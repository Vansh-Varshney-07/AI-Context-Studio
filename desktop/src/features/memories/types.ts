import type { GenerationOutputKind } from "@/shared/types/provider";

/**
 * Memory identifier
 */
export type MemoryId =
  | "project-context"
  | "team-knowledge"
  | "decision-log"
  | "architecture-decisions"
  | "api-contracts"
  | "coding-standards"
  | "custom";

/**
 * Memory block types
 */
export type MemoryType =
  | "context"
  | "knowledge"
  | "decision"
  | "standard"
  | "reference";

/**
 * A single memory block
 */
export interface MemoryBlock {
  id: string;
  type: MemoryType;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  source?: string; // e.g., "meeting-notes", "code-review", "manual"
  relatedBlocks?: string[]; // IDs of related memory blocks
}

/**
 * Memory collection (e.g., project context)
 */
export interface MemoryCollection {
  id: string;
  name: string;
  description: string;
  blocks: MemoryBlock[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Context injection configuration for AI
 */
export interface ContextInjectionConfig {
  includePinned: boolean;
  includeFavorites: boolean;
  includeRecent: boolean;
  maxBlocks: number;
  maxTokens: number;
  tagFilters?: string[];
}

/**
 * Memory search result
 */
export interface MemorySearchResult {
  block: MemoryBlock;
  score: number;
  highlights: string[];
}

/**
 * Form answers for memory generation
 */
export type MemoryAnswers = Record<string, string | number | string[] | boolean | undefined>;

/**
 * Blueprint for generating a memory artifact
 */
export interface MemoryBlueprint {
  kind: GenerationOutputKind;
  label: string;
  description: string;
  filenameHint: string;
  extension: "md" | "json" | "txt";
  titleTemplate: (answers: MemoryAnswers) => string;
  sections: MemoryBlueprintSection[];
}

export interface MemoryBlueprintSection {
  id: string;
  heading: string;
  consumes: string[];
  build: (answers: MemoryAnswers) => string | null;
}

