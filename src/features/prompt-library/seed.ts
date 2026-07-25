import { uuid } from "@/utils/uuid";
import { formatRelativeTime } from "@/utils/date";
import type { PromptCategory } from "@/types/domain";
import type { PromptTemplate } from "./types";

/**
 * Canonical seed prompts for all 6 categories + subcategories.
 * Each template is a fully-formed reference prompt with variables in {{VAR}} form.
 * Phase 5 ships this as read-only data. Phase 6/7 will make them AI-editable.
 */
export const SEED_PROMPTS: PromptTemplate[] = [];