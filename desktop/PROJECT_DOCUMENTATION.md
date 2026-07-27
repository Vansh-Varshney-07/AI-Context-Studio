# AI Context Studio — Complete Project Documentation

## Executive Summary

**AI Context Studio** is a premium, production-ready web application for AI instruction engineering. It enables developers and teams to create, manage, and export structured AI assets (instruction files, prompt templates, personas, skills, workflows, memories, and MCP configurations) for multiple AI coding assistants.

**Stack**: Next.js 16 (App Router), TypeScript strict, Tailwind CSS v4, Zustand, TanStack Query, React Hook Form + Zod, Framer Motion, IndexedDB (Dexie), 7 AI provider adapters.

---

## Architecture Overview

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with Geist fonts
│   ├── page.tsx           # Root route with Suspense boundary
│   └── [...slug]/page.tsx # Catch-all for direct module links
├── components/
│   ├── ui/                # Design system primitives (Button, Input, Card, Select, etc.)
│   ├── layout/            # AppShell, Sidebar, Topbar, WorkspaceShell
│   ├── common/            # EmptyState, Tag, CommandPalette
│   └── motion/            # Framer Motion presets
├── features/              # Domain modules (registry-driven)
│   ├── dashboard/         # Hero, QuickStart, RecentFiles
│   ├── instruction-files/ # Target rail + reference syntax + custom generator
│   ├── prompt-library/    # 36 seed templates, 6 categories, AI enhance
│   ├── system-prompt-engine/ # 6 blueprints, structured form, AI enhance
│   ├── skills/            # 7 seed skills, CRUD, detail pane
│   └── [personas,workflows,memories,configurations]/ # Coming Soon
├── hooks/                 # Cross-cutting hooks
│   ├── use-module-renderers.ts
│   ├── use-ai-engine.ts   # Local + AI generation
│   ├── use-storage.ts     # IndexedDB persistence
│   └── use-keyboard.ts    # Command palette shortcuts
├── lib/                   # Zustand stores, QueryClient
│   ├── navigation-store.ts   # Module + params + URL sync
│   └── provider-store.ts     # Active provider + API keys
├── providers/             # React context providers
│   ├── app-providers.tsx
│   └── toaster-provider.tsx
├── services/              # External integrations
│   ├── providers/         # 7 AI adapters (OpenAI, Anthropic, Google, DeepSeek, OpenRouter, NVIDIA, Ollama)
│   ├── storage/           # IndexedDB (Dexie) - assets, keys, exports
│   └── crypto/            # AES-GCM encryption for API keys
├── types/                 # Domain contracts
│   ├── domain.ts          # AgentInstructionTarget, PromptCategory
│   ├── navigation.ts      # ModuleId, ModuleParams
│   └── provider.ts        # ProviderId, GenerationContext, GenerationResult
├── constants/             # Registries
│   ├── modules.registry.ts      # 9 modules
│   ├── instruction-targets.ts   # 9 AI targets
│   ├── prompt-categories.ts     # 6 categories × subcategories
│   └── providers.ts             # 7 providers
└── utils/                 # cn, uuid, date, file, slugify
```

---

## Feature Modules (Implemented)

### 1. Dashboard
- Hero with quick actions (Instruction Files, Prompt Library, System Prompt Engine)
- Quick Start cards (6 module shortcuts)
- Recent files panel (sample data)

### 2. Instruction Files (Phase 4)
- **Target Rail**: 9 AI targets (Claude, Cursor, Copilot, Gemini, Codex, OpenCode, Continue, Roo, General)
- **Reference Syntax View**: Official structure per target (collapsible sections)
- **Custom Generator**: Dynamic form per target → dummy generator → preview
- **Resizable panes**: Collapse/expand/maximize each pane

### 3. Prompt Library (Phase 5)
- **Sidebar**: Category pills (6), subcategory list, search, filters (favorites, recent)
- **Editor**: Split view — Reference (read-only) | Custom Builder (variable substitution)
- **36 seed templates** across 6 categories × subcategories
- **AI Enhance**: Streams polished version via selected provider

### 4. System Prompt Engine (Phase 7)
- **12 structured fields** with controlled vocabularies (purpose, target AI, framework, language, style, project type, architecture, experience, testing, deployment, conventions, custom)
- **6 Blueprint Kinds**: system-prompt, instruction-file, prompt-template, context-file, memory, workflow
- **Declarative blueprints** — section builders declare `consumes: EngineFieldId[]`
- **Two-tier generation**: Local (instant) → AI Enhanced (streaming)
- **Save/Load** to IndexedDB

### 5. Skills (Phase 7+)
- 7 seed skills (refactor, test-gen, code-review, docs, dockerfile, sql-optimize)
- Category sidebar, search, detail pane with params/examples
- Create modal with system prompt editor

### 6. Coming Soon (Registry entries only)
- Personas, Workflows, Memories, Configurations

---

## AI Provider Integration (Phase 6 + 9)

### Provider Store (`lib/provider-store.ts`)
- `activeProviderId` — currently selected provider
- `apiKeys: Partial<Record<ProviderId, string>>` — in-memory session keys
- `setActiveProvider(id)`, `setApiKey(id, key)`, `hasApiKey(id)`

### 7 Built-in Adapters (`services/providers/`)
| Provider | ID | Models | Auth |
|----------|-----|--------|------|
| OpenAI | `openai` | gpt-4o, gpt-4o-mini, gpt-4-turbo | `sk-` |
| Anthropic | `claude` | claude-3.5-sonnet, haiku, opus | `sk-ant-` |
| Google | `gemini` | gemini-2.0-flash, 1.5-pro, 1.5-flash | API Key |
| DeepSeek | `deepseek` | deepseek-chat, deepseek-reasoner | `sk-` |
| OpenRouter | `openrouter` | claude-3.5-sonnet, gpt-4o, gemini-2.0 | `sk-or-` |
| NVIDIA | `nvidia` | llama-3.1-405b, nemotron-3-ultra | API Key |
| Ollama | `ollama` | llama3.1:70b, codellama:34b, qwen2.5-coder | Local (no key) |

### Generation Flow (`hooks/use-ai-engine.ts`)
```typescript
// 1. Local blueprint (instant, deterministic)
const localOutput = renderBlueprint(kind, answers)

// 2. If provider configured → AI enhancement
if (apiKey) {
  const provider = getProvider(activeProviderId)
  provider.configure({ apiKey, model })
  
  const ctx = {
    ...answers,           // all 12 structured fields
    localBlueprint: localOutput.content  // sent as reference
  }
  
  const result = await provider.generate(ctx, options, kind)
  // Returns EngineOutput with AI-refined content
}
```

**Key Point**: The local blueprint content is passed as `localBlueprint` in the GenerationContext. Each provider's `buildUserPrompt` includes this blueprint so the AI refines rather than fabricates.

---

## URL-Based Navigation (Phase 8)

### Navigation Store (`lib/navigation-store.ts`)
- Single source of truth: `activeModule`, `activeParams`
- History stack with cursor for back/forward
- `navigate(moduleId, params?)`

### URL Sync Component (`NavigationSync`)
- Reads `pathname` + `searchParams` on mount
- On store change → `router.push()` to update URL
- Browser back/forward → `popstate` → `searchParams` change → sync store

### URL Patterns
```
/                          → dashboard
/instruction-files         → instruction-files
/instruction-files?target=copilot
/prompt-library            → prompt-library
/system-prompt-engine      → system-prompt-engine
/system-prompt-engine?purpose=...
/skills                    → skills
```

### Catch-all Route
`app/[...slug]/page.tsx` renders `<AppShell />` inside `<Suspense>` for direct links / refresh.

---

## Persistence (Phase 10)

### IndexedDB Schema (`services/storage/index.ts`)
```typescript
// assets store
{ id, kind, title, description, category, tags[], favorite, pinned, content, metadata, createdAt, updatedAt }

// keys store  
{ id, providerId, encryptedKey, createdAt }

// exports store
{ id, name, assets[], format, createdAt }
```

### Hooks (`hooks/use-storage.ts`)
- `save(kind, title, content, options)`
- `load(id)`, `loadAll()`, `loadByKind(kind)`
- `remove(id)`

### Usage
- System Prompt Engine: "Save" / "Load" in preview footer
- Future: all modules persist to same asset store

---

## Design System

### Color Palette (Light, Warm, Editorial)
```css
/* Primary Background — Warm Beige */
--color-bg-primary: #F5F1E8

/* Secondary Background — Soft Sage */
--color-bg-secondary: #E7EFE6

/* Tertiary Background — Cream */
--color-bg-tertiary: #FAF7F2

/* Accent — Forest Green */
--color-accent: #4F7A5A
--color-accent-hover: #446B4E
--color-accent-light: #E7EFE6

/* Text */
--color-text-primary: #222222
--color-text-secondary: #6B6B6B
--color-text-muted: #9B9B9B

/* Borders */
--color-border: #DDD7CC
--color-border-strong: #D0C8BB
--color-border-subtle: #E8E3D9

/* Status */
--color-success: #5F8D4E
--color-warning: #D8A84E
--color-error: #D16666
```

### Typography
- **Font**: Geist Sans / Geist Mono (Next.js `next/font/google`)
- **Scale**: 8px base grid
- **Weights**: 400 (body), 500 (labels), 600 (headings)
- **Line heights**: tight (1.1), snug (1.375), normal (1.5), relaxed (1.625)

### Spacing & Radius
- **Base unit**: 8px (`--space-2`)
- **Radiuses**: 6px (sm), 10px (md), 14px (lg), 18px (xl), 24px (2xl)

### Shadows (Subtle)
- `shadow-xs`: 0 1px 2px rgba(34,34,34,0.04)
- `shadow-sm`: 0 1px 3px rgba(34,34,34,0.06)
- `shadow-md`: 0 4px 8px rgba(34,34,34,0.06)
- `shadow-lg`: 0 8px 24px rgba(34,34,34,0.07)

### Component Variants
| Component | Variants |
|-----------|----------|
| Button | primary, secondary, ghost, danger, outline, subtle |
| Button | sm, md, lg, icon |
| Input | sm, md, lg |
| Badge | default, accent, success, warning, error, muted |
| Card | bordered, elevated |

---

## API Key Handling — Verified Working

### Flow
1. User selects provider in sidebar dropdown
2. Enters API key → clicks **"Load"**
2. `SidebarApiConfig.onValid()` → `setActiveProvider(id)` + `setApiKey(id, key)`
3. Key stored in `ProviderStore.apiKeys[id]` (in-memory, session-only)
4. User switches module → `NavigationSync` keeps URL/module in sync
5. In **System Prompt Engine** or **Prompt Library** → click **"Enhance with AI"**
6. `useAIEngine.generate()` reads `apiKeys[activeProviderId]` from store
7. Provider configured with key → streams response → updates preview

### Verification Points
- ✅ Key stored in `ProviderStore.apiKeys[providerId]`
- ✅ `useAIEngine` reads `apiKeys[activeProviderId]` before generation
- ✅ Provider `configure({ apiKey, model })` called before `generate()`
- ✅ Streaming via `onStream` callback updates preview in real-time
- ✅ Falls back to local blueprint if no key / provider error
- ⚠️ Keys are **session-only** (cleared on reload) — by design for security
- ⚠️ No server-side persistence — client-only app

---

## Running the Project

```bash
# Install dependencies
npm install

# Development server
npm run dev
# → http://localhost:3000

# Production build
npm run build
# → .next/ output

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

### Environment
- No `.env` required for core features
- Optional: `NEXT_PUBLIC_*` for future server features
- All AI calls go **directly from browser** to provider APIs

---

## Extending the Project

### Add a New Module (e.g., "Snippets")
1. Add `snippets` to `ModuleId` union in `types/navigation.ts`
2. Add manifest to `constants/modules.registry.ts` (icon, order, description)
3. Create `src/features/snippets/` with module component
4. Register renderer in `hooks/use-module-renderers.ts`
5. Done — appears in sidebar automatically

### Add a New AI Provider
1. Create `services/providers/xyz-provider.ts` extending `BaseProvider`
2. Register in `services/providers/registry.ts`
3. Add to `constants/providers.ts` array
4. Done — appears in sidebar dropdown

### Add a New Output Kind to System Prompt Engine
1. Create `features/system-prompt-engine/blueprints/new-kind.ts`
2. Export `EngineBlueprint` with section builders
3. Add to `ENGINE_BLUEPRINTS` in `blueprints/index.ts`
4. Done — appears in OutputKind tabs automatically

### Add a New Structured Field
1. Add to `EngineFieldId` union in `features/system-prompt-engine/types.ts`
2. Add definition to `ENGINE_FIELDS` in `fields.ts`
3. Declare in blueprint section `consumes` arrays
5. Done — appears in form automatically

---

## Known Limitations & Future Work

| Area | Status | Notes |
|------|--------|-------|
| API Key Persistence | Session-only | By design; could add encrypted localStorage |
| Server-Side Rendering | Partial | Only root layout is SSR; modules are client-only |
| Testing | None | No test suite configured |
| Accessibility | Partial | Basic ARIA, needs audit |
| Mobile Layout | Basic | Sidebar collapses, some grids need refinement |
| Export/Import | Schema only | UI not built |
| Collaboration | None | Single-user only |
| Prompt Library AI | Uses same engine | Could have dedicated blueprints |
| Skill/Workflow Execution | UI only | No runtime engine |

---

## File Structure Quick Reference

```
D:\AI-Lab\workspace_2
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── .eslintrc.json
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css          # Design system tokens
│   │   └── [...slug]/page.tsx   # Catch-all
│   ├── components/
│   │   ├── ui/                  # 15+ primitives
│   │   ├── layout/              # Shell, Sidebar, Topbar
│   │   ├── common/              # Shared
│   │   └── motion/              # Framer presets
│   ├── features/
│   │   ├── dashboard/
│   │   ├── instruction-files/   # TargetRail + RefSyntax + Generator
│   │   ├── prompt-library/      # Sidebar + Editor + AI
│   │   ├── system-prompt-engine/ # 6 blueprints + form + preview
│   │   ├── skills/              # CRUD + detail
│   │   └── [placeholders]
│   ├── hooks/
│   ├── lib/                     # Stores
│   ├── providers/
│   ├── services/
│   │   ├── providers/           # 7 adapters
│   │   ├── storage/             # IndexedDB
│   │   └── crypto/              # AES-GCM
│   ├── types/
│   ├── constants/
│   └── utils/
└── public/
```

---

## Quick Start for New Developers

1. **Clone & Install**: `git clone ... && cd workspace_2 && npm install`
2. **Run Dev**: `npm run dev` → open `localhost:3000`
3. **Explore**:
   - Click **Instruction Files** → pick a target → see reference syntax → fill generator
   - Click **Prompt Library** → browse categories → select template → click "Enhance with AI"
   - Click **System Prompt Engine** → fill fields → click "Local" (instant) or "Enhance with AI"
   - Click **Skills** → browse → view detail → "Create Skill"
4. **Add API Key**: Sidebar → select provider → paste key → **Load** → use AI features
5. **Extend**: Follow "Extending the Project" section above

---

## License

MIT — Internal tooling for AI Context Studio. Built with modern React/Next.js patterns for maintainability and extensibility.

---

*Document generated from codebase analysis. Last updated: 2025-07-18*