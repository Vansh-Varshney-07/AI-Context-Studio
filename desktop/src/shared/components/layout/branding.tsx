import { Sparkles } from "lucide-react";

/**
 * App brand mark + name. Mounted at the top of the sidebar.
 * Clean, editorial branding.
 */
export function CoreBranding() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-text-inverse shadow-sm">
        <Sparkles className="size-4" />
      </span>
      <span className="flex flex-col min-w-0">
        <span className="text-sm font-semibold text-text-primary truncate">
          AI Context Studio
        </span>
        <span className="text-xs font-medium text-text-muted truncate">
          Instruction engineering
        </span>
      </span>
    </div>
  );
}
