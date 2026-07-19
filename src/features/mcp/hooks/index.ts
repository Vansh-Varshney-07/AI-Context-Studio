"use client";

import { useMCPStore } from "../store";

/**
 * Convenience selectors. Components import narrowly for less re-renders.
 */
export function useInstalledServers() {
  return useMCPStore((state) => state.installedServers);
}

export function useFavorites() {
  return useMCPStore((state) => state.favorites);
}

export function useRecentServerIds() {
  return useMCPStore((state) => state.recentServerIds);
}

export function useMCPFilter() {
  return useMCPStore((state) => state.filter);
}

export function useSelectedClient() {
  return useMCPStore((state) => state.selectedClientId);
}
