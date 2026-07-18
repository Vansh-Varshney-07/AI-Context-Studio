import type { GenerationOutputKind } from "@/types/provider";

/**
 * Identifies a structured engine field. New fields require ONLY appending
 * to this union + a definition in `fields.ts`. Pure data — never a UI edit.
 */
export type EngineFieldId =
  | "purpose"
  | "targetAI"
  | "framework"
  | "language"
  | "codingStyle"
  | "projectType"
  | "architecture"
  | "experienceLevel"
  | "testingFramework"
  | "deploymentTarget"
  | "codingConventions"
  | "customInstructions";

/**
 * Concrete form input kinds the engine's renderer knows how to render.
 * Mirrors the GeneratorQuestion concept but is engine-local so changes
 * to the instruction-files module can churn independently.
 */
export type EngineFieldKind =
  | "text"
  | "textarea"
  | "select"
  | "multiselect"
  | "toggle";

/**
 * Definition of a single structured engine field. Pure data: definition,
 * rendering hint, default value, and the optional controlled vocabulary.
 */
export interface EngineField {
  id: EngineFieldId;
  label: string;
  help?: string;
  kind: EngineFieldKind;
  placeholder?: string;
  /** For select / multiselect — uses shared vocab ids. */
  options?: readonly string[];
  defaultValue?: string | string[] | boolean;
  required?: boolean;
  /** When false, the field will not be prompted by default. */
  visibleByDefault?: boolean;
}

/**
 * Map of every field id to its answer. Values come from the form.
 */
export type EngineAnswers = Record<EngineFieldId, string | string[] | boolean | undefined>;

/**
 * A blueprint for one of the 6 output kinds. Built around composition:
 * a blueprint is a list of section builders that each receive the engine
 * answers and return either a populated string section or `null` to skip.
 *
 * Each builder MUST declare which EngineFieldIds it consumes — this powers
 * the "schema" view in the UI without any coupling.
 */
export interface EngineSectionBuilder {
  id: string;
  heading: string;
  /** Field ids used by this builder (declarative coupling). */
  consumes: readonly EngineFieldId[];
  /** Returns the section body or null to skip the section. */
  build: (answers: EngineAnswers) => string | null;
}

/**
 * Top-level blueprint for one OutputKind. Order of section builders is
 * preserved in the generated output.
 */
export interface EngineBlueprint {
  kind: GenerationOutputKind;
  label: string;
  description: string;
  /** Filename hint for export — `${slug}.${ext}`. */
  filenameHint: string;
  /** Extension to use when exporting. */
  extension: "md" | "txt" | "json" | "yml" | "yaml";
  /** Markdown heading used at the top of the generated artifact. */
  titleTemplate: (answers: EngineAnswers) => string;
  /** Ordered section builders. */
  sections: readonly EngineSectionBuilder[];
}

/**
 * Result returned by the engine to the UI. Carries both the raw content
 * and the exportable filename.
 */
export interface EngineOutput {
  kind: GenerationOutputKind;
  title: string;
  filename: string;
  content: string;
  /** Field ids the producing blueprint declared — for the schema view. */
  consumedFields: readonly EngineFieldId[];
}
