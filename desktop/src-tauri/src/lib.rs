mod commands;
mod mcp;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![
            // Filesystem
            commands::fs::fs_read_text,
            commands::fs::fs_write_text,
            commands::fs::fs_read_binary,
            commands::fs::fs_write_binary,
            commands::fs::fs_read_dir,
            commands::fs::fs_exists,
            commands::fs::fs_delete,
            commands::fs::fs_create_dir,
            // Dialog
            commands::dialog::dialog_open_file,
            commands::dialog::dialog_save_file,
            commands::dialog::dialog_open_dir,
            // Clipboard
            commands::clipboard::clipboard_write_text,
            commands::clipboard::clipboard_read_text,
            // Platform
            commands::platform::platform_info,
            commands::platform::platform_open_external,
            // Assets (.acs format)
            commands::assets::pack_asset_package,
            commands::assets::unpack_asset_package,
            commands::assets::validate_asset_package,
            commands::assets::install_asset_package,
            commands::assets::list_installed_assets,
            // Marketplace
            commands::marketplace::search_marketplace,
            commands::marketplace::download_asset,
            commands::marketplace::publish_asset,
            commands::marketplace::get_categories,
            // MCP
            commands::mcp::start_mcp_server,
            commands::mcp::stop_mcp_server,
            commands::mcp::list_mcp_servers,
            commands::mcp::call_mcp_tool,
            commands::mcp::save_mcp_config,
            commands::mcp::load_mcp_config,
            commands::mcp::generate_mcp_client_config,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}