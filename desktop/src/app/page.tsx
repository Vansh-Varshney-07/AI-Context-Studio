import { AppShell } from "@components/layout/app-shell";
import { Suspense } from "react";

/**
 * Root route.
 *
 * Phase 1 placeholder was retired in Phase 3: the whole experience runs
 * from the AppShell chrome with in-place module navigation.
 *
 * Phase 8: AppShell uses useSearchParams which requires Suspense boundary
 * for prerendered routes.
 */
export default function Home() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-fg-muted">Loading…</div>}>
      <AppShell />
    </Suspense>
  );
}

