import type { InstalledMCPServer, ImportedServer, MCPEnvVarValue } from "../../types";
import {
  extractArgs,
  inferTransport,
  type MCPClientProvider,
} from "./base-provider";

/**
 * Minimal YAML serializer for the Generic YAML export.
 * We deliberately keep this tiny and self-contained to avoid pulling
 * a YAML runtime dependency. Only the subset needed by MCP configs
 * is supported (scalars, sequences, simple mappings).
 */

function yamlScalar(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "string") {
    if (value === "" || /[\n#:{}[\],&*?|<>=!%@`]/.test(value) || /^\s|\s$/.test(value)) {
      const escaped = String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      return `"${escaped}"`;
    }
    return String(value);
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return yamlScalar(String(value));
}

function yamlIndent(depth: number): string {
  return "  ".repeat(depth);
}

function yamlSerialize(value: unknown, depth: number): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return value
      .map((entry) => {
        const head = `${yamlIndent(depth)}- `;
        if (entry && typeof entry === "object" && !Array.isArray(entry)) {
          const entries = Object.entries(entry as Record<string, unknown>);
          if (entries.length === 0) return `${head}{}`;
          const [firstKey, firstVal] = entries[0] ?? ["", null];
          const rest = entries.slice(1);
          const lines = [
            `${head}${firstKey}: ${yamlScalar(firstVal)}`,
            ...rest.map(
              ([k, v]) =>
                `${yamlIndent(depth + 1)}${k}: ${yamlScalar(v)}`,
            ),
          ];
          return lines.join("\n");
        }
        return `${head}${yamlScalar(entry)}`;
      })
      .join("\n");
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    return entries
      .map(([key, val]) => {
        const isContainer =
          val !== null &&
          typeof val === "object" &&
          (Array.isArray(val) ? (val as unknown[]).length > 0 : Object.keys(val as object).length > 0);
        if (isContainer) {
          return `${yamlIndent(depth)}${key}:\n${yamlSerialize(val, depth + 1)}`;
        }
        return `${yamlIndent(depth)}${key}: ${yamlScalar(val)}`;
      })
      .join("\n");
  }
  return `${yamlIndent(depth)}${yamlScalar(value)}`;
}

function serverToMap(
  server: InstalledMCPServer,
): Record<string, unknown> {
  if (server.transport === "http" || server.transport === "sse") {
    const entry: Record<string, unknown> = {
      transport: server.transport,
      url: server.url ?? "",
    };
    if (server.env.length) entry.env = envToRecord(server.env);
    return entry;
  }
  const entry: Record<string, unknown> = {
    command: server.command ?? "",
    args: server.args,
  };
  if (server.env.length) entry.env = envToRecord(server.env);
  return entry;
}

function envToRecord(env: MCPEnvVarValue[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const entry of env) if (entry.value) out[entry.key] = entry.value;
  return out;
}

/**
 * Generic YAML client provider — used by the export picker's
 * "Generic YAML" option. Parsing is intentionally a no-op (round-tripping
 * YAML to an object without a runtime is out of scope); import is JSON-only.
 */
export const genericYamlProvider: MCPClientProvider = {
  id: "custom",
  label: "Generic YAML",
  configFilename: "mcp.yaml",
  supportsRemoteTransport: true,

  buildConfig(servers: InstalledMCPServer[]): string {
    const mcpServers: Record<string, unknown> = {};
    for (const server of servers) {
      if (!server.enabled) continue;
      mcpServers[server.name] = serverToMap(server);
    }
    const root = { mcpServers };
    return yamlSerialize(root, 0) + "\n";
  },

  parseConfig: (): ImportedServer[] => {
    return [];
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

