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

export function AppShellClient() {
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
