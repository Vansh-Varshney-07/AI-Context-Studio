use std::fs;
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use zip::ZipArchive;
use zip::write::FileOptions;
use sha2::{Sha256, Digest};
use serde::{Deserialize, Serialize};
use tauri::{command, AppHandle, Manager};
use semver::Version;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AssetManifest {
    pub id: String,
    pub name: String,
    pub version: String,
    pub asset_type: AssetType,
    pub author: String,
    pub description: String,
    pub tags: Vec<String>,
    pub min_app_version: String,
    pub dependencies: Vec<AssetDependency>,
    pub checksum: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum AssetType {
    Skill,
    Persona,
    Workflow,
    PromptPack,
    InstructionFile,
    Template,
    McpServer,
    Collection,
}

impl AssetType {
    pub fn from_str(s: &str) -> Self {
        match s.to_lowercase().as_str() {
            "skill" => Self::Skill,
            "persona" => Self::Persona,
            "workflow" => Self::Workflow,
            "promptpack" | "prompt_pack" | "prompt-pack" => Self::PromptPack,
            "instructionfile" | "instruction_file" | "instruction-file" => Self::InstructionFile,
            "template" => Self::Template,
            "mcpserver" | "mcp_server" | "mcp-server" => Self::McpServer,
            "collection" => Self::Collection,
            _ => Self::Skill,
        }
    }
    
    pub fn to_string(&self) -> String {
        match self {
            Self::Skill => "skill",
            Self::Persona => "persona",
            Self::Workflow => "workflow",
            Self::PromptPack => "promptPack",
            Self::InstructionFile => "instructionFile",
            Self::Template => "template",
            Self::McpServer => "mcpServer",
            Self::Collection => "collection",
        }.to_string()
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AssetDependency {
    pub id: String,
    pub version: String,
    pub optional: bool,
}

#[derive(Debug, Serialize)]
pub struct AssetPackageInfo {
    pub path: String,
    pub size: u64,
    pub checksum: String,
    pub manifest: AssetManifest,
}

#[derive(Debug, Serialize)]
pub struct InstalledAssetInfo {
    pub id: String,
    pub name: String,
    pub version: String,
    pub asset_type: AssetType,
    pub path: String,
}

#[command]
pub fn pack_asset_package(
    app: AppHandle,
    source_dir: String,
    output_path: String,
) -> Result<AssetPackageInfo, String> {
    let source = PathBuf::from(&source_dir);
    let output = PathBuf::from(&output_path);
    
    if !source.exists() { return Err("Source directory does not exist".to_string()); }
    
    let manifest_path = source.join("manifest.json");
    if !manifest_path.exists() { return Err("manifest.json not found".to_string()); }
    
    let manifest_content = fs::read_to_string(&manifest_path)
        .map_err(|e| format!("Failed to read manifest: {}", e))?;
    let mut manifest: AssetManifest = serde_json::from_str(&manifest_content)
        .map_err(|e| format!("Invalid manifest: {}", e))?;
    
    let mut file = fs::File::create(&output)
        .map_err(|e| format!("Failed to create output: {}", e))?;
    let mut zip = zip::ZipWriter::new(std::io::Cursor::new(Vec::new()));
    let options = FileOptions::<'_, ()>::default()
        .compression_method(zip::CompressionMethod::Deflated)
        .unix_permissions(0o755);
    
    // We need to write to a temp file first, then copy to output
    let mut temp_file = fs::File::create(&output).map_err(|e| e.to_string())?;
    let mut zip = zip::ZipWriter::new(&mut temp_file);
    
    add_dir_to_zip(&mut zip, &source, &source, options)
        .map_err(|e| format!("Failed to create package: {}", e))?;
    zip.finish().map_err(|e| format!("Failed to finalize: {}", e))?;
    
    let size = fs::metadata(&output).map_err(|e| e.to_string())?.len();
    let checksum = calculate_sha256(&output).map_err(|e| e.to_string())?;
    manifest.checksum = checksum.clone();
    
    Ok(AssetPackageInfo { path: output_path, size, checksum, manifest })
}

#[command]
pub fn unpack_asset_package(
    app: AppHandle,
    package_path: String,
    extract_dir: String,
) -> Result<AssetManifest, String> {
    let package = PathBuf::from(&package_path);
    let extract = PathBuf::from(&extract_dir);
    
    if !package.exists() { return Err("Package not found".to_string()); }
    
    let checksum = calculate_sha256(&package).map_err(|e| e.to_string())?;
    
    let mut archive = ZipArchive::new(fs::File::open(&package).map_err(|e| e.to_string())?)
        .map_err(|e| format!("Invalid package: {}", e))?;
    
    for i in 0..archive.len() {
        let mut file = archive.by_index(i).map_err(|e| e.to_string())?;
        let outpath = extract.join(file.enclosed_name().ok_or("Invalid name")?);
        if file.name().ends_with('/') {
            fs::create_dir_all(&outpath).map_err(|e| e.to_string())?;
        } else {
            if let Some(parent) = outpath.parent() {
                fs::create_dir_all(parent).map_err(|e| e.to_string())?;
            }
            let mut outfile = fs::File::create(&outpath).map_err(|e| e.to_string())?;
            std::io::copy(&mut file, &mut outfile).map_err(|e| e.to_string())?;
        }
    }
    
    let manifest_path = extract.join("manifest.json");
    let manifest_content = fs::read_to_string(&manifest_path).map_err(|e| e.to_string())?;
    let mut manifest: AssetManifest = serde_json::from_str(&manifest_content).map_err(|e| e.to_string())?;
    
    if manifest.checksum != checksum { return Err("Checksum mismatch".to_string()); }
    
    let min_version = Version::parse(&manifest.min_app_version).map_err(|e| e.to_string())?;
    let current_version = Version::parse(env!("CARGO_PKG_VERSION")).map_err(|e| e.to_string())?;
    if current_version < min_version {
        return Err(format!("Requires app >= {}", manifest.min_app_version));
    }
    
    Ok(manifest)
}

#[command]
pub fn validate_asset_package(package_path: String) -> Result<AssetManifest, String> {
    let package = PathBuf::from(&package_path);
    if !package.exists() { return Err("Package not found".to_string()); }
    
    let checksum = calculate_sha256(&package).map_err(|e| e.to_string())?;
    let mut archive = ZipArchive::new(fs::File::open(&package).map_err(|e| e.to_string())?)
        .map_err(|e| format!("Invalid package: {}", e))?;
    
    let mut manifest_content = String::new();
    for i in 0..archive.len() {
        let mut file = archive.by_index(i).map_err(|e| e.to_string())?;
        if file.name() == "manifest.json" {
            file.read_to_string(&mut manifest_content).map_err(|e| e.to_string())?;
            break;
        }
    }
    if manifest_content.is_empty() { return Err("manifest.json not found".to_string()); }
    
    let mut manifest: AssetManifest = serde_json::from_str(&manifest_content).map_err(|e| e.to_string())?;
    if manifest.checksum != checksum { return Err("Checksum mismatch".to_string()); }
    
    Ok(manifest)
}

#[command]
pub fn install_asset_package(
    app: AppHandle,
    package_path: String,
    asset_type: String,
) -> Result<InstalledAssetInfo, String> {
    let app_data = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let assets_dir = app_data.join("assets").join(&asset_type);
    fs::create_dir_all(&assets_dir).map_err(|e| e.to_string())?;
    
    let package = PathBuf::from(&package_path);
    let mut archive = ZipArchive::new(fs::File::open(&package).map_err(|e| e.to_string())?)
        .map_err(|e| format!("Invalid package: {}", e))?;
    
    let mut manifest_content = String::new();
    for i in 0..archive.len() {
        let mut file = archive.by_index(i).map_err(|e| e.to_string())?;
        if file.name() == "manifest.json" {
            file.read_to_string(&mut manifest_content).map_err(|e| e.to_string())?;
        }
    }
    let manifest: AssetManifest = serde_json::from_str(&manifest_content).map_err(|e| e.to_string())?;
    
    let asset_dir = assets_dir.join(&manifest.id);
    if asset_dir.exists() { fs::remove_dir_all(&asset_dir).map_err(|e| e.to_string())?; }
    
    for i in 0..archive.len() {
        let mut file = archive.by_index(i).map_err(|e| e.to_string())?;
        let outpath = asset_dir.join(file.enclosed_name().ok_or("Invalid name")?);
        if file.name().ends_with('/') {
            fs::create_dir_all(&outpath).map_err(|e| e.to_string())?;
        } else {
            if let Some(parent) = outpath.parent() {
                fs::create_dir_all(parent).map_err(|e| e.to_string())?;
            }
            let mut outfile = fs::File::create(&outpath).map_err(|e| e.to_string())?;
            std::io::copy(&mut file, &mut outfile).map_err(|e| e.to_string())?;
        }
    }
    
    Ok(InstalledAssetInfo {
        id: manifest.id,
        name: manifest.name,
        version: manifest.version,
        asset_type: manifest.asset_type,
        path: asset_dir.to_string_lossy().to_string(),
    })
}

#[command]
pub fn list_installed_assets(
    app: AppHandle,
    asset_type: Option<String>,
) -> Result<Vec<InstalledAssetInfo>, String> {
    let app_data = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let assets_dir = app_data.join("assets");
    
    if !assets_dir.exists() { return Ok(Vec::new()); }
    
    let mut result = Vec::new();
    let types = asset_type.map(|t| vec![t]).unwrap_or_else(|| vec![
        "skill".to_string(), "persona".to_string(), "workflow".to_string(),
        "promptPack".to_string(), "instructionFile".to_string(),
        "template".to_string(), "mcpServer".to_string(), "collection".to_string(),
    ]);
    
    for t in types {
        let type_dir = assets_dir.join(&t);
        if !type_dir.exists() { continue; }
        for entry in fs::read_dir(&type_dir).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            let manifest_path = entry.path().join("manifest.json");
            if manifest_path.exists() {
                if let Ok(content) = fs::read_to_string(&manifest_path) {
                    if let Ok(manifest) = serde_json::from_str::<AssetManifest>(&content) {
                        result.push(InstalledAssetInfo {
                            id: manifest.id, name: manifest.name, version: manifest.version,
                            asset_type: manifest.asset_type.clone(),
                            path: entry.path().to_string_lossy().to_string(),
                        });
                    }
                }
            }
        }
    }
    Ok(result)
}

fn add_dir_to_zip<W: std::io::Write + std::io::Seek>(
    zip: &mut zip::ZipWriter<W>,
    root: &Path,
    dir: &Path,
    options: FileOptions<'_, ()>,
) -> zip::result::ZipResult<()> {
    for entry in fs::read_dir(dir)? {
        let entry = entry?; let path = entry.path();
        let name = path.strip_prefix(root).unwrap().to_string_lossy().to_string();
        if path.is_dir() {
            zip.add_directory(&format!("{}/", name), options)?;
            add_dir_to_zip(zip, root, &path, options)?;
        } else {
            zip.start_file(&name, options)?;
            let mut file = fs::File::open(&path)?;
            std::io::copy(&mut file, zip)?;
        }
    }
    Ok(())
}

fn calculate_sha256(path: &Path) -> Result<String, std::io::Error> {
    let mut file = fs::File::open(path)?;
    let mut hasher = Sha256::new();
    let mut buffer = [0; 8192];
    loop {
        let n = file.read(&mut buffer)?;
        if n == 0 { break; }
        hasher.update(&buffer[..n]);
    }
    Ok(format!("{:x}", hasher.finalize()))
}