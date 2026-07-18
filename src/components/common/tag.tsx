import * as React from "react";

import { cn } from "@/utils/cn";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "success" | "warning" | "error" | "muted";
  size?: "sm" | "md";
}

export function Tag({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: TagProps) {
  const base = "inline-flex items-center rounded-full font-medium uppercase tracking-wider";
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs";

  const variants = {
    default: "bg-bg-tertiary text-text-secondary border border-border",
    accent: "bg-accent-light text-accent",
    success: "bg-success-bg text-success",
    warning: "bg-warning-bg text-warning",
    error: "bg-error-bg text-error",
    muted: "bg-bg-secondary text-text-muted",
  };

  return (
    <span className={cn(base, sizeClass, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}