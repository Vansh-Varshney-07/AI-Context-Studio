import type { InstalledMCPServer, ImportedServer } from "../../types";
import {
  envToObject,
  extractArgs,
  inferTransport,
  objectToEnv,
  type MCPClientProvider,
} from "./base-provider";

/**
 * OpenCode stores MCP servers inside `opencode.json` under a top-level
 * `mcp` map. Values can be either a string ("command args...")
 * or an object:
 *   {
 *     "mcp": {
 *       "<name>": { "command": "npx", "args": ["-y", "pkg"], "env": {} },
 *       "<remote>": { "url": "...", "transport": "http" }
 *     }
 *   }
 */
export const opencodeProvider: MCPClientProvider = {
  id: "opencode",
  label: "OpenCode",
  configFilename: "opencode.json",
  supportsRemoteTransport: true,

  buildConfig(servers: InstalledMCPServer[]): string {
    const mcp: Record<string, unknown> = {};
    for (const server of servers) {
      if (!server.enabled) continue;
      mcp[server.name] = serverToEntry(server);
    }
    const payload: Record<string, unknown> = { mcp };
    return JSON.stringify(payload, null, 2);
  },

  parseConfig(raw: string): ImportedServer[] {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return [];
    }
    const container = (parsed as { mcp?: Record<string, unknown> } | null)?.mcp;
    if (!container || typeof container !== "object") return [];
    return Object.entries(container).map(([name, entry]) =>
      entryToImported(name, entry),
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

function serverToEntry(server: InstalledMCPServer): unknown {
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

function entryToImported(name: string, entry: unknown): ImportedServer {
  if (typeof entry === "string") {
    const { command, args } = extractArgs({ command: entry });
    return { name, command, args, transport: "stdio", env: [] };
  }
  const obj = (entry ?? {}) as Record<string, unknown>;
  const command = typeof obj.command === "string" ? obj.command : undefined;
  const rawArgs = Array.isArray(obj.args) ? (obj.args as string[]) : undefined;
  const url = typeof obj.url === "string" ? obj.url : undefined;
  const transport = inferTransport({
    command,
    url,
    transport:
      typeof obj.transport === "string" ? (obj.transport as ImportedServer["transport"]) : undefined,
  });
  const env = objectToEnv(obj.env as Record<string, string> | undefined);
  const { command: resolvedCommand, args } = extractArgs({ command, args: rawArgs });
  return { name, command: resolvedCommand, args, url, transport, env };
}

