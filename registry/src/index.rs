use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use crate::metadata::{AssetMetadata, CategoryMetadata, RegistryMetadata};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegistryIndex {
    pub metadata: RegistryMetadata,
    pub assets: HashMap<String, AssetMetadata>,
    pub categories: HashMap<String, CategoryMetadata>,
    pub asset_tags: HashMap<String, Vec<String>>,
    pub asset_categories: HashMap<String, Vec<String>>,
}

impl Default for RegistryIndex {
    fn default() -> Self {
        Self {
            metadata: RegistryMetadata::default(),
            assets: HashMap::new(),
            categories: HashMap::new(),
            asset_tags: HashMap::new(),
            asset_categories: HashMap::new(),
        }
    }
}

impl RegistryIndex {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn add_asset(&mut self, asset: AssetMetadata) {
        let asset_id = asset.id.clone();
        let tags = asset.tags.clone();
        let asset_type = asset.asset_type.clone();
        
        self.asset_tags.insert(asset_id.clone(), tags);
        self.asset_categories.insert(asset_id.clone(), vec![asset_type]);
        self.assets.insert(asset_id, asset);
        self.metadata.total_assets = self.assets.len();
        self.metadata.last_updated = chrono::Utc::now();
    }

    pub fn add_category(&mut self, category: CategoryMetadata) {
        self.categories.insert(category.id.clone(), category);
        self.metadata.total_categories = self.categories.len();
        self.metadata.last_updated = chrono::Utc::now();
    }

    pub fn get_asset(&self, id: &str) -> Option<&AssetMetadata> {
        self.assets.get(id)
    }

    pub fn get_category(&self, id: &str) -> Option<&CategoryMetadata> {
        self.categories.get(id)
    }

    pub fn search(&self, query: &str, category: Option<&str>, asset_type: Option<&str>) -> Vec<&AssetMetadata> {
        let query = query.to_lowercase();
        self.assets.values().filter(|a| {
            let matches_query = query.is_empty() ||
                a.name.to_lowercase().contains(&query) ||
                a.description.to_lowercase().contains(&query) ||
                a.tags.iter().any(|t| t.to_lowercase().contains(&query));
            let matches_cat = category.map_or(true, |c| a.asset_type == c);
            let matches_type = asset_type.map_or(true, |t| a.asset_type == t);
            matches_query && matches_cat && matches_type
        }).collect()
    }
}