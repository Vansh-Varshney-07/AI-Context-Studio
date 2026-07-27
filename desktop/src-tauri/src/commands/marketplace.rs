use tauri::{command, AppHandle};
use ai_context_studio_marketplace::{MarketplaceAsset as CatalogAsset, AssetType, MarketplaceCategory as CatalogCategory, search, seed_catalog};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct MarketplaceAsset {
    pub id: String,
    pub name: String,
    pub description: String,
    pub version: String,
    pub author: String,
    pub asset_type: String,
    pub tags: Vec<String>,
    pub download_url: String,
    pub checksum: String,
    pub min_app_version: String,
    pub downloads: u64,
    pub rating: f32,
}

impl From<CatalogAsset> for MarketplaceAsset {
    fn from(a: CatalogAsset) -> Self {
        Self {
            id: a.id,
            name: a.name,
            description: a.description,
            version: a.version,
            author: a.author,
            asset_type: a.asset_type.to_string(),
            tags: a.tags,
            download_url: a.download_url,
            checksum: a.checksum,
            min_app_version: a.min_app_version,
            downloads: a.downloads,
            rating: a.rating,
        }
    }
}

#[derive(Debug, Serialize)]
pub struct MarketplaceSearchResult {
    pub assets: Vec<MarketplaceAsset>,
    pub total: usize,
}

#[derive(Debug, Serialize)]
pub struct MarketplaceCategory {
    pub id: String,
    pub name: String,
    pub description: String,
    pub count: usize,
}

impl From<CatalogCategory> for MarketplaceCategory {
    fn from(c: CatalogCategory) -> Self {
        Self {
            id: c.id,
            name: c.name,
            description: c.description,
            count: c.count,
        }
    }
}

#[command]
pub fn search_marketplace(
    _app: AppHandle,
    query: String,
    category: Option<String>,
    asset_type: Option<String>,
) -> Result<MarketplaceSearchResult, String> {
    let cat = category.as_deref();
    let atype = asset_type.as_ref().and_then(|s| match s.as_str() {
        "skill" => Some(AssetType::Skill),
        "persona" => Some(AssetType::Persona),
        "workflow" => Some(AssetType::Workflow),
        "prompt_pack" => Some(AssetType::PromptPack),
        "memory" => Some(AssetType::Memory),
        "instruction_file" => Some(AssetType::InstructionFile),
        "system_prompt" => Some(AssetType::SystemPrompt),
        "module_config" => Some(AssetType::ModuleConfig),
        _ => None,
    });
    let results: Vec<_> = search(&query, cat, atype.as_ref()).into_iter().map(MarketplaceAsset::from).collect();
    let total = results.len();
    Ok(MarketplaceSearchResult { assets: results, total })
}

#[command]
pub fn download_asset(
    _app: AppHandle,
    asset_id: String,
    _version: Option<String>,
) -> Result<DownloadResult, String> {
    let (assets, _) = seed_catalog();
    let asset = assets.iter().find(|a| a.id == asset_id).ok_or("Asset not found")?;
    Ok(DownloadResult {
        download_url: asset.download_url.clone(),
        checksum: asset.checksum.clone(),
        size: 0,
    })
}

#[command]
pub fn publish_asset(
    _app: AppHandle,
    _asset: MarketplaceAsset,
) -> Result<String, String> {
    Err("Publishing not yet implemented".to_string())
}

#[command]
pub fn get_categories(_app: AppHandle) -> Result<Vec<MarketplaceCategory>, String> {
    let (_, categories) = seed_catalog();
    Ok(categories.into_iter().map(MarketplaceCategory::from).collect())
}

#[derive(Debug, Serialize)]
pub struct DownloadResult {
    pub download_url: String,
    pub checksum: String,
    pub size: u64,
}