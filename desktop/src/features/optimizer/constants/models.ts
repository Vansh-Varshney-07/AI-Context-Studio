/**
 * Model configurations for optimization.
 */

import type { TargetModel, ModelConfig } from "@/features/optimizer/types";

export const MODEL_CONFIGS: Record<TargetModel, ModelConfig> = {
  claude: {
    id: "claude",
    name: "Claude (Anthropic)",
    description: "Strong reasoning, large context, excellent coding",
    maxTokens: 200000,
    supportsSystemPrompt: true,
    supportsTools: true,
    supportsReasoning: true,
    strengths: ["Reasoning", "Coding", "Analysis", "Long context", "Safety"],
    limitations: ["No image gen", "API access limited"],
  },
  gpt: {
    id: "gpt",
    name: "GPT (OpenAI)",
    description: "Versatile, strong general capabilities, wide ecosystem",
    maxTokens: 128000,
    supportsSystemPrompt: true,
    supportsTools: true,
    supportsReasoning: true,
    strengths: ["Versatility", "Tools", "Ecosystem", "Structured output"],
    limitations: ["Cost", "Context smaller than Claude"],
  },
  gemini: {
    id: "gemini",
    name: "Gemini (Google)",
    description: "Multimodal, massive context, strong at search",
    maxTokens: 2000000,
    supportsSystemPrompt: true,
    supportsTools: true,
    supportsReasoning: true,
    strengths: ["Multimodal", "Huge context", "Search", "Free tier"],
    limitations: ["Inconsistent", "Safety filters strict"],
  },
  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    description: "Strong reasoning, cost-effective, open weights",
    maxTokens: 128000,
    supportsSystemPrompt: true,
    supportsTools: true,
    supportsReasoning: true,
    strengths: ["Reasoning", "Cost", "Open weights", "Math/Code"],
    limitations: ["Chinese bias", "Limited ecosystem"],
  },
  openrouter: {
    id: "openrouter",
    name: "OpenRouter",
    description: "Gateway to 100+ models, unified API",
    maxTokens: 200000,
    supportsSystemPrompt: true,
    supportsTools: true,
    supportsReasoning: true,
    strengths: ["Model variety", "Fallback", "Cost comparison", "Single API"],
    limitations: ["Proxy latency", "Rate limits vary"],
  },
  llama: {
    id: "llama",
    name: "Llama (Meta)",
    description: "Open weights, strong community, local deployment",
    maxTokens: 128000,
    supportsSystemPrompt: true,
    supportsTools: true,
    supportsReasoning: false,
    strengths: ["Open source", "Local run", "Community", "Customizable"],
    limitations: ["Setup required", "Hardware needs", "No native tools"],
  },
  mistral: {
    id: "mistral",
    name: "Mistral",
    description: "Efficient, strong multilingual, good coding",
    maxTokens: 128000,
    supportsSystemPrompt: true,
    supportsTools: true,
    supportsReasoning: true,
    strengths: ["Efficiency", "Multilingual", "Coding", "Cost"],
    limitations: ["Smaller context", "Less reasoning"],
  },
  qwen: {
    id: "qwen",
    name: "Qwen (Alibaba)",
    description: "Strong multilingual, good coding, open weights",
    maxTokens: 131072,
    supportsSystemPrompt: true,
    supportsTools: true,
    supportsReasoning: false,
    strengths: ["Multilingual", "Coding", "Open weights", "Long context"],
    limitations: ["English weaker", "Less documented"],
  },
  codex: {
    id: "codex",
    name: "Codex (OpenAI)",
    description: "Specialized for code generation and editing",
    maxTokens: 128000,
    supportsSystemPrompt: true,
    supportsTools: true,
    supportsReasoning: true,
    strengths: ["Code generation", "Code editing", "Repository context"],
    limitations: ["Narrow focus", "General tasks weaker"],
  },
  opencode: {
    id: "opencode",
    name: "OpenCode",
    description: "Open source coding agent framework",
    maxTokens: 128000,
    supportsSystemPrompt: true,
    supportsTools: true,
    supportsReasoning: true,
    strengths: ["Agent workflows", "Tool use", "Extensible", "Open source"],
    limitations: ["Setup complexity", "Smaller community"],
  },
};

export const MODEL_OPTIONS = Object.entries(MODEL_CONFIGS).map(([id, config]) => ({
  value: id as TargetModel,
  label: config.name,
  description: config.description,
}));

export function getModelConfig(model: TargetModel): ModelConfig {
  return MODEL_CONFIGS[model];
}

