import type { PersonaTrait, TraitCategory } from "./types";

/**
 * Canonical trait definitions for persona configuration.
 * Each trait is a 0-10 slider with a default.
 */
export const PERSONA_TRAITS: readonly PersonaTrait[] = [
  {
    id: "communication",
    label: "Communication Style",
    description: "How the persona conveys information — concise vs. elaborate",
    min: 0,
    max: 10,
    default: 5,
  },
  {
    id: "technical-depth",
    label: "Technical Depth",
    description: "Level of technical detail — high-level vs. implementation-focused",
    min: 0,
    max: 10,
    default: 7,
  },
  {
    id: "rigor",
    label: "Rigor & Precision",
    description: "Strictness about correctness, edge cases, and best practices",
    min: 0,
    max: 10,
    default: 8,
  },
  {
    id: "creativity",
    label: "Creativity",
    description: "Willingness to explore novel approaches vs. proven patterns",
    min: 0,
    max: 10,
    default: 5,
  },
  {
    id: "pragmatism",
    label: "Pragmatism",
    description: "Focus on practical, shipping solutions vs. theoretical purity",
    min: 0,
    max: 10,
    default: 7,
  },
  {
    id: "verbosity",
    label: "Verbosity",
    description: "Length of responses — terse vs. comprehensive",
    min: 0,
    max: 10,
    default: 5,
  },
  {
    id: "formality",
    label: "Formality",
    description: "Tone — casual/conversational vs. formal/professional",
    min: 0,
    max: 10,
    default: 5,
  },
] as const;

/**
 * O(1) lookup by trait id
 */
export const PERSONA_TRAITS_MAP: Record<TraitCategory, PersonaTrait> =
  Object.fromEntries(
    PERSONA_TRAITS.map((trait) => [trait.id, trait]),
  ) as Record<TraitCategory, PersonaTrait>;

/**
 * Ordered list of all trait categories
 */
export const TRAIT_CATEGORIES: TraitCategory[] = PERSONA_TRAITS.map((t) => t.id);

/**
 * Free-form text fields for persona definition
 */
export interface PersonaField {
  id: string;
  label: string;
  help?: string;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
}

export const PERSONA_FIELDS: readonly PersonaField[] = [
  {
    id: "name",
    label: "Name",
    help: "Display name for the persona",
    placeholder: "Senior Backend Engineer",
    required: true,
  },
  {
    id: "title",
    label: "Title / Role",
    help: "Professional title or role designation",
    placeholder: "Senior Software Engineer — Platform",
    required: true,
  },
  {
    id: "avatar",
    label: "Avatar",
    help: "Emoji or icon identifier",
    placeholder: "🏗️",
    required: false,
  },
  {
    id: "description",
    label: "Description",
    help: "One-sentence summary of the persona's purpose",
    placeholder: "Expert in distributed systems, API design, and developer experience",
    multiline: true,
    required: true,
  },
  {
    id: "systemPrompt",
    label: "System Prompt",
    help: "Core instructions that define the persona's behavior and boundaries",
    placeholder: "You are a senior backend engineer...",
    multiline: true,
    required: true,
  },
  {
    id: "expertise",
    label: "Areas of Expertise",
    help: "Comma-separated list of domains",
    placeholder: "Distributed Systems, API Design, Go, Kubernetes",
    required: true,
  },
  {
    id: "communicationStyle",
    label: "Communication Style",
    help: "How the persona communicates (e.g., 'Direct and code-first', 'Pedagogical and patient')",
    placeholder: "Direct, code-first, with architectural context",
    multiline: true,
    required: true,
  },
  {
    id: "exampleInteractions",
    label: "Example Interactions",
    help: "Sample user/assistant exchanges that demonstrate the persona (one per line, format: User: ... | Assistant: ...)",
    placeholder: "User: How do I design a rate limiter? | Assistant: Here's a token bucket implementation...",
    multiline: true,
    required: false,
  },
  {
    id: "tags",
    label: "Tags",
    help: "Comma-separated tags for filtering",
    placeholder: "backend, distributed-systems, mentoring",
    required: false,
  },
];

/**
 * Default trait values for new personas
 */
export const DEFAULT_TRAITS: Record<string, number> = Object.fromEntries(
  PERSONA_TRAITS.map((t) => [t.id, t.default]),
);