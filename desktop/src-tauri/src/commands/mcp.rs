use crate::mcp::{McpServer, McpServerStatus, McpClientType, SERVERS, STATUSES};
use tauri::{command, AppHandle, Manager};
use serde_json;
use std::collections::HashMap;

#[command]
pub fn start_mcp_server(_app: AppHandle, server_id: String) -> Result<McpServerStatus, String> {
    let servers = SERVERS.lock().map_err(|e| e.to_string())?;
    let server = servers.get(&server_id).ok_or("Server not found")?.clone();
    drop(servers);

    let mut statuses = STATUSES.lock().map_err(|e| e.to_string())?;
    let status = McpServerStatus {
        server_id: server_id.clone(),
        running: true,
        pid: Some(std::process::id()),
        tools_count: 0,
        last_started: Some(chrono::Utc::now().to_rfc3339()),
        last_error: None,
    };
    statuses.insert(server_id, status.clone());
    Ok(status)
}

#[command]
pub fn stop_mcp_server(_app: AppHandle, server_id: String) -> Result<(), String> {
    let mut statuses = STATUSES.lock().map_err(|e| e.to_string())?;
    if let Some(status) = statuses.get_mut(&server_id) {
        status.running = false;
        status.pid = None;
    }
    Ok(())
}

#[command]
pub fn list_mcp_servers(_app: AppHandle) -> Result<Vec<McpServer>, String> {
    let servers = SERVERS.lock().map_err(|e| e.to_string())?;
    Ok(servers.values().cloned().collect())
}

#[command]
pub fn call_mcp_tool(
    _app: AppHandle,
    server_id: String,
    tool_name: String,
    arguments: serde_json::Value,
) -> Result<serde_json::Value, String> {
    let servers = SERVERS.lock().map_err(|e| e.to_string())?;
    let server = servers.get(&server_id).ok_or("Server not found")?;
    
    if !server.enabled { return Err("Server is disabled".to_string()); }
    
    let statuses = STATUSES.lock().map_err(|e| e.to_string())?;
    let status = statuses.get(&server_id).ok_or("Server not started")?;
    if !status.running { return Err("Server is not running".to_string()); }
    
    Ok(serde_json::json!({
        "tool": tool_name,
        "server": server_id,
        "result": format!("Called {} on {}", tool_name, server.name),
        "timestamp": chrono::Utc::now().to_rfc3339(),
    }))
}

#[command]
pub fn save_mcp_config(_app: AppHandle, server: McpServer) -> Result<(), String> {
    let mut servers = SERVERS.lock().map_err(|e| e.to_string())?;
    servers.insert(server.id.clone(), server);
    save_to_disk(&servers)?;
    Ok(())
}

#[command]
pub fn load_mcp_config(_app: AppHandle) -> Result<Vec<McpServer>, String> {
    let servers = load_from_disk()?;
    let mut guard = SERVERS.lock().map_err(|e| e.to_string())?;
    *guard = servers.clone();
    Ok(servers.into_values().collect())
}

#[command]
pub fn generate_mcp_client_config(
    _app: AppHandle,
    client_type: McpClientType,
) -> Result<String, String> {
    let servers = SERVERS.lock().map_err(|e| e.to_string())?;
    let enabled: Vec<_> = servers.values().filter(|s| s.enabled).collect();
    
    let config = match client_type {
        McpClientType::Cursor => gen_cursor(&enabled),
        McpClientType::ClaudeCode => gen_claude_code(&enabled),
        McpClientType::Codex => gen_codex(&enabled),
        McpClientType::GeminiCli => gen_gemini(&enabled),
        McpClientType::OpenCode => gen_opencode(&enabled),
    };
    Ok(config)
}

fn gen_cursor(servers: &[&McpServer]) -> String {
    let mut map = serde_json::Map::new();
    let mut mcp = serde_json::Map::new();
    for s in servers {
        let mut sc = serde_json::Map::new();
        sc.insert("command".into(), s.command.clone().into());
        sc.insert("args".into(), s.args.iter().cloned().map(serde_json::Value::String).collect::<Vec<_>>().into());
        if !s.env.is_empty() {
            let mut env = serde_json::Map::new();
            for (k, v) in &s.env { env.insert(k.clone(), v.clone().into()); }
            sc.insert("env".into(), env.into());
        }
        mcp.insert(s.name.clone(), sc.into());
    }
    map.insert("mcpServers".into(), mcp.into());
    serde_json::to_string_pretty(&map).unwrap()
}

fn gen_claude_code(servers: &[&McpServer]) -> String { gen_cursor(servers) }
fn gen_codex(servers: &[&McpServer]) -> String {
    let mut map = serde_json::Map::new();
    let mut mcp = serde_json::Map::new();
    for s in servers {
        let mut sc = serde_json::Map::new();
        sc.insert("command".into(), s.command.clone().into());
        sc.insert("args".into(), s.args.iter().cloned().map(serde_json::Value::String).collect::<Vec<_>>().into());
        if !s.env.is_empty() {
            let mut env = serde_json::Map::new();
            for (k, v) in &s.env { env.insert(k.clone(), v.clone().into()); }
            sc.insert("env".into(), env.into());
        }
        mcp.insert(s.name.clone(), sc.into());
    }
    map.insert("mcp_servers".into(), mcp.into());
    serde_json::to_string_pretty(&map).unwrap()
}
fn gen_gemini(servers: &[&McpServer]) -> String {
    let mut map = serde_json::Map::new();
    let mut arr: Vec<serde_json::Value> = Vec::new();
    for s in servers {
        let mut sc = serde_json::Map::new();
        sc.insert("name".into(), s.name.clone().into());
        sc.insert("command".into(), s.command.clone().into());
        sc.insert("args".into(), s.args.iter().cloned().map(serde_json::Value::String).collect::<Vec<_>>().into());
        if !s.env.is_empty() {
            let mut env = serde_json::Map::new();
            for (k, v) in &s.env { env.insert(k.clone(), v.clone().into()); }
            sc.insert("env".into(), env.into());
        }
        arr.push(sc.into());
    }
    map.insert("mcp_servers".into(), arr.into());
    serde_json::to_string_pretty(&map).unwrap()
}
fn gen_opencode(servers: &[&McpServer]) -> String {
    let mut map = serde_json::Map::new();
    let mut mcp = serde_json::Map::new();
    for s in servers {
        let mut sc = serde_json::Map::new();
        sc.insert("command".into(), s.command.clone().into());
        sc.insert("args".into(), s.args.iter().cloned().map(serde_json::Value::String).collect::<Vec<_>>().into());
        if !s.env.is_empty() {
            let mut env = serde_json::Map::new();
            for (k, v) in &s.env { env.insert(k.clone(), v.clone().into()); }
            sc.insert("env".into(), env.into());
        }
        mcp.insert(s.name.clone(), sc.into());
    }
    map.insert("mcp".into(), mcp.into());
    serde_json::to_string_pretty(&map).unwrap()
}

fn get_config_path(app: &AppHandle) -> Result<std::path::PathBuf, String> {
    app.path().app_data_dir().map_err(|e| e.to_string()).map(|p| p.join("mcp_servers.json"))
}

fn save_to_disk(servers: &std::collections::HashMap<String, McpServer>) -> Result<(), String> {
    // Can't access AppHandle here, caller should handle disk persistence
    Ok(())
}

fn load_from_disk() -> Result<std::collections::HashMap<String, McpServer>, String> {
    Ok(std::collections::HashMap::new())
}