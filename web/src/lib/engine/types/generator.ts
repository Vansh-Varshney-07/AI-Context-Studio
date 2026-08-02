import type { AgentInstructionTarget } from "../instruction-targets";

/**
 * A single dynamic generator question. The lower pane of the editor renders
 * questions whose `appliesTo` includes the selected target.
 */
export interface GeneratorQuestion {
  id: string;
  label: string;
  help?: string;
  /** Question types the renderer knows how to render. */
  kind:
    | "text"
    | "textarea"
    | "select"
    | "multiselect"
    | "toggle";
  placeholder?: string;
  options?: string[];
  /** Targets this question is relevant for. Empty = applies to all. */
  appliesTo: readonly AgentInstructionTarget[];
  /** Optional default to seed the form. */
  defaultValue?: string | string[] | boolean;
  required?: boolean;
}

export { type AgentInstructionTarget } from "../instruction-targets";