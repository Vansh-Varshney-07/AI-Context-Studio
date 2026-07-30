"use client";

import { useState } from "react";
import { Monitor, Command, TerminalSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export type OS = "windows" | "macos" | "linux";

interface OSSelectorProps {
  value: OS;
  onChange: (os: OS) => void;
  className?: string;
}

const osConfig = {
  windows: { label: "Windows", icon: Monitor },
  macos: { label: "macOS", icon: Command },
  linux: { label: "Linux", icon: TerminalSquare },
};

export function OSSelector({ value, onChange, className }: OSSelectorProps) {
  return (
    <div className={cn("inline-flex items-center gap-1 p-1 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]", className)} role="tablist" aria-label="Operating System">
      {(Object.keys(osConfig) as OS[]).map((os) => {
        const config = osConfig[os];
        const Icon = config.icon;
        const isActive = value === os;
        return (
          <button
            key={os}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(os)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] shadow-sm"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {config.label}
          </button>
        );
      })}
    </div>
  );
}

export function useOS() {
  const [os, setOS] = useState<OS>("windows");
  return { os, setOS };
}