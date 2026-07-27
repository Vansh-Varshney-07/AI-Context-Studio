import type { AIProvider, ProviderConfig } from "./types";
import { BaseProvider } from "./base-provider";
import { OpenAIProvider } from "./openai-provider";
import { AnthropicProvider } from "./anthropic-provider";
import { GoogleProvider } from "./google-provider";
import { DeepSeekProvider } from "./deepseek-provider";
import { OpenRouterProvider } from "./openrouter-provider";
import { NvidiaProvider } from "./nvidia-provider";
import { OllamaProvider } from "./ollama-provider";

const providers: Map<string, AIProvider> = new Map();

export function registerProvider(provider: AIProvider): void {
  providers.set(provider.id, provider);
}

export function getProvider(id: string): AIProvider | undefined {
  return providers.get(id);
}

export function getAllProviders(): AIProvider[] {
  return Array.from(providers.values());
}

export function createProvider(id: string, config: ProviderConfig): AIProvider {
  const provider = providers.get(id);
  if (!provider) throw new Error(`Unknown provider: ${id}`);
  provider.configure(config);
  return provider;
}

export function getProviderIds(): string[] {
  return Array.from(providers.keys());
}

// Auto-register all built-in providers
registerProvider(new OpenAIProvider());
registerProvider(new AnthropicProvider());
registerProvider(new GoogleProvider());
registerProvider(new DeepSeekProvider());
registerProvider(new OpenRouterProvider());
registerProvider(new NvidiaProvider());
registerProvider(new OllamaProvider());

export { BaseProvider } from "./base-provider";
