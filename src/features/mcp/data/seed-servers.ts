import type { MCPServer } from "../types";

/**
 * Canonical MCP server catalog.
 *
 * To add a server:
 *   1. append an `MCPServer` entry here
 *   2. ensure its `category` exists in `constants/categories.ts`
 *
 * The catalog is intentionally static — user installs derive from it.
 */
export const MCP_SERVER_CATALOG: readonly MCPServer[] = [] as const;

/**
 * O(1) catalog lookup by id.
 */
export const MCP_CATALOG_MAP: Record<string, MCPServer> = {} as Record<string, MCPServer>;