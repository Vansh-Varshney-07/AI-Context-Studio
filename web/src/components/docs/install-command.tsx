"use client";

import { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstallCommandProps {
  command: string;
  label?: string;
  className?: string;
}

export function InstallCommand({ command, label = "Install", className }: InstallCommandProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex items-center gap-2 p-3 rounded-lg bg-[#1e1e2e] border border-[var(--color-border)]", className)}>
      <Terminal className="h-4 w-4 text-[#6c7086] flex-shrink-0" aria-hidden="true" />
      <code className="flex-1 text-sm font-mono text-[#cdd6f4] overflow-x-auto whitespace-nowrap">{command}</code>
      <button
        onClick={handleCopy}
        className="flex-shrink-0 p-1.5 rounded-md text-[#6c7086] hover:text-[#cdd6f4] hover:bg-[#313244] transition-colors"
        aria-label={copied ? "Copied" : `Copy ${label} command`}
      >
        {copied ? (
          <Check className="h-4 w-4 text-[#a6e3a1]" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}