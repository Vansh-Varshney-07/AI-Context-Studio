use serde::{Deserialize, Serialize};
use urlencoding::encode;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InstallProtocol {
    pub asset_id: String,
    pub source_url: String,
    pub version: String,
    pub checksum: String,
    pub protocol: String,
}

impl InstallProtocol {
    pub fn new(asset_id: String, source_url: String, version: String, checksum: String) -> Self {
        Self { asset_id, source_url, version, checksum, protocol: "ai-context-studio".to_string() }
    }

    pub fn to_url(&self) -> String {
        format!(
            "{}://install?asset={}&source={}&version={}&checksum={}",
            self.protocol,
            encode(&self.asset_id),
            encode(&self.source_url),
            encode(&self.version),
            encode(&self.checksum)
        )
    }

    pub fn from_url(url: &str) -> Result<Self, String> {
        if !url.starts_with("ai-context-studio://") { return Err("Invalid protocol".to_string()); }
        let query = url.split('?').nth(1).ok_or("Missing query")?;
        let mut params = std::collections::HashMap::new();
        for pair in query.split('&') {
            let mut parts = pair.split('=');
            let k = parts.next().ok_or("Missing key")?;
            let v = parts.next().ok_or("Missing value")?;
            // Simple URL decode
            let v = v.replace('+', " ");
            let mut result = String::new();
            let mut chars = v.chars().peekable();
            while let Some(c) = chars.next() {
                if c == '%' {
                    let hex: String = chars.by_ref().take(2).collect();
                    if let Ok(byte) = u8::from_str_radix(&hex, 16) {
                        result.push(byte as char);
                    } else {
                        result.push('%');
                        result.push_str(&hex);
                    }
                } else {
                    result.push(c);
                }
            }
            params.insert(k.to_string(), result);
        }
        Ok(Self {
            asset_id: params.get("asset").cloned().ok_or("Missing asset")?,
            source_url: params.get("source").cloned().ok_or("Missing source")?,
            version: params.get("version").cloned().ok_or("Missing version")?,
            checksum: params.get("checksum").cloned().ok_or("Missing checksum")?,
            protocol: "ai-context-studio".to_string(),
        })
    }
}