/**
 * Navigation module identifiers. New modules must append to this union
 * AND register a manifest entry in `constants/modules.registry.ts`.
 * Layout/components stay untouched (registry-driven, not hard-coded).
 */
export type ModuleId =
  | "dashboard"
  | "instruction-files"
  | "prompt-library"
  | "system-prompt-engine"
  | "personas"
  | "skills"
  | "workflows"
  | "memories"
  | "mcp"
  | "validator"
  | "optimizer";

/**
 * Parameters passed to a module renderer. Interpreted per-module.
 * Example: instruction-files uses { target: AgentInstructionTarget }.
 */
export type ModuleParams = Record<string, string | undefined>;

/**
 * History entry recorded for back/forward navigation.
 */
export interface NavigationHistoryEntry {
  moduleId: ModuleId;
  params: ModuleParams;
}
