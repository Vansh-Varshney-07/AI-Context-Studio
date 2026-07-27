"use client";

import { Fragment } from "react";
import { useClickOutside } from "@/shared/hooks/use-click-outside";
import { useKeyboard } from "@/shared/hooks/use-keyboard";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogClose,
} from "@radix-ui/react-dialog";
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
import { useState, useEffect, useCallback, useRef } from "react";

import { cn } from "@/shared/utils/cn";
import { useNavigationStore } from "@/shared/lib/navigation-store";
import { MODULE_REGISTRY_MAP, MODULES_ORDERED } from "@/shared/constants/modules.registry";
import type { ModuleId } from "@/shared/types/navigation";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  action: () => void;
  shortcut?: string;
  category?: string;
}

/**
 * Command palette (âŒ˜K) â€” global search + actions.
 * Phase 8: wired to topbar SearchTrigger.
 */
export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigationStore((s) => s.navigate);
  const itemsRef = useRef<CommandItem[]>([]);

  // Build command items
  useEffect(() => {
    const modules = MODULES_ORDERED.map((m) => ({
      id: `module:${m.id}`,
      label: m.label,
      description: m.description,
      icon: m.icon,
      category: "Modules",
      shortcut: "",
      action: () => {
        navigate(m.id as ModuleId);
        onClose();
      },
    }));

    const actions: CommandItem[] = [
      {
        id: "new-instruction",
        label: "New instruction file",
        description: "Create AGENTS.md / CLAUDE.md / .cursorrules",
        icon: FileText,
        category: "Actions",
        shortcut: "",
        action: () => {
          navigate("instruction-files");
          onClose();
        },
      },
      {
        id: "prompt-library",
        label: "Open prompt library",
        description: "Browse 36 seed templates across 6 categories",
        icon: Library,
        category: "Actions",
        shortcut: "",
        action: () => {
          navigate("prompt-library");
          onClose();
        },
      },
      {
        id: "system-prompt-engine",
        label: "System prompt engine",
        description: "Generate 6 output kinds from structured data",
        icon: Zap,
        category: "Actions",
        shortcut: "",
        action: () => {
          navigate("system-prompt-engine");
          onClose();
        },
      },
      {
        id: "personas",
        label: "Personas",
        description: "Reusable AI personas and system roles",
        icon: Bot,
        category: "Modules",
        shortcut: "",
        action: () => {
          navigate("personas");
          onClose();
        },
      },
      {
        id: "skills",
        label: "Skills",
        description: "Atomic AI skills that can be composed",
        icon: Cpu,
        category: "Modules",
        shortcut: "",
        action: () => {
          navigate("skills");
          onClose();
        },
      },
      {
        id: "workflows",
        label: "Workflows",
        description: "Orchestrate skills into repeatable pipelines",
        icon: Layers,
        category: "Modules",
        shortcut: "",
        action: () => {
          navigate("workflows");
          onClose();
        },
      },
      {
        id: "memories",
        label: "Memories & Context",
        description: "Long-running context and memory blocks",
        icon: BookText,
        category: "Modules",
        shortcut: "",
        action: () => {
          navigate("memories");
          onClose();
        },
      },
      {
        id: "mcp",
        label: "MCP Manager",
        description: "MCP configurations and provider settings",
        icon: SlidersHorizontal,
        category: "Modules",
        shortcut: "",
        action: () => {
          navigate("mcp");
          onClose();
        },
      },
    ];

    itemsRef.current = [...modules, ...actions];
  }, [navigate, onClose]);

  // Filter items
  const filteredItems = itemsRef.current.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.label.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q)
    );
  });

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        filteredItems[selectedIndex]?.action();
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [filteredItems, selectedIndex, onClose]
  );

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus management
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setSelectedIndex(0);
    }
  }, [open]);

  // Close on outside click
  const contentRef = useRef<HTMLDivElement>(null);
  useClickOutside(contentRef, onClose);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogOverlay
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-50",
          "data-[state=open]:animate-in data-[state=closed]:animate-out"
        )}
      />
      <AnimatePresence>
        <DialogContent
          ref={contentRef}
          className={cn(
            "fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl rounded-xl border border-border bg-bg-primary/95 p-0 shadow-[0_0_80px_rgba(34,34,34,0.15)] z-50",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col"
          >
            {/* Search input */}
            <div className="relative p-4 border-b border-border-subtle">
              <Search className="absolute left-10 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
              <kbd className="absolute right-4 top-1/2 -translate-y-1/2 rounded border border-border-strong bg-bg-secondary px-1.5 text-[10px] text-text-muted">
                âŒ˜K
              </kbd>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search modulesâ€¦"
                className="flex h-11 w-full rounded-lg border border-border bg-cream pl-10 pr-10 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                autoFocus
              />
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center text-text-muted">
                  <Search className="size-6 opacity-50" />
                  <p className="text-sm">No commands found for "{query}"</p>
                  <p className="text-xs">Try a different query</p>
                </div>
              ) : (
                <>
                  {Object.entries(
                    filteredItems.reduce(
                      (acc, item) => {
                        const cat = item.category ?? "Other";
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(item);
                        return acc;
                      },
                      {} as Record<string, CommandItem[]>
                    ),
                  ).map(([category, items]) => (
                    <div key={category} className="border-b border-border-subtle first:border-t-0">
                      <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        {category}
                      </div>
                      {items.map((item, idx) => {
                        const absoluteIdx = filteredItems.indexOf(item);
                        const isSelected = absoluteIdx === selectedIndex;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={item.action}
                            onMouseEnter={() => setSelectedIndex(absoluteIdx)}
                            className={cn(
                              "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                              isSelected
                                ? "bg-accent-light text-text-primary"
                                : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                            )}
                          >
                            {item.icon && (
                              <item.icon
                                className={cn(
                                  "size-4 shrink-0",
                                  isSelected ? "text-accent" : "text-text-muted"
                                )}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="truncate font-medium">{item.label}</p>
                              {item.description && (
                                <p className="truncate text-xs text-text-muted">{item.description}</p>
                              )}
                            </div>
                            {item.shortcut && (
                              <kbd className="rounded border border-border-strong bg-bg-secondary px-1.5 text-[10px] text-text-muted">
                                {item.shortcut}
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        </DialogContent>
      </AnimatePresence>
      <DialogClose asChild>
        <button
          className="fixed inset-0 z-40"
          aria-label="Close command palette"
          onClick={onClose}
        />
      </DialogClose>
    </Dialog>
  );
}
