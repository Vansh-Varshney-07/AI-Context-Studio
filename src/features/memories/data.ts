import { FileText, BookOpen, GitBranch, Ruler, Bookmark } from "lucide-react";
import type { MemoryType, MemoryCollection } from "./types";

/**
 * Canonical memory types
 */
export const MEMORY_TYPES: readonly { type: MemoryType; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    type: "context",
    label: "Project Context",
    description: "High-level project information, goals, and constraints",
    icon: FileText,
  },
  {
    type: "knowledge",
    label: "Knowledge Base",
    description: "Reusable knowledge, patterns, and best practices",
    icon: BookOpen,
  },
  {
    type: "decision",
    label: "Decision Log",
    description: "Architectural and technical decisions with rationale",
    icon: GitBranch,
  },
  {
    type: "standard",
    label: "Standards & Conventions",
    description: "Coding standards, naming conventions, and guidelines",
    icon: Ruler,
  },
  {
    type: "reference",
    label: "Reference Material",
    description: "API specs, schemas, external documentation links",
    icon: Bookmark,
  },
] as const;

/**
 * Default memory collections
 */
export const DEFAULT_COLLECTIONS: MemoryCollection[] = [
  {
    id: "project-context",
    name: "Project Context",
    description: "Core project information and context",
    blocks: [
      {
        id: "project-overview",
        type: "context",
        title: "Project Overview",
        content: "# Project Overview\n\n**Name:** AI Context Studio\n**Description:** A premium web application for AI instruction engineering. Users create, manage, and export AI assets (instruction files, prompt templates, personas, skills, workflows, memories, MCP configs) for multiple AI coding assistants.\n\n**Goals:**\n- Provide a unified interface for AI asset management\n- Support multiple AI coding assistants (Claude, Cursor, Copilot, Gemini, etc.)\n- Enable structured, version-controlled AI asset creation\n- Integrate with AI providers for enhanced generation\n\n**Constraints:**\n- Client-side only (no backend)\n- Privacy-first: API keys stored in session only\n- Offline-capable after initial load\n- TypeScript strict mode\n- Premium dark theme only",
        tags: ["overview", "goals", "constraints"],
        pinned: true,
        favorite: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: "manual",
      },
      {
        id: "tech-stack",
        type: "context",
        title: "Tech Stack",
        content: "# Tech Stack\n\n- **Framework:** Next.js 16 (App Router)\n- **Language:** TypeScript (strict mode)\n- **Styling:** Tailwind CSS v4\n- **State:** Zustand\n- **Data Fetching:** TanStack Query\n- **Forms:** React Hook Form + Zod\n- **Animations:** Framer Motion\n- **UI Components:** Radix UI + custom\n- **Icons:** Lucide React\n- **Database:** IndexedDB (Dexie)\n- **Encryption:** Web Crypto API (AES-GCM)\n- **AI Providers:** OpenAI, Anthropic, Google, DeepSeek, OpenRouter, NVIDIA, Ollama\n\n**Key Libraries:**\n- `next@16`\n- `react@19`\n- `zustand@5`\n- `@tanstack/react-query@5`\n- `react-hook-form@7` + `zod@3`\n- `framer-motion@11`\n- `@radix-ui/*`\n- `lucide-react@0.4`\n- `dexie@4`\n- `idb@8`",
        tags: ["tech-stack", "architecture"],
        pinned: true,
        favorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: "manual",
      },
      {
        id: "architecture-decisions",
        type: "decision",
        title: "Architecture Decisions",
        content: "# Architecture Decision Log\n\n## ADR-001: Client-Side Only Architecture\n**Status:** Accepted\n**Date:** 2024-01-15\n**Context:** Need to build a privacy-first AI asset management tool\n**Decision:** Build as client-side only SPA with IndexedDB persistence\n**Consequences:**\n- ✅ Complete privacy - no data leaves browser\n- ✅ Works offline after initial load\n- ✅ No backend infrastructure needed\n- ❌ No server-side rendering for SEO\n- ❌ Limited by browser storage quotas\n\n## ADR-002: Zustand for State Management\n**Status:** Accepted\n**Date:** 2024-01-20\n**Context:** Need simple, performant state management\n**Decision:** Use Zustand over Redux/Context\n**Consequences:**\n- ✅ Minimal boilerplate\n- ✅ Excellent TypeScript support\n- ✅ DevTools integration\n- ✅ No provider wrapper needed\n\n## ADR-003: IndexedDB via Dexie\n**Status:** Accepted\n**Date:** 2024-01-22\n**Context:** Need persistent local storage for assets\n**Decision:** Use Dexie.js wrapper over IndexedDB\n**Consequences:**\n- ✅ Type-safe database operations\n- ✅ Promise-based API\n- ✅ Schema migrations support\n- ✅ Good browser support",
        tags: ["adr", "architecture", "decisions"],
        pinned: true,
        favorite: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: "manual",
      },
      {
        id: "coding-standards",
        type: "standard",
        title: "Coding Standards",
        content: "# Coding Standards\n\n## TypeScript\n- Strict mode enabled\n- No `any` - use `unknown` with type guards\n- Prefer `interface` over `type` for object shapes\n- Use `readonly` for immutable data\n- Prefer `const` assertions for literal types\n\n## React\n- Functional components only\n- Use `React.FC` sparingly - prefer plain functions\n- Colocate components with their hooks\n- Use `React.memo` for expensive renders\n- Prefer composition over inheritance\n\n## Styling\n- Tailwind CSS only - no custom CSS\n- Use design tokens (colors, spacing, radii)\n- Mobile-first responsive design\n- Dark mode only (premium theme)\n\n## File Organization\n- Feature-based folder structure\n- Barrel exports (`index.ts`) for public API\n- Colocate types with their feature\n- One component per file\n\n## Testing\n- Unit tests with Vitest\n- Component tests with React Testing Library\n- E2E tests with Playwright\n- Aim for >80% coverage on critical paths",
        tags: ["standards", "typescript", "react", "guidelines"],
        pinned: true,
        favorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: "manual",
      },
      {
        id: "api-contracts",
        type: "reference",
        title: "API Contracts",
        content: "# API Contracts\n\n## Internal APIs\n\n### Navigation Store\n```typescript\ninterface NavigationState {\n  activeModule: ModuleId;\n  activeParams: ModuleParams;\n  history: NavigationHistoryEntry[];\n  cursor: number;\n}\n```\n\n### Provider Store\n```typescript\ninterface ProviderState {\n  activeProviderId: ProviderId;\n  apiKeys: Partial<Record<ProviderId, string>>;\n}\n```\n\n### Provider Adapters\nAll providers implement:\n```typescript\ninterface AIProvider {\n  readonly id: string;\n  readonly label: string;\n  readonly models: string[];\n  readonly defaultModel: string;\n  configure(config: ProviderConfig): void;\n  getConfig(): ProviderConfig | null;\n  isConfigured(): boolean;\n  validateApiKey(apiKey: string): boolean;\n  testConnection(apiKey: string, model?: string): Promise<boolean>;\n  generate(ctx: GenerationContext, options?: GenerationOptions): Promise<GenerationResult>;\n}\n```\n\n## External APIs\n\n### OpenAI\n- Base URL: `https://api.openai.com/v1`\n- Auth: Bearer token\n- Models: gpt-4o, gpt-4o-mini, gpt-4-turbo\n\n### Anthropic\n- Base URL: `https://api.anthropic.com/v1`\n- Auth: `x-api-key` header\n- Models: claude-3-5-sonnet, claude-3-5-haiku\n\n### Google Gemini\n- Base URL: `https://generativelanguage.googleapis.com/v1beta`\n- Auth: API key as query param\n- Models: gemini-2.0-flash, gemini-1.5-pro",
        tags: ["api", "contracts", "reference"],
        pinned: false,
        favorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: "manual",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];