use serde::{Deserialize, Serialize};
use crate::commands::assets::AssetType;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MarketplaceAsset {
    pub id: String,
    pub name: String,
    pub description: String,
    pub version: String,
    pub author: String,
    pub asset_type: AssetType,
    pub tags: Vec<String>,
    pub download_url: String,
    pub checksum: String,
    pub min_app_version: String,
    pub downloads: u64,
    pub rating: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MarketplaceCategory {
    pub id: String,
    pub name: String,
    pub description: String,
    pub asset_type: Option<AssetType>,
    pub count: usize,
}

pub fn seed_catalog() -> (Vec<MarketplaceAsset>, Vec<MarketplaceCategory>) {
    let assets = vec![
        MarketplaceAsset {
            id: "skill-code-review".to_string(),
            name: "Code Review Assistant".to_string(),
            description: "AI-powered code review with security, performance, and best practice checks".to_string(),
            version: "1.0.0".to_string(),
            author: "AI Context Studio".to_string(),
            asset_type: AssetType::Skill,
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
            asset_type: AssetType::Persona,
            tags: vec!["senior".to_string(), "systems".to_string()],
            download_url: "https://example.com/persona-senior-dev-1.0.0.acs".to_string(),
            checksum: "sha256:def456...".to_string(),
            min_app_version: "1.0.0".to_string(),
            downloads: 890,
            rating: 4.9,
        },
    ];
    
    let categories = vec![
        MarketplaceCategory { id: "skill".to_string(), name: "Skills".to_string(), description: "Atomic AI skills".to_string(), asset_type: Some(AssetType::Skill), count: 1 },
        MarketplaceCategory { id: "persona".to_string(), name: "Personas".to_string(), description: "Reusable AI personas".to_string(), asset_type: Some(AssetType::Persona), count: 1 },
        MarketplaceCategory { id: "workflow".to_string(), name: "Workflows".to_string(), description: "Orchestrated pipelines".to_string(), asset_type: Some(AssetType::Workflow), count: 0 },
        MarketplaceCategory { id: "promptPack".to_string(), name: "Prompt Packs".to_string(), description: "Curated prompt collections".to_string(), asset_type: Some(AssetType::PromptPack), count: 0 },
    ];
    
    (assets, categories)
}

pub fn search(
    query: &str,
    category: Option<&str>,
    asset_type: Option<&AssetType>,
) -> Vec<MarketplaceAsset> {
    let (assets, _) = seed_catalog();
    assets.into_iter().filter(|a| {
        let matches_query = query.is_empty() ||
            a.name.to_lowercase().contains(&query.to_lowercase()) ||
            a.description.to_lowercase().contains(&query.to_lowercase());
        let matches_cat = category.map_or(true, |c| a.asset_type.to_string() == c);
        let matches_type = asset_type.map_or(true, |t| &a.asset_type == t);
        matches_query && matches_cat && matches_type
    }).collect()
}