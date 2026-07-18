import * as React from "react";

import { cn } from "@/utils/cn";

/**
 * WorkspaceShell is the top-level application chrome container.
 *
 * Layout:
 *   .grid (sidebar-width | 1fr)
 *   - Left:  <Sidebar/>
 *   - Right: <div flex-col> <Topbar/> + <MainWorkspace/> </div>
 *
 * Phase 1 ships only the chrome + slots. Phase 2 fills each slot with
 * real content. This guarantees a single stable grid across phases.
 */
export interface WorkspaceShellProps {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  main: React.ReactNode;
  className?: string;
}

export function WorkspaceShell({
  sidebar,
  topbar,
  main,
  className,
}: WorkspaceShellProps) {
  return (
    <div
      className={cn(
        "grid h-screen w-screen grid-cols-[260px_1fr] overflow-hidden bg-bg-primary",
        "lg:grid-cols-[260px_1fr]",
        className,
      )}
    >
      <aside className="h-full overflow-hidden border-r border-border">
        {sidebar}
      </aside>
      <div className="flex h-full flex-col overflow-hidden">
        <header className="shrink-0 border-b border-border bg-bg-primary/80 backdrop-blur-sm">
          {topbar}
        </header>
        <main className="flex-1 overflow-y-auto">{main}</main>
      </div>
    </div>
  );
}