"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { bordered?: boolean; elevated?: boolean; glass?: boolean }>(
  function Card({ className, bordered = true, elevated = false, glass = false, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl transition-all duration-150 ease-smooth",
          glass
            ? "bg-[var(--color-glass)] border-[var(--color-glass-border)] backdrop-blur-md"
            : "bg-[var(--color-bg-surface)]",
          bordered && "border border-[var(--color-border)]",
          elevated && !glass && "shadow-md",
          className,
        )}
        {...props}
      />
    );
  },
);

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cn("px-6 py-5", className)} {...props} />;
  },
);

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, ...props }, ref) {
    return <h3 ref={ref} className={cn("text-lg font-semibold text-[var(--color-text-primary)] tracking-tight", className)} {...props} />;
  },
);

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cn("text-sm text-[var(--color-text-secondary)] mt-1", className)} {...props} />;
  },
);

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn("px-6 pb-6", className)} {...props} />;
  },
);

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]", className)}
        {...props}
      />
    );
  },
);

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };