import { cn } from "@/lib/utils";

interface VersionBadgeProps {
  version: string;
  status?: "stable" | "beta" | "alpha" | "deprecated";
  className?: string;
}

const statusConfig = {
  stable: { label: "", color: "bg-green-100 text-green-800 border-green-200" },
  beta: { label: "Beta", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  alpha: { label: "Alpha", color: "bg-purple-100 text-purple-800 border-purple-200" },
  deprecated: { label: "Deprecated", color: "bg-gray-100 text-gray-700 border-gray-200" },
};

export function VersionBadge({ version, status = "stable", className }: VersionBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
        config.color,
        className
      )}
    >
      v{version}
      {config.label && <span className="text-[10px] uppercase tracking-wide">{config.label}</span>}
    </span>
  );
}