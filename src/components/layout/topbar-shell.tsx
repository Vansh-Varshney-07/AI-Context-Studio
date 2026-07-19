"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Topbar } from "@/components/layout/topbar";
import { UserSection } from "@/components/layout/user-section";
import { CommandPalette } from "@/components/layout/command-palette";
import { useNavigationStore } from "@/lib/navigation-store";
import { MODULE_REGISTRY_MAP } from "@/constants/modules.registry";

/**
 * Topbar shell — wires module-aware title + a future search input slot +
 * the UserSection on the right. Phase 2/3 deliver the title + user;
 * Phase 8 will expand search into the command palette.
 */
export function TopbarShell() {
  const activeModule = useNavigationStore((s) => s.activeModule);
  const manifest = MODULE_REGISTRY_MAP[activeModule];
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openPalette = () => setPaletteOpen(true);
  const closePalette = () => setPaletteOpen(false);

  return (
    <>
      <Topbar
        start={
          <SearchTrigger onClick={openPalette} />
        }
        center={
          manifest ? (
            <p className="truncate text-sm font-semibold text-text-primary">
              {manifest.label}
            </p>
          ) : null
        }
        end={<UserSection name="Studio Operator" email="operator@studio.local" />}
      />
      <CommandPalette open={paletteOpen} onClose={closePalette} />
    </>
  );
}

/**
 * Search trigger — opens command palette on click or ⌘K.
 */
function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-secondary size-9 max-w-xs gap-2 flex items-center"
      aria-label="Open command palette"
    >
      <Search className="size-3.5 shrink-0" />
      <span className="hidden sm:inline text-xs">Search…</span>
      <kbd className="ml-auto hidden rounded border border-border-strong bg-bg-secondary px-1.5 text-[10px] text-text-muted md:inline">
        ⌘K
      </kbd>
    </button>
  );
}