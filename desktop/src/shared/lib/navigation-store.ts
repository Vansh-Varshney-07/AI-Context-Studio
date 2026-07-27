"use client";

import { create } from "zustand";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useCallback } from "react";

import { MODULE_REGISTRY_MAP } from "@/shared/constants/modules.registry";
import type {
  ModuleId,
  ModuleParams,
  NavigationHistoryEntry,
} from "@/shared/types/navigation";

/**
 * Navigation store contract (Phase 3+8).
 *
 * - In-place content swap (zero page reloads) is achieved by reading
 *   `activeModule` + `activeParams` and dispatching to `<MainWorkspace/>`.
 * - Phase 8: URL synchronization via Next.js `useSearchParams` +
 *   `useRouter`. The URL is the source of truth on the client.
 * - History is kept as a bounded stack for future back/forward support
 *   without committing to full router-style semantics now.
 * - The active module's renderer is resolved dynamically via the registry
 *   hook (`hooks/use-module-renderer.ts`), keeping this store pure data.
 */
export interface NavigationState {
  activeModule: ModuleId;
  activeParams: ModuleParams;
  history: NavigationHistoryEntry[];
  /** Index into `history` for back/forward support (-1 when empty). */
  cursor: number;
  navigate: (moduleId: ModuleId, params?: ModuleParams) => void;
  back: () => void;
  forward: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
  resetParams: (moduleId: ModuleId) => void;
  /** Internal: sync from URL (called by NavigationSync component). */
  _syncFromUrl: (moduleId: ModuleId, params: ModuleParams) => void;
}

const DEFAULT_MODULE: ModuleId = "dashboard";

/**
 * Resolve the manifest-default params for a module when none are supplied.
 * Keeps navigation calls terse: `navigate("instruction-files")`.
 */
function resolveParams(
  moduleId: ModuleId,
  params?: ModuleParams,
): ModuleParams {
  if (params) return params;
  return MODULE_REGISTRY_MAP[moduleId]?.defaultParams ?? {};
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  activeModule: DEFAULT_MODULE,
  activeParams: resolveParams(DEFAULT_MODULE),
  history: [{ moduleId: DEFAULT_MODULE, params: resolveParams(DEFAULT_MODULE) }],
  cursor: 0,

  navigate: (moduleId, params) => {
    const resolved = resolveParams(moduleId, params);
    const state = get();
    if (state.activeModule === moduleId && sameParams(state.activeParams, resolved)) {
      return;
    }
    const next: NavigationHistoryEntry = {
      moduleId,
      params: resolved,
    };
    // Truncate forward history whenever relocating from a back-navigated state.
    const truncated = state.history.slice(0, state.cursor + 1);
    const history = [...truncated, next];
    set({
      activeModule: moduleId,
      activeParams: resolved,
      history,
      cursor: history.length - 1,
    });
    // Navigation via pushState happens in NavigationSync (URL is source of truth).
  },

  back: () => {
    const state = get();
    if (!state.canGoBack()) return;
    const cursor = state.cursor - 1;
    const entry = state.history[cursor];
    if (!entry) return;
    set({
      activeModule: entry.moduleId,
      activeParams: entry.params,
      cursor,
    });
  },

  forward: () => {
    const state = get();
    if (!state.canGoForward()) return;
    const cursor = state.cursor + 1;
    const entry = state.history[cursor];
    if (!entry) return;
    set({
      activeModule: entry.moduleId,
      activeParams: entry.params,
      cursor,
    });
  },

  canGoBack: () => get().cursor > 0,
  canGoForward: () => get().cursor < get().history.length - 1,

  resetParams: (moduleId) => {
    set({
      activeModule: moduleId,
      activeParams: resolveParams(moduleId),
    });
  },

  _syncFromUrl: (moduleId, params) => {
    const state = get();
    const resolved = resolveParams(moduleId, params);
    if (state.activeModule === moduleId && sameParams(state.activeParams, resolved)) {
      return;
    }
    const next: NavigationHistoryEntry = {
      moduleId,
      params: resolved,
    };
    const truncated = state.history.slice(0, state.cursor + 1);
    const history = [...truncated, next];
    set({
      activeModule: moduleId,
      activeParams: resolved,
      history,
      cursor: history.length - 1,
    });
  },
}));

/**
 * Shallow params comparison. Plain string maps so reference-equal bailout
 * is sufficient; this only guards against deep-equal no-ops.
 */
function sameParams(a: ModuleParams, b: ModuleParams): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => a[key] === b[key]);
}

/**
 * Convert ModuleParams to URLSearchParams string.
 * Omits undefined/empty values.
 */
export function paramsToSearch(params: ModuleParams): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") usp.set(k, String(v));
  }
  return usp.toString();
}

/**
 * Convert URLSearchParams to ModuleParams.
 */
export function searchToParams(searchParams: URLSearchParams): ModuleParams {
  const params: ModuleParams = {};
  for (const [k, v] of searchParams.entries()) {
    params[k] = v;
  }
  return params;
}

/**
 * Client component that syncs navigation store with URL.
 * Must be rendered inside <AppShell> (client component tree).
 *
 * Reads URL on mount and on popstate; pushes URL on store changes.
 * The URL is the single source of truth â€” store is derived from URL.
 */
export function NavigationSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { activeModule, activeParams, _syncFromUrl } = useNavigationStore();

  // Initial sync from URL on mount (and when searchParams changes via client transition).
  useEffect(() => {
    // Module is encoded in the first path segment after root, e.g. /instruction-files
    // If no module segment, default to dashboard.
    const segments = pathname.split("/").filter(Boolean);
    const moduleFromUrl = (segments[0] as ModuleId) || DEFAULT_MODULE;
    const paramsFromUrl = searchToParams(searchParams);

    // Validate module id against registry
    const validModule = MODULE_REGISTRY_MAP[moduleFromUrl] ? moduleFromUrl : DEFAULT_MODULE;

    // Only sync if different from current store state
    const currentModule = activeModule;
    const currentParams = activeParams;
    const urlModuleDifferent = validModule !== currentModule;
    const urlParamsDifferent = !sameParams(paramsFromUrl, currentParams);

    if (urlModuleDifferent || urlParamsDifferent) {
      _syncFromUrl(validModule, paramsFromUrl);
    }
  }, [pathname, searchParams]);

  // When store changes (via navigate()), push to URL.
  useEffect(() => {
    const usp = new URLSearchParams();
    for (const [k, v] of Object.entries(activeParams)) {
      if (v !== undefined && v !== "") usp.set(k, String(v));
    }
    const search = usp.toString();
    const nextPath = `/${activeModule}${search ? `?${search}` : ""}`;
    if (nextPath !== pathname) {
      router.push(nextPath, { scroll: false });
    }
  }, [activeModule, activeParams, router, pathname]);

  return null;
}

/**
 * Hook for components to navigate while keeping URL in sync.
 * Calls the store's navigate() which triggers NavigationSync to push URL.
 */
export function useNavigate() {
  const navigate = useNavigationStore((s) => s.navigate);
  return useCallback((moduleId: ModuleId, params?: ModuleParams) => {
    navigate(moduleId, params);
  }, [navigate]);
}

/**
 * Hook for components to read the current module+params from URL
 * directly (useful for SSR or when you need URL params before store sync).
 */
export function useUrlParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const moduleFromUrl = (segments[0] as ModuleId) || DEFAULT_MODULE;
  const paramsFromUrl = searchToParams(searchParams);
  return { module: moduleFromUrl, params: paramsFromUrl };
}
