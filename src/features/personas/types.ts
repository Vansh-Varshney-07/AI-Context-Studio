import type { GenerationOutputKind } from "@/types/provider";

/**
 * Persona identifier. Add new entries here + in constants/personas.ts
 */
export type PersonaId =
  | "senior-engineer"
  | "code-reviewer"
  | "architect"
  | "product-manager"
  | "designer"
  | "security-expert"
  | "devops-engineer"
  | "data-scientist"
  | "technical-writer"
  | "custom";

/**
 * Persona trait categories
 */
export type TraitCategory =
  | "communication"
  | "technical-depth"
  | "rigor"
  | "creativity"
  | "pragmatism"
  | "verbosity"
  | "formality";

/**
 * A single configurable trait for a persona
 */
export interface PersonaTrait {
  id: TraitCategory;
  label: string;
  description: string;
  min: number;
  max: number;
  default: number;
}

/**
 * Complete persona definition
 */
export interface Persona {
  id: PersonaId;
  name: string;
  title: string;
  avatar: string; // emoji or icon name
  description: string;
  systemPrompt: string;
  traits: Record<TraitCategory, number>;
  expertise: string[];
  communicationStyle: string;
  exampleInteractions: ExampleInteraction[];
  metadata: PersonaMetadata;
}

export interface ExampleInteraction {
  user: string;
  assistant: string;
  context?: string;
}

export interface PersonaMetadata {
  createdAt: string;
  updatedAt: string;
  version: number;
  tags: string[];
  isCustom: boolean;
}

/**
 * Form answers for persona generation
 */
export type PersonaAnswers = Record<string, string | number | string[] | boolean | undefined>;

/**
 * Blueprint for generating a persona artifact
 */
export interface PersonaBlueprint {
  kind: GenerationOutputKind;
  label: string;
  description: string;
  filenameHint: string;
  extension: "md" | "json" | "yaml";
  titleTemplate: (answers: PersonaAnswers) => string;
  sections: PersonaBlueprintSection[];
}

export interface PersonaBlueprintSection {
  id: string;
  heading: string;
  consumes: string[];
  build: (answers: PersonaAnswers) => string | null;
}