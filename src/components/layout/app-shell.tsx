"use client";

import { useEffect, useState } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { TopbarShell } from "@/components/layout/topbar-shell";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { CoreBranding } from "@/components/layout/branding";
import { MainWorkspace } from "@/components/layout/main-workspace";
import { SidebarApiConfig } from "@/features/dashboard";
import { NavigationSync } from "@/lib/navigation-store";
import { Suspense } from "react";
import { CommandPalette } from "@/components/common/command-palette";

/**
 * AppShell — the single chrome assembled from layout slots.
 *
 * Phase 3 owns this composition: every slot is driven by the module
 * registry (`constants/modules.registry.ts`) so future modules require
 * zero layout changes.
 *
 * Phase 8 adds NavigationSync to synchronize URL with navigation store.
 * Wrapped in Suspense because useSearchParams requires a boundary.
 */
export function AppShell() {
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <NavigationSync />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      <WorkspaceShell
        sidebar={
          <Sidebar
            header={<CoreBranding />}
            navigation={<SidebarNav />}
            footer={<SidebarApiConfig />}
          />
        }
        topbar={<TopbarShell />}
        main={<MainWorkspace />}
      />
    </>
  );
}
