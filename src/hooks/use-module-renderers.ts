"use client";

import { DashboardModule } from "@/features/dashboard";
import { InstructionFilesModule } from "@/features/instruction-files";
import { PromptLibraryModule } from "@/features/prompt-library";
import { SystemPromptEngineModule } from "@/features/system-prompt-engine";
import { SkillsModule } from "@/features/skills";
import { PersonasModule } from "@/features/personas";
import { WorkflowsModule } from "@/features/workflows";
import { MemoriesModule } from "@/features/memories";
import { MCPModule } from "@/features/mcp";
import { ValidatorModule } from "@/features/validator";
import { OptimizerModule } from "@/features/optimizer";
import { SettingsModule } from "@/features/settings/settings-module";
import { SearchModule } from "@/features/search/search-module";
import type { ModuleId, ModuleParams } from "@/types/navigation";
import {
  ComingSoon,
  type ModuleRenderer,
  type ModuleRendererProps,
  type ModuleRendererRegistry,
} from "./types";
import { withErrorBoundary } from "@/components/common/error-boundary";

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

const withErrorFallback = <P extends ModuleParams>(
  WrappedComponent: ModuleRenderer
) =>
  withErrorBoundary(WrappedComponent, {
    onError: (error, errorInfo) => {
      console.error(`Module error in ${WrappedComponent.displayName || WrappedComponent.name}:`, error, errorInfo);
    },
  });

const moduleRenderers: ModuleRendererRegistry = {
  dashboard: withErrorFallback(DashboardModule),
  "instruction-files": withErrorFallback(InstructionFilesModule),
  "prompt-library": withErrorFallback(PromptLibraryModule),
  "system-prompt-engine": withErrorFallback(SystemPromptEngineModule),
  skills: withErrorFallback(SkillsModule),
  personas: withErrorFallback(PersonasModule),
  workflows: withErrorFallback(WorkflowsModule),
  memories: withErrorFallback(MemoriesModule),
  mcp: withErrorFallback(MCPModule),
  validator: withErrorFallback(ValidatorModule),
  optimizer: withErrorFallback(OptimizerModule),
  settings: withErrorFallback(SettingsModule),
  search: withErrorFallback(SearchModule),
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
    "mcp",
    "validator",
    "optimizer",
    "settings",
    "search",
  ];
  return (allowed as string[]).includes(id) ? (id as ModuleId) : null;
}

/** Stable alias for type ergonomics. */
export type StableParams<P extends ModuleParams = ModuleParams> = ModuleParams & P;

