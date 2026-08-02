"use client";

import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
    variant?: "default" | "outline" | "ghost";
  };
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
    <div className={`flex flex-col items-center justify-center text-center py-16 px-4 ${className}`}>
      {Icon && (
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent-light)] text-[var(--color-accent)]">
          <Icon className="h-8 w-8" aria-hidden="true" />
        </div>
      )}
      <h3 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">{title}</h3>
      <p className="mb-6 max-w-md text-[var(--color-text-secondary)]">{description}</p>
      {action && (
        <a
          href={action.href}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            action.variant === "outline"
              ? "border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
              : action.variant === "ghost"
              ? "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              : "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]"
          }`}
        >
          {action.label}
        </a>
      )}
    </div>
  );
}