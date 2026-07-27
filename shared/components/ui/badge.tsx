import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@shared/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-border-default bg-white/5 text-fg-secondary",
        accent:
          "border-accent/30 bg-accent/10 text-[var(--accent-primary-hover)]",
        success:
          "border-success/30 bg-success/10 text-[var(--status-success)]",
        warning:
          "border-warning/30 bg-warning/10 text-[var(--status-warning)]",
        danger: "border-danger/30 bg-danger/10 text-[var(--status-danger)]",
        outline: "border-border-strong text-fg-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
