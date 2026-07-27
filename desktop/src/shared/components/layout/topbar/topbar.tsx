import * as React from "react";

import { cn } from "@/shared/utils/cn";

/**
 * Topbar shell. Slots align with Phase 2 needs: left search/quick actions,
 * center title/breadcrumbs, right user section.
 */
export interface TopbarProps {
  start?: React.ReactNode;
  center?: React.ReactNode;
  end?: React.ReactNode;
  className?: string;
}

export function Topbar({ start, center, end, className }: TopbarProps) {
  return (
    <header className={cn("sticky top-0 z-sticky flex h-14 items-center gap-4 border-b border-border bg-bg-primary/80 backdrop-blur-sm px-4", className)}>
      <div className="flex flex-1 items-center gap-3">{start}</div>
      <div className="flex min-w-0 items-center justify-center">{center}</div>
      <div className="flex flex-1 items-center justify-end gap-3">{end}</div>
    </header>
  );
}
