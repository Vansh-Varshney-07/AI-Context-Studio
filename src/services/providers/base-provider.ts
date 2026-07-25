import type {
  AIProvider,
  GenerationContext,
  GenerationOptions,
  GenerationResult,
  ProviderConfig,
  GenerationOutputKind,
} from "./types";

export abstract class BaseProvider implements AIProvider {
  abstract readonly id: string;
  abstract readonly label: string;
  abstract readonly models: string[];
  abstract readonly defaultModel: string;

  protected config: ProviderConfig | null = null;

  configure(config: ProviderConfig): void {
    this.config = config;
  }

  getConfig(): ProviderConfig | null {
    return this.config;
  }

  isConfigured(): boolean {
    return this.config !== null && this.validateApiKey(this.config.apiKey);
  }

  abstract validateApiKey(apiKey: string): boolean;

  abstract testConnection(apiKey: string, model?: string): Promise<boolean>;

  abstract generate(
    ctx: GenerationContext,
    options?: GenerationOptions,
    kind?: GenerationOutputKind
  ): Promise<GenerationResult>;

  protected buildSystemPrompt(ctx: GenerationContext, kind: GenerationOutputKind): string {
    const base = `You are an expert AI assistant specialized in generating high-quality ${this.getKindLabel(kind)}.`;
    const contextParts: string[] = [];

    if (ctx.purpose) contextParts.push(`Purpose: ${ctx.purpose}`);
    if (ctx.targetAI) contextParts.push(`Target AI: ${ctx.targetAI}`);
    if (ctx.framework) contextParts.push(`Framework: ${ctx.framework}`);
    if (ctx.language) contextParts.push(`Language: ${ctx.language}`);
    if (ctx.codingStyle) contextParts.push(`Coding Style: ${ctx.codingStyle}`);
    if (ctx.projectType) contextParts.push(`Project Type: ${ctx.projectType}`);
    if (ctx.architecture) contextParts.push(`Architecture: ${ctx.architecture}`);
    if (ctx.experienceLevel) contextParts.push(`Experience Level: ${ctx.experienceLevel}`);
    if (ctx.testingFramework) contextParts.push(`Testing Framework: ${ctx.testingFramework}`);
    if (ctx.deploymentTarget) contextParts.push(`Deployment Target: ${ctx.deploymentTarget}`);
    if (ctx.codingConventions) contextParts.push(`Coding Conventions: ${ctx.codingConventions}`);
    if (ctx.customInstructions) contextParts.push(`Custom Instructions: ${ctx.customInstructions}`);

    const contextStr = contextParts.length > 0
      ? `\n\nContext:\n${contextParts.join("\n")}`
      : "";

    return `${base}${contextStr}\n\nGenerate a production-ready ${this.getKindLabel(kind)} that follows best practices.`;
  }

  protected getKindLabel(kind: GenerationOutputKind): string {
    const labels: Record<GenerationOutputKind, string> = {
      "system-prompt": "system prompt",
      "instruction-file": "instruction file (AGENTS.md, CLAUDE.md, etc.)",
      "prompt-template": "prompt template",
      "context-file": "context/memory file",
      "memory": "memory block",
      "workflow": "workflow definition",
    };
    return labels[kind];
  }

  protected buildUserPrompt(ctx: GenerationContext, kind: GenerationOutputKind): string {
    if (ctx.localBlueprint) {
      return `Here is a structured blueprint for the ${this.getKindLabel(kind)}. Refine, enhance, and polish this content while preserving its structure and intent. Return only the final ${this.getKindLabel(kind)} content, no explanations.\n\n--- BLUEPRINT ---\n${ctx.localBlueprint}\n--- END BLUEPRINT ---`;
    }
    return `Generate a ${this.getKindLabel(kind)} based on the provided context. Return only the generated content, no explanations or markdown formatting unless explicitly requested.`;
  }
}