export interface SkillParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  systemPrompt: string;
  examples: string[];
  parameters: SkillParameter[];
  icon: string; // Lucide icon name as string
}

export const SKILL_CATEGORIES = [
  "programming",
  "writing",
  "analysis",
  "creative",
  "research",
  "devops",
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];