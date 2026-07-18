"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/utils/cn";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    max?: number;
    min?: number;
    step?: number;
  }
>(({ className, max = 10, min = 0, step = 1, ...props }, ref) => {
  const tickCount = Math.floor((max - min) / step) + 1;
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className,
      )}
      max={max}
      min={min}
      step={step}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-border">
        <SliderPrimitive.Range className="absolute h-full bg-accent" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-border bg-bg-primary shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      {tickCount > 1 && (
        <div
          className="absolute bottom-0 left-0 flex w-full items-end justify-between px-1"
          aria-hidden="true"
        >
          {Array.from({ length: tickCount }, (_, i) => (
            <span
              key={i}
              className="h-1.5 w-px bg-border"
              style={{
                height: i === 0 || i === tickCount - 1 ? "2.5px" : "1.5px",
              }}
            />
          ))}
        </div>
      )}
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };