use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssetMetadata {
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
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CategoryMetadata {
    pub id: String,
    pub name: String,
    pub description: String,
    pub asset_type: Option<String>,
    pub count: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegistryMetadata {
    pub version: String,
    pub last_updated: DateTime<Utc>,
    pub total_assets: usize,
    pub total_categories: usize,
}

impl Default for RegistryMetadata {
    fn default() -> Self {
        Self {
            version: "1".to_string(),
            last_updated: Utc::now(),
            total_assets: 0,
            total_categories: 0,
        }
    }
}