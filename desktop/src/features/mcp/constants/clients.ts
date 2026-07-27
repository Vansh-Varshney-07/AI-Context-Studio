import {
  Bot,
  Braces,
  Code2,
  MousePointer2,
  Settings,
  Sparkles,
  Terminal,
  Wind,
} from "lucide-react";

import type {
  MCPAuthMode,
  MCPClientId,
  MCPClientMeta,
  MCPLogLevel,
  MCPTransport,
} from "../types";

/**
 * Transport options surfaced in the configuration editor.
 */
export const MCP_TRANSPORTS: readonly {
  value: MCPTransport;
  label: string;
  description: string;
}[] = [
  {
    value: "stdio",
    label: "Standard IO (stdio)",
    description: "Spawned child process; reads stdin, writes stdout.",
  },
  {
    value: "http",
    label: "HTTP",
    description: "Remote HTTP endpoint with request/response.",
  },
  {
    value: "sse",
    label: "Server-Sent Events",
    description: "Streaming SSE endpoint with POST commands.",
  },
] as const;

/**
 * Auth modes for remote transports (http/sse).
 */
export const MCP_AUTH_MODES: readonly {
  value: MCPAuthMode;
  label: string;
}[] = [
  { value: "none", label: "None" },
  { value: "bearer", label: "Bearer Token" },
  { value: "apikey", label: "API Key Header" },
  { value: "basic", label: "Basic Auth" },
  { value: "oauth", label: "OAuth 2.0" },
] as const;

/**
 * Log level options for the configuration editor.
 */
export const MCP_LOG_LEVELS: readonly { value: MCPLogLevel; label: string }[] = [
  { value: "debug", label: "Debug" },
  { value: "info", label: "Info" },
  { value: "warn", label: "Warning" },
  { value: "error", label: "Error" },
  { value: "silent", label: "Silent" },
] as const;

/**
 * All clients supported by the export picker. The provider adapter for
 * each id is registered in `services/client-providers/registry.ts`.
 */
export const MCP_CLIENTS: readonly MCPClientMeta[] = [
  {
    id: "claude-desktop",
    label: "Claude Desktop",
    configFilename: "claude_desktop_config.json",
    fileLocation: "~/Library/Application Support/Claude/claude_desktop_config.json",
    description: "Anthropic's Claude desktop app (macOS / Windows).",
    icon: Sparkles,
    preferredTransport: "stdio",
  },
  {
    id: "claude-code",
    label: "Claude Code",
    configFilename: ".mcp.json",
    fileLocation: "~/.claude.json (project-scoped .mcp.json)",
    description: "Anthropic's CLI coding agent.",
    icon: Terminal,
    preferredTransport: "stdio",
  },
  {
    id: "cursor",
    label: "Cursor",
    configFilename: "mcp.json",
    fileLocation: "~/.cursor/mcp.json (project .cursor/mcp.json)",
    description: "Cursor IDE MCP configuration.",
    icon: MousePointer2,
    preferredTransport: "stdio",
  },
  {
    id: "opencode",
    label: "OpenCode",
    configFilename: "opencode.json",
    fileLocation: "./opencode.json",
    description: "OpenCode AI coding agent.",
    icon: Code2,
    preferredTransport: "stdio",
  },
  {
    id: "codex-cli",
    label: "Codex CLI",
    configFilename: "mcp.json",
    fileLocation: "~/.codex/mcp.json",
    description: "OpenAI Codex CLI agent.",
    icon: Bot,
    preferredTransport: "stdio",
  },
  {
    id: "gemini-cli",
    label: "Gemini CLI",
    configFilename: "mcp.json",
    fileLocation: "~/.gemini/mcp.json",
    description: "Google Gemini CLI coding agent.",
    icon: Sparkles,
    preferredTransport: "stdio",
  },
  {
    id: "continue",
    label: "Continue.dev",
    configFilename: "config.json",
    fileLocation: "~/.continue/config.json",
    description: "Continue.dev open-source coding assistant.",
    icon: Braces,
    preferredTransport: "stdio",
  },
  {
    id: "cline",
    label: "Cline",
    configFilename: "mcp_settings.json",
    fileLocation:
      "~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json",
    description: "Cline VS Code extension agent.",
    icon: Code2,
    preferredTransport: "stdio",
  },
  {
    id: "roo-code",
    label: "Roo Code",
    configFilename: "mcp_settings.json",
    fileLocation:
      "~/Library/Application Support/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/mcp_settings.json",
    description: "Roo Code VS Code extension agent.",
    icon: Code2,
    preferredTransport: "stdio",
  },
  {
    id: "windsurf",
    label: "Windsurf",
    configFilename: "mcp_config.json",
    fileLocation: "~/.codeium/windsurf/mcp_config.json",
    description: "Codeium Windsurf MCP configuration.",
    icon: Wind,
    preferredTransport: "stdio",
  },
  {
    id: "custom",
    label: "Custom Client",
    configFilename: "mcp.json",
    fileLocation: "(user-defined)",
    description: "Generic JSON / YAML config for any other client.",
    icon: Settings,
    preferredTransport: "stdio",
  },
] as const;

/**
 * O(1) client lookup.
 */
export const MCP_CLIENT_MAP: Record<MCPClientId, MCPClientMeta> =
  Object.fromEntries(
    MCP_CLIENTS.map((client) => [client.id, client]),
  ) as Record<MCPClientId, MCPClientMeta>;

/**
 * Generic export formats (not tied to a specific client).
 */
export const MCP_EXPORT_FORMATS = [
  {
    id: "json",
    label: "Generic JSON",
    extension: "json",
    mime: "application/json",
  },
  {
    id: "yaml",
    label: "Generic YAML",
    extension: "yaml",
    mime: "text/yaml",
  },
] as const;

export type MCPExportFormatId = (typeof MCP_EXPORT_FORMATS)[number]["id"];

