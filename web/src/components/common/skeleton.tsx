"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({
  className,
  width = "100%",
  height,
  variant = "text",
}: SkeletonProps) {
  const baseStyles = "animate-pulse bg-[var(--color-border)] rounded";

  const variantStyles = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 space-y-4", className)}>
      <div className="flex items-center gap-4">
        <Skeleton width={48} height={48} variant="circular" />
        <div className="space-y-2 flex-1">
          <Skeleton width="40%" height={20} />
          <Skeleton width="60%" height={16} />
        </div>
      </div>
      <Skeleton width="100%" height={12} />
      <Skeleton width="80%" height={12} />
      <Skeleton width="60%" height={12} />
      <div className="flex gap-2 pt-4">
        <Skeleton width={80} height={32} variant="rectangular" />
        <Skeleton width={80} height={32} variant="rectangular" />
      </div>
    </div>
  );
}

export function AssetCardSkeleton() {
  return (
    <div className="group relative flex flex-col h-full border border-[var(--color-border)] rounded-xl bg-[var(--color-bg-surface)] overflow-hidden transition-all duration-200 hover:border-[var(--color-border-strong)] hover:shadow-lg">
      <div className="aspect-video w-full bg-[var(--color-border)] animate-pulse" />
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div className="flex items-center gap-2">
          <Skeleton width={80} height={20} />
          <Skeleton width={60} height={20} />
        </div>
        <Skeleton width="100%" height={16} />
        <Skeleton width="70%" height={16} />
        <Skeleton width="50%" height={16} />
        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-[var(--color-border)]">
          <Skeleton width={24} height={24} variant="circular" />
          <Skeleton width={80} height={14} />
          <span className="ml-auto">
            <Skeleton width={60} height={20} variant="rectangular" />
          </span>
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton width={i === 0 ? "60%" : "40%"} height={16} />
        </td>
      ))}
    </tr>
  );
}