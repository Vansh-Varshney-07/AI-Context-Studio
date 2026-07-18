import * as React from "react";

import { cn } from "@/utils/cn";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, size = "md", type = "text", ...props }, ref) {
    const sizeClass = size === "sm" ? "h-8 text-xs" : size === "lg" ? "h-11 text-base" : "h-9 text-sm";

    return (
      <input
        ref={ref}
        type={type}
        className={cn("input", sizeClass, className)}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };