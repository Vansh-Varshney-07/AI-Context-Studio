import type { AgentInstructionTarget } from "@/shared/types/domain";
import type { GeneratorQuestion } from "./types";

/**
 * Question bank for the Custom Generator.
 *
 * Per spec (Phase 4) the generator must "ask dynamic questions depending
 * on the selected instruction file". We do that by filtering this list
 * through each question's `appliesTo` set.
 *
 * The dummy generator (separate module) consumes the user's answers and
 * stitches an instruction file string. No AI is invoked.
 */
export const GENERATOR_QUESTIONS: readonly GeneratorQuestion[] = [
  {
    id: "project-name",
    label: "Project name",
    kind: "text",
    placeholder: "AI Context Studio",
    appliesTo: [],
    required: true,
    help: "Used in headings and filename when unspecified.",
  },
  {
    id: "summary",
    label: "Project summary",
    kind: "textarea",
    placeholder: "A single sentence describing the project.",
    appliesTo: [],
    required: true,
  },
  {
    id: "stack",
    label: "Tech stack",
    kind: "textarea",
    placeholder: "TypeScript, Next.js 16, Tailwind v4, Zustandâ€¦",
    appliesTo: [
      "claude",
      "cursor",
      "copilot",
      "gemini",
      "codex",
      "opencode",
      "general",
    ],
  },
  {
    id: "commands",
    label: "Commands",
    kind: "textarea",
    placeholder: "npm install, npm run dev, npm run build, npm run test",
    appliesTo: ["claude", "codex", "general"],
  },
  {
    id: "structure",
    label: "Repository structure",
    kind: "textarea",
    placeholder: "src/app â€” routes, src/features â€” module slicesâ€¦",
    appliesTo: ["claude", "codex", "general"],
  },
  {
    id: "style",
    label: "Code style",
    kind: "textarea",
    placeholder: "PascalCase components, snake_case testsâ€¦",
    appliesTo: [
      "claude",
      "cursor",
      "copilot",
      "gemini",
      "codex",
      "opencode",
      "general",
    ],
  },
  {
    id: "tests",
    label: "Testing approach",
    kind: "text",
    placeholder: "Vitest + Playwright, run before declaring done.",
    appliesTo: ["claude", "cursor", "copilot", "codex", "general"],
  },
  {
    id: "avoid",
    label: "Avoid / Do not touch",
    kind: "textarea",
    placeholder: ".next/, node_modules/, build artifactsâ€¦",
    appliesTo: ["claude", "cursor", "cursor", "copilot", "codex", "general"],
  },
  {
    id: "modes",
    label: "Roo modes",
    kind: "multiselect",
    appliesTo: ["roo"],
    options: ["architect", "coder", "debugger", "reviewer"],
    defaultValue: ["coder"],
  },
  {
    id: "rules",
    label: "Continue rules",
    kind: "textarea",
    appliesTo: ["continue"],
    placeholder: "Prefer composition. Use Zod for validation.",
  },
  {
    id: "tools",
    label: "Permitted tools",
    kind: "multiselect",
    appliesTo: ["roo", "continue"],
    options: ["read", "write", "run", "browser", "search"],
    defaultValue: ["read", "write"],
  },
  {
    id: "strict-types",
    label: "Enforce strict TypeScript",
    kind: "toggle",
    appliesTo: [
      "claude",
      "cursor",
      "codex",
      "opencode",
      "general",
    ],
    defaultValue: true,
  },
  {
    id: "accessibility",
    label: "Accessibility focus",
    kind: "toggle",
    appliesTo: ["claude", "cursor", "copilot", "gemini", "opencode"],
    defaultValue: true,
    help: "When on, generated file includes an a11y expectations block.",
  },
] as const;

/**
 * Return questions relevant for the given target. Order is preserved.
 */
export function questionsForTarget(
  target: AgentInstructionTarget,
): GeneratorQuestion[] {
  return GENERATOR_QUESTIONS.filter((q) => q.appliesTo.length === 0 ||
    q.appliesTo.includes(target));
}

