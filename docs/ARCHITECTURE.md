# AI Context Studio — Architecture Document

> **Document status**: Reference Architecture.
> Senior frontend architecture decision record (ADR-style summary at top, details below).

---

## 1. Executive Summary

### 1.1 Purpose
Build a modular, enterprise-grade web application — **AI Context Studio** —
fully focused on managing, building, and exporting **AI instruction assets**
(instruction files, prompt templates, personas, skills, workflows, memories,
MCP configurations). NOT a simple prompt library.

### 1.2 Product North Star
- Minimalistic, fast, smooth, modern.
- Design inspirations: **Linear + Raycast + Cursor + Vercel**.
- Dark premium UI, glassmorphism, subtle gradients, rounded cards, smooth animations.
- Everything component-based and production ready. Compose, don't inherit.

### 1.3 Core Constraint
The application must remain **modular and scalable** so that new AI assistant targets
(Claude, Cursor, Copilot, Gemini, Codex, OpenCode, Continue, Roo, etc.) and new providers
can be added **with zero layout changes**.

---

## 2. Technology Stack

### 2.1 Core
- **Runtime**: Next.js latest (App Router, Turbopack)
- **Language**: TypeScript (strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes)
- **Styling**: TailwindCSS v4 + CSS variables + `tailwind-merge` (via shadcn/ui)
- **Components**: shadcn/ui primitives (Radix UI under the hood)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Geist Sans, Geist Mono (Vercel fonts)

### 2.2 State
- **Local UI state**: Zustand (slices per domain)
- **Server / async state**: TanStack Query v5 (QueryClient, mutations, invalidation)
- **Form state**: React Hook Form + Zod resolver

### 2.3 Validation & Types
- **Schemas**: Zod (single-source-of-truth schemas → TS types via `z.infer`)
- **Domain types**: hand-rolled thin wrappers in `types/` for cross-module contracts

### 2.4 Persistence (local-first)
- **Primary**: IndexedDB via `dexie` (offline-first, browser-portable)
- **Secrets**: `localStorage` + Web Crypto API (encrypt API keys at rest)
- **Export/Import**: JSON + Markdown (per asset), ZIP bundle (workspace export)

### 2.5 Tooling
- ESLint (Next + TypeScript + React Hooks + import-resolver)
- Prettier (with `prettier-plugin-tailwindcss`)
- TypeScript strict tsconfig, path aliases `@/*` → `./src/*`
- Husky + lint-staged (guard against dirty commits)

### 2.6 Why not (rejected alternatives)
- Redux Toolkit → too heavy for local-first single-route app.
- React Context for global state → causes re-render storms.
- Express/REST server → not needed yet (local-first via IndexedDB).
- Tailwind plugins that depend on white → we commit to a fully dark theme to avoid light/dark branches.

---

## 3. Folder Structure

```
src/
  app/                          # Next.js App Router (routes, providers wrapper)
    layout.tsx                  # Root layout: fonts, theme, providers
    globals.css                 # Tailwind layers, CSS variables, base styles
    page.tsx                    # Entry (renders <WorkspaceShell/>)
  components/
    ui/                         # shadcn/ui primitives (Button, Dialog, DropdownMenu, …)
    layout/                     # Reusable structural components
      Sidebar/
      Topbar/
      MainWorkspace/
      WorkspaceShell/
      UserSection/
    common/                     # Cross-feature reused widgets
      EmptyState/
      Skeleton/
      Spinner/
      IconButton/
      Tooltip/
      CommandPalette/
    motion/                     # Framer Motion presets (variants, transitions)
  features/                     # One folder per product module
    dashboard/
    instruction-files/
    prompt-library/
    personas/
    skills/
    workflows/
    memories/
    configurations/
  hooks/                        # Generic cross-feature hooks
  services/                     # External/runtime service boundary
    providers/                  # AI provider adapters (implement interface)
    storage/                    # Dexie/IndexedDB wrappers
    crypto/                     # API key encryption
    export-import/              # JSON/Markdown/ZIP exporters
  types/                        # Domain models & contracts
  lib/                          # Framework glue (query client, zustand helpers)
  providers/                    # React context providers
  constants/                    # App-wide constants & registries
  styles/                       # Global styles, themes
  utils/                        # Pure helpers (cn, file, string, etc.)
```

### 3.1 Folder Discipline
- `components/` = UI only (no service calls, no domain state mutation).
- `features/` = self-contained vertical slices. Each may expose
  `index.ts` public API (barrel) so internal layout never leaks upward.
- `services/` = side-effect boundary. Only `services/` talks to IndexedDB / network / crypto.
- `hooks/` = reusable hooks with no feature coupling.
- `features/**/hooks/` = feature-scoped hooks, safe to colocate.

---

## 4. Cross-Cutting Architecture

### 4.1 Providers Tree (app-level React providers)
```
<QueryClientProvider>
  <ThemeProvider>          # dark theme only (per current spec)
  <ToasterProvider>        # (configurable toast system)
  <CommandPaletteProvider>  # (phase 8)
  <TooltipProvider>
    <AppInner/>            # consumes navigation + workspace shell
```

### 4.2 Navigation Model (Phase 3)
- Single Zustand store slice: `useNavigationStore` exposes:
  - `activeModule: ModuleId`
  - `activeParams: Record<string, unknown>` (e.g., selected agent instruction target)
  - `navigate(moduleId, params?)`
- Module Registry (`constants/modules.registry.ts`) maps `ModuleId → ModuleManifest`:
  ```ts
  type ModuleManifest = {
    id: ModuleId
    label: string
    icon: LucideIcon
    renderer: () => ReactNode   // lazy component
    order: number
  }
  ```
- `<MainWorkspace/>` reads active module from store and renders the registered
  renderer inside an `<AnimatePresence>` wrapper. **Future modules = a single
  registry entry — zero layout changes.**

### 4.3 State Slices (Zustand)
- `useNavigationStore` — active module/route params, history stack.
- `useUIStore` — sidebar collapse, command palette open, toasts queue.
- `useProviderStore` — selected provider, decrypted API keys (in-memory only).
- `useAssetStore` — cached asset lists (recent, pinned, favorites) — synced with IndexedDB.
- All slices are created via `create<…>()` and composed / split to keep bundles small.

### 4.4 Provider Adapter System (Phase 6)
```ts
// services/providers/types.ts
interface GenerationContext { /* target purpose, framework, etc. */ }
interface GenerationResult { /* generated asset payload */ }
interface AIProvider {
  readonly id: ProviderId
  readonly label: string
  generate(ctx: GenerationContext): Promise<GenerationResult>
  testConnection(apiKey: string): Promise<boolean>
}
```
- `services/providers/{openai,claude,gemini,deepseek,openrouter,nvidia,ollama}.ts`
  each default-exports a class implementing `AIProvider`.
- `services/providers/registry.ts` maps `ProviderId → () => Promise<AIProvider>` (lazy).
- UI (sidebar "API Provider" dropdown) only knows `ProviderId`; never imports adapters
  directly. Switching provider = switching registry entry.

### 4.5 Prompt Generation Engine (Phase 7)
- `services/engine/templates/` contains reusable templated fragments
  (purpose, framework, language, coding style, project type, architecture,
  experience level, testing framework, deployment target, conventions).
- Templates are **functions of structured data**, not strings:
  ```ts
  type PromptContext = { purpose: Purpose; targetAI: TargetAI; framework?: string; … }
  type OutputKind = 'system-prompt' | 'instruction-file' | 'prompt-template'
                  | 'context-file' | 'memory' | 'workflow'
  interface PromptEngine {
    render(kind: OutputKind, ctx: PromptContext): GeneratedAsset
  }
  ```
- No hardcoded text anywhere except inside the `templates/` module itself.

### 4.6 Data Model (Overview)
```ts
type AssetKind =
  | 'instruction-file' | 'prompt-template' | 'persona' | 'skill'
  | 'workflow' | 'memory' | 'mcp-config'

interface Asset {
  id: string                 // uuid v4
  kind: AssetKind
  scope: 'personal' | 'shared'
  category?: string          // e.g., Programming / Writing
  tags: string[]
  favorite: boolean
  pinned: boolean
  createdAt: string
  updatedAt: string
  body: unknown              // discriminated by `kind` (Zod schema)
}
```
Persisted in IndexedDB `assets` table via Dexie. `tags`, `kind`, `category` indexed.

### 4.7 Resilience & Security
- **API keys** never touch IndexedDB encrypted-only buckets; decrypted at runtime in
  memory within `useProviderStore`. Use Web Crypto AES-GCM with a session key.
- **Error handling** via shared `<ErrorBoundary>` per module + toast resolver.
- **Performance**: virtualize Recent Files list after 200 rows; dynamic import modules.

---

## 5. Design System (Dark Premium)

### 5.1 Tokens (`styles/tokens.css`)
- Surfaces, elevation shades (0..5), glass overlay alpha, border alpha.
- Accent gradient stops (primary, secondary, tertiary).
- Motion timings: `--ease-spring`, `--dur-fast 160ms`, `--dur-base 220ms`,
  `--dur-slow 320ms`.
- Typography scale: display/md, title/lg, body/base, mono for code blocks.

### 5.2 Component DNA
- Cards: `rounded-2xl`, soft inner `shadow-inner`, subtle gradient stroke
  (`before:` pseudo with `bg-gradient` + `mask` to render a 1px gradient border).
- Glassmorphism: `bg-white/5 backdrop-blur-xl border border-white/10`
  used **sparingly** (Topbar, Command Palette, modals) for premium feel.
- Hover micro-interactions: `scale-1.01` + gradient overlay reveal — Framer Motion variants.

### 5.3 Motion Presets (`components/motion/`)
- `fade-in`, `slide-up`, `card-hover`, `list-stagger` exported as
  `Variants` objects. Importing a preset is the only allowed way to animate.

---

## 6. Testing Strategy (reserved for later phases)

- Unit: Vitest on `utils/`, `services/engine/templates/`, `services/providers/` adapters.
- Component: Testing Library + `msw` for provider HTTP responses.
- E2E: Playwright on critical flows (create instruction file, generate prompt).
- Accessibility: `axe-playwright` in E2E. Keyboard shortcuts tested explicitly.

> Phase 1 explicitly excludes pages/testing scaffolding (per spec), but the
> architecture is test-ready.

---

## 7. Phase-by-Phase Mapping

| Phase  | Scope summary                                      | New folders/touched folders                                |
|--------|----------------------------------------------------|------------------------------------------------------------|
| 1      | Foundation, tooling, theme, layout-only components | entire scaffolding                                          |
| 2      | Dashboard (sidebar/main/topbar)                    | `features/dashboard`                                       |
| 3      | Navigation (module registry + Zustand)             | `hooks/useNavigation`, `constants/modules.registry.ts`    |
| 4      | Instruction File module                            | `features/instruction-files`                                |
| 5      | Prompt Library                                     | `features/prompt-library`                                  |
| 6      | AI Provider adapters + secure keys                 | `services/providers`, `services/crypto`                    |
| 7      | Prompt generation engine (refactor/no hardcoded)  | `services/engine/templates`                                |
| 8      | Polish (a11y, perf, skeletons, cmd palette, etc.) | cross-cutting `components/common`, `hooks/useKeyboard`      |

---

## 8. Architectural Decisions & Risks

### 8.1 Decisions
1. **Next App Router** chosen for native code-splitting of modules (lazy registry entries).
2. **Barrel files (`index.ts`)** at every feature boundary to lock internal API surface.
3. **Composed providers over context** keeps re-renders scoped; Zustand selectors used in components.
4. **Schema-first (Zod)** for every persisted asset to enforce runtime safety + derive TS types.
5. **Provider Ids (string unions)** kept in `types/`, never symbols — easier persistence.

### 8.2 Risks & Mitigations
- **R1 Layout shifts between modules** → keep `<MainWorkspace/>` height stable via CSS grid; only inner content animates.
- **R2 Provider leakage into UI layer** → build a `useProvider()` façade that consumes the registry only.
- **R3 Hardcoded prompts creeping in** → ESLint rule disallows string literal returns in `services/engine/plumbing`.
- **R4 API key leakage** → never log, never include in exported JSON, always redacted in toasts.
- **R5 Disk quota on IndexedDB** → periodic compaction job, optional export cleanup.

---

## 9. Verification Acceptance (each phase)

- Phase 1: `npm run lint && npm run typecheck && npm run build` pass; layout-only story renders.
- Phase 2: Dashboard responsive at 320/768/1024/1440 px; hover animations present.
- Phase 3: Clicking any module swaps content with NO `next/navigation` calls or reloads.
- Phase 4: Instruction File split view renders `target-specific` reference syntax from a data file.
- Phase 5: Prompt Library search/favorites/copy/export all functional offline.
- Phase 6: Switching selected provider adapter changes generation behavior via DI — no `if/switch` in UI.
- Phase 7: Changing any `PromptContext` field regenerates all 6 output kinds without code edits.
- Phase 8: Lighthouse a11y/perf ≥ 95; keyboard parity for all primary actions.

---

## 10. Out of Scope (explicit, to avoid scope creep)

- User auth / multi-user sync (local-first single user assumed for now).
- Backend server (added only when Phase 6+ requires optional cloud sync).
- Real-time collaboration.
- Mobile native shell.
