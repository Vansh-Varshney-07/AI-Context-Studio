"use client";

import * as React from "react";

import { cn } from "@/shared/utils/cn";

import "./toast.css";

export type ToastVariant = "default" | "success" | "warning" | "danger";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToasterProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const variantClass: Record<ToastVariant, string> = {
  default: "border-border-default bg-bg-elevated",
  success: "border-success/40 bg-success/10",
  warning: "border-warning/40 bg-warning/10",
  danger: "border-danger/40 bg-danger/10",
};

export function Toaster({ toasts, onDismiss }: ToasterProps) {
  return (
    <div
      role="region"
      aria-label="Notifications"
      className="toast-viewport"
    >
      {toasts.map((toast) => {
        const variant: ToastVariant = toast.variant ?? "default";
        return (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={cn(
              "toast-item pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 text-sm shadow-e3 backdrop-blur",
              variantClass[variant],
            )}
          >
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="font-medium text-fg-primary">{toast.title}</p>
              {toast.description ? (
                <p className="text-xs text-fg-secondary">{toast.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="toast-dismiss text-fg-muted transition-colors hover:text-fg-primary"
            >
              Ã—
            </button>
          </div>
        );
      })}
    </div>
  );
}
