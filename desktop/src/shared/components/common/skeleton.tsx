import * as React from "react";

import { cn } from "@/shared/utils/cn";

const shimmerClass =
  "relative overflow-hidden rounded-md bg-white/[0.04] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.06] before:to-transparent";

const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function Skeleton({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(shimmerClass, className)}
      {...props}
    />
  );
});

export { Skeleton };
