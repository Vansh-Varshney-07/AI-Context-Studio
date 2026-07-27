import type { InstalledMCPServer, ImportedServer } from "../../types";
import {
  envToObject,
  extractArgs,
  inferTransport,
  objectToEnv,
  type MCPClientProvider,
} from "./base-provider";

/**
 * Cursor's mcp.json shares Claude Desktop's shape, but keys the servers
 * under `mcpServers` with an extra `type` field for remote servers.
 *   {
 *     "mcpServers": {
 *       "<name>": { "command": "...", "args": [], "env": {} },
 *       "<remote>": { "url": "...", "type": "http" }
 *     }
 *   }
 */
export const cursorProvider: MCPClientProvider = {
  id: "cursor",
  label: "Cursor",
  configFilename: "mcp.json",
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

function serverToEntry(server: InstalledMCPServer): Record<string, unknown> {
  if (server.transport === "http" || server.transport === "sse") {
    return {
      url: server.url ?? "",
      type: server.transport,
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
    transport:
      typeof entry.type === "string" ? (entry.type as ImportedServer["transport"]) : undefined,
  });
  const env = objectToEnv(entry.env as Record<string, string> | undefined);
  const { command: resolvedCommand, args } = extractArgs({ command, args: rawArgs });
  return { name, command: resolvedCommand, args, url, transport, env };
}

