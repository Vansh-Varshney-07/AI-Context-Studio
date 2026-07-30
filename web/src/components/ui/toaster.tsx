"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "success" | "warning" | "error";

interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  variant?: ToastVariant;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default: "bg-[var(--color-bg-surface)] border-[var(--color-border)]",
      success: "bg-[var(--color-success-bg)] border-[var(--color-success)]",
      warning: "bg-[var(--color-warning-bg)] border-[var(--color-warning)]",
      error: "bg-[var(--color-error-bg)] border-[var(--color-error)]",
    };

    return (
      <ToastPrimitive.Root
        ref={ref as React.Ref<HTMLLIElement>}
        className={cn(
          "rounded-lg border px-4 py-3 shadow-lg grid gap-2 grid-cols-[1fr_auto] items-start min-w-[320px] max-w-[480px]",
          variantStyles[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Toast.displayName = ToastPrimitive.Root.displayName;

const ToastAction = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-white transition-colors hover:bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);

ToastAction.displayName = "ToastAction";

const ToastClose = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>>(
  ({ className, ...props }, ref) => (
    <ToastPrimitive.Close
      ref={ref}
      className={cn(
        "absolute right-2 top-2 rounded-md p-1 text-[var(--color-text-muted)] opacity-0 transition-opacity hover:text-[var(--color-text-primary)] focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] group-hover:opacity-100",
        className,
      )}
      toast-close=""
      {...props}
    >
      <X className="h-4 w-4" />
    </ToastPrimitive.Close>
  ),
);

ToastClose.displayName = ToastPrimitive.Close.displayName;

const ToastTitle = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>>(
  ({ className, ...props }, ref) => (
    <ToastPrimitive.Title ref={ref} className={cn("text-sm font-semibold text-[var(--color-text-primary)]", className)} {...props} />
  ),
);

ToastTitle.displayName = ToastPrimitive.Title.displayName;

const ToastDescription = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>>(
  ({ className, ...props }, ref) => (
    <ToastPrimitive.Description ref={ref} className={cn("text-sm opacity-90 text-[var(--color-text-secondary)]", className)} {...props} />
  ),
);

ToastDescription.displayName = ToastPrimitive.Description.displayName;

export interface ToastOptions {
  id: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastContextValue {
  toasts: ToastOptions[];
  addToast: (toast: ToastOptions) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToasterProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToasterProps) {
  const [toasts, setToasts] = React.useState<(ToastOptions & { id: string })[]>([]);

  const addToast = React.useCallback((toast: ToastOptions) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);
    if (toast.duration !== 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toast.duration ?? 5000);
    }
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

const ToastViewport = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>>(
  ({ className, ...props }, ref) => (
    <ToastPrimitive.Viewport
      ref={ref}
      className={cn(
        "fixed bottom-4 right-4 z-[var(--z-toast)] flex flex-col gap-2 w-full max-w-sm sm:max-w-md",
        className,
      )}
      {...props}
    />
  ),
);

ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div
      className="fixed bottom-4 right-4 z-[var(--z-toast)] flex flex-col gap-2 w-full max-w-sm sm:max-w-md"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} variant={toast.variant}>
          <div className="grid gap-1">
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
          </div>
          {toast.action && <ToastAction>{toast.action}</ToastAction>}
          <ToastClose />
        </Toast>
      ))}
    </div>
  );
}