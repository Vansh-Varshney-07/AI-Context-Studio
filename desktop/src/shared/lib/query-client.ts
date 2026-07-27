import { QueryClient } from "@tanstack/react-query";

/**
 * Factory for the TanStack Query client.
 *
 * Kept separate from `providers/` so it can be instantiated:
 *   - per-test (isolated QueryClient) without data sharing leakage
 *   - once for the app via `providers/AppProviders.tsx`
 *
 * Defaults are tuned for a local-first app: short stale time to avoid
 * noisy refetches and graceful retry on transient failures.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
