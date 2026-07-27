use tauri::{command, AppHandle};
use tauri_plugin_clipboard_manager::ClipboardExt;

#[command]
pub fn clipboard_write_text(app: AppHandle, text: String) -> Result<(), String> {
    app.clipboard().write_text(text).map_err(|e| format!("Failed to write to clipboard: {}", e))
}

#[command]
pub fn clipboard_read_text(app: AppHandle) -> Result<String, String> {
    app.clipboard().read_text().map_err(|e| format!("Failed to read from clipboard: {}", e))
}