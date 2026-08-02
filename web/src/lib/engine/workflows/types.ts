import type { GenerationOutputKind } from "@/lib/engine/types";

/**
 * Workflow identifier. Add new entries here + in constants/workflows.ts
 */
export type WorkflowId =
  | "code-review"
  | "feature-development"
  | "bug-fix"
  | "refactoring"
  | "documentation"
  | "testing"
  | "deployment"
  | "custom";

/**
 * Workflow step types
 */
export type StepType =
  | "skill"
  | "prompt"
  | "approval"
  | "condition"
  | "parallel"
  | "loop";

/**
 * A single workflow step
 */
export interface WorkflowStep {
  id: string;
  type: StepType;
  name: string;
  description?: string;
  // For skill steps
  skillId?: string;
  skillConfig?: Record<string, unknown>;
  // For prompt steps
  promptTemplate?: string;
  promptVariables?: string[];
  // For approval steps
  approvers?: string[];
  // For condition steps
  condition?: string;
  // For parallel steps
  branches?: WorkflowStep[][];
  // For loop steps
  loopCondition?: string;
  loopBody?: WorkflowStep[];
  // Common
  dependsOn?: string[];
  optional?: boolean;
}

/**
 * Complete workflow definition
 */
export interface Workflow {
  id: WorkflowId;
  name: string;
  description: string;
  version: number;
  steps: WorkflowStep[];
  metadata: WorkflowMetadata;
}

export interface WorkflowMetadata {
  createdAt: string;
  updatedAt: string;
  version: number;
  tags: string[];
  isCustom: boolean;
  author?: string;
}

/**
 * Form answers for workflow generation
 */
export type WorkflowAnswers = Record<string, string | number | string[] | boolean | undefined>;

/**
 * Blueprint for generating a workflow artifact
 */
export interface WorkflowBlueprint {
  kind: GenerationOutputKind;
  label: string;
  description: string;
  filenameHint: string;
  extension: "md" | "yaml" | "json";
  titleTemplate: (answers: WorkflowAnswers) => string;
  sections: WorkflowBlueprintSection[];
}

export interface WorkflowBlueprintSection {
  id: string;
  heading: string;
  consumes: string[];
  build: (answers: WorkflowAnswers) => string | null;
}

/**
 * Form field definition for workflow configuration
 */
export interface WorkflowField {
  id: string;
  label: string;
  help?: string;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
  type: "text" | "textarea" | "select" | "multiselect" | "toggle";
  options?: string[];
}