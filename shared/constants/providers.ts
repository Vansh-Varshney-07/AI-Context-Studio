import type { ProviderId, ProviderInfo } from "@shared/types/provider";

/**
 * Static registry of supported AI generation providers (Phase 6 adapters).
 * New providers are added here AND in `services/providers/registry.ts`.
 * Order is canonical and appears in the sidebar provider dropdown.
 */
export const AI_PROVIDERS: readonly ProviderInfo[] = [
  {
    id: "openai",
    label: "OpenAI",
    description: "GPT-4o / o-series chat completions.",
    requiresApiKey: true,
  },
  {
    id: "claude",
    label: "Anthropic Claude",
    description: "Claude 3.5 / Sonnet messages API.",
    requiresApiKey: true,
  },
  {
    id: "gemini",
    label: "Google Gemini",
    description: "Gemini 2.x generate content API.",
    requiresApiKey: true,
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    description: "DeepSeek reasoner / chat completions.",
    requiresApiKey: true,
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    description: "Unified gateway to many foundation models.",
    requiresApiKey: true,
  },
  {
    id: "nvidia",
    label: "NVIDIA NIM",
    description: "NVIDIA build catalog / NIM endpoints.",
    requiresApiKey: true,
  },
  {
    id: "ollama",
    label: "Local Ollama",
    description: "Run models locally via Ollama. No API key required.",
    requiresApiKey: false,
    defaultEndpoint: "http://localhost:11434",
  },
] as const;

/**
 * O(1) lookup by provider id.
 */
export const AI_PROVIDER_MAP: Record<ProviderId, ProviderInfo> =
  Object.fromEntries(
    AI_PROVIDERS.map((provider) => [provider.id, provider]),
  ) as Record<ProviderId, ProviderInfo>;
