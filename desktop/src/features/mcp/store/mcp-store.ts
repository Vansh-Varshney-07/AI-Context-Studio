"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { uuid } from "@utils/uuid";

import { MCP_CATALOG_MAP } from "../data";
import type {
  InstalledMCPServer,
  MCPCategoryId,
  MCPClientId,
  MCPServer,
  MCPTransport,
  MCPEnvVarValue,
} from "../types";

/**
 * MCP state contract.
 *
 * Persists (localStorage):
 *   - installedServers: user-configured instances
 *   - favorites:        catalog server ids
 *   - recentServerIds:  recently-viewed catalog ids (bounded)
 *   - selectedClientId:  the export target the user is targeting
 *   - configDraft:      in-progress draft edits per instance
 *
 * Non-persisted:
 *   - filter:           live browser filter (query + category + status)
 */
export interface MCPState {
  installedServers: InstalledMCPServer[];
  favorites: string[];
  recentServerIds: string[];
  selectedClientId: MCPClientId;
  filter: {
    query: string;
    category: MCPCategoryId | "all";
    status: "all" | "installed" | "not-installed" | "favorites" | "recent";
  };

  setFilter: (patch: Partial<MCPState["filter"]>) => void;
  setSelectedClient: (clientId: MCPClientId) => void;

  install: (catalogId: string) => string | null;
  uninstall: (instanceId: string) => void;
  updateServer: (instanceId: string, patch: Partial<InstalledMCPServer>) => void;
  setServerEnabled: (instanceId: string, enabled: boolean) => void;
  setEnv: (instanceId: string, env: MCPEnvVarValue[]) => void;

  toggleFavorite: (catalogId: string) => void;
  isFavorite: (catalogId: string) => boolean;
  recordRecent: (catalogId: string) => void;

  createCustom: (seed: {
    name: string;
    description?: string;
    transport?: MCPTransport;
    command?: string;
    args?: string[];
    url?: string;
    env?: MCPEnvVarValue[];
  }) => string;

  resetAll: () => void;
}

const RECENT_MAX = 12;

/**
 * Build an installed instance from a catalog entry.
 */
function catalogToInstance(catalog: MCPServer): InstalledMCPServer {
  return {
    instanceId: `${catalog.id}-${uuid()}`,
    serverId: catalog.id,
    name: catalog.name,
    category: catalog.category,
    transport: catalog.transport,
    command: catalog.command,
    args: catalog.args ?? [],
    url: catalog.url,
    authMode: catalog.authMode,
    env: catalog.envVars
      .filter((spec) => spec.defaultValue !== undefined)
      .map((spec) => ({
        key: spec.key,
        value: spec.defaultValue ?? "",
      })),
    autoStart: false,
    reconnect: true,
    logLevel: "info",
    enabled: true,
    installStatus: "installed",
    connectionStatus: "unknown",
    installedAt: new Date().toISOString(),
    lastUsedAt: undefined,
    lastValidatedAt: undefined,
  };
}

export const useMCPStore = create<MCPState>()(
  persist(
    (set, get) => ({
      installedServers: [],
      favorites: [],
      recentServerIds: [],
      selectedClientId: "claude-desktop",
      filter: { query: "", category: "all", status: "all" },

      setFilter: (patch) =>
        set((state) => ({ filter: { ...state.filter, ...patch } })),

      setSelectedClient: (clientId) => set({ selectedClientId: clientId }),

      install: (catalogId) => {
        const catalog = MCP_CATALOG_MAP[catalogId];
        if (!catalog) return null;
        const instance = catalogToInstance(catalog);
        set((state) => ({
          installedServers: [...state.installedServers, instance],
          recentServerIds: bumpRecent(state.recentServerIds, catalogId),
        }));
        return instance.instanceId;
      },

      uninstall: (instanceId) =>
        set((state) => ({
          installedServers: state.installedServers.filter(
            (server) => server.instanceId !== instanceId,
          ),
        })),

      updateServer: (instanceId, patch) =>
        set((state) => ({
          installedServers: state.installedServers.map((server) =>
            server.instanceId === instanceId
              ? { ...server, ...patch }
              : server,
          ),
        })),

      setServerEnabled: (instanceId, enabled) =>
        set((state) => ({
          installedServers: state.installedServers.map((server) =>
            server.instanceId === instanceId
              ? { ...server, enabled }
              : server,
          ),
        })),

      setEnv: (instanceId, env) =>
        set((state) => ({
          installedServers: state.installedServers.map((server) =>
            server.instanceId === instanceId ? { ...server, env } : server,
          ),
        })),

      toggleFavorite: (catalogId) =>
        set((state) => ({
          favorites: state.favorites.includes(catalogId)
            ? state.favorites.filter((id) => id !== catalogId)
            : [...state.favorites, catalogId],
        })),

      isFavorite: (catalogId) => get().favorites.includes(catalogId),

      recordRecent: (catalogId) =>
        set((state) => ({
          recentServerIds: bumpRecent(state.recentServerIds, catalogId),
        })),

      createCustom: (seed) => {
        const slug = slugify(seed.name) || "custom";
        const instance: InstalledMCPServer = {
          instanceId: `custom-${slug}-${uuid()}`,
          serverId: `custom-${slug}`,
          name: seed.name,
          category: "custom",
          transport: seed.transport ?? "stdio",
          command: seed.command,
          args: seed.args ?? [],
          url: seed.url,
          env: seed.env ?? [],
          autoStart: false,
          reconnect: true,
          logLevel: "info",
          enabled: true,
          installStatus: "installed",
          connectionStatus: "unknown",
          installedAt: new Date().toISOString(),
        };
        set((state) => ({
          installedServers: [...state.installedServers, instance],
        }));
        return instance.instanceId;
      },

      resetAll: () =>
        set({
          installedServers: [],
          favorites: [],
          recentServerIds: [],
          selectedClientId: "claude-desktop",
          filter: { query: "", category: "all", status: "all" },
        }),
    }),
    {
      name: "ai-context-studio.mcp",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        installedServers: state.installedServers,
        favorites: state.favorites,
        recentServerIds: state.recentServerIds,
        selectedClientId: state.selectedClientId,
      }),
    },
  ),
);

function bumpRecent(current: string[], id: string): string[] {
  const next = [id, ...current.filter((entry) => entry !== id)];
  return next.slice(0, RECENT_MAX);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

