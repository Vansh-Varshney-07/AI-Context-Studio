"use client";

import { Fragment } from "react";
import { useEscapeKeydown } from "@radix-ui/react-use-escape-keydown";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useKeyboard } from "@/hooks/use-keyboard";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Library,
  Sparkles,
  Bot,
  Cpu,
  Layers,
  BookText,
  SlidersHorizontal,
  Zap,
  Boxes,
  Search,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";

import { cn } from "@/utils/cn";
import { useNavigationStore } from "@/lib/navigation-store";
import { MODULE_REGISTRY_MAP, MODULES_ORDERED } from "@/constants/modules.registry";
import type { ModuleId } from "@/types/navigation";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  shortcut?: string;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Command Palette (⌘K) — module switcher + quick actions.
 * Phase 8: full keyboard navigation, fuzzy search, instant open.
 */
export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigationStore((s) => s.navigate);
  const activeModule = useNavigationStore((s) => s.activeModule);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const itemsRef = useRef<HTMLDivElement | null>(null);

  // Build command items
  const items = React.useMemo((): CommandItem[] => {
    const moduleItems: CommandItem[] = MODULES_ORDERED.map((m) => ({
      id: m.id,
      label: m.label,
      description: m.description,
      icon: m.icon,
      shortcut: m.id === "dashboard" ? "⌘1" : undefined,
      action: () => {
        navigate(m.id);
        onClose();
      },
      keywords: [m.id, m.label.toLowerCase()],
    }));

    // Add quick actions
    const quickActions: CommandItem[] = [
      {
        id: "new-instruction",
        label: "New instruction file",
        description: "Create AGENTS.md or per-target rules",
        icon: FileText,
        action: () => { navigate("instruction-files"); onClose(); },
        keywords: ["instruction", "file", "agents", "claude", "cursor", "new", "create"],
      },
      {
        id: "prompt-library",
        label: "Browse prompt library",
        description: "Curated templates by domain",
        icon: Library,
        action: () => { navigate("prompt-library"); onClose(); },
        keywords: ["prompt", "library", "template", "browse"],
      },
      {
        id: "system-prompt-engine",
        label: "System Prompt Engine",
        description: "Structured generation across 6 output kinds",
        icon: Zap,
        action: () => { navigate("system-prompt-engine"); onClose(); },
        keywords: ["system", "prompt", "engine", "generate", "ai", "workflow"],
      },
      {
        id: "personas",
        label: "Design a persona",
        description: "AI personas and system roles",
        icon: Bot,
        action: () => { navigate("personas"); onClose(); },
        keywords: ["persona", "role", "design", "ai"],
      },
      {
        id: "skills",
        label: "Compose a skill",
        description: "Atomic composable AI skills",
        icon: Cpu,
        action: () => { navigate("skills"); onClose(); },
        keywords: ["skill", "compose", "atomic"],
      },
      {
        id: "workflows",
        label: "Build a workflow",
        description: "Orchestrate skills into pipelines",
        icon: Layers,
        action: () => { navigate("workflows"); onClose(); },
        keywords: ["workflow", "pipeline", "orchestrate"],
      },
      {
        id: "memories",
        label: "Memories & Context",
        description: "Long-running context blocks",
        icon: BookText,
        action: () => { navigate("memories"); onClose(); },
        keywords: ["memory", "context", "long", "running"],
      },
      {
        id: "configurations",
        label: "Configurations",
        description: "MCP configs and provider settings",
        icon: SlidersHorizontal,
        action: () => { navigate("configurations"); onClose(); },
        keywords: ["config", "mcp", "provider", "settings"],
      },
    ];

    return [...moduleItems, ...quickActions];
  }, [navigate, onClose, activeModule]);

  // Filter items by query
  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((item) =>
      item.label.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.keywords?.some((k) => k.toLowerCase().includes(q))
    );
  }, [items, query]);

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useKeyboard({
    ArrowDown: () => {
      if (filteredItems.length) {
        setSelectedIndex((i) => (i + 1) % filteredItems.length);
      }
    },
    ArrowUp: () => {
      if (filteredItems.length) {
        setSelectedIndex((i) => (i - 1 + filteredItems.length) % filteredItems.length);
      }
    },
    Enter: () => {
      const item = filteredItems[selectedIndex];
      if (item) item.action();
    },
    Escape: onClose,
  });

  // Close on outside click
  const overlayRef = useRef<HTMLDivElement>(null);
  useClickOutside(overlayRef, onClose);

  // Animate entry/exit
  return (
    <AnimatePresence>
      {open && (
        <Fragment>
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="overflow-hidden rounded-xl border border-border-default bg-bg-elevated/95 shadow-2xl backdrop-blur-xl">
              {/* Search input */}
              <div className="border-b border-border-subtle px-4 py-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type a command or search…"
                    className="flex w-full rounded-md bg-white/5 py-3 pl-10 pr-4 text-sm text-fg-primary placeholder:text-fg-muted focus-visible:outline-none"
                    autoFocus
                    spellCheck={false}
                    aria-label="Command palette search"
                  />
                  <kbd className="ml-auto hidden rounded border border-border-strong bg-white/5 px-2 text-[10px] text-fg-subtle md:inline">
                    ⌘K
                  </kbd>
                </div>
              </div>

              {/* Results */}
              <div
                ref={itemsRef}
                className="max-h-[50vh] overflow-y-auto"
                role="listbox"
                aria-label="Commands"
              >
                {filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center text-fg-muted">
                    <Search className="size-8 opacity-50" />
                    <p className="text-sm">No commands match "{query}"</p>
                    <p className="text-xs">Try a different search</p>
                  </div>
                ) : filteredItems.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                          isSelected
                            ? "bg-accent/10 text-fg-primary"
                            : "text-fg-secondary hover:bg-white/5 hover:text-fg-primary"
                        )}
                      >
                        {item.icon && (
                          <span
                            className={cn(
                              "flex size-5 shrink-0 items-center justify-center",
                              isSelected ? "text-[var(--accent-primary-hover)]" : "text-fg-muted"
                            )}
                          >
                            <item.icon className="size-4" />
                          </span>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium">{item.label}</p>
                          {item.description && (
                            <p className="truncate text-xs text-fg-muted">{item.description}</p>
                          )}
                        </div>
                        {item.shortcut && (
                          <kbd className="shrink-0 rounded border border-border-strong bg-white/5 px-1.5 text-[10px] text-fg-subtle">
                            {item.shortcut}
                          </kbd>
                        )}
                      </button>
                    );
                  })}
              </div>

              {/* Footer hint */}
              <div className="border-t border-border-subtle px-3 py-2">
                <p className="flex items-center justify-center gap-2 text-[10px] text-fg-subtle">
                  <kbd className="rounded border border-border-strong bg-white/5 px-1.5">↑</kbd>
                  <kbd className="rounded border border-border-strong bg-white/5 px-1.5">↓</kbd>
                  navigate · <kbd className="rounded border border-border-strong bg-white/5 px-1.5">⏎</kbd> select · <kbd className="rounded border border-border-strong bg-white/5 px-1.5">Esc</kbd> close
                </p>
              </div>
            </div>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}