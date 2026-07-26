use tauri::{command, AppHandle};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

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

fn seed_catalog() -> Vec<MarketplaceAsset> {
    vec![
        MarketplaceAsset {
            id: "skill-code-review".to_string(),
            name: "Code Review Assistant".to_string(),
            description: "AI-powered code review with security, performance, and best practice checks".to_string(),
            version: "1.0.0".to_string(),
            author: "AI Context Studio".to_string(),
            asset_type: "skill".to_string(),
            tags: vec!["code-review".to_string(), "security".to_string()],
            download_url: "https://example.com/skill-code-review-1.0.0.acs".to_string(),
            checksum: "sha256:abc123...".to_string(),
            min_app_version: "1.0.0".to_string(),
            downloads: 1250,
            rating: 4.8,
        },
        MarketplaceAsset {
            id: "persona-senior-dev".to_string(),
            name: "Senior Developer Persona".to_string(),
            description: "Experienced senior developer with 15+ years in systems programming".to_string(),
            version: "1.0.0".to_string(),
            author: "AI Context Studio".to_string(),
            asset_type: "persona".to_string(),
            tags: vec!["senior".to_string(), "systems".to_string()],
            download_url: "https://example.com/persona-senior-dev-1.0.0.acs".to_string(),
            checksum: "sha256:def456...".to_string(),
            min_app_version: "1.0.0".to_string(),
            downloads: 890,
            rating: 4.9,
        },
    ]
}

#[command]
pub fn search_marketplace(
    _app: AppHandle,
    query: String,
    category: Option<String>,
    asset_type: Option<String>,
) -> Result<MarketplaceSearchResult, String> {
    let assets = seed_catalog();
    let mut results: Vec<_> = assets.into_iter().filter(|a| {
        let matches_query = query.is_empty() ||
            a.name.to_lowercase().contains(&query.to_lowercase()) ||
            a.description.to_lowercase().contains(&query.to_lowercase());
        let matches_cat = category.as_ref().map_or(true, |c| &a.asset_type == c);
        let matches_type = asset_type.as_ref().map_or(true, |t| &a.asset_type == t);
        matches_query && matches_cat && matches_type
    }).collect();
    let total = results.len();
    Ok(MarketplaceSearchResult { assets: results, total })
}

#[command]
pub fn download_asset(
    _app: AppHandle,
    asset_id: String,
    _version: Option<String>,
) -> Result<DownloadResult, String> {
    let assets = seed_catalog();
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
    Ok(vec![
        MarketplaceCategory { id: "skill".to_string(), name: "Skills".to_string(), description: "Atomic AI skills".to_string(), count: 1 },
        MarketplaceCategory { id: "persona".to_string(), name: "Personas".to_string(), description: "Reusable AI personas".to_string(), count: 1 },
        MarketplaceCategory { id: "workflow".to_string(), name: "Workflows".to_string(), description: "Orchestrated pipelines".to_string(), count: 0 },
        MarketplaceCategory { id: "promptPack".to_string(), name: "Prompt Packs".to_string(), description: "Curated prompt collections".to_string(), count: 0 },
    ])
}

#[derive(Debug, Serialize)]
pub struct DownloadResult {
    pub download_url: String,
    pub checksum: String,
    pub size: u64,
}