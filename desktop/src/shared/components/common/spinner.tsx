import { Loader2, type LucideIcon } from "lucide-react";

import { cn } from "@/shared/utils/cn";

interface SpinnerProps {
  icon?: LucideIcon;
  className?: string;
  label?: string;
}

/**
 * Lightweight inline spinner. Default uses Loader2 for compact loaders.
 * Pass `icon={LoaderCircle}` to swap glyphs without breaking consumers.
 */
export function Spinner({ icon: Icon = Loader2, className, label }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label ?? "Loading"}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <Icon className="size-4 animate-spin text-fg-muted" aria-hidden />
    </span>
  );
}
