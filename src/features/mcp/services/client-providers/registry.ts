import type { MCPClientId } from "../../types";
import type { MCPClientProvider } from "./base-provider";
import { claudeDesktopProvider } from "./claude-desktop.provider";
import { claudeCodeProvider } from "./claude-code.provider";
import { cursorProvider } from "./cursor.provider";
import { opencodeProvider } from "./opencode.provider";
import { makeGenericJsonProvider } from "./generic-json.provider";
import { genericYamlProvider } from "./generic-yaml.provider";

export type { MCPClientProvider } from "./base-provider";
export { envToObject, objectToEnv, inferTransport, extractArgs } from "./base-provider";

/**
 * Per-client provider adapters.
 *
 * To add a new client:
 *   1. add its id to `MCPClientId` in `types/mcp.types.ts`
 *   2. add its metadata entry to `constants/clients.ts`
 *   3. add an adapter (either a dedicated file or `makeGenericJsonProvider`)
 *   4. register it in this map
 *
 * No other code changes required — the export UI consults this map.
 */
const PROVIDER_REGISTRY: Record<MCPClientId, MCPClientProvider> = {
  "claude-desktop": claudeDesktopProvider,
  "claude-code": claudeCodeProvider,
  cursor: cursorProvider,
  opencode: opencodeProvider,
  "codex-cli": makeGenericJsonProvider({
    id: "codex-cli",
    label: "Codex CLI",
    filename: "mcp.json",
    supportsRemote: true,
  }),
  "gemini-cli": makeGenericJsonProvider({
    id: "gemini-cli",
    label: "Gemini CLI",
    filename: "mcp.json",
    supportsRemote: true,
  }),
  continue: makeGenericJsonProvider({
    id: "continue",
    label: "Continue.dev",
    filename: "config.json",
    supportsRemote: true,
  }),
  cline: makeGenericJsonProvider({
    id: "cline",
    label: "Cline",
    filename: "mcp_settings.json",
    supportsRemote: true,
  }),
  "roo-code": makeGenericJsonProvider({
    id: "roo-code",
    label: "Roo Code",
    filename: "mcp_settings.json",
    supportsRemote: true,
  }),
  windsurf: makeGenericJsonProvider({
    id: "windsurf",
    label: "Windsurf",
    filename: "mcp_config.json",
    supportsRemote: true,
  }),
  custom: genericYamlProvider,
};

/**
 * Lookup the provider for a given client id. Falls back to the
 * Claude Desktop shape when no adapter is registered.
 */
export function getClientProvider(clientId: MCPClientId): MCPClientProvider {
  return PROVIDER_REGISTRY[clientId] ?? claudeDesktopProvider;
}

/**
 * All registered provider adapters (for the picker).
 */
export const MCP_CLIENT_PROVIDERS: readonly MCPClientProvider[] =
  Object.values(PROVIDER_REGISTRY);

/**
 * All client ids that have a registered provider.
 */
export const REGISTERED_CLIENT_IDS: readonly MCPClientId[] =
  Object.keys(PROVIDER_REGISTRY) as MCPClientId[];
