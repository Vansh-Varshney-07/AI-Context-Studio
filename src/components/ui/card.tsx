"use client";

import * as React from "react";

import { cn } from "@/utils/cn";

/**
 * Premium Card primitive.
 * Calm, editorial card design with subtle elevation.
 */

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { bordered?: boolean; elevated?: boolean }
>(function Card({ className, bordered = true, elevated = false, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl transition-all duration-150 ease-smooth",
        bordered && "border border-border",
        elevated ? "shadow-md" : "shadow-sm",
        "bg-bg-primary",
        className,
      )}
      {...props}
    />
  );
});

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardHeader({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("px-6 py-5", className)}
      {...props}
    />
  );
});

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(function CardTitle({ className, ...props }, ref) {
  return (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold text-text-primary tracking-tight", className)}
      {...props}
    />
  );
});

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-text-secondary mt-1", className)}
      {...props}
    />
  );
});

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardContent({ className, ...props }, ref) {
  return <div ref={ref} className={cn("px-6 pb-6", className)} {...props} />;
});

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardFooter({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-2 px-6 py-4 border-t border-border bg-bg-tertiary", className)}
      {...props}
    />
  );
});

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};