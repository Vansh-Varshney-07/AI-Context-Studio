"use client";

import { type LucideIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/utils/cn";

/**
 * NavItem — single sidebar entry. Pure presentation + active styling.
 * Navigation behavior (click, navigate()) is the caller's responsibility,
 * keeping this component decoupled from Zustand.
 */
export interface NavItemProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick?: () => void;
  badge?: React.ReactNode;
  className?: string;
}

export function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
  badge,
  className,
}: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      data-active={active}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ease-smooth",
        "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
        active && "bg-accent-light text-accent font-semibold",
        className,
      )}
    >
      {active && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-lg bg-accent"
        />
      )}
      <Icon
        className={cn(
          "size-4 shrink-0 transition-colors",
          active ? "text-accent" : "text-text-muted group-hover:text-text-secondary",
        )}
      />
      <span className="flex-1 truncate text-left">{label}</span>
      {badge ? <span className="shrink-0">{badge}</span> : null}
    </button>
  );
}

/**
 * NavGroup — optional labeled section with consistent spacing.
 */
export const NavGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { label?: string }
>(function NavGroup({ label, children, className, ...props }, ref) {
  return (
    <div ref={ref} className={cn("flex flex-col gap-0.5", className)} {...props}>
      {label ? (
        <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </p>
      ) : null}
      {children}
    </div>
  );
});