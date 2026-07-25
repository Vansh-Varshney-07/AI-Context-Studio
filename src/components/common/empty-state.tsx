import { type LucideIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/utils/cn";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border-default bg-white/[0.02] px-6 py-12 text-center",
        className,
      )}
    >
      <div className="rounded-full bg-white/5 p-3 text-fg-muted">
        <Icon className="size-6" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-fg-primary">{title}</p>
        {description ? (
          <p className="mx-auto max-w-xs text-xs text-fg-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
