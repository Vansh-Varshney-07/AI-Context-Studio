"use client";

import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/shared/utils/cn";

const buttonBase = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const variantStyles = {
  primary: "bg-accent text-text-inverse hover:bg-accent-hover active:bg-accent-hover/90 shadow-sm",
  secondary: "bg-cream text-text-primary border border-border hover:bg-cream/80 hover:border-border-strong active:bg-cream/60",
  ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-secondary active:bg-bg-secondary/80",
  outline: "border border-border text-text-primary hover:bg-bg-secondary hover:border-border-strong active:bg-bg-secondary/80",
  danger: "bg-error text-text-inverse hover:bg-error/90 active:bg-error shadow-sm",
  subtle: "text-text-secondary hover:text-text-primary hover:bg-bg-secondary active:bg-bg-secondary/80 bg-transparent",
};

const sizeStyles = {
  sm: "h-9 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
  icon: "size-10 p-0",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", asChild = false, ...props },
    ref,
  ) {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonBase, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
