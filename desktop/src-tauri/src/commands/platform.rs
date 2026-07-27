use tauri::{command, AppHandle};

#[derive(serde::Serialize)]
pub struct PlatformInfo {
    pub os: String,
    pub arch: String,
    pub family: String,
    pub is_tauri: bool,
}

#[command]
pub fn platform_info() -> PlatformInfo {
    PlatformInfo {
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        family: std::env::consts::FAMILY.to_string(),
        is_tauri: true,
    }
}

#[command]
pub fn platform_open_external(url: String) -> Result<(), String> {
    opener::open(&url).map_err(|e| format!("Failed to open URL: {}", e))
}