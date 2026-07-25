"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Suspense } from "react";

/**
 * Catch-all route for direct module links / refreshes.
 * Renders the AppShell which reads the URL via NavigationSync
 * and dispatches to the correct module in-place.
 */
export default function CatchAll() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-fg-muted">Loading…</div>}>
      <AppShell />
    </Suspense>
  );
}