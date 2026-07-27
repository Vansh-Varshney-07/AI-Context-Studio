import type { LucideIcon } from "lucide-react";

/**
 * MCP server categories. Mirrors the catalog taxonomy:
 * Filesystem, Git, Database, Cloud, Browser, Search, Docs, Memory,
 * Vector DB, AI Providers, Utilities, Custom.
 */
export type MCPCategoryId =
  | "filesystem"
  | "git"
  | "database"
  | "cloud"
  | "terminal"
  | "browser"
  | "search"
  | "docs"
  | "memory"
  | "notion"
  | "vector-db"
  | "ai-providers"
  | "utilities"
  | "custom";

/**
 * Transport mechanism used by an MCP server.
 * stdio: spawned child process (default for Claude Desktop / Cursor).
 * http: HTTP endpoint with request/response.
 * sse: Server-Sent Events streaming endpoint.
 */
export type MCPTransport = "stdio" | "http" | "sse";

/**
 * Authentication mode for http/sse transports.
 */
export type MCPAuthMode =
  | "none"
  | "bearer"
  | "apikey"
  | "basic"
  | "oauth";

/**
 * Installation lifecycle state for a server in the user's registry.
 */
export type MCPInstallStatus =
  | "not-installed"
  | "installing"
  | "installed"
  | "failed";

/**
 * Connection probe status. `unknown` until a test has been run.
 */
export type MCPConnectionStatus =
  | "unknown"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

/**
 * Logging verbosity for a configured server.
 */
export type MCPLogLevel = "debug" | "info" | "warn" | "error" | "silent";

/**
 * Supported AI coding assistant client identifiers.
 * Each has a corresponding `MCPClientProvider` adapter.
 */
export type MCPClientId =
  | "claude-desktop"
  | "claude-code"
  | "cursor"
  | "opencode"
  | "codex-cli"
  | "gemini-cli"
  | "continue"
  | "cline"
  | "roo-code"
  | "windsurf"
  | "custom";

/**
 * Required or optional environment variable declared by a server.
 */
export interface MCPEnvVarSpec {
  /** Env var name, e.g. `GITHUB_PERSONAL_ACCESS_TOKEN`. */
  key: string;
  label: string;
  description?: string;
  required: boolean;
  /** Hint about where to obtain the value. */
  hint?: string;
  /** If true, the value is masked in the UI. */
  secret?: boolean;
  /** Optional default value (non-secret). */
  defaultValue?: string;
}

/**
 * A concrete env-var value as configured by the user.
 */
export interface MCPEnvVarValue {
  key: string;
  value: string;
}

/**
 * A capability exposed by the server (tools/resources/prompts).
 */
export interface MCPCapability {
  name: string;
  kind: "tool" | "resource" | "prompt";
  description?: string;
}

/**
 * Static catalog entry for an MCP server.
 * Catalog = available-to-install; `InstalledMCPServer` = configured copy.
 */
export interface MCPServer {
  /** Stable catalog id (slug). */
  id: string;
  name: string;
  description: string;
  category: MCPCategoryId;
  /** Maintainer or vendor, e.g. "Anthropic", "modelcontextprotocol". */
  provider: string;
  version: string;
  author?: string;
  /** Canonical docs / package URL. */
  documentationUrl?: string;
  homepageUrl?: string;
  /** npm package or command name. */
  packageName?: string;
  /** Default transport this server speaks. */
  transport: MCPTransport;
  /** Default command for stdio transport. */
  command?: string;
  /** Default args for stdio transport. */
  args?: string[];
  /** Default URL for http/sse transport. */
  url?: string;
  /** Default auth mode for remote transports. */
  authMode?: MCPAuthMode;
  /** Env vars the server accepts / requires. */
  envVars: MCPEnvVarSpec[];
  /** Capabilities the server exposes. */
  capabilities: MCPCapability[];
  /** Which clients officially support this server. */
  supportedClients: MCPClientId[];
  /** Installation guide steps (markdown lines). */
  installGuide?: string[];
  /** Example usage snippets (markdown lines). */
  exampleUsage?: string[];
  /** True if the server is a custom, user-defined entry. */
  isCustom?: boolean;
  /** Tags for free-form filtering. */
  tags?: string[];
}

/**
 * A user-configured, installed server instance.
 * Holds the editable configuration draft and lifecycle state.
 */
export interface InstalledMCPServer {
  /** Unique instance id (catalog id + uid suffix for duplicates). */
  instanceId: string;
  /** Catalog id (or "custom-<slug>" for user-defined). */
  serverId: string;
  /** Display name (may be edited from catalog default). */
  name: string;
  category: MCPCategoryId;
  transport: MCPTransport;
  command?: string;
  args: string[];
  /** Used for http/sse. */
  url?: string;
  authMode?: MCPAuthMode;
  /** Resolved env-var values. */
  env: MCPEnvVarValue[];
  /** Working directory override (stdio). */
  cwd?: string;
  /** Shutdown timeout in ms. */
  timeoutMs?: number;
  /** Auto-start when the host client launches. */
  autoStart: boolean;
  /** Reconnect automatically on disconnect. */
  reconnect: boolean;
  /** Log verbosity. */
  logLevel: MCPLogLevel;
  /** Whether the server is enabled in exports. */
  enabled: boolean;
  /** Runtime lifecycle state. */
  installStatus: MCPInstallStatus;
  /** Connection probe state. */
  connectionStatus: MCPConnectionStatus;
  /** ISO timestamps. */
  installedAt?: string;
  lastUsedAt?: string;
  /** Last validation run on this instance. */
  lastValidatedAt?: string;
  /** Connection probe logs (tail). */
  logs?: MCPLogEntry[];
}

export interface MCPLogEntry {
  ts: string;
  level: MCPLogLevel | "system";
  message: string;
}

/**
 * Result of validating one installed server config.
 */
export interface ValidationIssue {
  severity: "error" | "warning" | "info";
  code: string;
  message: string;
  /** Optional path to the offending field. */
  field?: string;
  /** Suggested fix. */
  suggestion?: string;
}

export interface ValidationResult {
  instanceId: string;
  serverName: string;
  issues: ValidationIssue[];
  /** Computed: true when no `error`-severity issues present. */
  ok: boolean;
}

/**
 * A server imported from a client config file (parse result).
 */
export interface ImportedServer {
  name: string;
  command?: string;
  args?: string[];
  url?: string;
  transport: MCPTransport;
  env: MCPEnvVarValue[];
}

/**
 * Catalog category metadata.
 */
export interface MCPCategory {
  id: MCPCategoryId;
  label: string;
  description: string;
  icon: LucideIcon;
}

/**
 * Client metadata for the picker / export UI.
 */
export interface MCPClientMeta {
  id: MCPClientId;
  label: string;
  /** File name the provider writes by default. */
  configFilename: string;
  /** Default install path on the user's machine. */
  fileLocation: string;
  /** Short description shown in the picker. */
  description: string;
  /** Lucide icon for the picker. */
  icon: LucideIcon;
  /** Whether this client prefers stdio (local) or remote transports. */
  preferredTransport: MCPTransport;
}

/**
 * Filter shape for the server browser.
 */
export interface MCPServerFilter {
  query: string;
  category: MCPCategoryId | "all";
  /** Lifecycle filter. */
  status: "all" | "installed" | "not-installed" | "favorites" | "recent";
}

