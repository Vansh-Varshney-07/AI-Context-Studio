# RELEASE_TODO.md
## AI Context Studio — Final Release Audit & Task Breakdown

**Generated**: 2026-07-26
**Project Version**: 0.1.0 → Target: 1.0.0
**Audit Scope**: Complete codebase — frontend (Next.js 16 + React 19 + TypeScript), desktop (Tauri v2 + Rust), deployment, marketplace architecture

---

## AUDIT SUMMARY

### Current State
- **Stack**: Next.js 16.2.10, React 19.2.4, TypeScript 5 (strict), Tailwind CSS v4, Zustand, TanStack Query, Framer Motion, Radix UI, IndexedDB (idb)
- **Frontend**: 14 feature directories, 4 Zustand stores, 9 AI provider adapters, IndexedDB storage layer, AES-GCM encryption
- **Desktop (src-tauri)**: **DOES NOT EXIST** — must be built from scratch (Tauri v2 + Rust)
- **Tests**: Zero unit tests, zero E2E tests, zero Rust tests
- **CI/CD**: No GitHub Actions, no Vercel config, no deployment automation
- **SEO**: Default create-next-app assets only (placeholder SVGs, no favicon, no manifest, no sitemap, no robots.txt)
- **Docs**: Default create-next-app README, no CHANGELOG, no CONTRIBUTING, no LICENSE

### Key Findings
1. **6 modules have empty seed data** — `prompt-library`, `workflows`, `personas`, `mcp` catalog, and 2 modules don't exist at all (`configurations`, `search`)
2. **Dead UI**: multiple `onClick={() => {}}` buttons, "Coming Soon" text, false-success toasts
3. **Type duplication**: `types/provider.ts` vs `services/providers/types.ts` — divergent definitions
4. **No Tauri desktop layer** — entire `src-tauri/` must be created (Rust backend, commands, MCP integration, filesystem)
5. **No deployment infrastructure** — zero CI, zero SEO, zero release automation

---

## PHASE 1: ARCHITECTURE AUDIT — ✅ COMPLETE

> Audit performed. Results documented above. No code changes.

---

## PHASE 2: CODE CLEANUP

### P0 — Critical

| # | Task | Difficulty | Risk | Dependencies | Est. Time |
|---|------|-----------|------|-------------|-----------|
| 2.1 | Remove `optimizer-module.tsx.new` stale staging file | Trivial | None | None | 5 min |
| 2.2 | Remove `validator-module.tsx.new` stale staging file | Trivial | None | None | 5 min |
| 2.3 | Remove all `console.log` / `console.warn` / `console.error` statements (none found in src/ — verify across all directories) | Trivial | None | None | 10 min |
| 2.4 | Remove `Heading` placeholder import hack at `modules.registry.ts:145-149` (Replace with real usage or remove the export) | Low | Low | None | 15 min |
| 2.5 | Consolidate duplicate type definitions: `types/provider.ts` vs `services/providers/types.ts` — pick ONE canonical location, make the other re-export | Medium | Medium | None | 1h |
| 2.6 | Consolidate duplicate `Asset` type: `services/storage/index.ts` `Asset` vs `types/asset.ts` `Asset<TBody>` — create adapter or unify | Medium | High | 2.5 | 1.5h |
| 2.7 | Remove `.gitkeep` files from feature directories that now have content (dashboard, instruction-files, memories, personas, prompt-library, skills, workflows) | Trivial | None | None | 10 min |
| 2.8 | Fix JSDoc lie in `hooks/types.tsx:22-23` — claims `lazy()` code-splitting but `use-module-renderers.ts` uses static imports. Either implement lazy() or correct the comment | Low | Low | None | 30 min |

### P1 — Required

| # | Task | Difficulty | Risk | Dependencies | Est. Time |
|---|------|-----------|------|-------------|-----------|
| 2.9 | Remove duplicate UUID fallback logic in `providers/toaster-provider.tsx:26-29` — import from `utils/uuid.ts` instead | Trivial | None | None | 10 min |
| 2.10 | Extract shared SSE streaming reader (~25 lines duplicated in 5 providers) into `BaseProvider` method | Medium | Medium | None | 1.5h |
| 2.11 | Add streaming support to `google-provider.ts` (only provider missing it) | Medium | Low | 2.10 | 1h |
| 2.12 | Remove `services/export-import/.gitkeep` placeholder and either build the service or remove the directory + IndexedDB `exports` store | Medium | Medium | None | 1h |
| 2.13 | Remove `styles/.gitkeep` and `configurations/.gitkeep` empty directories | Trivial | None | None | 5 min |

### P2 — Recommended

| # | Task | Difficulty | Risk | Dependencies | Est. Time |
|---|------|-----------|------|-------------|-----------|
| 2.14 | Extract common UUID-creation pattern across `toaster-provider.tsx`, `memories-module.tsx`, etc. to use `utils/uuid.ts` | Trivial | None | None | 20 min |
| 2.15 | Remove redundant re-sort in `services/storage/index.ts:getRecentAssets()` (already uses `by-updated` index) | Trivial | None | None | 10 min |
| 2.16 | Rename misleading "Demo skills data" comment at `skills-module.tsx:455` to "Seed skills data" | Trivial | None | None | 2 min |
| 2.17 | Fix `tsconfig.tsbuildinfo` tracking — confirm it's gitignored (pattern `*.tsbuildinfo` exists) and remove from git if committed | Trivial | None | None | 5 min |

### P3 — Future

| # | Task | Difficulty | Risk | Dependencies | Est. Time |
|---|------|-----------|------|-------------|-----------|
| 2.18 | Add `exactOptionalPropertyTypes` to tsconfig (referenced in docs/ARCHITECTURE.md but not set) | Low | Medium | 2.5 | 2h |
| 2.19 | Add retry/backoff/timeout/rate-limiting to AI provider calls | High | Medium | 2.10 | 4h |

---

## PHASE 3: FRONTEND POLISH

### P0 — Critical

| # | Task | Difficulty | Risk | Dependencies | Est. Time |
|---|------|-----------|------|-------------|-----------|
| 3.1 | **Workflows module** — Fix dead create form: `value=""` + `onChange={() => {}}` at lines 547, 558, 570 — make inputs functional | Medium | High | 2.1 | 2h |
| 3.2 | **Workflows module** — Wire `onSubmit` at line 539 to actually create a workflow (replace `onSubmit({})` no-op) | Medium | High | 3.1 | 1.5h |
| 3.3 | **Workflows module** — Remove "Step Builder (Coming Soon)" text + "will be available in the next phase" at lines 577-578 — either implement step builder or show empty-state with CTA | High | Medium | 3.1 | 3h |
| 3.4 | **Workflows module** — Populate `SEED_WORKFLOWS` at `data.ts:6` (currently `[]`) with real sample workflows | Medium | Low | 3.2 | 1.5h |
| 3.5 | **Prompt Library module** — Populate `SEED_PROMPTS` at `seed.ts:11` (currently `[]`) — add real prompt templates for all 6 categories and subcategories | Medium | Low | None | 4h |
| 3.6 | **Personas module** — Populate `SEED_PERSONAS` at `personas-module.tsx:55` (currently `[]`) with real persona blueprints | Medium | Low | None | 2h |
| 3.7 | **Personas module** — Fix `onAnswer={() => {}}`, `onSubmit={() => {}}` no-ops at line 383 (builder fallback path) — wire to state | Medium | High | 3.6 | 1.5h |
| 3.8 | **Personas module** — Fix "Run" action showing `(demo)` toast at line 273 — implement or hide the button | Medium | Medium | 3.7 | 1h |
| 3.9 | **Personas module** — Fix `onChange={() => {}}` dead input at line 624 | Low | Medium | 3.7 | 30 min |
| 3.10 | **Memories module** — Fix `onEdit={() => {}}` no-op at line 197 — implement edit flow | Medium | High | None | 2h |
| 3.11 | **Memories module** — Fix `onDelete` showing "Delete not implemented yet" toast at line 198 — implement delete | Medium | High | 3.10 | 1h |
| 3.12 | **Memories module** — Fix false-success toast "Created" at line 201 — wire `onSubmit` to IndexedDB persistence | Medium | High | 3.10 | 1.5h |
| 3.13 | **Memories module** — Fix `onSubmit={() => {}}` no-op at line 275 (second builder instance) | Low | Medium | 3.12 | 30 min |
| 3.14 | **Validator module** — Fix "Strict mode" `<Switch checked={false} onCheckedChange={() => {}}>` at lines 716-718 — either wire to state or remove | Low | Medium | None | 45 min |
| 3.15 | **Validator module** — Fix dead `onClick={() => {}}` buttons at lines 312, 834 | Low | Low | None | 20 min |
| 3.16 | **Optimizer module** — Fix 3 dead `<Button onClick={() => {}}>` at `PromptEditor.tsx:331, 349, 353` | Low | Low | None | 30 min |
| 3.17 | **Optimizer module** — Fix empty-state "Get Started" button at lines 341-346 — wire or remove | Low | Low | None | 20 min |
| 3.18 | **Dashboard module** — Replace hardcoded `sampleRecent()` mock data at line 86, 106-159 with real IndexedDB-backed recent files | Medium | Medium | 2.6 | 2h |
| 3.19 | **Dashboard module** — Fix "View all" button missing `onClick` at `recent-files.tsx:39-41` | Low | Low | 3.18 | 15 min |
| 3.20 | **Dashboard module** — Fix "Create your first file" button missing `onClick` at `recent-files.tsx:50-53` | Low | Low | 3.18 | 15 min |
| 3.21 | **MCP module** — Populate `MCP_SERVER_CATALOG` at `data/seed-servers.ts:12` (currently `[]`) with real MCP server definitions | Medium | Low | None | 3h |

### P1 — Required

| # | Task | Difficulty | Risk | Dependencies | Est. Time |
|---|------|-----------|------|-------------|-----------|
| 3.22 | **Configurations module** — Currently only `.gitkeep`. The registry maps `configurations` → MCP Manager (module exists as `mcp-module.tsx`). Verify naming mismatch: registry says "MCP Manager" id "configurations" — either create separate configurations module or fix registry mapping | Medium | Medium | None | 1h |
| 3.23 | **Settings module** — Does not exist. Create `src/features/settings/settings-module.tsx` with app settings (theme, API key management, data export/import, about info) | High | Medium | None | 4h |
| 3.24 | **Search feature** — Currently no `src/features/search/` directory. Create search module with cross-module asset search | High | Medium | 6.1-6.5 | 6h (see Phase 6) |
| 3.25 | **Instruction Files module** — Replace "Dummy engine" tag at `custom-generator.tsx:78` with actual AI integration or relabel as "Local engine" | Medium | Low | None | 1h |
| 3.26 | **Instruction Files module** — Replace "Generated by AI Context Studio (dummy engine)" literal at `generator.ts:46` with real AI or remove the string | Low | Low | 3.25 | 15 min |
| 3.27 | Remove `ComingSoon` component usage from any module that ships (verify none currently render for registered modules) | Trivial | None | 3.1-3.26 | 30 min |

### P2 — Recommended

| # | Task | Difficulty | Risk | Dependencies | Est. Time |
|---|------|-----------|------|-------------|-----------|
| 3.28 | Audit and fix all loading states — ensure skeleton/spinner on async operations (AI generation, storage ops) | Medium | Low | None | 3h |
| 3.29 | Audit and fix all empty states — ensure every empty list shows actionable empty-state UI, not blank | Medium | Low | None | 2h |
| 3.30 | Audit responsive behavior — mobile sidebar drawer, grid breakpoints, text truncation on small screens | Medium | Medium | None | 3h |
| 3.31 | Audit typography hierarchy — consistent h1-h6, body text, caption sizes across modules | Low | Low | None | 1.5h |
| 3.32 | Audit animation — ensure Framer Motion entrance/exit transitions are consistent and respect `prefers-reduced-motion` | Medium | Low | None | 2h |

### P3 — Future

| # | Task | Difficulty | Risk | Dependencies | Est. Time |
|---|------|-----------|------|-------------|-----------|
| 3.33 | Add keyboard navigation indicators (focus rings, skip links) across all interactive elements | Medium | Low | Phase 7 | 2h |
| 3.34 | Add toast/error boundary for all async error states (currently silent failures possible) | Medium | Medium | None | 3h |

---

## PHASE 4: DESKTOP POLISH — BUILD SRC-TAURI FROM SCRATCH

> **CRITICAL**: `src-tauri/` directory does not exist. Must create entire Tauri v2 + Rust backend.

### P0 — Critical (Desktop App Must Work)

| # | Task | Difficulty | Risk | Dependencies | Est. Time |
|---|------|-----------|------|-------------|-----------|
| 4.1 | **Install Tauri v2 CLI** — `npm install -D @tauri-apps/cli@^2` and `npm install @tauri-apps/api@^2` + plugins (dialog, fs, shell, opener) | Trivial | None | None | 30 min |
| 4.2 | **Create `src-tauri/Cargo.toml`** — manifest with deps: `tauri` 2.x, `serde`, `serde_json`, `tokio`, `tauri-plugin-dialog`, `tauri-plugin-fs`, `tauri-plugin-shell`, `tauri-plugin-opener`, `rmcp` (MCP), `zip` | Medium | Medium | 4.1 | 1h |
| 4.3 | **Create `src-tauri/src/main.rs`** — Tauri entry point with `Builder::default()`, plugin registration (dialog, fs, shell, opener), command handler (`invoke_handler`), sync `.setup()` closure | High | Medium | 4.2 | 2h |
| 4.4 | **Create `src-tauri/tauri.conf.json`** — v2 config: productName, identifier (com.ai-context-studio), app windows (1200x800, min size, decorations), security CSP, bundle settings (NSIS for Windows, DMG for macOS, AppImage for Linux), updater config | Medium | High | 4.2 | 1.5h |
| 4.5 | **Create `src-tauri/capabilities/default.json`** — Tauri v2 capability/permissions file: allow dialog (open, save), fs (read, write scoped to app dirs), shell (open), opener (urls, files) | Medium | High | 4.3 | 1h |
| 4.6 | **Create `src/services/platform/` directory** — platform abstraction layer that detects Tauri vs web using `@tauri-apps/api` `isTauri()` check; exposes: `readFile()`, `writeFile()`, `showSaveDialog()`, `showOpenDialog()`, `openExternal()`, `copyToClipboard()` that dispatch to Tauri commands or web fallbacks | High | High | 4.3 | 4h |
| 4.7 | **Create Tauri commands in `src-tauri/src/`**: `read_file(path)`, `write_file(path, content)`, `save_file_dialog(content, defaultName)`, `open_file_dialog(filters)`, `open_url(url)`, `copy_clipboard(text)`, `get_app_data_dir()` | High | Medium | 4.3 | 3h |
| 4.8 | **Wire frontend platform service** — update `src/utils/file.ts` `downloadFile()` and `copyToClipboard()` to use `src/services/platform/` abstraction instead of browser-only `Blob`/`navigator.clipboard` | Medium | High | 4.6, 4.7 | 2h |
| 4.9 | **Add `tauri:dev` and `tauri:build` scripts** to `package.json`: `tauri:dev` uses `cross-env TAURI=1 next dev`, `tauri:build` uses `cross-env TAURI=1 next build && tauri build` | Trivial | None | 4.1 | 15 min |
| 4.10 | **Update `next.config.ts`** — add `output: isTauri ? "export" : undefined` for static export when building desktop; add `images: { unoptimized: isTauri }` | Low | Low | 4.9 | 15 min |
| 4.11 | **Build & verify** — run `cargo tauri dev` (debug), verify desktop window opens, verify platform abstraction works, run `cargo tauri build` (release), verify installer builds | High | High | 4.1-4.10 | 4h |

### P1 — Required (MCP Desktop Integration)

| # | Task | Difficulty | Risk | Dependencies | Est. Time |
|---|------|-----------|------|-------------|-----------|
| 4.12 | **Create `src-tauri/src/mcp/mod.rs`** — MCP server module using `rmcp` crate: `McpServer` struct, `ServerHandler` impl, stdio transport | High | High | 4.3 | 8h |
| 4.13 | **Create `src-tauri/src/mcp/tools.rs`** — `ToolRegistry` with handlers for prompt generation, validation, asset CRUD, file export | High | Medium | 4.12 | 6h |
| 4.14 | **Create `src-tauri/src/mcp/config.rs`** — MCP config reader/writer for JSON config files (stdio transport, env vars, command/args) | Medium | Medium | 4.12 | 2h |
| 4.15 | **Wire MCP commands** — Tauri commands to list/start/stop MCP servers, call MCP tools from frontend | High | Medium | 4.12 | 3h |
| 4.16 | **Test MCP from desktop app** — launch an MCP server via stdio, list tools, call a tool, verify response | High | High | 4.15 | 2h |

### P2 — Recommended (Desktop UX Polish)

| # | Task | Difficulty | Risk | Dependencies | Est. Time |
|---|------|-----------|------|-------------|-----------|
| 4.17 | Add window state persistence (position, size, fullscreen state) using `tauri-plugin-window-state` | Medium | Low | 4.3 | 1.5h |
| 4.18 | Add system tray icon with quick actions (Open, New Asset, Settings, Quit) | Medium | Medium | 4.3 | 3h |
| 4.19 | Add native desktop notifications using `tauri-plugin-notification` | Low | Low | 4.3 | 1h |
| 4.20 | Add auto-updater config to `tauri.conf.json` (endpoints, pubkeys) for future release channel | Medium | Medium | 4.4 | 1.5h |

### P3 — Future

| # | Task | Difficulty | Risk | Dependencies | Est. Time |
|---|------|-----------|------|-------------|-----------|
| 4.21 | Code-signed builds for Windows (signtool) and macOS (codesign + notarize) | High | High | 4.11 | 4h |
| 4.22 | MSIX installer or winget package for Windows App Store distribution | High | Medium | 4.11 | 4h |
| 4.23 | Auto-updater backend (GitHub releases + update manifest hosting) | Medium | Medium | 4.20 | 3h |

---

## PHASE 5: MARKETPLACE PREPARATION

> Prepare architecture for future online marketplace. NO backend. Static generation only.

### P1 — Required

| # | Task | Difficulty | Risk | Dependencies | Est. Time |
|---|------|-----------|------|-------------|-----------|
| 5.1 | **Define marketplace asset schema** — create `src/types/marketplace.ts` with `MarketplaceAsset` type: id, name, description, author, version, type (skill/persona/instruction-file/workflow/prompt-pack/template/mcp-server/collection/bundle), tags, dependencies, compatibility, ratings, downloads, checksum | Medium | Low | None | 2h |
| 5.2 | **Define manifest format** — create `src/types/marketplace-manifest.ts` with `AssetManifest` (JSON manifest format for publishing/sharing assets): includes compatibility matrix, dependency resolution, version semver | Medium | Low | 5.1 | 2h |
| 5.3 | **Create marketplace schema validator** — `src/services/marketplace/validate-manifest.ts` using zod to validate asset manifests against schema | Medium | Low | 5.2 | 1.5h |
| 5.4 | **Create asset packaging format** — ZIP archive format with manifest.json + asset content. Reuse existing `jszip` dep. `src/services/marketplace/pack.ts` | Medium | Low | 5.2 | 2h |
| 5.5 | **Create asset unpacking/instal