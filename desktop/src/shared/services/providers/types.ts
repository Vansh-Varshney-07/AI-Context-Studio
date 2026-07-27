export type GenerationOutputKind =
  | "system-prompt"
  | "instruction-file"
  | "prompt-template"
  | "context-file"
  | "memory"
  | "workflow";

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
  customInstructions?: string;
  /** Pre-composed local blueprint content (from engine) for AI to refine. */
  localBlueprint?: string;
}

export interface GenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  stream?: boolean;
  onStream?: (chunk: string) => void;
}

export interface GenerationResult {
  kind: GenerationOutputKind;
  title: string;
  content: string;
  metadata?: Record<string, string>;
}

export interface ProviderConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  organizationId?: string;
  projectId?: string;
}

export interface AIProvider {
  readonly id: string;
  readonly label: string;
  readonly models: string[];
  readonly defaultModel: string;
  configure(config: ProviderConfig): void;
  getConfig(): ProviderConfig | null;
  isConfigured(): boolean;
  validateApiKey(apiKey: string): boolean;
  testConnection(apiKey: string, model?: string): Promise<boolean>;
  generate(
    ctx: GenerationContext,
    options?: GenerationOptions,
    kind?: GenerationOutputKind
  ): Promise<GenerationResult>;
}
