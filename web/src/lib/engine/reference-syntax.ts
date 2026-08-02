export interface ReferenceSection {
  id: string;
  heading: string;
  body: string;
}

export interface ReferenceSyntaxManifest {
  target: string;
  filename: string;
  summary: string;
  sections: readonly ReferenceSection[];
}

export const INSTRUCTION_SYNTAX: Record<string, ReferenceSection[]> = {
  claude: [
    {
      id: "overview",
      heading: "Project Overview",
      body: "A concise 2-3 sentence description of the project, its purpose, and target audience. This helps the AI understand the context immediately.",
    },
    {
      id: "stack",
      heading: "Tech Stack",
      body: "List all languages, frameworks, runtime, build tools, databases, and key libraries with versions where relevant. Example:\n- Language: TypeScript 5.3\n- Framework: Next.js 14 (App Router)\n- Styling: Tailwind CSS 3.4\n- State: Zustand 4.5\n- Database: PostgreSQL 15 + Prisma 5",
    },
    {
      id: "commands",
      heading: "Commands",
      body: "Document the exact commands for common operations:\n- Install: `npm install`\n- Dev: `npm run dev`\n- Build: `npm run build`\n- Lint: `npm run lint`\n- Typecheck: `npm run typecheck`\n- Test: `npm run test`\n- Format: `npm run format`",
    },
    {
      id: "structure",
      heading: "Repository Structure",
      body: "Describe top-level directories and their responsibilities:\n- `src/app` — Next.js App Router routes\n- `src/components` — Shared UI components\n- `src/features` — Feature-specific modules\n- `src/lib` — Utilities and configurations\n- `src/services` — External service integrations\n- `src/types` — Shared TypeScript types",
    },
    {
      id: "style",
      heading: "Code Style & Conventions",
      body: "Explicit rules for:\n- Naming: PascalCase components, camelCase functions/variables, UPPER_SNAKE_CASE constants\n- Imports: Absolute imports via `@/` alias; group external, internal, relative\n- Components: Prefer composition over inheritance; use `React.forwardRef` for primitives\n- State: Colocate state; prefer Zustand for cross-feature state\n- Errors: Use Result types; never throw in async functions",
    },
    {
      id: "testing",
      heading: "Testing",
      body: "Testing framework and patterns:\n- Unit: Vitest + React Testing Library\n- Integration: Playwright for E2E\n- Coverage: Minimum 80% for critical paths\n- Naming: `*.test.ts` for unit, `*.spec.ts` for integration\n- Run before commit: `npm run test`",
    },
    {
      id: "refactoring",
      heading: "Refactoring Guidance",
      body: "Areas under active refactoring:\n- Legacy components in `src/components/legacy` — migrate to new patterns\n- API client in `src/services/api` — replace with TanStack Query\n- State management — consolidate to Zustand stores",
    },
    {
      id: "do-not",
      heading: "Do Not Touch",
      body: "Files and patterns the AI should avoid:\n- `src/app/api/auth/*` — Authentication routes managed separately\n- `src/lib/auth/*` — Auth internals, do not modify\n- `src/middleware.ts` — Edge middleware, changes require review\n- Generated files in `src/generated/` — Do not edit manually",
    },
  ],
  cursor: [
    {
      id: "context",
      heading: "Context",
      body: "Describe the project goal, target users, and primary workflows. Keep it concise — Cursor reads this on every interaction.",
    },
    {
      id: "tech",
      heading: "Technology",
      body: "Stack summary:\n- Language: TypeScript 5.x\n- Framework: Next.js 14\n- UI: Tailwind CSS + shadcn/ui\n- State: Zustand\n- Data: TanStack Query\n- ORM: Prisma + PostgreSQL",
    },
    {
      id: "coding",
      heading: "Coding Standards",
      body: "- Use functional components with TypeScript\n- Prefer `interface` over `type` for object shapes\n- Export types from `src/types` barrel\n- Use `clsx` + `tailwind-merge` for class composition\n- No `any` — use `unknown` and type guards\n- Handle errors with `try/catch` + typed error objects",
    },
    {
      id: "refactor",
      heading: "Refactoring Rules",
      body: "- Ask before making breaking changes to public APIs\n- Preserve existing test coverage\n- Update types when changing component props\n- Run `npm run typecheck` after changes",
    },
    {
      id: "tests",
      heading: "Testing",
      body: "- Write tests for new components in `*.test.tsx`\n- Use `@testing-library/react` + Vitest\n- Mock external services with MSW\n- Aim for meaningful assertions, not snapshot matching",
    },
    {
      id: "avoid",
      heading: "Avoid",
      body: "- Direct DOM manipulation\n- `useEffect` for data fetching (use TanStack Query)\n- Inline styles unless dynamic\n- Deeply nested ternaries\n- Magic strings — use constants",
    },
  ],
  copilot: [
    {
      id: "purpose",
      heading: "Purpose",
      body: "This project is a premium AI instruction engineering hub. It enables users to create, manage, and export AI assets (instruction files, prompt templates, personas, skills, workflows, memories, MCP configs) for multiple AI coding assistants.",
    },
    {
      id: "stack",
      heading: "Stack",
      body: "- TypeScript 5 (strict)\n- Next.js 14 App Router\n- Tailwind CSS 3.4 + shadcn/ui\n- Zustand + TanStack Query\n- Framer Motion for animations\n- Zod for validation\n- Prisma + PostgreSQL",
    },
    {
      id: "conventions",
      heading: "Conventions",
      body: "- Components: `src/components` (shared), `src/features/*/components` (feature)\n- Types: `src/types` with barrel exports\n- State: `src/lib/*-store.ts` for Zustand\n- Services: `src/services` for external APIs\n- Constants: `src/constants` with barrel exports\n- Styles: `src/app/globals.css` + Tailwind config",
    },
    {
      id: "tests",
      heading: "Tests",
      body: "- Unit: `*.test.ts` with Vitest + RTL\n- E2E: `*.spec.ts` with Playwright\n- Run: `npm run test` / `npm run test:e2e`\n- CI runs typecheck + lint + test",
    },
    {
      id: "security",
      heading: "Security & Privacy",
      body: "- API keys encrypted at rest (AES-GCM)\n- No secrets in localStorage\n- Sanitize all user inputs\n- No telemetry without consent",
    },
    {
      id: "avoid",
      heading: "Avoid",
      body: "- Hardcoding configuration values\n- Direct `localStorage` access (use storage service)\n- Mutating props or context directly\n- Blocking async operations in render",
    },
  ],
  gemini: [
    {
      id: "project",
      heading: "Project Summary",
      body: "AI Context Studio — a premium hub for AI instruction engineering. Users create and export instruction files, prompts, personas, skills, workflows, and MCP configs for multiple AI coding assistants.",
    },
    {
      id: "technologies",
      heading: "Technologies",
      body: "- TypeScript 5 (strict mode)\n- Next.js 14 (App Router, Turbopack)\n- Tailwind CSS 3.4 + shadcn/ui\n- Zustand (state) + TanStack Query (server state)\n- Framer Motion (animations)\n- Zod (validation)\n- Prisma + PostgreSQL",
    },
    {
      id: "architecture",
      heading: "Architecture",
      body: "- Feature-based folder structure under `src/features`\n- Shared UI in `src/components/ui`\n- State in `src/lib/*-store.ts` (Zustand)\n- Services in `src/services` (providers, storage, crypto)\n- Types in `src/types` (barrel exports)\n- Constants in `src/constants`",
    },
    {
      id: "standards",
      heading: "Standards",
      body: "- TypeScript strict mode, no `any`\n- ESLint + Prettier + TypeScript strict\n- Components: composition > inheritance\n- State: colocated, minimal, typed\n- Animations: Framer Motion presets only",
    },
  ],
  codex: [
    {
      id: "summary",
      heading: "Summary",
      body: "AI Context Studio — premium web app for AI instruction engineering. Create, manage, and export instruction files, prompt templates, personas, skills, workflows, memories, and MCP configs for multiple AI coding assistants.",
    },
    {
      id: "commands",
      heading: "Commands",
      body: "- `npm run dev` — Start dev server\n- `npm run build` — Production build\n- `npm run typecheck` — TypeScript check\n- `npm run lint` — ESLint\n- `npm run format` — Prettier\n- `npm run test` — Vitest\n- `npm run test:e2e` — Playwright",
    },
    {
      id: "structure",
      heading: "Structure",
      body: "- `src/app` — Next.js App Router\n- `src/components` — Shared UI primitives\n- `src/features` — Feature modules (dashboard, instruction-files, prompt-library, etc.)\n- `src/lib` — Store, query client, utils\n- `src/services` — Providers, storage, crypto\n- `src/types` — Shared types\n- `src/constants` — Manifests, registries",
    },
    {
      id: "agents",
      heading: "Agent Instructions",
      body: "- Follow existing patterns in the codebase\n- Use existing UI primitives from `src/components/ui`\n- State: Zustand stores in `src/lib/*-store.ts`\n- Types: Import from `src/types`\n- Animations: Use presets from `src/components/motion`\n- Validation: Zod schemas in feature folders",
    },
    {
      id: "subagents",
      heading: "Subagent Instructions",
      body: "- `code-generator`: Generates code from templates\n- `prompt-optimizer`: Improves prompt quality\n- `security-auditor`: Reviews for vulnerabilities\n- `docs-writer`: Updates documentation\n- Each subagent has isolated context",
    },
  ],
  opencode: [
    {
      id: "context",
      heading: "Context",
      body: "AI Context Studio — a premium web application for AI instruction engineering. Users create, customize, manage, and export AI assets for multiple AI coding assistants.",
    },
    {
      id: "stack",
      heading: "Stack",
      body: "- TypeScript 5 (strict)\n- Next.js 14 (App Router)\n- Tailwind CSS 3.4 + shadcn/ui\n- Zustand + TanStack Query\n- Framer Motion\n- Zod\n- Prisma + PostgreSQL",
    },
    {
      id: "style",
      heading: "Style",
      body: "- Premium dark theme with subtle gradients\n- Glassmorphism for overlays\n- Rounded-2xl cards with gradient borders on hover\n- Framer Motion for all transitions\n- Geist Sans/Mono fonts",
    },
    {
      id: "tools",
      heading: "Tools",
      body: "- `src/lib/query-client.ts` — TanStack Query client\n- `src/lib/*-store.ts` — Zustand stores\n- `src/services/storage` — IndexedDB (Dexie)\n- `src/services/crypto` — AES-GCM encryption\n- `src/services/providers` — AI provider adapters",
    },
    {
      id: "rules",
      heading: "Rules",
      body: "- No `any` — use `unknown` + type guards\n- Validate all inputs with Zod\n- Encrypt secrets with AES-GCM\n- Use `cn()` for class merging\n- Framer Motion presets for animations",
    },
  ],
  continue: [
    {
      id: "schema",
      heading: "Schema",
      body: "`.continuerules.json` structure:\n```json\n{\n  \"models\": [],\n  \"rules\": [],\n  \"contextProviders\": [],\n  \"experimental\": {}\n}\n```",
    },
    {
      id: "rules",
      heading: "Rules",
      body: "Plain-language rules merged into every completion prompt. Examples:\n- Prefer composition over inheritance\n- Use Zod for validation\n- Encrypt secrets with AES-GCM\n- Use Framer Motion presets\n- No `any` — use `unknown` + type guards",
    },
    {
      id: "models",
      heading: "Models",
      body: "Default provider + per-scope overrides (chat, edit, embed). Configure in `.continuerules.json`.",
    },
    {
      id: "context",
      heading: "Context Providers",
      body: "Enabled providers and their options for repo-aware chat. Configure in `.continuerules.json`.",
    },
  ],
  roo: [
    {
      id: "modes",
      heading: "Modes",
      body: "Named modes with responsibilities:\n- `architect` — High-level design, architecture decisions\n- `coder` — Implementation, feature development\n- `debugger` — Root cause analysis, fixes\n- `reviewer` — Code review, quality gates",
    },
    {
      id: "boundaries",
      heading: "Boundaries",
      body: "Files and operations each mode may perform unaided. Example:\n- `architect`: Read all, write `docs/architecture/*`, propose ADRs\n- `coder`: Read/write `src/features/*`, write tests\n- `debugger`: Read all, write `*.test.ts`, apply fixes\n- `reviewer`: Read all, write review comments",
    },
    {
      id: "tools",
      heading: "Tools",
      body: "Permitted tool use per mode with approval gates:\n- `read` — Always allowed\n- `write` — `coder` + `debugger` (approval for new files)\n- `run` — `debugger` only (approval for commands)\n- `browser` — `architect` + `reviewer` (research)",
    },
    {
      id: "style",
      heading: "Style",
      body: "- TypeScript strict, no `any`\n- Zod validation for all inputs\n- Framer Motion for UI animations\n- Premium dark theme, glassmorphism overlays\n- Rounded-2xl cards with gradient borders",
    },
  ],
  general: [
    {
      id: "summary",
      heading: "Summary",
      body: "Cross-agent AGENTS.md for any AI coding assistant. Defines project purpose, commands, structure, and global instructions.",
    },
    {
      id: "commands",
      heading: "Commands",
      body: "- `npm run dev` — Development server\n- `npm run build` — Production build\n- `npm run typecheck` — TypeScript validation\n- `npm run lint` — ESLint\n- `npm run format` — Prettier\n- `npm run test` — Unit tests\n- `npm run test:e2e` — Playwright E2E",
    },
    {
      id: "structure",
      heading: "Structure",
      body: "- `src/app` — Next.js App Router pages/layouts\n- `src/components` — Shared UI (ui/, layout/, common/, motion/)\n- `src/features` — Feature modules (each self-contained)\n- `src/lib` — Stores, query client, utilities\n- `src/services` — External services (providers, storage, crypto)\n- `src/types` — Shared types (barrel exports)\n- `src/constants` — Registries, manifests",
    },
    {
      id: "global",
      heading: "Global Agent Instructions",
      body: "- Follow existing patterns and conventions\n- Use `src/components/ui` primitives\n- State in `src/lib/*-store.ts` (Zustand)\n- Types from `src/types` (barrel exports)\n- Animations from `src/components/motion`\n- Validation with Zod in feature folders\n- Premium dark theme, no hardcoded colors",
    },
    {
      id: "subagents",
      heading: "Per-Subagent Instructions",
      body: "- `instruction-file-generator`: Creates AGENTS.md, CLAUDE.md, .cursorrules, etc.\n- `prompt-library-curator`: Manages prompt templates and categories\n- `persona-designer`: Creates AI personas and system roles\n- `skill-composer`: Builds atomic AI skills\n- `workflow-orchestrator`: Chains skills into pipelines\n- `memory-manager`: Handles long-running context\n- `config-manager`: Manages MCP configs and provider settings",
    },
  ],
};