# AI Context Studio — Full Web Implementation Plan

> **Goal**: Every navbar tab works, every desktop feature (instruction files, personas, MCP config, skills, workflows, optimizer, validator, memories) ported to the web with generation capabilities, all API routes connected, footer links functional, and deployment to Vercel.

---

## Current State (Pre-Plan)

### What Works
- 11 marketing pages exist in `app/(marketing)/`: about, blog (+[slug]), community, docs (+[category]/[page]), download, faq, marketplace (+[asset]), products, registry, roadmap, security
- Homepage with real DB stats (StatsSection), GitHub data, marketplace preview, download CTA
- 18 API routes (auth, blog, community, contact, downloads, marketplace, newsletter, registry, roadmap, search, security, admin/*)
- 14 server action files (73 functions) with real Prisma queries
- Better Auth configured (email/password + GitHub + Google social)
- Neon Postgres connected with 43 Prisma models + 18 enums
- Prisma seed creates real data: 2 users, 9 categories, 30 tags, 4 roadmap items, 11 doc categories, 10 SystemPromptTemplates
- Marketplace dropdown navbar with 9 asset kinds + "⚡ Generate File" link
- Fake data files deleted (stats.ts, community.ts, marketplace.ts, downloads.ts, roadmap.ts)
- Build passes (`npm run build` succeeds, only BETTER_AUTH_SECRET warnings)

### What's Missing
- `/generate` route referenced in navbar dropdown but **does not exist** (404)
- Footer links to 8 non-existent routes: `/changelog`, `/careers`, `/press`, `/contact`, `/privacy`, `/terms`, `/license`, `/cookies`
- No `/tools` hub page for generator tools
- No web-ported generator features (instruction files, personas, MCP, skills, workflows, optimizer, validator, memories)
- No Generate API endpoint or server actions
- No AI provider integration for web (desktop's `use-ai-engine.ts` not ported)
- No admin panel UI (API routes exist but no admin pages)
- No deployment config (Vercel env vars, domain)

---

## Phase 1: Port the System Prompt Engine (Core Library)

**Objective**: Copy the pure deterministic engine from desktop to web as a shared library.

### Files to Create
| File | Source | Purpose |
|------|--------|---------|
| `web/src/lib/engine/types.ts` | `desktop/src/features/system-prompt-engine/types.ts` | Engine types (EngineFieldId, EngineField, EngineAnswers, EngineBlueprint, EngineSectionBuilder, EngineOutput) |
| `web/src/lib/engine/fields.ts` | `desktop/src/features/system-prompt-engine/fields.ts` | 12 field definitions + controlled vocabularies (TARGET_AI, FRAMEWORK, LANGUAGE, etc.) |
| `web/src/lib/engine/engine.ts` | `desktop/src/features/system-prompt-engine/engine.ts` | renderBlueprint(), listBlueprints(), getBlueprint(), consumedFieldsForKind(), titleToFilename() |
| `web/src/lib/engine/blueprints/index.ts` | `desktop/src/features/system-prompt-engine/blueprints/index.ts` | ENGINE_BLUEPRINTS registry (6 blueprints) |
| `web/src/lib/engine/blueprints/shared.ts` | same | Helper functions (asString, bullets, section, etc.) |
| `web/src/lib/engine/blueprints/system-prompt.ts` | same | System prompt blueprint (5 sections) |
| `web/src/lib/engine/blueprints/instruction-file.ts` | same | Instruction file blueprint (5 sections) |
| `web/src/lib/engine/blueprints/prompt-template.ts` | same | Prompt template blueprint (5 sections, {{VARIABLE}} placeholders) |
| `web/src/lib/engine/blueprints/context-file.ts` | same | Context file blueprint (6 sections) |
| `web/src/lib/engine/blueprints/memory.ts` | same | Memory blueprint (5 sections) |
| `web/src/lib/engine/blueprints/workflow.ts` | same | Workflow blueprint (5 sections, YAML) |
| `web/src/lib/engine/index.ts` | — | Barrel: re-export everything |

### Porting Changes
- Replace `import { slugify } from "@utils"` → `import { slugify } from "@/lib/utils"`
- Replace `import type { GenerationOutputKind } from "@/shared/types/provider"` → define inline in types.ts
- No other changes needed — code is pure TypeScript with no DOM/React/AI deps

### Verification
- `npm run typecheck` passes
- `npm run build` passes

---

## Phase 2: Port Instruction Files Target Registry + Questions

**Objective**: Port the 9-target instruction file system and question bank.

### Files to Create
| File | Source | Purpose |
|------|--------|---------|
| `web/src/lib/engine/instruction-targets.ts` | `desktop/src/shared/constants/instruction-targets.ts` | 9 targets (Claude, Cursor, Copilot, Gemini, Codex, OpenCode, Continue, Roo, General) + lookup map |
| `web/src/lib/engine/generator-questions.ts` | `desktop/src/features/instruction-files/generator-questions.ts` | 13 questions with appliesTo filtering |
| `web/src/lib/engine/generator.ts` | `desktop/src/features/instruction-files/generator.ts` | generateInstructionFile() — pure stitching |
| `web/src/lib/engine/reference-syntax.ts` | `desktop/src/features/instruction-files/reference-syntax.ts` | INSTRUCTION_SYNTAX reference manifests per target |
| `web/src/lib/engine/types/generator.ts` | `desktop/src/features/instruction-files/types.ts` | GeneratorQuestion interface |

### Porting Changes
- Replace domain type imports from `@/shared/types/domain` → inline in instruction-targets.ts
- No `lucide-react` imports (use plain string icon names)

### Verification
- `npm run typecheck` passes

---

## Phase 3: Port Personas, Workflows, MCP, Skills Data

**Objective**: Port seed data and type definitions for personas, workflows, MCP servers, and skills.

### Files to Create
| File | Source | Purpose |
|------|--------|---------|
| `web/src/lib/engine/personas/types.ts` | `desktop/src/features/personas/types.ts` | Persona, PersonaTrait, PersonaBlueprint types |
| `web/src/lib/engine/personas/constants.ts` | `desktop/src/features/personas/constants.ts` | PERSONA_TRAITS (7 traits, 0-10), PERSONA_FIELDS, DEFAULT_TRAITS |
| `web/src/lib/engine/personas/seed.ts` | `desktop/src/features/personas/seed.ts` | 10 seed personas (code reviewer, architect, etc.) |
| `web/src/lib/engine/personas/blueprints.ts` | Extract from `desktop/src/features/personas/data.ts` | renderPersonaBlueprint() — pure render function (strip React) |
| `web/src/lib/engine/workflows/types.ts` | `desktop/src/features/workflows/types.ts` | Workflow, WorkflowStep, StepType (6), WorkflowBlueprint |
| `web/src/lib/engine/workflows/constants.ts` | `desktop/src/features/workflows/constants.ts` | STEP_TYPES (6), WORKFLOW_FIELDS (3), STEP_TEMPLATES |
| `web/src/lib/engine/workflows/seed.ts` | `desktop/src/features/workflows/data.ts` | 7 seed workflows (feature-dev, bug-fix, code-review, etc.) |
| `web/src/lib/engine/mcp/types.ts` | `desktop/src/features/mcp/types/mcp.types.ts` | MCPServer, MCPCategory, MCPClient, MCPTransport types (strip LucideIcon) |
| `web/src/lib/engine/mcp/categories.ts` | `desktop/src/features/mcp/constants/categories.ts` | MCP category taxonomy (14 categories) |
| `web/src/lib/engine/mcp/clients.ts` | `desktop/src/features/mcp/constants/clients.ts` | 11 client definitions (claude-desktop, cursor, opencode, etc.) |
| `web/src/lib/engine/mcp/config-builders.ts` | `desktop/src/features/mcp/services/client-providers/*.ts` | Pure builders for each client's config format (JSON/YAML) |
| `web/src/lib/engine/mcp/validator.ts` | `desktop/src/features/mcp/validators/config-validator.ts` | validateServer(), validateCollection() |
| `web/src/lib/engine/skills/types.ts` | Extract from `desktop/src/features/skills/skills-module.tsx` | Skill interface + categories |
| `web/src/lib/engine/skills/seed.ts` | Extract from `desktop/src/features/skills/skills-module.tsx` | Skill definitions (extract SKILLS[] array) |

### Porting Changes
- Strip all `"use client"` directives
- Strip all `lucide-react` imports (use string icon names instead of LucideIcon type)
- Strip all React imports from data/logic files
- Keep pure functions and type definitions only

### Verification
- `npm run typecheck` passes
- All engine modules importable from server actions

---

## Phase 4: Port Optimizer + Validator Engines

**Objective**: Port the 16-engine prompt optimizer and asset validator.

### Files to Create
| File | Source | Purpose |
|------|--------|---------|
| `web/src/lib/optimizer/types.ts` | `desktop/src/features/optimizer/types/index.ts` | OptimizationInput, OptimizationResult, ComparisonData, DiffHunk, etc. |
| `web/src/lib/optimizer/optimizer.ts` | `desktop/src/features/optimizer/services/optimizer.ts` | Optimizer class + OptimizationEngineRegistry |
| `web/src/lib/optimizer/engines/base.ts` | `desktop/src/features/optimizer/engines/base.ts` | BaseOptimizationEngine abstract class |
| `web/src/lib/optimizer/engines/*.ts` (16 files) | `desktop/src/features/optimizer/engines/*.ts` | Clarity, Conciseness, ContextExpansion, RoleDefinition, Constraint, OutputFormatting, CoT, Reasoning, ToolUsage, Safety, WorkflowCompleteness, MemoryStrategy, Cost, Performance, PromptEngineering, TokenReduction |
| `web/src/lib/optimizer/engines/index.ts` | `desktop/src/features/optimizer/engines/index.ts` | Barrel: re-export all engines |
| `web/src/lib/optimizer/index.ts` | — | Barrel: re-export Optimizer + types |
| `web/src/lib/validator/types.ts` | `desktop/src/features/validator/types/index.ts` | IAssetValidator, ValidationReport, QualityScore, etc. |
| `web/src/lib/validator/validation-service.ts` | `desktop/src/features/validator/services/validation-service.ts` | ValidationService (auto-detects asset type) |
| `web/src/lib/validator/scoring-engine.ts` | `desktop/src/features/validator/services/scoring-engine.ts` | Quality scoring + AI performance + token efficiency |
| `web/src/lib/validator/validators/base.ts` | `desktop/src/features/validator/validators/base.ts` | ValidatorRegistry + IAssetValidator interface |
| `web/src/lib/validator/validators/markdown.ts` | `desktop/src/features/validator/validators/markdown.ts` | Markdown asset validator |
| `web/src/lib/validator/index.ts` | — | Barrel |

### Porting Changes
- These are already pure TypeScript (no React, no DOM, no AI) — copy verbatim
- Replace any internal path aliases with web conventions

### Verification
- `npm run typecheck` passes
- `npm run build` passes

---

## Phase 5: Create Generate API + Server Actions

**Objective**: Wire the engine to web server actions and an API route.

### Files to Create
| File | Purpose |
|------|---------|
| `web/src/actions/generate.ts` | Server actions: `getBlueprints()`, `getFields()`, `getDefaultAnswers(kind)`, `generateLocally(kind, answers)`, `generateWithAI(kind, answers, providerConfig)`, `getInstructionTargets()`, `getQuestionsForTarget(target)`, `generateInstructionFile(target, answers)`, `getPersonaBlueprints()`, `renderPersona(kind, answers)`, `getWorkflowBlueprints()`, `renderWorkflow(workflowId, answers)` |
| `web/src/app/api/generate/route.ts` | POST endpoint: accepts `{kind, answers, useAI?, provider?}`, calls server action, returns generated content. GET: returns available blueprints + fields. |
| `web/src/app/api/generate/instruction-file/route.ts` | POST: accepts `{target, answers}`, returns generated instruction file |
| `web/src/app/api/generate/persona/route.ts` | POST: accepts `{kind, answers}`, returns rendered persona |
| `web/src/app/api/generate/workflow/route.ts` | POST: accepts `{workflowId, answers}`, returns rendered workflow |
| `web/src/app/api/optimize/route.ts` | POST: accepts `{text, types?, mode?}`, returns optimized prompt + diff |
| `web/src/app/api/validate/route.ts` | POST: accepts `{content, type?}`, returns validation report + quality score |
| `web/src/app/api/mcp-config/route.ts` | POST: accepts `{servers, clientId}`, returns config string. GET: returns available clients. |

### Pattern
- Server actions call `EngineOutput` from `@/lib/engine` (pure functions, server-safe)
- API routes wrap server actions with auth checks where needed
- AI generation (Tier 2) calls provider adapters server-side only; API key from request body, never stored

### Verification
- `npm run typecheck` passes
- API routes return 200 with valid JSON when called

---

## Phase 6: Build the /generate Page (System Prompt Engine UI)

**Objective**: The main generation page with 6 blueprint kinds, form-driven generation, live preview, copy + download.

### Files to Create
| File | Purpose |
|------|---------|
| `web/src/app/(marketing)/generate/page.tsx` | Server component: fetches blueprints + fields, renders GenerateClient |
| `web/src/components/generate/generate-client.tsx` | Main client component: kind selector (6 tabs), form pane (dynamic fields), preview pane (live markdown), copy/download buttons |
| `web/src/components/generate/blueprint-form.tsx` | Dynamic form rendered from ENGINE_FIELDS (text/textarea/select/multiselect/toggle) with validation |
| `web/src/components/generate/blueprint-preview.tsx` | Live markdown preview with syntax highlighting (shiki) |
| `web/src/components/generate/instruction-file-generator.tsx` | Target selector rail (9 targets) + dynamic questions + preview |
| `web/src/components/generate/persona-generator.tsx` | Persona blueprint form (traits sliders, fields) + preview |
| `web/src/components/generate/workflow-generator.tsx` | Workflow selector (7 seeds) + step builder + YAML preview |
| `web/src/components/generate/api-key-modal.tsx` | Modal for entering API key (session-only, not stored). Supports OpenAI, Anthropic, Google, DeepSeek, OpenRouter, NVIDIA, Ollama |

### UI Flow
1. User visits `/generate` — sees 6 kind tabs (System Prompt, Instruction File, Prompt Template, Context File, Memory, Workflow)
2. Selecting a kind shows the relevant form fields from ENGINE_FIELDS
3. User fills the form → live preview updates (calls local renderBlueprint)
4. User can click "Generate with AI" → API key modal appears → chooses provider + enters key → server-side AI refinement → preview updates
5. Copy to clipboard or Download as file (filename from engine)

### Verification
- Page loads without errors
- Form renders all field types
- Live preview updates on form change
- Copy works
- Download produces correct file
- `npm run build` passes

---

## Phase 7: Build /tools Hub Page

**Objective**: A landing page listing all generator tools with cards linking to each.

### Files to Create
| File | Purpose |
|------|---------|
| `web/src/app/(marketing)/tools/page.tsx` | Server component with tool cards |
| `web/src/components/tools/tool-grid.tsx` | Grid of tool cards (icon, name, description, link) |

### Tool Cards (9)
1. **⚡ Generate File** → `/generate` — System Prompt Engine (6 kinds)
2. **📋 Instruction Files** → `/tools/instruction-files` — 9 targets with per-target questions
3. **🎭 Personas** → `/tools/personas` — Browse 10 built-in personas, render to system prompt / instruction file
4. **🔧 MCP Config Generator** → `/tools/mcp-config` — Build MCP server configs for 11 AI clients
5. **📦 Workflows** → `/tools/workflows` — Browse 7 built-in workflows, render YAML
6. **⚡ Skills** → `/tools/skills` — Browse skill catalog, view prompts
7. **✨ Optimizer** → `/tools/optimize` — Optimize prompts with 16 engines
8. **✅ Validator** → `/tools/validate` — Validate AI assets, get quality scores
9. **🧠 Memories** → `/tools/memories` — Memory block management + rendering

### Navigation Update
- Add `Tools` to `mainNav` in `navigation.ts` (or add to marketplace dropdown)
- Update header to show Tools nav item

### Verification
- Page loads, all tool cards link to valid routes (some may still be placeholders)
- `npm run build` passes

---

## Phase 8: Build Individual Tool Pages

**Objective**: Full web pages for each generator tool with forms + preview + copy/download.

### 8A: /tools/instruction-files
| File | Purpose |
|------|---------|
| `web/src/app/(marketing)/tools/instruction-files/page.tsx` | Server: fetches targets + questions |
| `web/src/components/tools/instruction-files-client.tsx` | Client: target rail (9 targets), dynamic questions, preview, copy/download |
| `web/src/components/tools/reference-syntax-view.tsx` | Reference syntax panel showing canonical structure per target |

### 8B: /tools/personas
| File | Purpose |
|------|---------|
| `web/src/app/(marketing)/tools/personas/page.tsx` | Server: fetches seed personas |
| `web/src/components/tools/personas-client.tsx` | Client: persona grid (10 cards), detail view, traits visualization, render to markdown |
| `web/src/components/tools/persona-detail.tsx` | Full persona view with system prompt, traits (7 sliders), expertise, example interactions |

### 8C: /tools/mcp-config
| File | Purpose |
|------|---------|
| `web/src/app/(marketing)/tools/mcp-config/page.tsx` | Server: fetches client list + categories |
| `web/src/components/tools/mcp-config-client.tsx` | Client: server list (add/remove/edit), client selector (11), config preview (JSON/YAML), copy/download, validation panel |

### 8D: /tools/workflows
| File | Purpose |
|------|---------|
| `web/src/app/(marketing)/tools/workflows/page.tsx` | Server: fetches seed workflows |
| `web/src/components/tools/workflows-client.tsx` | Client: workflow grid (7 seeds), step graph visualization, YAML preview, copy/download |

### 8E: /tools/skills
| File | Purpose |
|------|---------|
| `web/src/app/(marketing)/tools/skills/page.tsx` | Server: fetches skill catalog |
| `web/src/components/tools/skills-client.tsx` | Client: category sidebar (6 categories), skill grid, detail view with full prompt, copy button |

### 8F: /tools/optimize
| File | Purpose |
|------|---------|
| `web/src/app/(marketing)/tools/optimize/page.tsx` | Server component |
| `web/src/components/tools/optimize-client.tsx` | Client: prompt textarea, optimization type checkboxes (16), mode selector, run button, original vs optimized split view, diff view, token reduction stats |

### 8G: /tools/validate
| File | Purpose |
|------|---------|
| `web/src/app/(marketing)/tools/validate/page.tsx` | Server component |
| `web/src/components/tools/validate-client.tsx` | Client: content textarea, type auto-detect, validate button, quality score gauge, per-issue list, compatibility matrix, token efficiency report |

### 8H: /tools/memories
| File | Purpose |
|------|---------|
| `web/src/app/(marketing)/tools/memories/page.tsx` | Server component |
| `web/src/components/tools/memories-client.tsx` | Client: collection list (5 types: context, knowledge, decision, standard, reference), memory blocks, render to markdown |

### Verification
- All 8 tool pages load
- Each tool has working form + preview + copy/download
- `npm run build` passes

---

## Phase 9: Create Missing Footer Pages

**Objective**: Build real pages for all 8 dead footer links.

### Pages to Create
| Route | Type | Content |
|-------|------|---------|
| `/changelog` | SSR | Fetches GitHub releases via `getGitHubReleases()` → render versioned changelog with tags |
| `/contact` | SSR + Client | Contact form (name, email, subject, message) → `submitContactMessage()` server action → success state |
| `/privacy` | Static | Privacy policy page (real content: local-first philosophy, no cloud data, API keys session-only, cookie usage) |
| `/terms` | Static | Terms of service (real content: open source MIT license, usage terms, disclaimers) |
| `/license` | Static | License info (MIT License full text, third-party licenses list) |
| `/cookies` | Static | Cookie policy (session cookies, auth cookies, no tracking cookies) |
| `/careers` | Static | "No open positions yet" page with mission statement + email signup for future openings |
| `/press` | Static | Press kit: logo assets, brand guidelines, description boilerplate, screenshots |

### Files per Page
- `web/src/app/(marketing)/<route>/page.tsx` — server component with metadata
- Some pages need client components for interactivity (contact form)

### Verification
- All footer links resolve (no 404s)
- Contact form submits to DB
- Changelog shows real GitHub releases
- `npm run build` passes

---

## Phase 10: Fix Remaining Static Pages

**Objective**: Ensure pages that should have real data have it, and pages that are intentionally static are polished.

### Pages to Verify/Enhance
| Route | Current State | Action |
|-------|--------------|--------|
| `/products` | Static product cards | OK — add real GitHub link, ensure download CTA works |
| `/registry` | Static spec showcase | OK — ensure links to docs work, add manifest validator widget |
| `/docs` | Static category grid + embedded content | OK — verify all doc page links work |
| `/faq` | Static accordion (9 categories) | OK — ensure all questions are current |
| `/about` | Static mission/vision/team | OK — ensure team section references GitHub contributors |
| `/security` | Static security info | OK — wire to SecurityAdvisory API for real advisories if any exist |
| `/roadmap` | SSR (getRoadmapItems) | Verify — should show 4 real seeded items |
| `/community` | SSR (GitHub + DB) | Verify — should show real contributors + users |
| `/blog` | SSR (getBlogPosts) | Verify — empty state since no blog posts seeded (graceful) |
| `/marketplace` | SSR (getMarketplaceAssets) | Verify — empty state since no assets seeded (graceful) |

### Verification
- Visit each page, verify no dead links
- Verify empty states are graceful (use EmptyState component)
- `npm run build` passes

---

## Phase 11: Build Admin Panel

**Objective**: Web-based admin panel for managing the platform.

### Pages to Create
| File | Purpose |
|------|---------|
| `web/src/app/admin/layout.tsx` | Admin layout with sidebar (dashboard, users, assets, blog, announcements, feature flags, analytics) |
| `web/src/app/admin/page.tsx` | Dashboard with stats (users, assets, downloads, pageviews) |
| `web/src/app/admin/users/page.tsx` | User management table (list, ban, role change) |
| `web/src/app/admin/assets/page.tsx` | Pending assets approval queue |
| `web/src/app/admin/blog/page.tsx` | Blog post management (create, edit, publish) |
| `web/src/app/admin/announcements/page.tsx` | Announcement CRUD |
| `web/src/app/admin/feature-flags/page.tsx` | Feature flag CRUD |
| `web/src/app/admin/analytics/page.tsx` | Analytics dashboard (charts from API) |
| `web/src/app/admin/templates/page.tsx` | SystemPromptTemplate management (CRUD the 10 seeded templates, add new ones) |

### Components
| File | Purpose |
|------|---------|
| `web/src/components/admin/admin-sidebar.tsx` | Sidebar navigation |
| `web/src/components/admin/admin-table.tsx` | Reusable table with sorting/pagination |
| `web/src/components/admin/admin-stats-card.tsx` | Stats card with icon + value + trend |

### Auth
- All admin routes use `requireAdmin()` / `requireModerator()` server actions
- Middleware redirects non-admin users to `/` with a toast

### Verification
- Admin pages load for admin user
- CRUD operations work
- Non-admin users get redirected
- `npm run build` passes

---

## Phase 12: Auth Pages (Sign In / Sign Up)

**Objective**: User authentication pages for Better Auth.

### Pages to Create
| File | Purpose |
|------|---------|
| `web/src/app/(auth)/login/page.tsx` | Sign in form (email/password + GitHub/Google social) |
| `web/src/app/(auth)/register/page.tsx` | Sign up form (username, email, password + social) |
| `web/src/app/(auth)/verify-email/page.tsx` | Email verification landing page |
| `web/src/app/(auth)/forgot-password/page.tsx` | Password reset request form |
| `web/src/app/(auth)/reset-password/page.tsx` | Password reset form (with token from URL) |
| `web/src/app/(auth)/layout.tsx` | Auth layout (centered card, no header/footer) |

### Components
| File | Purpose |
|------|---------|
| `web/src/components/auth/auth-form.tsx` | Reusable auth form (login/register modes) |
| `web/src/components/auth/social-buttons.tsx` | GitHub + Google OAuth buttons |

### Integration
- Login/register buttons added to Header (when logged out)
- User avatar menu added to Header (when logged in) with links: Profile, Admin (if admin), Sign Out

### Verification
- Sign up flow works (form + social)
- Login works (form + social)
- Protected routes redirect to login
- `npm run build` passes

---

## Phase 13: User Profile + Settings Pages

**Objective**: User account pages and settings (AI provider config).

### Pages to Create
| File | Purpose |
|------|---------|
| `web/src/app/(marketing)/profile/page.tsx` | User profile (avatar, bio, username, assets published) |
| `web/src/app/(marketing)/profile/edit/page.tsx` | Edit profile form |
| `web/src/app/(marketing)/settings/page.tsx` | Settings dashboard (account, AI providers, notifications) |
| `web/src/app/(marketing)/settings/ai-providers/page.tsx` | Configure AI provider for generation (session-only key entry, test connection button) |
| `web/src/app/(marketing)/settings/notifications/page.tsx` | Notification preferences |

### Verification
- Profile shows user data from DB
- Settings allow provider config (session-only, per user answer)
- `npm run build` passes

---

## Phase 14: Dashboard / My Assets Page

**Objective**: User dashboard showing their generated assets, saved files, and activity.

### Pages to Create
| File | Purpose |
|------|---------|
| `web/src/app/(marketing)/dashboard/page.tsx` | Personal dashboard: generated files history, saved drafts, installed assets |
| `web/src/components/dashboard/recent-generations.tsx` | List of recently generated files (stored in DB) |
| `web/src/components/dashboard/saved-drafts.tsx` | Drafts saved but not downloaded |

### Prisma Model (may need new model)
```prisma
model GeneratedFile {
  id          String   @id @default(cuid())
  userId      String
  kind        String   // system-prompt, instruction-file, etc.
  title       String
  filename    String
  content     String   @db.Text
  targetAI    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id])
}
```

### Verification
- Dashboard shows user's generated files
- Can re-download or delete generated files
- `npm run build` passes

---

## Phase 15: SEO + Sitemap + robots.txt

**Objective**: Complete SEO setup for all pages including dynamic routes.

### Files to Create/Update
| File | Purpose |
|------|---------|
| `web/src/app/sitemap.ts` | Dynamic sitemap including all static pages + marketplace assets + blog posts + docs + tools |
| `web/src/app/robots.ts` | Allow all routes, reference sitemap |
| `web/src/app/(marketing)/[...not-found]/page.tsx` | Custom 404 page with search + useful links |
| All pages | Verify `generateMetadata()` returns correct title/description/OG tags |

### Verification
- `sitemap.xml` returns all routes
- `robots.txt` is correct
- 404 page is useful
- `npm run build` passes

---

## Phase 16: Deployment Configuration

**Objective**: Deploy to Vercel with proper env vars and domain.

### Steps
1. Create `vercel.json` with build config
2. Set Vercel environment variables:
   - `DATABASE_URL` (Neon pooled connection)
   - `BETTER_AUTH_SECRET` (generate random 32-char string)
   - `BETTER_AUTH_URL` (https://aicontextstudio.eu.org or Vercel URL)
   - `NEXT_PUBLIC_APP_URL` (same as BETTER_AUTH_URL)
   - `GITHUB_OWNER` = `Vansh-Varshney-07`
   - `GITHUB_REPO` = `AI-Context-Studio`
   - `GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET` (GitHub OAuth app)
   - `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` (Google OAuth app)
   - `RESEND_API_KEY` (email service)
3. Configure `.eu.org` domain in Vercel (when approved)
4. Push to GitHub → Vercel auto-deploys
5. Verify all env vars work in production
6. Run `db:push` against production Neon DB
7. Run `db:seed` against production Neon DB
8. Verify all pages load in production
9. Verify auth (sign up, login, social login)
10. Verify API routes work

### Verification
- Production deployment successful
- All pages load
- Auth works
- Database connected
- GitHub API works (stars, releases, contributors shown)

---

## Phase 17: Final Polish + Cleanup

**Objective**: Final QA pass before considering the project complete.

### Checklist
- [ ] Every navbar tab works (Products, Marketplace, Registry, Community, Docs, Download, Roadmap, Security, Blog, FAQ, About, Tools)
- [ ] Every footer link works (all 5 sections)
- [ ] Every tool page works (/tools/*)
- [ ] Generate page works with all 6 kinds
- [ ] Instruction files work with all 9 targets
- [ ] Personas render correctly
- [ ] MCP config generates valid JSON/YAML for all 11 clients
- [ ] Workflows render YAML correctly
- [ ] Optimizer runs all 16 engines
- [ ] Validator gives useful quality scores
- [ ] Memories render correctly
- [ ] Skills display with full prompts
- [ ] Auth pages work (login, register, reset password)
- [ ] Admin panel works (requires admin role)
- [ ] User profile + settings work
- [ ] Empty states are graceful everywhere
- [ ] No console errors on any page
- [ ] No 404s on any internal link
- [ ] TypeScript: 0 errors
- [ ] ESLint: 0 errors
- [ ] Build: passes
- [ ] Mobile responsive: all pages at 320/768/1024/1440px
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95

---

## Phase Summary

| Phase | Focus | Estimated Effort |
|-------|-------|-----------------|
| 1 | Port System Prompt Engine (core library) | 1-2 hrs |
| 2 | Port Instruction Files targets + questions | 1 hr |
| 3 | Port Personas, Workflows, MCP, Skills data | 2-3 hrs |
| 4 | Port Optimizer + Validator engines | 1-2 hrs |
| 5 | Create Generate API + server actions | 1-2 hrs |
| 6 | Build /generate page (System Prompt Engine UI) | 3-4 hrs |
| 7 | Build /tools hub page | 1 hr |
| 8 | Build 8 individual tool pages | 6-8 hrs |
| 9 | Create 8 missing footer pages | 2-3 hrs |
| 10 | Fix/verify remaining static pages | 1-2 hrs |
| 11 | Build admin panel | 3-4 hrs |
| 12 | Build auth pages | 2-3 hrs |
| 13 | User profile + settings | 2 hrs |
| 14 | Dashboard / My Assets | 2 hrs |
| 15 | SEO + sitemap + 404 | 1 hr |
| 16 | Deployment configuration | 1-2 hrs |
| 17 | Final polish + cleanup | 2-3 hrs |
| **Total** | | **~31-40 hrs** |

---

## Key Decisions

1. **AI Provider Keys**: Session-only — user enters key in a modal, key is held in server session, never persisted to DB
2. **Engine Porting**: Pure TypeScript files copied from desktop → `web/src/lib/engine/` with minimal import path changes
3. **Tool Hub**: `/tools` page added to navbar listing all 9 generator tools
4. **Footer**: All 8 missing pages created (changelog, contact, privacy, terms, license, cookies, careers, press)
5. **Admin Panel**: Full web-based admin at `/admin/*` with sidebar + CRUD pages
6. **Auth**: Separate route group `(auth)` for login/register with centered layout
7. **Generated Files**: Stored in DB via new `GeneratedFile` Prisma model for user dashboard
8. **No fake data**: All pages show real DB data or graceful empty states