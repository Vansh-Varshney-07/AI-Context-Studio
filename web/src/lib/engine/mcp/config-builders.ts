import type {
  ImportedServer,
  MCPClientId,
  MCPEnvVarValue,
  MCPCategory,
  MCPTransport,
  InstalledMCPServer,
} from "./types";

/**
 * Adapter contract implemented by every supported AI coding assistant
 * client. Each client knows how to:
 *   - serialize installed servers into its native config format
 *   - parse a config file back into `ImportedServer` records
 *   - declare its preferred transport + auth envelope
 *
 * Adding a new client = new implementation + register in this file.
 */
export interface MCPClientProvider {
  readonly id: MCPClientId;
  readonly label: string;
  readonly configFilename: string;
  /**
   * Serialize the supplied installed servers into a config file body.
   * Only servers whose `enabled === true` should be included.
   */
  buildConfig(servers: InstalledMCPServer[]): string;
  /**
   * Parse a previously-saved config file back into server records.
   * Should be permissive: unknown shapes return [] rather than throwing.
   */
  parseConfig(raw: string): ImportedServer[];
  /**
   * Whether the client fully supports remote (http/sse) transports.
   * Used by the validation UI to surface a warning when a server
   * uses a transport this client can't actually drive.
   */
  supportsRemoteTransport: boolean;
  /**
   * Convert an ImportedServer record (from parsing) into a partial
   * InstalledMCPServer seed. The store is responsible for assigning
   * instanceId / state fields.
   */
  toInstanceSeed(
    imported: ImportedServer,
    fallbackCategoryId: MCPCategory["id"],
  ): Pick<InstalledMCPServer, "name" | "transport" | "command" | "args" | "url" | "env">;
}

/**
 * Serialize env-var values into a plain object suitable for JSON config.
 * Empty values are dropped.
 */
export function envToObject(env: MCPEnvVarValue[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const entry of env) {
    if (entry.value) out[entry.key] = entry.value;
  }
  return out;
}

/**
 * Parse a plain object of env vars into the structured form.
 */
export function objectToEnv(obj: Record<string, string> | undefined): MCPEnvVarValue[] {
  if (!obj) return [];
  return Object.entries(obj).map(([key, value]) => ({ key, value }));
}

/**
 * Resolve the transport from a parsed server entry. Most clients only
 * specify `command` (stdio). http/sse is inferred from a `url` field when
 * present.
 */
export function inferTransport(parsed: {
  command?: string;
  url?: string;
  transport?: MCPTransport;
}): MCPTransport {
  if (parsed.transport) return parsed.transport;
  if (parsed.url) return "http";
  if (parsed.command) return "stdio";
  return "stdio";
}

/**
 * Common args extraction. Some clients accept a single `command` that
 * embeds args (space-separated). We split when needed.
 */
export function extractArgs(parsed: {
  args?: string[];
  command?: string;
}): { command: string | undefined; args: string[] } {
  if (Array.isArray(parsed.args)) {
    return { command: parsed.command, args: parsed.args };
  }
  if (parsed.command && parsed.command.includes(" ")) {
    const [command, ...args] = parsed.command.split(/\s+/);
    return { command, args };
  }
  return { command: parsed.command, args: [] };
}

/**
 * Claude Desktop format:
 *   ~/Library/Application Support/Claude/claude_desktop_config.json
 *
 * Shape:
 *   {
 *     "mcpServers": {
 *       "<name>": {
 *         "command": "npx",
 *         "args": ["-y", "pkg"],
 *         "env": { "TOKEN": "..." }
 *       },
 *       "<remote>": { "url": "https://...", "transport": "http" }
 *     }
 *   }
 */
export const claudeDesktopProvider: MCPClientProvider = {
  id: "claude-desktop",
  label: "Claude Desktop",
  configFilename: "claude_desktop_config.json",
  supportsRemoteTransport: true,

  buildConfig(servers: InstalledMCPServer[]): string {
    const mcpServers: Record<string, unknown> = {};
    for (const server of servers) {
      if (!server.enabled) continue;
      mcpServers[server.name] = serverToEntry(server);
    }
    return JSON.stringify({ mcpServers }, null, 2);
  },

  parseConfig(raw: string): ImportedServer[] {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return [];
    }
    const container = (parsed as { mcpServers?: Record<string, unknown> } | null)?.mcpServers;
    if (!container || typeof container !== "object") return [];
    return Object.entries(container).map(([name, entry]) =>
      entryToImported(name, entry as Record<string, unknown>),
    );
  },

  toInstanceSeed(imported) {
    const { command, args } = extractArgs(imported);
    return {
      name: imported.name,
      transport: inferTransport(imported),
      command,
      args,
      url: imported.url,
      env: imported.env,
    };
  },
};

/**
 * Generic clients (Codex CLI, Gemini CLI, Continue, Cline, Roo Code,
 * Windsurf, Custom) all share the Claude Desktop shape:
 *   { "mcpServers": { "<name>": { command, args, env } } }
 * We compute the metadata (filename, label, remote support) at
 * registry construction time.
 */
export function makeGenericJsonProvider(opts: {
  id: string;
  label: string;
  filename: string;
  supportsRemote?: boolean;
}): MCPClientProvider {
  const { id, label, filename, supportsRemote = false } = opts;
  return {
    id: id as MCPClientProvider["id"],
    label,
    configFilename: filename,
    supportsRemoteTransport: supportsRemote,

    buildConfig(servers: InstalledMCPServer[]): string {
      const mcpServers: Record<string, unknown> = {};
      for (const server of servers) {
        if (!server.enabled) continue;
        mcpServers[server.name] = serverToEntry(server);
      }
      return JSON.stringify({ mcpServers }, null, 2);
    },

    parseConfig(raw: string): ImportedServer[] {
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return [];
      }
      // Accept either `mcpServers` (Claude-style) or a flat object.
      const container =
        (parsed as { mcpServers?: Record<string, unknown> } | null)?.mcpServers ??
        (parsed as Record<string, unknown> | null);
      if (!container || typeof container !== "object") return [];
      return Object.entries(container).map(([name, entry]) =>
        entryToImported(name, entry as Record<string, unknown>),
      );
    },

    toInstanceSeed(imported) {
      const { command, args } = extractArgs(imported);
      return {
        name: imported.name,
        transport: inferTransport(imported),
        command,
        args,
        url: imported.url,
        env: imported.env,
      };
    },
  };
}

/**
 * OpenCode uses a flat JSON format.
 */
export function makeOpencodeProvider(): MCPClientProvider {
  return {
    id: "opencode",
    label: "OpenCode",
    configFilename: "opencode.json",
    supportsRemoteTransport: false,

    buildConfig(servers: InstalledMCPServer[]): string {
      const mcpServers: Record<string, unknown> = {};
      for (const server of servers) {
        if (!server.enabled) continue;
        mcpServers[server.name] = serverToEntry(server);
      }
      return JSON.stringify({ mcpServers }, null, 2);
    },

    parseConfig(raw: string): ImportedServer[] {
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return [];
      }
      const container = (parsed as { mcpServers?: Record<string, unknown> } | null)?.mcpServers ??
        (parsed as Record<string, unknown> | null);
      if (!container || typeof container !== "object") return [];
      return Object.entries(container).map(([name, entry]) =>
        entryToImported(name, entry as Record<string, unknown>),
      );
    },

    toInstanceSeed(imported) {
      const { command, args } = extractArgs(imported);
      return {
        name: imported.name,
        transport: inferTransport(imported),
        command,
        args,
        url: imported.url,
        env: imported.env,
      };
    },
  };
}

/**
 * Continue.dev uses a different config format.
 */
export function makeContinueProvider(): MCPClientProvider {
  return {
    id: "continue",
    label: "Continue.dev",
    configFilename: "config.json",
    supportsRemoteTransport: false,

    buildConfig(servers: InstalledMCPServer[]): string {
      const mcpServers: Record<string, unknown> = {};
      for (const server of servers) {
        if (!server.enabled) continue;
        mcpServers[server.name] = serverToEntry(server);
      }
      return JSON.stringify({ mcpServers }, null, 2);
    },

    parseConfig(raw: string): ImportedServer[] {
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return [];
      }
      const container = (parsed as { mcpServers?: Record<string, unknown> } | null)?.mcpServers;
      if (!container || typeof container !== "object") return [];
      return Object.entries(container).map(([name, entry]) =>
        entryToImported(name, entry as Record<string, unknown>),
      );
    },

    toInstanceSeed(imported) {
      const { command, args } = extractArgs(imported);
      return {
        name: imported.name,
        transport: inferTransport(imported),
        command,
        args,
        url: imported.url,
        env: imported.env,
      };
    },
  };
}

/**
 * Cline / Roo Code use mcp_settings.json.
 */
export function makeClineProvider(): MCPClientProvider {
  return {
    id: "cline",
    label: "Cline",
    configFilename: "mcp_settings.json",
    supportsRemoteTransport: false,

    buildConfig(servers: InstalledMCPServer[]): string {
      const mcpServers: Record<string, unknown> = {};
      for (const server of servers) {
        if (!server.enabled) continue;
        mcpServers[server.name] = serverToEntry(server);
      }
      return JSON.stringify({ mcpServers }, null, 2);
    },

    parseConfig(raw: string): ImportedServer[] {
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return [];
      }
      const container = (parsed as { mcpServers?: Record<string, unknown> } | null)?.mcpServers;
      if (!container || typeof container !== "object") return [];
      return Object.entries(container).map(([name, entry]) =>
        entryToImported(name, entry as Record<string, unknown>),
      );
    },

    toInstanceSeed(imported) {
      const { command, args } = extractArgs(imported);
      return {
        name: imported.name,
        transport: inferTransport(imported),
        command,
        args,
        url: imported.url,
        env: imported.env,
      };
    },
  };
}

/**
 * Windsurf uses mcp_config.json.
 */
export function makeWindsurfProvider(): MCPClientProvider {
  return {
    id: "windsurf",
    label: "Windsurf",
    configFilename: "mcp_config.json",
    supportsRemoteTransport: false,

    buildConfig(servers: InstalledMCPServer[]): string {
      const mcpServers: Record<string, unknown> = {};
      for (const server of servers) {
        if (!server.enabled) continue;
        mcpServers[server.name] = serverToEntry(server);
      }
      return JSON.stringify({ mcpServers }, null, 2);
    },

    parseConfig(raw: string): ImportedServer[] {
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return [];
      }
      const container = (parsed as { mcpServers?: Record<string, unknown> } | null)?.mcpServers ??
        (parsed as Record<string, unknown> | null);
      if (!container || typeof container !== "object") return [];
      return Object.entries(container).map(([name, entry]) =>
        entryToImported(name, entry as Record<string, unknown>),
      );
    },

    toInstanceSeed(imported) {
      const { command, args } = extractArgs(imported);
      return {
        name: imported.name,
        transport: inferTransport(imported),
        command,
        args,
        url: imported.url,
        env: imported.env,
      };
    },
  };
}

// Shared helpers for all providers
function serverToEntry(server: InstalledMCPServer): Record<string, unknown> {
  if (server.transport === "http" || server.transport === "sse") {
    return {
      url: server.url ?? "",
      transport: server.transport,
      ...(server.env.length ? { env: envToObject(server.env) } : {}),
    };
  }
  return {
    command: server.command,
    args: server.args,
    ...(server.env.length ? { env: envToObject(server.env) } : {}),
  };
}

function entryToImported(
  name: string,
  entry: Record<string, unknown>,
): ImportedServer {
  const command = typeof entry.command === "string" ? entry.command : undefined;
  const rawArgs = Array.isArray(entry.args) ? (entry.args as string[]) : undefined;
  const url = typeof entry.url === "string" ? entry.url : undefined;
  const transport = inferTransport({
    command,
    url,
    transport: typeof entry.transport === "string" ? (entry.transport as ImportedServer["transport"]) : undefined,
  });
  const env = objectToEnv(entry.env as Record<string, string> | undefined);
  const { command: resolvedCommand, args } = extractArgs({
    command,
    args: rawArgs,
  });
  return {
    name,
    command: resolvedCommand,
    args,
    url,
    transport,
    env,
  };
}

/**
 * Provider registry - maps client IDs to provider instances.
 * Adding a new client = add to this registry.
 */
export const PROVIDER_REGISTRY: Record<MCPClientId, MCPClientProvider> = {
  "claude-desktop": claudeDesktopProvider,
  "claude-code": makeGenericJsonProvider({ id: "claude-code", label: "Claude Code", filename: ".mcp.json", supportsRemote: true }),
  "cursor": makeGenericJsonProvider({ id: "cursor", label: "Cursor", filename: "mcp.json", supportsRemote: true }),
  "opencode": makeOpencodeProvider(),
  "codex-cli": makeGenericJsonProvider({ id: "codex-cli", label: "Codex CLI", filename: "mcp.json", supportsRemote: true }),
  "gemini-cli": makeGenericJsonProvider({ id: "gemini-cli", label: "Gemini CLI", filename: "mcp.json", supportsRemote: true }),
  "continue": makeContinueProvider(),
  "cline": makeClineProvider(),
  "roo-code": makeClineProvider(),
  "windsurf": makeWindsurfProvider(),
  "custom": makeGenericJsonProvider({ id: "custom", label: "Custom Client", filename: "mcp.json", supportsRemote: false }),
};

export function getClientProvider(id: MCPClientId): MCPClientProvider {
  return PROVIDER_REGISTRY[id] ?? claudeDesktopProvider;
}

export function getRegisteredClientIds(): MCPClientId[] {
  return Object.keys(PROVIDER_REGISTRY) as MCPClientId[];
}