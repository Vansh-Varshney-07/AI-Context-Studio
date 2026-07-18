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

/**
 * Structured context for the prompt generation engine (Phase 7).
 * Every field is optional so simple generations don't require full context.
 * The engine interprets whatever is present.
 */
export interface GenerationContext {
  purpose?: string;
  targetAI?: string;
  framework?: string;
  language?: string;
  codingStyle?: string;
  projectType?: string;
  architecture?: string;
  experienceLevel?: string;
  testingFramework?: string;
  deploymentTarget?: string;
  codingConventions?: string;
}

/**
 * Output kinds producible by the generation engine (Phase 7).
 */
export type GenerationOutputKind =
  | "system-prompt"
  | "instruction-file"
  | "prompt-template"
  | "context-file"
  | "memory"
  | "workflow";

/**
 * Result of a single generation. Adapters must normalize to this shape.
 */
export interface GenerationResult {
  kind: GenerationOutputKind;
  title: string;
  content: string;
  metadata?: Record<string, string>;
}
