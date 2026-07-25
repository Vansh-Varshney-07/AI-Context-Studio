import type { PromptCategory, PromptCategoryInfo } from "@/types/domain";

/**
 * Top-level Prompt Library categories per Phase 5 spec.
 * Order is canonical.
 */
export const PROMPT_CATEGORIES: readonly PromptCategoryInfo[] = [
  {
    id: "personal",
    label: "Personal",
    description: "Personal prompts, saved and curated by the user.",
  },
  {
    id: "programming",
    label: "Programming",
    description: "Code-centric prompts for debugging, generation, refactors.",
  },
  {
    id: "business",
    label: "Business",
    description: "Strategy, planning, communications, and operations.",
  },
  {
    id: "writing",
    label: "Writing",
    description: "Drafting, editing, summarizing, long-form content tasks.",
  },
  {
    id: "education",
    label: "Education",
    description: "Study guides, explanations, tutoring, learning aids.",
  },
  {
    id: "ai-specific",
    label: "AI Specific",
    description: "Meta prompts for orchestrating AI agents and workflows.",
  },
] as const;

/**
 * Sub-categories are intentionally shared as a flat map keyed by category id.
 * Subcategories are simple string arrays — each module owns rendering them.
 */
export const PROMPT_SUBCATEGORIES: Record<PromptCategory, string[]> = {
  personal: ["My Snippets", "Favorites", "Drafts"],
  programming: ["Debugging", "Refactoring", "New Features", "Code Review"],
  business: ["Strategy", "Email", "Reports", "Planning"],
  writing: ["Drafting", "Editing", "Summarizing", "Outlining"],
  education: ["Tutoring", "Summaries", "Flashcards", "Explanations"],
  "ai-specific": ["Chain-of-Thought", "Roleplay", "Metaprompts", "Routing"],
};

/**
 * Lookup map keyed by category id.
 */
export const PROMPT_CATEGORY_MAP: Record<PromptCategory, PromptCategoryInfo> =
  Object.fromEntries(
    PROMPT_CATEGORIES.map((category) => [category.id, category]),
  ) as Record<PromptCategory, PromptCategoryInfo>;
