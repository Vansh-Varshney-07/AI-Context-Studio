"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import { Toaster, type Toast } from "@/components/ui/toaster";

/**
 * Minimal toast orchestration. Phase 8 will expand this with keyboard
 * dismiss / stacking / action callbacks. The interface is intentionally
 * forward-compatible so expanders don't churn the call surface.
 */
interface ToastContextValue {
  toast: (toast: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToasterProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = (id: string) =>
    setToasts((current) => current.filter((t) => t.id !== id));

  const toast = (next: Omit<Toast, "id">) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    setToasts((current) => [...current, { ...next, id }]);
    if (next.duration !== Infinity) {
      window.setTimeout(
        () => dismiss(id),
        next.duration ?? 4000,
      );
    }
    return id;
  };

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error(
      "useToast must be used within <ToasterProvider> (composed by <AppProviders>).",
    );
  }
  return ctx;
}
