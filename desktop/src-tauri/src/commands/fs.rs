use std::fs;
use std::path::PathBuf;
use tauri::command;

#[derive(serde::Serialize)]
pub struct FsEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub is_file: bool,
    pub size: Option<u64>,
}

#[command]
pub fn fs_read_text(path: String) -> Result<String, String> {
    let p = validate_path(&path)?;
    fs::read_to_string(&p).map_err(|e| format!("Failed to read file: {}", e))
}

#[command]
pub fn fs_write_text(path: String, content: String) -> Result<(), String> {
    let p = validate_path(&path)?;
    if let Some(parent) = p.parent() {
        fs::create_dir_all(parent).map_err(|e| format!("Failed to create directory: {}", e))?;
    }
    fs::write(&p, content).map_err(|e| format!("Failed to write file: {}", e))
}

#[command]
pub fn fs_read_binary(path: String) -> Result<Vec<u8>, String> {
    let p = validate_path(&path)?;
    fs::read(&p).map_err(|e| format!("Failed to read binary file: {}", e))
}

#[command]
pub fn fs_write_binary(path: String, data: Vec<u8>) -> Result<(), String> {
    let p = validate_path(&path)?;
    if let Some(parent) = p.parent() {
        fs::create_dir_all(parent).map_err(|e| format!("Failed to create directory: {}", e))?;
    }
    fs::write(&p, data).map_err(|e| format!("Failed to write binary file: {}", e))
}

#[command]
pub fn fs_read_dir(path: String) -> Result<Vec<FsEntry>, String> {
    let p = validate_path(&path)?;
    let entries = fs::read_dir(&p).map_err(|e| format!("Failed to read directory: {}", e))?;
    let mut result = Vec::new();
    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read entry: {}", e))?;
        let metadata = entry.metadata().map_err(|e| format!("Failed to read metadata: {}", e))?;
        result.push(FsEntry {
            name: entry.file_name().to_string_lossy().to_string(),
            path: entry.path().to_string_lossy().to_string(),
            is_dir: metadata.is_dir(),
            is_file: metadata.is_file(),
            size: if metadata.is_file() { Some(metadata.len()) } else { None },
        });
    }
    Ok(result)
}

#[command]
pub fn fs_exists(path: String) -> Result<bool, String> {
    let p = validate_path(&path)?;
    Ok(p.exists())
}

#[command]
pub fn fs_delete(path: String) -> Result<(), String> {
    let p = validate_path(&path)?;
    if p.is_dir() {
        fs::remove_dir_all(&p).map_err(|e| format!("Failed to delete directory: {}", e))
    } else {
        fs::remove_file(&p).map_err(|e| format!("Failed to delete file: {}", e))
    }
}

#[command]
pub fn fs_create_dir(path: String) -> Result<(), String> {
    let p = validate_path(&path)?;
    fs::create_dir_all(&p).map_err(|e| format!("Failed to create directory: {}", e))
}

fn validate_path(path: &str) -> Result<PathBuf, String> {
    let p = PathBuf::from(path);
    let canonical = p.canonicalize().map_err(|e| format!("Invalid path: {}", e))?;
    let allowed = get_allowed_directories();
    for dir in &allowed {
        if canonical.starts_with(dir) {
            return Ok(canonical);
        }
    }
    Err("Access denied: path outside allowed directories".to_string())
}

fn get_allowed_directories() -> Vec<PathBuf> {
    let mut dirs = Vec::new();
    if let Some(home) = dirs::home_dir() { dirs.push(home); }
    if let Some(docs) = dirs::document_dir() { dirs.push(docs); }
    if let Some(downloads) = dirs::download_dir() { dirs.push(downloads); }
    if let Some(desktop) = dirs::desktop_dir() { dirs.push(desktop); }
    if let Ok(cwd) = std::env::current_dir() { dirs.push(cwd); }
    if let Ok(temp) = std::env::temp_dir().canonicalize() { dirs.push(temp); }
    dirs
}