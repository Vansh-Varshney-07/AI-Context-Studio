import type { EngineBlueprint } from "../types";
import { contextFileBlueprint } from "./context-file";
import { instructionFileBlueprint } from "./instruction-file";
import { memoryBlueprint } from "./memory";
import { promptTemplateBlueprint } from "./prompt-template";
import { systemPromptBlueprint } from "./system-prompt";
import { workflowBlueprint } from "./workflow";

/**
 * Canonical blueprint registry.
 *
 * Adding a new output kind:
 *   1. Create `./<kind>.ts` exporting an EngineBlueprint
 *   2. Append it to `ENGINE_BLUEPRINTS` below
 *
 * No UI changes required — the engine module reads this list verbatim.
 */
export const ENGINE_BLUEPRINTS: readonly EngineBlueprint[] = [
  systemPromptBlueprint,
  instructionFileBlueprint,
  promptTemplateBlueprint,
  contextFileBlueprint,
  memoryBlueprint,
  workflowBlueprint,
];

export {
  contextFileBlueprint,
  instructionFileBlueprint,
  memoryBlueprint,
  promptTemplateBlueprint,
  systemPromptBlueprint,
  workflowBlueprint,
};