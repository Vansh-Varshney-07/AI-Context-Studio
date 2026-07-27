import type { PromptCategory } from "@/shared/types/domain";

/**
 * A prompt library template.
 * The `referencePrompt` is the canonical template with {{VARIABLE}} placeholders.
 * The editor renders this in the upper pane; the builder in the lower pane
 * allows users to create their own variant.
 */
export interface PromptTemplate {
  id: string;
  category: PromptCategory;
  subcategory: string;
  title: string;
  description: string;
  referencePrompt: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

