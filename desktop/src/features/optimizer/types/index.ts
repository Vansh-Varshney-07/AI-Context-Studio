/**
 * Prompt types that can be optimized.
 */
export type PromptType =
  | "system-prompt"
  | "developer-prompt"
  | "user-prompt"
  | "claude-prompt"
  | "chatgpt-prompt"
  | "gemini-prompt"
  | "deepseek-prompt"
  | "codex-prompt"
  | "general-prompt"
  | "workflow-prompt";

/**
 * Supported target models for optimization.
 */
export type TargetModel =
  | "claude"
  | "gpt"
  | "gemini"
  | "deepseek"
  | "openrouter"
  | "llama"
  | "mistral"
  | "qwen"
  | "codex"
  | "opencode";

/**
 * Optimization types that can be applied.
 */
export type OptimizationType =
  | "clarity"
  | "conciseness"
  | "context-expansion"
  | "role-definition"
  | "constraint-improvement"
  | "output-formatting"
  | "chain-of-thought"
  | "reasoning-enhancement"
  | "few-shot-preparation"
  | "prompt-engineering"
  | "tool-usage"
  | "memory-usage"
  | "token-reduction"
  | "performance-optimization"
  | "cost-optimization"
  | "safety"
  | "workflow-completeness";

/**
 * Optimization modes for different use cases.
 */
export type OptimizationMode =
  | "general"
  | "coding"
  | "research"
  | "writing"
  | "education"
  | "architecture"
  | "debugging"
  | "agent"
  | "frontend"
  | "backend"
  | "fullstack";

/**
 * Target model configurations for optimization.
 */
export interface ModelConfig {
  id: TargetModel;
  name: string;
  description: string;
  maxTokens: number;
  supportsSystemPrompt: boolean;
  supportsTools: boolean;
  supportsReasoning: boolean;
  strengths: string[];
  limitations: string[];
}

/**
 * Optimization options and configuration.
 */
export interface OptimizationOptions {
  promptType: PromptType;
  targetModel: TargetModel;
  optimizationTypes: OptimizationType[];
  mode: OptimizationMode;
  temperature?: number;
  maxTokens?: number;
  outputStyle?: "concise" | "detailed" | "structured" | "conversational";
  reasoningStyle?: "step-by-step" | "structured" | "intuitive" | "minimal";
  strictness?: "lenient" | "balanced" | "strict";
  verbosity?: "concise" | "normal" | "verbose";
  targetAudience?: "expert" | "intermediate" | "beginner";
  preserveOriginal?: boolean;
}

/**
 * Input for optimization.
 */
export interface OptimizationInput {
  content: string;
  promptType?: PromptType;
  options: OptimizationOptions;
}

/**
 * A single optimization change with explanation.
 */
export interface OptimizationChange {
  id: string;
  type: OptimizationType;
  severity: "major" | "moderate" | "minor";
  originalText: string;
  optimizedText: string;
  explanation: string;
  whyChanged: string;
  expectedImprovement: string;
  estimatedReasoningImprovement: "high" | "medium" | "low";
  estimatedTokenSavings: "high" | "medium" | "low" | "none";
  estimatedResponseQuality: "high" | "medium" | "low";
  confidence: number;
}

/**
 * Optimization result with all details.
 */
export interface OptimizationResult {
  originalPrompt: string;
  optimizedPrompt: string;
  changes: OptimizationChange[];
  summary: OptimizationSummary;
  comparison: ComparisonData;
  metadata: {
    originalLength: number;
    optimizedLength: number;
    tokenEstimate: number;
    changesCount: number;
    majorChanges: number;
    moderateChanges: number;
    minorChanges: number;
  };
}

/**
 * Summary of optimizations applied.
 */
export interface OptimizationSummary {
  totalChanges: number;
  majorChanges: number;
  moderateChanges: number;
  minorChanges: number;
  tokenReduction: number;
  tokenReductionPercent: number;
  estimatedQualityImprovement: number;
  estimatedTokenSavings: number;
  estimatedCostSavings: number;
  keyImprovements: string[];
  remainingIssues: string[];
}

/**
 * Side-by-side comparison data.
 */
export interface ComparisonData {
  originalLines: ComparisonLine[];
  optimizedLines: ComparisonLine[];
  hunks: DiffHunk[];
}

/**
 * A line in the comparison view.
 */
export interface ComparisonLine {
  number: number;
  content: string;
  type: "unchanged" | "added" | "removed" | "modified";
  changeId?: string;
}

/**
 * A diff hunk showing a contiguous set of changes.
 */
export interface DiffHunk {
  id: string;
  originalStart: number;
  originalCount: number;
  optimizedStart: number;
  optimizedCount: number;
  lines: ComparisonLine[];
}

/**
 * Engine interface for optimization.
 */
export interface IOptimizationEngine {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly supportedTypes: OptimizationType[];
  optimize(input: OptimizationInput): Promise<OptimizationResult>;
  canOptimize(input: OptimizationInput): boolean;
}

/**
 * Engine configuration.
 */
export interface EngineConfig {
  enabled: boolean;
  priority: number;
  options?: Record<string, unknown>;
}

/**
 * Pipeline configuration.
 */
export interface PipelineConfig {
  engines: EngineConfig[];
  maxIterations: number;
  convergenceThreshold: number;
}

/**
 * Output styles for optimized prompts.
 */
export type OutputStyle = "concise" | "detailed" | "structured" | "conversational";

/**
 * Reasoning styles.
 */
export type ReasoningStyle = "step-by-step" | "structured" | "intuitive" | "minimal";

/**
 * Strictness levels.
 */
export type StrictnessLevel = "lenient" | "balanced" | "strict";

/**
 * Verbosity levels.
 */
export type VerbosityLevel = "concise" | "normal" | "verbose";

/**
 * Target audience levels.
 */
export type AudienceLevel = "expert" | "intermediate" | "beginner";

/**
 * Complete optimization session.
 */
export interface OptimizationSession {
  id: string;
  input: OptimizationInput;
  result: OptimizationResult;
  createdAt: string;
  completedAt?: string;
  status: "pending" | "processing" | "completed" | "failed";
  error?: string;
}

/**
 * Preset optimization configurations.
 */
export interface OptimizationPreset {
  id: string;
  name: string;
  description: string;
  options: Partial<OptimizationOptions>;
  icon: string;
}

/**
 * Comparison view modes.
 */
export type ComparisonViewMode = "side-by-side" | "inline" | "unified";

