"use client";

import { useEffect, useState } from "react";

import { Sidebar } from "@/shared/components/layout/sidebar";
import { SidebarNav } from "@/shared/components/layout/sidebar-nav";
import { TopbarShell } from "@/shared/components/layout/topbar-shell";
import { WorkspaceShell } from "@/shared/components/layout/workspace-shell";
import { CoreBranding } from "@/shared/components/layout/branding";
import { MainWorkspace } from "@/shared/components/layout/main-workspace";
import { SidebarApiConfig } from "@/features/dashboard";
import { NavigationSync } from "@/shared/lib/navigation-store";
import { Suspense } from "react";
import { CommandPalette } from "@/shared/components/common/command-palette";

/**
 * AppShell â€” the single chrome assembled from layout slots.
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
