/**
 * Asset types that can be validated.
 */
export type AssetType =
  | "instruction-file"
  | "prompt-template"
  | "system-prompt"
  | "user-prompt"
  | "skill"
  | "persona"
  | "workflow"
  | "mcp-configuration";

/**
 * Specific instruction file targets.
 */
export type InstructionTarget =
  | "CLAUDE.md"
  | "AGENTS.md"
  | "GEMINI.md"
  | "Copilot Instructions"
  | "Cursor Rules"
  | "README.md"
  | "CONTEXT.md"
  | "MEMORY.md"
  | "PERSONA.md"
  | "WORKFLOW.md"
  | "STYLEGUIDE.md"
  | "SYSTEM.md";

/**
 * Input methods for validation.
 */
export type InputMethod = "paste" | "file" | "generated" | "imported";

/**
 * Severity levels for validation findings.
 */
export type Severity = "error" | "warning" | "info" | "success";

/**
 * Categories of validation checks.
 */
export type ValidationCategory =
  | "structure"
  | "formatting"
  | "required-sections"
  | "missing-sections"
  | "readability"
  | "prompt-quality"
  | "instruction-clarity"
  | "role-definition"
  | "tool-usage"
  | "context-quality"
  | "memory-strategy"
  | "workflow-completeness"
  | "architecture-description"
  | "testing-instructions"
  | "coding-standards"
  | "error-handling"
  | "performance-guidance"
  | "security-recommendations"
  | "maintainability"
  | "consistency";

/**
 * Supported AI coding assistants for compatibility checks.
 */
export type AIClient =
  | "claude-code"
  | "cursor"
  | "opencode"
  | "codex"
  | "gemini-cli"
  | "continue"
  | "roo-code"
  | "cline";

/**
 * Compatibility status.
 */
export type CompatibilityStatus = "compatible" | "partially-compatible" | "needs-changes";

/**
 * A single validation finding.
 */
export interface ValidationFinding {
  id: string;
  category: ValidationCategory;
  severity: Severity;
  title: string;
  description: string;
  location?: {
    line?: number;
    column?: number;
    snippet?: string;
  };
  suggestion?: string;
  autoFixable?: boolean;
}

/**
 * Score breakdown for a specific dimension.
 */
export interface ScoreDimension {
  category: string;
  score: number;
  maxScore: number;
  label: string;
  description: string;
}

/**
 * Overall quality score with breakdown.
 */
export interface QualityScore {
  overall: number;
  maxScore: number;
  breakdown: ScoreDimension[];
  grade: "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D" | "F";
}

/**
 * Compatibility result for a specific client.
 */
export interface ClientCompatibility {
  client: AIClient;
  status: CompatibilityStatus;
  issues: string[];
  requiredChanges: string[];
}

/**
 * Validation report containing all analysis results.
 */
export interface ValidationReport {
  assetType: AssetType;
  instructionTarget?: InstructionTarget;
  inputMethod: InputMethod;
  timestamp: string;
  qualityScore: QualityScore;
  findings: ValidationFinding[];
  strengths: string[];
  weaknesses: string[];
  missingSections: string[];
  improvementSuggestions: string[];
  estimatedAIPerformance: "excellent" | "good" | "fair" | "poor";
  estimatedTokenEfficiency: "high" | "medium" | "low";
  compatibility: ClientCompatibility[];
  metadata: {
    contentLength: number;
    lineCount: number;
    sectionCount: number;
    wordCount: number;
  };
}

/**
 * Validator interface for pluggable validation logic.
 */
export interface IAssetValidator {
  readonly assetType: AssetType;
  readonly supportedTargets?: InstructionTarget[];
  validate(content: string, options?: ValidationOptions): Promise<ValidationReport>;
}

/**
 * Options for validation.
 */
export interface ValidationOptions {
  target?: InstructionTarget;
  strictMode?: boolean;
  includeCompatibility?: boolean;
  includeSuggestions?: boolean;
}

/**
 * Validation result summary for quick display.
 */
export interface ValidationSummary {
  overallScore: number;
  grade: QualityScore["grade"];
  totalFindings: number;
  errors: number;
  warnings: number;
  infos: number;
  estimatedAIPerformance: ValidationReport["estimatedAIPerformance"];
  topIssue?: ValidationFinding;
}

/**
 * Preset validation profiles.
 */
export type ValidationProfile = "comprehensive" | "quick" | "compatibility" | "prompt-engineering" | "instruction-files";

/**
 * Profile configurations.
 */
export interface ValidationProfileConfig {
  id: ValidationProfile;
  name: string;
  description: string;
  categories: ValidationCategory[];
  enabledClients: AIClient[];
}

/**
 * Input for validation.
 */
export interface ValidationInput {
  content: string;
  assetType?: AssetType;
  filename?: string;
  method?: InputMethod;
}

/**
 * Full validation result.
 */
export interface ValidationResult {
  assetType: AssetType;
  valid: boolean;
  score: QualityScore;
  findings: ValidationFinding[];
  strengths: string[];
  weaknesses: string[];
  missingSections: string[];
  improvementSuggestions: string[];
  estimatedAIPerformance: "excellent" | "good" | "fair" | "poor";
  estimatedTokenEfficiency: "high" | "medium" | "low";
  compatibility?: ClientCompatibility[];
  recommendations: string[];
  metadata: {
    validatedAt: string;
    validatorVersion: string;
    inputMethod: InputMethod;
    contentLength: number;
    lineCount?: number;
    sectionCount?: number;
    wordCount?: number;
    parsedKeys?: number;
    estimatedAIPerformance?: "excellent" | "good" | "fair" | "poor";
    estimatedTokenEfficiency?: "high" | "medium" | "low";
  };
}