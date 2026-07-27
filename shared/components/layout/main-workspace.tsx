"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

import { moduleTransition } from "@shared/components/motion";
import { useNavigationStore } from "@shared/lib/navigation-store";
import { MODULE_REGISTRY_MAP } from "@shared/constants/modules.registry";
import type { ModuleId } from "@shared/types/navigation";
import { useModuleRenderers } from "@shared/hooks";

/**
 * MainWorkspace — in-place module renderer.
 *
 * Phase 3 navigation architecture:
 * - Reads `activeModule` and `activeParams` from the Zustand navigation store.
 * - Resolves the active renderer from a hook-owned registry of renderers.
 * - Wraps the rendered module in `<AnimatePresence>` + `moduleTransition`
 *   for smooth, in-place transitions with ZERO page reloads.
 *
 * Adding a new module requires:
 *   1. Append id to `ModuleId` union
 *   2. Append manifest in `constants/modules.registry.ts`
 *   3. Register a renderer in `hooks/use-module-renderers.ts`
 *
 * Layout components stay untouched.
 */
export function MainWorkspace() {
  const activeModule = useNavigationStore((s) => s.activeModule);
  const activeParams = useNavigationStore((s) => s.activeParams);
  const renderers = useModuleRenderers();
  const manifest = MODULE_REGISTRY_MAP[activeModule];

  const Renderer = renderers[activeModule];

  if (!manifest || !Renderer) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-sm text-fg-muted">
        Module not registered: {activeModule}
      </div>
    );
  }

  return (
    <div className="h-full">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${activeModule}:${stableParamsKey(activeModule, activeParams)}`}
          variants={moduleTransition}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="h-full"
        >
          <Renderer params={activeParams} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function stableParamsKey(module: ModuleId, params: Record<string, unknown>): string {
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b));
  if (entries.length === 0) return module;
  return `${module}#${entries.map(([k, v]) => `${k}=${String(v)}`).join("&")}`;
}
