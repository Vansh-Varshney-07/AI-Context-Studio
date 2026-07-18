/**
 * Identifiers for every AI coding-assistant target supported by the
 * Instruction File module. Mirror Phase 4 hierarchy.
 */
export type AgentInstructionTarget =
  | "claude"
  | "cursor"
  | "copilot"
  | "gemini"
  | "codex"
  | "opencode"
  | "continue"
  | "roo"
  | "general";

export interface AgentInstructionTargetInfo {
  id: AgentInstructionTarget;
  label: string;
  filename: string;
  description: string;
}

/**
 * Prompt Library categories per Phase 5 spec.
 */
export type PromptCategory =
  | "personal"
  | "programming"
  | "business"
  | "writing"
  | "education"
  | "ai-specific";

export interface PromptCategoryInfo {
  id: PromptCategory;
  label: string;
  description: string;
}

export interface ReferenceSection {
  id: string;
  heading: string;
  body: string;
}

export interface ReferenceSyntaxManifest {
  target: AgentInstructionTarget;
  filename: string;
  summary: string;
  sections: readonly ReferenceSection[];
}
