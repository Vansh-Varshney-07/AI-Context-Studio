# Repository Audit — AI Context Studio

**Date:** 2026-07-27  
**Auditor:** Principal Software Architect  
**Scope:** Full repository (source, config, build artifacts, docs)

---

## 1. Current Top‑Level Layout

| Path | Type | Description | Target Bucket | Action |
|------|------|-------------|---------------|--------|
| `.git/` | dir | Git history (must stay) | — | **KEEP** |
| `.github/` | dir | CI workflows, issue templates | `.github/` | **KEEP** (move later under root) |
| `.next/` | dir | Next.js build cache (generated) | — | **DELETE** (ignore in git) |
| `docs/` | dir | Project documentation (markdown) | `docs/` | **KEEP** (restructure) |
| `node_modules/` | dir | npm dependencies (generated) | — | **DELETE** (ignore in git) |
| `out/` | dir | Static export output (generated) | — | **DELETE** (ignore in git) |
| `public/` | dir | Static assets served by Next.js | `desktop/public/` | **MOVE** |
| `src/` | dir | **Core Next.js / React source** (used by both web & desktop) | `desktop/src/` | **MOVE** |
| `src-tauri/` | dir | Tauri (Rust) desktop backend | `desktop/src-tauri/` | **MOVE** |
| `target/` | dir | Cargo build artifacts (generated) | — | **DELETE** (ignore in git) |
| `package.json` / `package-lock.json` | file | Root npm workspace (currently single app) | `desktop/package.json` | **MOVE** |
| `tsconfig.json` / `tsconfig.tsbuildinfo` | file | TypeScript config (project‑wide) | `desktop/tsconfig.json` | **MOVE** |
| `next.config.ts` | file | Next.js config (used by desktop) | `desktop/next.config.ts` | **MOVE** |
| `eslint.config.mjs` | file | ESLint flat config | `desktop/eslint.config.mjs` | **MOVE** |
| `prettierrc.json` / `.prettierignore` | file | Prettier config | `desktop/` | **MOVE** |
| `postcss.config.mjs` | file | PostCSS/Tailwind config | `desktop/postcss.config.mjs` | **MOVE** |
| `README.md` | file | Repo overview | root `README.md` | **KEEP** (update) |
| `AGENTS.md` | file | Internal agent instructions | `docs/AGENTS.md` | **MOVE** |
| `CLAUDE.md` | file | Internal notes | `docs/CLAUDE.md` | **MOVE** |
| `PROJECT_DOCUMENTATION.md` | file | Project notes | `docs/PROJECT_DOCUMENTATION.md` | **MOVE** |
| `RELEASE_TODO.md` | file | Release checklist | `docs/RELEASE_TODO.md` | **MOVE** |

---

## 2. `src/` — Feature‑level audit

| Sub‑dir | Purpose | Duplicate / Dead? | Target |
|---------|---------|-------------------|--------|
| `app/` | Next.js App Router pages (dashboard, modules) | **Active** – used by desktop | `desktop/src/app/` |
| `components/` | Shared UI (layout, motion, ui, common) | **Active** – shared across modules | `shared/components/` (see §4) |
| `constants/` | Module registry, providers, prompt categories | **Active** | `shared/constants/` |
| `features/` | 14 feature modules (dashboard, instruction-files, mcp, memories, optimizer, personas, prompt-library, search, settings, skills, system-prompt-engine, validator, workflows, configurations) | **Active** – each a workspace module | `desktop/src/features/` |
| `hooks/` | Custom React hooks (navigation, storage, keyboard, module renderers) | **Active** | `shared/hooks/` |
| `lib/` | Zustand stores (navigation, provider, UI, query client) | **Active** | `shared/lib/` |
| `providers/` | React context providers (toaster, app providers) | **Active** | `shared/providers/` |
| `services/` | Core services (crypto, storage, providers, platform, export‑import) | **Active** | `shared/services/` |
| `styles/` | Global CSS (Tailwind entry) | **Active** | `shared/styles/` |
| `types/` | Shared TypeScript types (asset, domain, navigation, provider) | **Active** | `shared/types/` |
| `utils/` | Utility helpers (cn, date, file, uuid) | **Active** | `shared/utils/` |

**Observations**
- No duplicate feature folders.
- `configurations/` feature exists but only contains `.gitkeep` → **DELETE** after confirming unused (registry maps `configurations` → `mcp` module).
- All feature modules have `index.ts` barrels – good.
- `search/` feature only has `search-module.tsx` – minimal but functional.

---

## 3. `src-tauri/` — Rust backend audit

| Path | Purpose | Target |
|------|---------|--------|
| `src/commands/` | Tauri command modules (fs, dialog, clipboard, platform, assets, marketplace, mcp) | `desktop/src-tauri/src/commands/` |
| `src/marketplace/` | Marketplace catalog & protocol (stubs) | `desktop/src-tauri/src/marketplace/` |
| `src/mcp/` | MCP server stub | `desktop/src-tauri/src/mcp/` |
| `Cargo.toml` / `Cargo.lock` | Rust workspace manifest | `desktop/src-tauri/` |
| `tauri.conf.json` | Tauri v2 config (window, bundle, CSP) | `desktop/src-tauri/` |
| `capabilities/default.json` | Permission manifest | `desktop/src-tauri/capabilities/` |
| `icons/` | App icons (all platforms) | `desktop/src-tauri/icons/` |
| `build.rs` | Build script | `desktop/src-tauri/` |
| `target/` | Build artifacts | **DELETE** (git‑ignored) |
| `gen/` | Generated JSON schemas | **KEEP** (generated) |

No dead Rust modules; all command files are referenced from `lib.rs`.

---

## 4. Mapping to Target Ecosystem Structure

| Target Dir | Source(s) | Notes |
|------------|-----------|-------|
| `web/` | *none yet* – will be a fresh Next.js site (landing, docs, marketplace browser) | **CREATE** |
| `desktop/` | `src/`, `src-tauri/`, `public/`, `package.json`, `tsconfig.json`, `next.config.ts`, eslint/prettier/postcss configs | **MOVE** (root → `desktop/`) |
| `marketplace/` | `src-tauri/src/marketplace/`, `src-tauri/src/commands/marketplace.rs` | **MOVE** (Rust) + **CREATE** TS schemas in `shared/types/marketplace.ts` |
| `registry/` | `src/constants/modules.registry.ts`, feature seed data (skills, personas, workflows, prompts, mcp) | **MOVE** JSON/TS seed files here |
| `assets/` | *none* – runtime user data lives in OS app‑data; seed assets can be placed under `registry/` | **CREATE** dirs (official, community, user, cache) |
| `shared/` | `src/components/`, `src/constants/`, `src/hooks/`, `src/lib/`, `src/providers/`, `src/services/`, `src/styles/`, `src/types/`, `src/utils/` | **MOVE** (extract truly shared code) |
| `backend/` | *none* – placeholder for future API | **CREATE** empty with `README.md` |
| `tools/` | *none* – scripts for asset packaging, release, migration | **CREATE** |
| `docs/` | existing `docs/`, plus `AGENTS.md`, `CLAUDE.md`, `PROJECT_DOCUMENTATION.md`, `RELEASE_TODO.md` | **REORGANISE** |
| `security/` | *none* – will hold threat model, CSP report, encryption docs | **CREATE** |
| `.github/` | stays at root | **KEEP** |

---

## 5. Duplicate / Dead / Obsolete Items

| Item | Reason | Action |
|------|--------|--------|
| `src/features/configurations/` (only `.gitkeep`) | Registry maps `configurations` → `mcp` module; no UI | **DELETE** |
| `.next/`, `out/`, `node_modules/`, `target/` | Build artifacts | **DELETE** (ensure `.gitignore`) |
| `src-tauri/target/` | Cargo artifacts | **DELETE** |
| `src/styles/.gitkeep` | Empty dir | **DELETE** |
| `src/constants/.gitkeep` | Empty dir | **DELETE** |
| `src/hooks/.gitkeep` | Empty dir | **DELETE** |
| `src/lib/.gitkeep` | Empty dir | **DELETE** |
| `src/providers/.gitkeep` | Empty dir | **DELETE** |
| `src/services/crypto/.gitkeep` | Empty dir | **DELETE** |
| `src/services/export-import/.gitkeep` | Empty dir (no implementation) | **DELETE** or **IMPLEMENT** later |
| `src/services/platform/.gitkeep` | Empty dir | **DELETE** |
| `src-tauri/src/commands/assets.rs` has dead code (`zip::ZipWriter` created twice) | Minor cleanup | **MERGE** (fix in place) |
| `src-tauri/src/commands/marketplace.rs` uses `seed_catalog` only – no real backend | Placeholder | **KEEP** (mark as stub) |
| `src/features/prompt-library/seed.ts` empty array | No seed prompts yet | **KEEP** (will populate) |
| `src/features/workflows/data.ts` has 5 seed workflows – good | — | **KEEP** |
| `src/features/personas/seed.ts` 10 personas – good | — | **KEEP** |
| `src/features/memories/seed.ts` 7 memories – good | — | **KEEP** |
| `src/features/optimizer/seed.ts` 6 presets – good | — | **KEEP** |
| `src/features/validator/seed.ts` 5 profiles – good | — | **KEEP** |
| `src/features/mcp/seed.ts` 12 servers – good | — | **KEEP** |

---

## 6. Import / Alias Changes Required

| Current Alias | New Location | Example Change |
|---------------|--------------|----------------|
| `@/components/*` | `shared/components/*` | `import { Button } from '@/components/ui/button'` → `import { Button } from 'shared/components/ui/button'` |
| `@/hooks/*` | `shared/hooks/*` | similar |
| `@/lib/*` | `shared/lib/*` | similar |
| `@/services/*` | `shared/services/*` | similar |
| `@/utils/*` | `shared/utils/*` | similar |
| `@/types/*` | `shared/types/*` | similar |
| `@/constants/*` | `shared/constants/*` | similar |
| `@/features/*` | `desktop/src/features/*` (unchanged for desktop) | no change for desktop code |
| `@tauri-apps/api` | stays (desktop only) | — |

**Strategy:**  
1. Create `shared/` at repo root.  
2. Move the shared directories there.  
3. Update `tsconfig.json` `paths` in `desktop/` to point `shared/*` → `../shared/*`.  
4. Keep `@/` alias inside `desktop/` pointing to `desktop/src/`.

---

## 7. Migration Phases (high‑level)

| Phase | Description | Validation |
|-------|-------------|------------|
| **0 – Prep** | Add `.gitignore` entries for generated dirs; commit current clean state. | `git status` clean |
| **1 – Extract `shared/`** | Move `components/`, `hooks/`, `lib/`, `providers/`, `services/`, `styles/`, `types/`, `utils/`, `constants/` to `shared/`. Update desktop `tsconfig.json` paths. | `npm run typecheck` (desktop) ✅ |
| **2 – Move desktop app** | Rename root `src/` → `desktop/src/`, `src-tauri/` → `desktop/src-tauri/`, `public/` → `desktop/public/`, config files → `desktop/`. Update `package.json` `scripts` to run from `desktop/`. | `cd desktop && npm run typecheck && npm run build` ✅ |
| **3 – Create `web/` scaffold** | New Next.js app (static export) for landing, docs, marketplace browser. | `cd web && npm run build` ✅ |
| **4 – Marketplace & Registry** | Move seed data & Rust marketplace code to `marketplace/` and `registry/`. Add TypeScript schemas. | `cargo check` ✅ |
| **5 – Assets dirs** | Create `assets/{official,community,user,cache}/` (empty, git‑kept). | — |
| **6 – Docs & Security** | Reorganise `docs/`, create `security/`. | — |
| **7 – Tools & CI** | Add release scripts, asset packager, update GitHub Actions to build `desktop/` and `web/` separately. | CI green |

Each phase ends with **full build + typecheck** before proceeding.

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking import paths during `shared/` extraction | High | Build fails | Automated codemod / find‑replace; run typecheck after each move |
| Tauri `tauri.conf.json` `frontendDist` path wrong after move | Medium | Desktop build breaks | Update `frontendDist: "../out"` → `../../desktop/out` (or adjust) |
| Vercel deployment expects root `package.json` | Medium | Web deploy fails | Keep a minimal root `package.json` with `workspaces: ["desktop", "web"]` or use separate repos later |
| Cargo `build.rs` expects icons at relative path | Low | Build error | Verify `build.rs` uses `CARGO_MANIFEST_DIR` |
| Git history loss on large moves | Low | History fragmented | Use `git mv` for directories; commit each phase separately |

---

## 9. Next Steps (TODO)

1. **Commit current clean state** (if not already).  
2. **Create `shared/`** and move the nine shared directories.  
3. **Update `desktop/tsconfig.json`** with new path aliases.  
4. **Run `npm run typecheck`** in `desktop/` – fix any broken imports.  
5. **Run `npm run build`** – ensure desktop still compiles.  
6. **Proceed to Phase 2** (move desktop app).  

---

*End of audit.*  
All items above are **non‑destructive** – nothing is deleted until the corresponding move is verified.