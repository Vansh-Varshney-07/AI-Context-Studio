/**
 * Provider identifiers for supported AI generation adapters.
 * Adding a new provider requires only: a new union member + adapter in
 * `services/providers/{id}.ts` + registry entry. Zero UI changes.
 */
export type ProviderId =
  | "openai"
  | "claude"
  | "gemini"
  | "deepseek"
  | "openrouter"
  | "nvidia"
  | "ollama";

/**
 * Static descriptor for a provider, used in dropdowns/registries.
 */
export interface ProviderInfo {
  id: ProviderId;
  label: string;
  description: string;
  requiresApiKey: boolean;
  /**
   * Default endpoint hint for local providers that may run on a custom URL.
   */
  defaultEndpoint?: string;
}

// Re-export canonical types from the providers package
export {
  type GenerationOutputKind,
  type GenerationContext,
  type GenerationOptions,
  type GenerationResult,
  type ProviderConfig,
  type AIProvider,
} from "@/shared/services/providers/types";
