"use server";

import {
  listBlueprints,
  listFields,
  getBlueprint,
  renderBlueprint,
  consumedFieldsForKind,
  type EngineOutput,
  type EngineBlueprint,
  type EngineAnswers,
  type GenerationOutputKind,
  type EngineField,
} from "@/lib/engine";
import {
  AGENT_INSTRUCTION_TARGETS,
  type AgentInstructionTarget,
} from "@/lib/engine/instruction-targets";
import {
  questionsForTarget,
  GENERATOR_QUESTIONS,
} from "@/lib/engine/generator-questions";
import {
  generateInstructionFile,
  type GeneratorQuestion,
} from "@/lib/engine/generator";
import {
  PERSONA_BLUEPRINTS,
  renderPersonaBlueprint,
} from "@/lib/engine/personas/blueprints";
import { type PersonaAnswers } from "@/lib/engine/personas/types";
import { SEED_WORKFLOWS } from "@/lib/engine/workflows/seed";

export async function getBlueprints(): Promise<readonly EngineBlueprint[]> {
  return listBlueprints();
}

export async function getFields(): Promise<readonly EngineField[]> {
  return listFields();
}

export async function getDefaultAnswers(kind: GenerationOutputKind): Promise<EngineAnswers> {
  const blueprint = getBlueprint(kind);
  const answers: EngineAnswers = {} as EngineAnswers;
  for (const field of blueprint.sections.flatMap((s) => s.consumes)) {
    if (!answers[field]) {
      answers[field] = undefined;
    }
  }
  return answers;
}

export async function generateLocally(
  kind: GenerationOutputKind,
  answers: EngineAnswers,
): Promise<EngineOutput | null> {
  return renderBlueprint(kind, answers);
}

export async function generateWithAI(
  kind: GenerationOutputKind,
  answers: EngineAnswers,
  _providerConfig: { provider: string; apiKey: string; model?: string },
): Promise<EngineOutput | null> {
  // First generate locally
  const localOutput = await generateLocally(kind, answers);
  if (!localOutput) return null;

  // TODO: Implement AI provider integration
  // For now, return local output with a note
  return {
    ...localOutput,
    content: `${localOutput.content}\n\n<!-- AI enhancement requested but not yet implemented. Showing local engine output. -->`,
  };
}

export async function getInstructionTargets(): Promise<AgentInstructionTarget[]> {
  return AGENT_INSTRUCTION_TARGETS.map((t) => t.id);
}

export async function getQuestionsForTargetAction(
  target: AgentInstructionTarget,
): Promise<GeneratorQuestion[]> {
  return questionsForTarget(target);
}

export async function generateInstructionFileAction(
  target: AgentInstructionTarget,
  answers: Record<string, string | string[] | boolean>,
): Promise<{ filename: string; content: string }> {
  return generateInstructionFile(target, answers, GENERATOR_QUESTIONS);
}

export async function getPersonaBlueprints() {
  return PERSONA_BLUEPRINTS;
}

export async function renderPersonaAction(
  kind: "system-prompt" | "instruction-file",
  answers: PersonaAnswers,
): Promise<string | null> {
  return renderPersonaBlueprint(kind, answers);
}

export async function getWorkflowBlueprints() {
  return SEED_WORKFLOWS;
}

export async function renderWorkflowAction(
  workflowId: string,
  answers: Record<string, string | number | string[] | boolean | undefined>,
): Promise<string | null> {
  const workflow = SEED_WORKFLOWS.find((w) => w.id === workflowId);
  if (!workflow) return null;

  // Simple YAML rendering
  const lines = [
    `name: ${workflow.name}`,
    `description: ${workflow.description}`,
    `version: ${workflow.version}`,
    "steps:",
  ];

  for (const step of workflow.steps) {
    lines.push(`  - id: ${step.id}`);
    lines.push(`    type: ${step.type}`);
    lines.push(`    name: ${step.name}`);
    if (step.description) lines.push(`    description: ${step.description}`);
    if (step.skillId) lines.push(`    skillId: ${step.skillId}`);
    if (step.promptTemplate) lines.push(`    promptTemplate: "${step.promptTemplate}"`);
    if (step.dependsOn?.length) lines.push(`    dependsOn: [${step.dependsOn.join(", ")}]`);
  }

  return lines.join("\n");
}

export async function getAvailableProviders(): Promise<string[]> {
  return ["openai", "claude", "gemini", "deepseek", "openrouter", "nvidia", "ollama"];
}