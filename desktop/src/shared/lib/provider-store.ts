"use client";

import { create } from "zustand";

import { AI_PROVIDER_MAP } from "@/shared/constants/providers";
import type { ProviderId } from "@/shared/types/provider";

/**
 * Provider store contract.
 *
 * Holds the currently-selected provider and the in-memory decrypted API
 * key for that provider. Persisted encrypted key material is the job of
 * `services/crypto`. This store NEVER logs the key string and NEVER puts
 * it into exported JSON.
 */
export interface ProviderState {
  activeProviderId: ProviderId;
  setActiveProvider: (id: ProviderId) => void;
  /**
   * In-memory API keys keyed by provider id. Cleared on reload.
   * Not persisted by design â€” keys re-entered per session, or loaded via
   * crypto service into memory once unlocked.
   */
  apiKeys: Partial<Record<ProviderId, string>>;
  setApiKey: (id: ProviderId, key: string) => void;
  clearApiKey: (id: ProviderId) => void;
  hasApiKey: (id: ProviderId) => boolean;
}

const DEFAULT_PROVIDER: ProviderId = "openai";

export const useProviderStore = create<ProviderState>((set, get) => ({
  activeProviderId: DEFAULT_PROVIDER,
  setActiveProvider: (id) => set({ activeProviderId: id }),
  apiKeys: {},
  setApiKey: (id, key) =>
    set((state) => ({
      apiKeys: { ...state.apiKeys, [id]: key },
    })),
  clearApiKey: (id) => {
    const next = { ...get().apiKeys };
    delete next[id];
    set({ apiKeys: next });
  },
  hasApiKey: (id) => Boolean(get().apiKeys[id]),
}));

/**
 * Returns the active provider info descriptor (label/description/flags).
 * Memoization is the caller's responsibility via zustand selectors.
 */
export function selectActiveProviderInfo(state: ProviderState) {
  return AI_PROVIDER_MAP[state.activeProviderId];
}
