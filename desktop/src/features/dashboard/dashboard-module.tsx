"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Cpu,
  FileText,
  FileUp,
  Grid3x3,
  Layers,
  Library,
  SlidersHorizontal,
  Waypoints,
  type LucideIcon,
} from "lucide-react";

import { Hero } from "@/features/dashboard/hero";
import {
  QuickStartCards,
  type QuickStartCardData,
} from "@/features/dashboard/quick-start-cards";
import {
  RecentFiles,
  type RecentFileItem,
} from "@/features/dashboard/recent-files";
import { moduleTransition } from "@components/motion";
import { useNavigationStore } from "@lib/navigation-store";
import { uuid } from "@utils";

/**
 * Dashboard module renderer.
 *
 * Phase 2 ships content. Phase 3 mounts this via the module registry
 * switchboard inside `<MainWorkspace/>`. Here we keep it standalone so
 * it can be unit-rendered in isolation as well.
 */
export function DashboardModule() {
  const navigate = useNavigationStore((s) => s.navigate);

  const quickStart: QuickStartCardData[] = [
    {
      id: "instruction-file",
      icon: FileText,
      title: "New agent instruction file",
      description:
        "Draft AGENTS.md or per-target rules for Claude, Cursor, Copilot and more.",
      onClick: () => navigate("instruction-files"),
    },
    {
      id: "prompt",
      icon: Library,
      title: "Create a prompt template",
      description: "Compose a reusable prompt for programming, writing, or AI-specific workflows.",
      onClick: () => navigate("prompt-library"),
    },
    {
      id: "persona",
      icon: Bot,
      title: "Design a persona",
      description: "Define an AI persona, system role, and stylistic guardrails.",
      onClick: () => navigate("personas"),
    },
    {
      id: "skill",
      icon: Cpu,
      title: "Compose a skill",
      description: "Atomic, composable AI skills you can plug into workflows.",
      onClick: () => navigate("skills"),
    },
    {
      id: "workflow",
      icon: Layers,
      title: "Build a workflow",
      description: "Orchestrate skills and prompts into repeatable pipelines.",
      onClick: () => navigate("workflows"),
    },
    {
      id: "mcp",
      icon: SlidersHorizontal,
      title: "Manage MCP configurations",
      description: "Inspect MCP configs, providers, and export/import bundle.",
      onClick: () => navigate("mcp"),
    },
  ];

  const recent: RecentFileItem[] = sampleRecent();

  return (
    <motion.div
      variants={moduleTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8"
    >
      <Hero />
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-fg-primary">Quick start</h2>
        <QuickStartCards cards={quickStart} />
      </section>
      <RecentFiles files={recent} onOpen={() => navigate("instruction-files")} />
    </motion.div>
  );
}

function sampleRecent(): RecentFileItem[] {
  const base = Date.now();
  const def = (icon: LucideIcon) => ({ icon });
  const data: RecentFileItem[] = [
    {
      id: uuid(),
      ...def(FileText),
      title: "CLAUDE.md (frontend team)",
      kindLabel: "Instruction file",
      updatedAt: new Date(base - 1000 * 60 * 12).toISOString(),
      tags: ["claude", "frontend"],
      pinned: true,
    },
    {
      id: uuid(),
      ...def(Library),
      title: "Refactor stream-from-prompts template",
      kindLabel: "Prompt template",
      updatedAt: new Date(base - 1000 * 60 * 60 * 3).toISOString(),
      tags: ["programming"],
    },
    {
      id: uuid(),
      ...def(Bot),
      title: "Senior reviewer persona",
      kindLabel: "Persona",
      updatedAt: new Date(base - 1000 * 60 * 60 * 26).toISOString(),
      tags: ["review"],
    },
    {
      id: uuid(),
      ...def(Layers),
      title: "Generate → review → ship",
      kindLabel: "Workflow",
      updatedAt: new Date(base - 1000 * 60 * 60 * 48).toISOString(),
      tags: ["ci"],
    },
    {
      id: uuid(),
      ...def(Waypoints),
      title: "Generate presence workflow",
      kindLabel: "Workflow",
      updatedAt: new Date(base - 1000 * 60 * 60 * 72).toISOString(),
    },
    {
      id: uuid(),
      ...def(FileUp),
      title: "Bundle export 2024-11-12",
      kindLabel: "Export",
      updatedAt: new Date(base - 1000 * 60 * 60 * 120).toISOString(),
    },
  ];
  return data;
}

/** Stable icon refs used by the dashboard. Kept exported for tests. */
export const DashboardIcons = { Grid3x3 };

