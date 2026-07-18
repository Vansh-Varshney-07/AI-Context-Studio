/**
 * Domain type barrel.
 * Single import surface for all cross-module contracts.
 */
export type {
  Asset,
  AssetKind,
  AssetMetadata,
  AssetScope,
} from "./asset";
export type {
  AgentInstructionTarget,
  AgentInstructionTargetInfo,
  PromptCategory,
  PromptCategoryInfo,
} from "./domain";
export type {
  ModuleId,
  ModuleParams,
  NavigationHistoryEntry,
} from "./navigation";
export type {
  GenerationContext,
  GenerationOutputKind,
  GenerationResult,
  ProviderId,
  ProviderInfo,
} from "./provider";
