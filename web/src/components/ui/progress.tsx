import { cn } from "@/lib/utils";

export function Progress({
  className,
  value,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  value?: number;
}) {
  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]",
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-[var(--color-accent)] transition-all duration-300 ease-out"
        style={{ width: `${Math.min(Math.max(value ?? 0, 0), 100)}%` }}
      />
    </div>
  );
}

Progress.displayName = "Progress";