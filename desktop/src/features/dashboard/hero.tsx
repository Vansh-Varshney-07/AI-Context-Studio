"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Library,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "@components/ui/button";
import { cardHover } from "@components/motion";
import { useNavigationStore } from "@lib/navigation-store";

/**
 * Hero section of the dashboard main area.
 * Premium gradient background with a single primary CTA. Per spec the
 * hero is short and bold; the meat lives in Quick Start + Recent Files.
 */
export function Hero() {
  const navigate = useNavigationStore((s) => s.navigate);

  return (
    <motion.section
      variants={cardHover}
      initial="rest"
      animate="rest"
      whileHover="hover"
      className="gradient-border relative overflow-hidden rounded-2xl border border-border-default bg-gradient-to-br from-bg-surface to-bg-elevated p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[var(--gradient-accent-soft)]"
      />
      <div className="relative flex flex-col gap-5">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-[var(--accent-primary-hover)]">
          <Sparkles className="size-3" />
          AI Context Studio
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-fg-primary md:text-4xl">
            Engineer your{" "}
            <span className="text-gradient">AI instruction assets</span>.
          </h1>
          <p className="max-w-xl text-sm text-fg-muted">
            Build, customize, manage and export instruction files, prompt
            templates, personas, skills, workflows, memories and MCP
            configurations for multiple AI coding assistants.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={() => navigate("instruction-files")}>
            <FileText className="mr-2 size-4" />
            New instruction file
          </Button>
          <Button size="lg" variant="secondary" onClick={() => navigate("prompt-library")}>
            <Library className="mr-2 size-4" />
            Browse prompt library
          </Button>
          <Button size="lg" variant="ghost" onClick={() => navigate("system-prompt-engine")}>
            <Zap className="mr-2 size-4" />
            System prompt engine
          </Button>
        </div>
      </div>
    </motion.section>
  );
}

