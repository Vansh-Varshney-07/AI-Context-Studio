"use client";

import { DashboardModule } from "@/features/dashboard";
import { InstructionFilesModule } from "@/features/instruction-files";
import { PromptLibraryModule } from "@/features/prompt-library";
import { SystemPromptEngineModule } from "@/features/system-prompt-engine";
import { SkillsModule } from "@/features/skills";
import type { ModuleId, ModuleParams } from "@/types/navigation";
import {
  ComingSoon,
  type ModuleRenderer,
  type ModuleRendererProps,
  type ModuleRendererRegistry,
} from "./types";

/**
 * Phase 3+ renderer registry. Each phase registers its module renderer
 * as it gets built. Unbuilt modules fall back to <ComingSoon/> until
 * their build phase lands.
 *
 * Adding a new module requires:
 *   1. Append id to `ModuleId` union                 (types/navigation.ts)
 *   2. Append manifest in `constants/modules.registry.ts`
 *   3. (later phase) implement renderer and register it here
 *
 * Layout components stay untouched.
 */
export function useModuleRenderers(): ModuleRendererRegistry {
  return moduleRenderers;
}

const moduleRenderers: ModuleRendererRegistry = {
  dashboard: DashboardModule as ModuleRenderer,
  "instruction-files": InstructionFilesModule as ModuleRenderer,
  "prompt-library": PromptLibraryModule as ModuleRenderer,
  "system-prompt-engine": SystemPromptEngineModule as ModuleRenderer,
  skills: SkillsModule as ModuleRenderer,
  personas: ComingSoon as unknown as ModuleRenderer,
  workflows: ComingSoon as unknown as ModuleRenderer,
  memories: ComingSoon as unknown as ModuleRenderer,
  configurations: ComingSoon as unknown as ModuleRenderer,
};

export type { ModuleRendererProps, ModuleRendererRegistry, ModuleRenderer };
export function ensureModuleId(id: string): ModuleId | null {
  const allowed: ModuleId[] = [
    "dashboard",
    "instruction-files",
    "prompt-library",
    "system-prompt-engine",
    "personas",
    "skills",
    "workflows",
    "memories",
    "configurations",
  ];
  return (allowed as string[]).includes(id) ? (id as ModuleId) : null;
}

/** Stable alias for type ergonomics. */
export type StableParams<P extends ModuleParams = ModuleParams> = ModuleParams & P;

