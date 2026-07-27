"use client";

import type { AssetType, Severity } from "./types";

export interface SeedValidationProfile {
  id: string;
  name: string;
  description: string;
  assetType: AssetType;
  rules: SeedValidationRule[];
  passingScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface SeedValidationRule {
  id: string;
  name: string;
  description: string;
  severity: Severity;
  enabled: boolean;
}

/**
 * Seed validation profiles for the Validator module.
 */
export const SEED_VALIDATION_PROFILES: SeedValidationProfile[] = [
  {
    id: "system-prompt-standard",
    name: "System Prompt — Standard",
    description: "Standard validation for AI system prompts",
    assetType: "system-prompt",
    rules: [
      { id: "has-role", name: "Has Role Definition", description: "Prompt defines AI role/identity", severity: "error", enabled: true },
      { id: "has-purpose", name: "Has Purpose Statement", description: "Clear purpose or objective stated", severity: "error", enabled: true },
      { id: "has-constraints", name: "Has Constraints", description: "Includes boundaries/guardrails", severity: "warning", enabled: true },
      { id: "has-examples", name: "Has Examples", description: "Provides example interactions", severity: "info", enabled: true },
      { id: "no-pii", name: "No PII in Prompt", description: "No personal data in prompt template", severity: "error", enabled: true },
      { id: "appropriate-length", name: "Appropriate Length", description: "Not excessively verbose (>10k chars)", severity: "warning", enabled: true },
    ],
    passingScore: 80,
    createdAt: new Date("2024-01-15").toISOString(),
    updatedAt: new Date("2024-01-15").toISOString(),
  },
  {
    id: "instruction-file-comprehensive",
    name: "Instruction File — Comprehensive",
    description: "Full validation for AGENTS.md/CLAUDE.md style files",
    assetType: "instruction-file",
    rules: [
      { id: "has-header", name: "Has Header", description: "File starts with title/description", severity: "error", enabled: true },
      { id: "has-sections", name: "Has Required Sections", description: "Includes: Overview, Instructions, Examples", severity: "error", enabled: true },
      { id: "has-code-examples", name: "Has Code Examples", description: "Shows concrete code patterns", severity: "warning", enabled: true },
      { id: "has-anti-patterns", name: "Has Anti-Patterns", description: "Documents what NOT to do", severity: "info", enabled: true },
      { id: "valid-markdown", name: "Valid Markdown", description: "Parses without errors", severity: "error", enabled: true },
      { id: "no-broken-links", name: "No Broken Internal Links", description: "All anchor links resolve", severity: "warning", enabled: true },
    ],
    passingScore: 75,
    createdAt: new Date("2024-01-20").toISOString(),
    updatedAt: new Date("2024-01-20").toISOString(),
  },
  {
    id: "prompt-template-quality",
    name: "Prompt Template — Quality",
    description: "Validates prompt templates for reusability and clarity",
    assetType: "prompt-template",
    rules: [
      { id: "has-variables", name: "Has Variables", description: "Uses {{VAR}} syntax for customization", severity: "error", enabled: true },
      { id: "variables-documented", name: "Variables Documented", description: "Each variable has description", severity: "warning", enabled: true },
      { id: "clear-instructions", name: "Clear Instructions", description: "Template body is unambiguous", severity: "error", enabled: true },
      { id: "has-context", name: "Has Context Section", description: "Explains when/why to use", severity: "info", enabled: true },
      { id: "no-hardcoded-secrets", name: "No Hardcoded Secrets", description: "No API keys, passwords in template", severity: "error", enabled: true },
    ],
    passingScore: 85,
    createdAt: new Date("2024-02-01").toISOString(),
    updatedAt: new Date("2024-02-01").toISOString(),
  },
  {
    id: "workflow-completeness",
    name: "Workflow — Completeness",
    description: "Ensures workflow definitions are complete and executable",
    assetType: "workflow",
    rules: [
      { id: "has-steps", name: "Has Steps", description: "At least one step defined", severity: "error", enabled: true },
      { id: "steps-connected", name: "Steps Connected", description: "No orphaned steps (all reachable)", severity: "error", enabled: true },
      { id: "valid-dependencies", name: "Valid Dependencies", description: "All dependsOn reference existing steps", severity: "error", enabled: true },
      { id: "no-circular-deps", name: "No Circular Dependencies", description: "Dependency graph is acyclic", severity: "error", enabled: true },
      { id: "has-entry-point", name: "Has Entry Point", description: "Clear starting step(s)", severity: "warning", enabled: true },
      { id: "steps-have-skills", name: "Steps Have Skills", description: "Each step references valid skill", severity: "warning", enabled: true },
    ],
    passingScore: 90,
    createdAt: new Date("2024-02-15").toISOString(),
    updatedAt: new Date("2024-02-15").toISOString(),
  },
  {
    id: "persona-completeness",
    name: "Persona — Completeness",
    description: "Validates persona definitions have all required fields",
    assetType: "persona",
    rules: [
      { id: "has-name", name: "Has Name", description: "Persona has a name", severity: "error", enabled: true },
      { id: "has-system-prompt", name: "Has System Prompt", description: "Core instructions present", severity: "error", enabled: true },
      { id: "has-expertise", name: "Has Expertise", description: "Domain expertise defined", severity: "warning", enabled: true },
      { id: "has-traits", name: "Has Personality Traits", description: "Trait scores (0-10) provided", severity: "info", enabled: true },
      { id: "has-examples", name: "Has Examples", description: "Example interactions included", severity: "info", enabled: true },
    ],
    passingScore: 80,
    createdAt: new Date("2024-03-01").toISOString(),
    updatedAt: new Date("2024-03-01").toISOString(),
  },
];

export const VALIDATION_RULE_CATEGORIES = [
  { id: "structure", label: "Structure", description: "Required sections, formatting, syntax" },
  { id: "content", label: "Content", description: "Quality, clarity, completeness of content" },
  { id: "security", label: "Security", description: "No secrets, PII, unsafe patterns" },
  { id: "best-practices", label: "Best Practices", description: "Follows conventions, patterns" },
  { id: "usability", label: "Usability", description: "Easy to use, understand, maintain" },
] as const;

