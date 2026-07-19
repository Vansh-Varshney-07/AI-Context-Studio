import type {
  ImportedServer,
  MCPClientId,
  MCPEnvVarValue,
  MCPCategory,
  MCPTransport,
  InstalledMCPServer,
} from "../../types";

/**
 * Adapter contract implemented by every supported AI coding assistant
 * client. Each client knows how to:
 *   - serialize installed servers into its native config format
 *   - parse a config file back into `ImportedServer` records
 *   - declare its preferred transport + auth envelope
 *
 * Adding a new client = new file in this directory + register in
 * `registry.ts`. No other code changes required.
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
