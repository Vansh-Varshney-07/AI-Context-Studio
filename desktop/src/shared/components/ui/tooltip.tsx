"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@/shared/utils/cn";

/**
 * Tooltip namespace.
 * Usage:
 *   <Tooltip.Provider>
 *     <Tooltip>
 *       <Tooltip.Trigger asChild><button>...</button></Tooltip.Trigger>
 *       <Tooltip.Content>...</Tooltip.Content>
 *     </Tooltip>
 *   </Tooltip.Provider>
 *
 * The Provider is mounted once in <AppProviders/>.
 */
const Tooltip = {
  Provider: TooltipPrimitive.Provider,
};

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(function TooltipContent({ className, sideOffset = 6, ...props }, ref) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-md border border-border-default bg-bg-elevated px-2.5 py-1.5 text-xs text-fg-primary shadow-e3",
          "data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
});

export { Tooltip, TooltipContent, TooltipTrigger };
