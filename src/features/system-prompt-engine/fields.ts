import type { EngineField, EngineFieldId } from "./types";

/**
 * Controlled vocabularies used by select/multiselect fields. Centralized
 * so blueprints never hardcode option lists — adding an option is data.
 */
const TARGET_AI_OPTIONS: readonly string[] = [
  "Claude",
  "Cursor",
  "GitHub Copilot",
  "Gemini",
  "OpenAI Codex",
  "OpenCode",
  "Continue",
  "Roo",
  "General AGENTS.md",
] as const;

const FRAMEWORK_OPTIONS: readonly string[] = [
  "Next.js (App Router)",
  "Next.js (Pages Router)",
  "Remix",
  "Nuxt",
  "SvelteKit",
  "Astro",
  "Vite (SPA)",
  "Express",
  "Fastify",
  "Hono",
  "Django",
  "FastAPI",
  "Rails",
  "Laravel",
  "Spring Boot",
  "Other",
] as const;

const LANGUAGE_OPTIONS: readonly string[] = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "Kotlin",
  "Swift",
  "C#",
  "C++",
  "Ruby",
  "PHP",
  "Other",
] as const;

const CODING_STYLE_OPTIONS: readonly string[] = [
  "Functional",
  "Object-Oriented",
  "Hybrid",
] as const;

const PROJECT_TYPE_OPTIONS: readonly string[] = [
  "Web App",
  "API",
  "CLI",
  "Library/Package",
  "Mobile App",
  "Desktop App",
  "Extension",
  "Other",
] as const;

const ARCHITECTURE_OPTIONS: readonly string[] = [
  "Monolith",
  "Modular Monolith",
  "Microservices",
  "Serverless",
  "Edge-first",
  "Monorepo",
] as const;

const EXPERIENCE_LEVEL_OPTIONS: readonly string[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;

const TESTING_FRAMEWORK_OPTIONS: readonly string[] = [
  "Vitest",
  "Jest",
  "React Testing Library",
  "Playwright",
  "Cypress",
  "Pytest",
  "Go testing",
  "Rust test",
  "JUnit",
  "Other",
] as const;

const DEPLOYMENT_TARGET_OPTIONS: readonly string[] = [
  "Vercel",
  "Netlify",
  "AWS",
  "GCP",
  "Azure",
  "Cloudflare",
  "Self-hosted",
  "Local only",
  "Other",
] as const;

/**
 * Canonical engine field registry. Adding a field requires ONLY a new
 * entry here + (optionally) submitting it as `consumes` in blueprints.
 */
export const ENGINE_FIELDS: readonly EngineField[] = [
  {
    id: "purpose",
    label: "Purpose",
    help: "One sentence describing what you want the AI to do or produce.",
    kind: "textarea",
    placeholder: "e.g. Generate production-ready React components from schemas.",
    required: true,
    visibleByDefault: true,
  },
  {
    id: "targetAI",
    label: "Target AI",
    help: "Which AI coding assistant will receive this artifact.",
    kind: "select",
    options: TARGET_AI_OPTIONS,
    defaultValue: "General AGENTS.md",
    visibleByDefault: true,
  },
  {
    id: "framework",
    label: "Framework",
    help: "Primary framework this artifact targets.",
    kind: "select",
    options: FRAMEWORK_OPTIONS,
    visibleByDefault: true,
  },
  {
    id: "language",
    label: "Language",
    help: "Primary programming language.",
    kind: "select",
    options: LANGUAGE_OPTIONS,
    visibleByDefault: true,
  },
  {
    id: "codingStyle",
    label: "Coding Style",
    help: "Functional / OOP / Hybrid preference.",
    kind: "select",
    options: CODING_STYLE_OPTIONS,
    visibleByDefault: false,
  },
  {
    id: "projectType",
    label: "Project Type",
    help: "Shape of the deliverable.",
    kind: "select",
    options: PROJECT_TYPE_OPTIONS,
    visibleByDefault: true,
  },
  {
    id: "architecture",
    label: "Architecture",
    help: "High-level structural pattern.",
    kind: "select",
    options: ARCHITECTURE_OPTIONS,
    visibleByDefault: false,
  },
  {
    id: "experienceLevel",
    label: "Experience Level",
    help: "Audience experience the AI should assume for explanations.",
    kind: "select",
    options: EXPERIENCE_LEVEL_OPTIONS,
    defaultValue: "Intermediate",
    visibleByDefault: false,
  },
  {
    id: "testingFramework",
    label: "Testing Framework",
    help: "Framework used for unit/integration/E2E tests.",
    kind: "multiselect",
    options: TESTING_FRAMEWORK_OPTIONS,
    visibleByDefault: true,
  },
  {
    id: "deploymentTarget",
    label: "Deployment Target",
    help: "Where the deliverable ships to.",
    kind: "select",
    options: DEPLOYMENT_TARGET_OPTIONS,
    visibleByDefault: false,
  },
  {
    id: "codingConventions",
    label: "Coding Conventions",
    help: "Free-form bullet list of conventions. One bullet per line.",
    kind: "textarea",
    placeholder: "- PascalCase components\n- Absolute imports via @/\n- No `any`",
    visibleByDefault: true,
  },
  {
    id: "customInstructions",
    label: "Custom Instructions",
    help: "Any free-form additional instructions appended verbatim.",
    kind: "textarea",
    placeholder: "Always prefer composition over inheritance…",
    visibleByDefault: true,
  },
];

/**
 * O(1) field lookup by id.
 */
export const ENGINE_FIELDS_MAP: Record<EngineFieldId, EngineField> =
  Object.fromEntries(
    ENGINE_FIELDS.map((field) => [field.id, field]),
  ) as Record<EngineFieldId, EngineField>;

/** Ordered list of the default-on fields — used by the compact form. */
export const DEFAULT_VISIBLE_FIELDS: EngineField[] = ENGINE_FIELDS.filter(
  (field) => field.visibleByDefault !== false,
);

/** Filter callback used by the UI to expose/hide fields without churn. */
export function isFieldVisible(field: EngineField, includeAll: boolean): boolean {
  if (includeAll) return true;
  return field.visibleByDefault !== false;
}
