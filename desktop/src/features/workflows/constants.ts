import type { WorkflowField, StepType } from "./types";

/**
 * Canonical step types for workflows. Each has an icon and description.
 */
export const STEP_TYPES: readonly { type: StepType; label: string; description: string; icon: string }[] = [
  {
    type: "skill",
    label: "Skill",
    description: "Execute a predefined AI skill with configuration",
    icon: "cpu",
  },
  {
    type: "prompt",
    label: "Prompt",
    description: "Run an AI prompt with variable substitution",
    icon: "message-square",
  },
  {
    type: "approval",
    label: "Approval",
    description: "Human-in-the-loop approval gate",
    icon: "check-circle",
  },
  {
    type: "condition",
    label: "Condition",
    description: "Conditional branching based on expression",
    icon: "git-branch",
  },
  {
    type: "parallel",
    label: "Parallel",
    description: "Run multiple branches in parallel",
    icon: "layers",
  },
  {
    type: "loop",
    label: "Loop",
    description: "Repeat steps until condition is met",
    icon: "repeat",
  },
] as const;

/**
 * Free-form text fields for workflow configuration
 */
export const WORKFLOW_FIELDS: readonly WorkflowField[] = [
  {
    id: "name",
    label: "Workflow Name",
    help: "Display name for the workflow",
    placeholder: "Feature Development Pipeline",
    required: true,
    type: "text",
  },
  {
    id: "description",
    label: "Description",
    help: "What this workflow accomplishes",
    placeholder: "Automated pipeline for developing and deploying new features",
    multiline: true,
    required: true,
    type: "textarea",
  },
  {
    id: "tags",
    label: "Tags",
    help: "Comma-separated tags for filtering",
    placeholder: "ci/cd, development, automation",
    required: false,
    type: "text",
  },
] as const;

/**
 * Default step templates for quick start
 */
export const STEP_TEMPLATES: Record<StepType, { name: string; description: string }> = {
  skill: {
    name: "Run Skill",
    description: "Execute a predefined AI skill",
  },
  prompt: {
    name: "AI Prompt",
    description: "Run a prompt with variable substitution",
  },
  approval: {
    name: "Approval Gate",
    description: "Require human approval before proceeding",
  },
  condition: {
    name: "Conditional Branch",
    description: "Branch based on condition evaluation",
  },
  parallel: {
    name: "Parallel Branches",
    description: "Execute multiple branches simultaneously",
  },
  loop: {
    name: "Loop",
    description: "Repeat steps until condition is met",
  },
};

