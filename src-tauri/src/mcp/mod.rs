use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use lazy_static::lazy_static;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct McpServer {
    pub id: String,
    pub name: String,
    pub description: String,
    pub command: String,
    pub args: Vec<String>,
    pub env: HashMap<String, String>,
    pub cwd: Option<String>,
    pub enabled: bool,
    pub auto_start: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct McpServerStatus {
    pub server_id: String,
    pub running: bool,
    pub pid: Option<u32>,
    pub tools_count: usize,
    pub last_started: Option<String>,
    pub last_error: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum McpClientType {
    Cursor,
    #[serde(rename = "claudeCode")]
    ClaudeCode,
    Codex,
    #[serde(rename = "geminiCli")]
    GeminiCli,
    #[serde(rename = "openCode")]
    OpenCode,
}

lazy_static! {
    pub static ref SERVERS: Arc<Mutex<HashMap<String, McpServer>>> = Arc::new(Mutex::new(HashMap::new()));
    pub static ref STATUSES: Arc<Mutex<HashMap<String, McpServerStatus>>> = Arc::new(Mutex::new(HashMap::new()));
}