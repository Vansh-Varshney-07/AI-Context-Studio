import * as React from "react";

import { cn } from "@/utils/cn";

/**
 * Sidebar shell. Phase 1 ships the structural slots (brand/header → nav/footer)
 * that Phase 2 fills. Slots keep layout free of feature coupling.
 */
export interface SidebarProps {
  header?: React.ReactNode;
  navigation?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Sidebar({
  header,
  navigation,
  footer,
  className,
}: SidebarProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col bg-bg-secondary text-text-primary border-r border-border",
        className,
      )}
    >
      {header ? (
        <div className="shrink-0 border-b border-border px-4 py-5">
          {header}
        </div>
      ) : null}
      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-4">
        {navigation}
      </nav>
      {footer ? (
        <div className="shrink-0 border-t border-border p-3">
          {footer}
        </div>
      ) : null}
    </div>
  );
}