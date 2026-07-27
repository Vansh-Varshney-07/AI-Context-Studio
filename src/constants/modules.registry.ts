import {
  BookText,
  Bot,
  Boxes,
  Cpu,
  FileText,
  Layers,
  Library,
  SlidersHorizontal,
  Sparkles,
  Server,
  Shield,
  Zap,
  Search,
  Settings,
  type LucideIcon,
} from "lucide-react";

import type { ModuleId, ModuleParams } from "@/types/navigation";

/**
 * Manifest entry describing a navigable workspace module.
 * Adding a module requires ONLY appending a new entry here —
 * layout/sidebar/main workspace components drive purely off this registry.
 */
export interface ModuleManifest {
  id: ModuleId;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Stable ordering in the sidebar (user-facing). */
  order: number;
  /** Optional initial params applied when this module becomes active. */
  defaultParams?: ModuleParams;
}

/**
 * Canonical module registry.
 *
 * Phase 3 navigation uses this exclusively to render sidebar entries and
 * to resolve active module content. To add a new module:
 *   1. append its id to `ModuleId` union in `types/navigation.ts`
 *   2. append its manifest entry here
 *   3. implement a renderer and register it in the navigation store
 *
 * Layout changes are NEVER required.
 */
export const MODULE_REGISTRY: readonly ModuleManifest[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Overview, quick start, and recent files.",
    icon: Sparkles,
    order: 0,
  },
  {
    id: "instruction-files",
    label: "Instruction Files",
    description: "Build AGENTS.md and per-target agent instructions.",
    icon: FileText,
    order: 10,
  },
  {
    id: "prompt-library",
    label: "Prompt Library",
    description: "Curated prompt templates organized by domain.",
    icon: Library,
    order: 20,
  },
  {
    id: "system-prompt-engine",
    label: "Prompt Engine",
    description: "Structured-data-driven system prompt generation across 6 output kinds.",
    icon: Boxes,
    order: 25,
  },
  {
    id: "personas",
    label: "Personas",
    description: "Reusable AI personas and system roles.",
    icon: Bot,
    order: 30,
  },
  {
    id: "skills",
    label: "Skills",
    description: "Atomic AI skills that can be composed.",
    icon: Cpu,
    order: 40,
  },
  {
    id: "workflows",
    label: "Workflows",
    description: "Orchestrate skills into repeatable pipelines.",
    icon: Layers,
    order: 50,
  },
  {
    id: "memories",
    label: "Memories & Context",
    description: "Long-running context and memory blocks.",
    icon: BookText,
    order: 60,
  },
  {
    id: "mcp",
    label: "MCP Manager",
    description: "Configure, validate, and export MCP server configurations.",
    icon: Server,
    order: 70,
  },
  {
    id: "validator",
    label: "Asset Validator",
    description: "Validate AI assets for quality, completeness, and compatibility.",
    icon: Shield,
    order: 80,
  },
  {
    id: "optimizer",
    label: "Prompt Optimizer",
    description: "Optimize prompts for clarity, quality, and model compatibility.",
    icon: Zap,
    order: 85,
  },
  {
    id: "settings",
    label: "Settings",
    description: "Configure app preferences, AI providers, data, and privacy.",
    icon: Settings,
    order: 90,
  },
  {
    id: "search",
    label: "Search",
    description: "Find assets, prompts, and modules across your workspace.",
    icon: Search,
    order: 95,
  },
] as const;

/**
 * O(1) lookup by module id.
 */
export const MODULE_REGISTRY_MAP: Record<ModuleId, ModuleManifest> =
  Object.fromEntries(
    MODULE_REGISTRY.map((module) => [module.id, module]),
  ) as Record<ModuleId, ModuleManifest>;

/**
 * Modules ordered by canonical sidebar order.
 * Stable sort guarantees registry array order does not break UI.
 * Kept exported separately because some callers need a sorted copy.
 */
export const MODULES_ORDERED: ModuleManifest[] = [...MODULE_REGISTRY].sort(
  (a, b) => a.order - b.order,
);

export type { LucideIcon } from "lucide-react";
