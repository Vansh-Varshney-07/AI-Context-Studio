# AI Context Studio — Web Experience Redesign Plan

## Executive Summary
Complete redesign of the `web/` application from a minimal landing page to a premium, production-ready ecosystem website matching the visual quality of Apple, Linear, Vercel, Raycast, and Framer. The web app serves as the **public ecosystem hub** (not the desktop app) — showcasing products, marketplace, registry, docs, downloads, community, roadmap, security, and about.

---

## 1. Current State Audit

### 1.1 Existing Structure (`web/`)
```
web/
├── package.json          # Next.js 16.2.10, React 18, Tailwind 3.4
├── tsconfig.json         # Path aliases: @/* → ./src/*, @shared/* → ../shared/*
├── next.config.ts        # Static export, CSP headers, unoptimized images
├── src/
│   ├── app/
│   │   ├── layout.tsx    # Metadata, Geist fonts, dark theme CSS
│   │   ├── page.tsx      # Single-page landing (dark, minimal)
│   │   └── globals.css   # Tailwind 3 directives, dark CSS variables
│   ├── components/       # EMPTY
│   └── lib/              # EMPTY
├── public/               # EMPTY (no favicons, og-image, manifest)
└── node_modules/         # NOT INSTALLED
```

### 1.2 Problems Identified

| Category | Issues |
|----------|--------|
| **UX/Design** | Dark theme only (spec requires light-first), minimal hero, no animations, generic Tailwind, no visual hierarchy, no product mockups, no marketplace preview, no interactive elements |
| **Architecture** | Flat structure, no reusable components, no design system, no shared component usage, no proper folder organization |
| **Pages Missing** | Products, Marketplace, Registry, Community, Documentation (multi-page), Download, Roadmap, Security, About |
| **Components Missing** | Buttons, Cards, Badges, Feature Cards, Marketplace Cards, Search, Category Chips, Navigation, Footer, Code Snippets, Install Commands, OS Selectors, Asset Previews, Skeletons, Callouts, Docs Blocks, Timeline, FAQ, Testimonials |
| **Technical** | No Tailwind 4 migration, React 18 (desktop is 19), missing deps for shared UI (Radix, CVA, Framer Motion), no SEO/OG/Twitter/robots/sitemap/manifest/favicons, no TypeScript strictness matching desktop, no lint/prettier |
| **Content** | Placeholder links (#), no real download URLs, no checksums, no release notes, no community stats, no roadmap data |
| **Responsive** | Basic mobile support only, no tablet optimization |
| **Accessibility** | No ARIA, no focus management, no reduced motion, no WCAG AA |

### 1.3 Shared Components Available (from `shared/components/ui/`)
- Button, Card, Badge, Input, Label, Select, Separator, Slider, Switch, Tabs, Tooltip, Toaster, ScrollArea, Popover, Checkbox
- Motion presets: fadeIn, slideUp, cardHover, listStagger, moduleTransition, baseTransition
- Utils: `cn()` (clsx + tailwind-merge), uuid, date formatting, file utils
- Constants: providers, modules, instruction targets, prompt categories
- Types: Asset, AssetKind, AssetMetadata, domain types, provider types, navigation types

### 1.4 Desktop Design System (Tailwind 4, Light Theme)
- **Colors**: Warm beige bg (#F5F1E8), soft sage secondary (#E7EFE6), cream tertiary (#FAF7F2), forest green accent (#4F7A5A)
- **Typography**: Geist Sans/Mono, 8px spacing grid, editorial scale
- **Shadows**: Subtle (xs→xl), calm elevation
- **Motion**: spring/smooth/out easings, 150/200/300ms durations
- **Border radius**: 6px→24px scale
- **Components**: `.card`, `.btn-*`, `.input`, `.badge-*`, `.label`, `.divider`, `.empty-state`, `.container-app`

---

## 2. Target Architecture (New `web/` Structure)

```
web/
├── package.json                    # Updated deps (Tailwind 4, React 19, Radix, Framer Motion, CVA)
├── tsconfig.json                   # Strict mode, path aliases @shared/* → ../shared/*
├── next.config.ts                  # Static export, image optimization, headers, sitemap/robots/manifest generation
├── postcss.config.mjs              # @tailwindcss/postcss
├── components.json                 # shadcn/ui config (optional)
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with providers, fonts, metadata
│   │   ├── globals.css             # Tailwind 4 import, design tokens, base styles
│   │   ├── page.tsx                # Landing page (server component)
│   │   ├── loading.tsx             # Global loading UI
│   │   ├── not-found.tsx           # 404 page
│   │   ├── robots.txt.ts           # Dynamic robots.txt
│   │   ├── sitemap.ts              # Dynamic sitemap.xml
│   │   ├── manifest.ts             # Web app manifest
│   │   ├── (marketing)/            # Route group for marketing pages
│   │   │   ├── products/
│   │   │   │   └── page.tsx
│   │   │   ├── marketplace/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [category]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [asset]/
│   │   │   │       └── page.tsx
│   │   │   ├── registry/
│   │   │   │   └── page.tsx
│   │   │   ├── community/
│   │   │   │   └── page.tsx
│   │   │   ├── docs/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── getting-started/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── installation/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── desktop/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── marketplace/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── registry/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── mcp/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── skills/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── prompt-files/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── api-keys/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── security/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── developer-guide/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── architecture/
│   │   │   │       └── page.tsx
│   │   │   ├── download/
│   │   │   │   └── page.tsx
│   │   │   ├── roadmap/
│   │   │   │   └── page.tsx
│   │   │   ├── security/
│   │   │   │   └── page.tsx
│   │   │   └── about/
│   │   │       └── page.tsx
│   │   └── api/                    # Not used (static export) — keep for future
│   ├── components/
│   │   ├── ui/                     # Re-exports from shared + web-specific primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── input.tsx
│   │   │   ├── ... (all shared UI)
│   │   │   └── index.ts
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── navigation.tsx
│   │   │   └── index.ts
│   │   ├── sections/
│   │   │   ├── hero.tsx
│   │   │   ├── features.tsx
│   │   │   ├── stats.tsx
│   │   │   ├── cta.tsx
│   │   │   ├── product-grid.tsx
│   │   │   ├── marketplace-preview.tsx
│   │   │   ├── download-cards.tsx
│   │   │   ├── roadmap-timeline.tsx
│   │   │   ├── community-stats.tsx
│   │   │   ├── testimonials.tsx
│   │   │   ├── faq.tsx
│   │   │   └── index.ts
│   │   ├── marketplace/
│   │   │   ├── asset-card.tsx
│   │   │   ├── asset-grid.tsx
│   │   │   ├── category-tabs.tsx
│   │   │   ├── search-bar.tsx
│   │   │   ├── filter-sidebar.tsx
│   │   │   ├── sort-dropdown.tsx
│   │   │   ├── compatibility-badge.tsx
│   │   │   ├── rating-stars.tsx
│   │   │   └── index.ts
│   │   ├── docs/
│   │   │   ├── doc-layout.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── toc.tsx
│   │   │   ├── code-block.tsx
│   │   │   ├── callout.tsx
│   │   │   ├── install-command.tsx
│   │   │   ├── os-selector.tsx
│   │   │   ├── version-badge.tsx
│   │   │   └── index.ts
│   │   ├── common/
│   │   │   ├── animated-counter.tsx
│   │   │   ├── floating-preview.tsx
│   │   │   ├── gradient-text.tsx
│   │   │   ├── scroll-reveal.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── empty-state.tsx
│   │   │   └── index.ts
│   │   └── index.ts                # Barrel export
│   ├── lib/
│   │   ├── constants.ts            # Site config, navigation, social links
│   │   ├── metadata.ts             # Metadata helpers, Open Graph, Twitter
│   │   ├── utils.ts                # Re-export shared utils + web-specific
│   │   ├── animations.ts           # Framer Motion variants, transitions
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-scroll-reveal.ts
│   │   ├── use-reduced-motion.ts
│   │   ├── use-media-query.ts
│   │   └── index.ts
│   ├── data/
│   │   ├── navigation.ts           # Nav items, footer links
│   │   ├── marketplace.ts          # Mock marketplace data (types from shared)
│   │   ├── roadmap.ts              # Roadmap phases data
│   │   ├── community.ts            # Community stats, creators
│   │   ├── docs.ts                 # Doc sidebar structure
│   │   ├── stats.ts                # Animated statistics
│   │   ├── downloads.ts            # Platform downloads, checksums
│   │   ├── faq.ts                  # FAQ data
│   │   └── index.ts
│   ├── styles/
│   │   └── globals.css             # Imported in app/globals.css
│   ├── providers/
│   │   └── web-providers.tsx       # QueryClient, Tooltip, Toaster (from shared)
│   └── types/
│       └── web.ts                  # Web-specific types
├── public/
│   ├── icons/                      # Favicons (16, 32, 180, 192, 512)
│   ├── og-image.png                # Open Graph image (1200x630)
│   ├── images/                     # Product screenshots, illustrations
│   ├── manifest.json               # Generated at build
│   └── robots.txt                  # Generated at build
└── .github/
    └── workflows/
        └── web-deploy.yml          # CI/CD for web
```

---

## 3. Design System (Light-First, Premium)

### 3.1 Color Palette (matching desktop, adapted for web)
```css
/* Light Theme (default) */
--color-bg-primary: #FFFFFF;           /* Pure white */
--color-bg-secondary: #F5F1E8;         /* Warm beige */
--color-bg-tertiary: #FAF7F2;          /* Cream */
--color-bg-surface: #FFFFFF;           /* Card surfaces */

--color-accent: #3B82F6;               /* Blue primary */
--color-accent-hover: #2563EB;
--color-accent-light: #DBEAFE;         /* Blue 100 */

--color-violet: #8B5CF6;               /* Violet accent */
--color-violet-hover: #7C3AED;
--color-violet-light: #EDE9FE;

--color-cyan: #06B6D4;                 /* Cyan highlight */
--color-cyan-hover: #0891B2;
--color-cyan-light: #CFFAFE;

--color-text-primary: #111827;         /* Gray 900 */
--color-text-secondary: #4B5563;       /* Gray 600 */
--color-text-muted: #9CA3AF;           /* Gray 400 */
--color-text-inverse: #FFFFFF;

--color-border: #E5E7EB;               /* Gray 200 */
--color-border-strong: #D1D5DB;        /* Gray 300 */
--color-border-subtle: #F3F4F6;        /* Gray 100 */

/* Status */
--color-success: #10B981;
--color-success-bg: #ECFDF5;
--color-warning: #F59E0B;
--color-warning-bg: #FFFBEB;
--color-error: #EF4444;
--color-error-bg: #FEF2F2;

/* Glass */
--color-glass: rgba(255, 255, 255, 0.7);
--color-glass-border: rgba(255, 255, 255, 0.3);
```

### 3.2 Typography
- **Font**: Geist Sans (UI), Geist Mono (code) — loaded via `next/font/google`
- **Scale**: 11px → 72px (clamp fluid scaling)
- **Weights**: 400, 500, 600, 700
- **Line heights**: tight (1.1), snug (1.375), normal (1.5), relaxed (1.625)

### 3.3 Spacing & Layout
- 8px base grid (--space-1 = 4px, --space-2 = 8px, etc.)
- Container max-width: 1280px (content), 1440px (full sections)
- Section padding: py-16 (mobile), py-24 (tablet), py-32 (desktop)

### 3.4 Motion
- Reduced motion respected via `@media (prefers-reduced-motion: reduce)`
- Standard durations: fast 150ms, base 200ms, slow 300ms
- Easings: smooth (cubic-bezier(0.4, 0, 0.2, 1)), spring (0.22, 1, 0.36, 1)
- Variants: fadeIn, slideUp, slideDown, scaleIn, cardHover, listStagger

### 3.5 Component Primitives (to build/re-export)
| Component | Source | Web Adaptations |
|-----------|--------|-----------------|
| Button | shared | Add `glass` variant, `size: xl`, loading state |
| Card | shared | Add `elevated`, `glass`, `bordered` props |
| Badge | shared | Add `dot` variant, `removable` |
| Input | shared | Add `search` variant with icon |
| Select | shared | — |
| Tabs | shared | Add `underline` variant |
| Tooltip | shared | — |
| Separator | shared | — |
| ScrollArea | shared | — |
| Avatar | Radix | New |
| DropdownMenu | Radix | New |
| Dialog | Radix | New |
| Sheet | Radix | New (mobile nav) |
| Toast | shared | — |

---

## 4. Implementation Phases

### Phase 0: Foundation & Setup (Week 1)
- [ ] Install dependencies: Tailwind 4, React 19, Radix UI, Framer Motion, CVA, Lucide, clsx, tailwind-merge, @tanstack/react-query, date-fns, zod
- [ ] Configure `postcss.config.mjs` with `@tailwindcss/postcss`
- [ ] Create `src/app/globals.css` with design tokens (CSS variables + @theme inline)
- [ ] Update `tsconfig.json` with strict desktop-matching settings
- [ ] Update `next.config.ts` for image optimization, sitemap/robots/manifest generation
- [ ] Create `src/providers/web-providers.tsx` wrapping QueryClient, Tooltip, Toaster
- [ ] Create `src/lib/utils.ts` re-exporting shared `cn`, uuid, date, file utils
- [ ] Create `src/lib/metadata.ts` for SEO helpers
- [ ] Create `src/lib/constants.ts` for site config
- [ ] Create `src/data/navigation.ts` for nav/footer structure
- [ ] Build UI primitives in `src/components/ui/` re-exporting from shared + adding web variants
- [ ] Create layout components: Header, Footer, Navigation
- [ ] Create root layout with providers, metadata, fonts
- [ ] Add favicons, OG image placeholder, manifest
- [ ] Run `npm run build` → fix all TS errors → verify static export works

### Phase 1: Landing Page Redesign (Week 2)
- [ ] Build Hero section: large typography, gradient text, floating UI preview (mock), dual CTAs
- [ ] Build Animated Statistics counter (users, assets, downloads, stars)
- [ ] Build Product Showcase: 3-column grid (Desktop, Hub, Marketplace) with illustrations
- [ ] Build Features Highlight: 6 feature cards with hover animations, icons
- [ ] Build Marketplace Preview: horizontal scrolling asset cards (mock data)
- [ ] Build Desktop Preview: interactive mockup screenshot with callouts
- [ ] Build Registry Preview: schema diagram + code snippet
- [ ] Build Search Preview: animated search bar with suggestions
- [ ] Build Download CTA section: OS selector, version badges, checksums
- [ ] Build GitHub CTA + Documentation CTA
- [ ] Build Footer: navigation, social, newsletter, legal
- [ ] Add scroll-reveal animations (IntersectionObserver via Framer Motion)
- [ ] Ensure responsive: mobile (<640), tablet (640-1024), desktop (>1024)
- [ ] Build `npm run build` → verify no layout shift, no console errors

### Phase 2: Products Page (Week 2-3)
- [ ] Create `/products` page with ecosystem overview
- [ ] Product cards: Desktop App, Online Hub, Marketplace, Registry, Community, Future Cloud
- [ ] Architecture diagram (SVG/React component): data flow between products
- [ ] Feature comparison table
- [ ] "Why separate apps?" explanation
- [ ] CTA to each product

### Phase 3: Marketplace Frontend (Week 3)
- [ ] Create `/marketplace` with search, filters, categories
- [ ] Build AssetCard: thumbnail, title, author, category, rating, downloads, compatibility badges, install button
- [ ] Build CategoryTabs: All, Skills, Personas, Templates, Prompt Packs, Instruction Files, Workflows, MCP Servers, Collections, Bundles
- [ ] Build FilterSidebar: Category, Type, Verified, Compatibility, Sort (Trending, Recent, Rating, Downloads)
- [ ] Build SearchBar: debounced, suggestions, keyboard navigation
- [ ] Build Asset Detail Page (`/marketplace/[asset]`): full metadata, screenshots, install command, version history, dependencies, README preview
- [ ] Mock data from `src/data/marketplace.ts` using shared `AssetKind` types
- [ ] Empty states, loading skeletons, error boundaries
- [ ] URL state management (search params)

### Phase 4: Registry Page (Week 3-4)
- [ ] Create `/registry` explaining asset structure
- [ ] Visual schema diagram (manifest.json structure)
- [ ] Metadata fields table
- [ ] Versioning strategy (semver)
- [ ] Dependency graph visualization
- [ ] Manifest validator (client-side JSON schema)
- [ ] Compatibility matrix (target → asset kinds)
- [ ] Screenshot gallery pattern

### Phase 5: Community Page (Week 4)
- [ ] Create `/community` with stats, featured creators, contributors
- [ ] Stats: contributors, assets, discussions, stars
- [ ] Featured creators grid (avatars, bios, asset counts)
- [ ] Recent contributors list
- [ ] GitHub stats (PRs, issues, stars) — static placeholders
- [ ] Discord/CTA placeholder
- [ ] "How to contribute" steps
- [ ] Code of conduct link

### Phase 6: Documentation Site (Week 4-5)
- [ ] Create `/docs` landing with category cards
- [ ] Build DocLayout: sidebar navigation, table of contents, main content, edit-on-GitHub
- [ ] Create all doc pages per spec:
  - Getting Started → Installation → Desktop → Marketplace → Registry → MCP → Skills → Prompt Files → API Keys → Security
  - Developer Guide → Architecture
- [ ] CodeBlock component: syntax highlighting (shiki), copy button, line numbers, OS tabs
- [ ] Callout component: Note, Tip, Warning, Danger
- [ ] InstallCommand component: copyable, OS-aware
- [ ] VersionBadge component
- [ ] Search within docs (Algolia DocSearch placeholder)
- [ ] MDX content pipeline (or static TSX for now)

### Phase 7: Download Page (Week 5)
- [ ] Create `/download` with beautiful platform cards
- [ ] Windows: NSIS installer, portable, checksums (SHA256)
- [ ] macOS: Universal DMG, ARM64, checksums, notarization info
- [ ] Linux: AppImage, .deb, .rpm, tarball, checksums
- [ ] Source code link (GitHub releases)
- [ ] Release notes accordion (latest 5 versions)
- [ ] Installation instructions per platform
- [ ] Verify signatures section (placeholder)

### Phase 8: Roadmap Page (Week 5)
- [ ] Create `/roadmap` with interactive timeline
- [ ] Phases: Completed, In Progress, Planned, Future
- [ ] Each item: title, description, status badge, target quarter, tags
- [ ] Filter by status, category
- [ ] Expandable detail view
- [ ] Data from `src/data/roadmap.ts`

### Phase 9: Security Page (Week 5-6)
- [ ] Create `/security` explaining local-first philosophy
- [ ] Encryption: at-rest, in-transit, key management
- [ ] No cloud storage explanation
- [ ] API keys remain local
- [ ] MCP isolation / sandboxing
- [ ] Privacy policy summary
- [ ] Open source audit link
- [ ] Security.txt / responsible disclosure

### Phase 10: About Page (Week 6)
- [ ] Create `/about` with mission, vision, philosophy
- [ ] Why local-first, why open source, why AI Context Studio
- [ ] Team/credits placeholder
- [ ] Values cards
- [ ] History timeline

### Phase 11: Polish & Launch Prep (Week 6)
- [ ] Full responsive audit (all pages, all breakpoints)
- [ ] Accessibility audit: axe-core, keyboard nav, ARIA, color contrast
- [ ] Performance audit: Lighthouse, bundle analysis, image optimization
- [ ] SEO audit: metadata on every page, structured data (JSON-LD), sitemap, robots
- [ ] Cross-browser testing
- [ ] Remove all console.logs, TODOs, FIXMEs, commented code
- [ ] Delete unused files, dependencies, styles
- [ ] Generate production build
- [ ] Configure GitHub Actions CI/CD
- [ ] Deploy to Vercel/Netlify preview
- [ ] Final QA sign-off

---

## 5. Shared Code Synchronization Strategy

| Shared Asset | Action |
|--------------|--------|
| UI Components (Button, Card, Badge, Input, Select, Tabs, Tooltip, Toaster, ScrollArea, Separator, Slider, Switch, Popover, Checkbox, Label) | Re-export from `shared/components/ui` in `web/src/components/ui/`; add web-only variants |
| Motion Presets (fadeIn, slideUp, cardHover, listStagger, moduleTransition, baseTransition) | Re-export from `shared/components/motion` in `web/src/lib/animations.ts` |
| Utils (cn, uuid, date, file) | Re-export from `shared/utils` in `web/src/lib/utils.ts` |
| Constants (providers, modules, instruction-targets, prompt-categories) | Import directly from `@shared/constants` in web data files |
| Types (Asset, AssetKind, domain, provider, navigation) | Import from `@shared/types` in web data/components |
| Hooks (useModuleRenderers, useAIEngine, useStorage, etc.) | Available via `@shared/hooks` if needed |
| Providers (AppProviders, ToasterProvider) | Use `shared/providers/app-providers.tsx` pattern in `web/src/providers/web-providers.tsx` |

**Rule**: Never modify `desktop/` unless a shared component API change requires it. Always test `desktop` build after shared changes.

---

## 6. Cleanup Checklist (Pre-Implementation)

### Remove from `web/`
- [ ] Dark theme CSS variables in `globals.css`
- [ ] Hardcoded SVG icons → use Lucide React
- [ ] Inline styles → use Tailwind classes
- [ ] Single-page layout → replace with multi-page structure

### Add Missing
- [ ] `package.json`: Radix UI primitives, Framer Motion, CVA, date-fns, zod, shiki, next-sitemap
- [ ] `tsconfig.json`: Match desktop strictness (`noUncheckedIndexedAccess`, `verbatimModuleSyntax`, etc.)
- [ ] ESLint + Prettier config (match desktop)
- [ ] `.env.example` for any env vars
- [ ] Public assets: favicons, og-image, screenshots
- [ ] GitHub Actions workflow

---

## 7. Success Criteria

| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | 100 |
| Lighthouse SEO | 100 |
| TypeScript Errors | 0 |
| ESLint Errors | 0 |
| Bundle Size (gzipped) | < 150 KB initial JS |
| First Contentful Paint | < 1.2s |
| Time to Interactive | < 2.5s |
| Cumulative Layout Shift | < 0.05 |
| All Pages Responsive | ✓ 320px - 1920px |
| Keyboard Navigable | ✓ All interactive elements |
| Reduced Motion | ✓ Respected everywhere |

---

## 8. Dependencies to Add (web/package.json)

```json
{
  "dependencies": {
    "next": "16.2.10",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.453.0",
    "@tanstack/react-query": "^5.59.0",
    "framer-motion": "^11.0.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.6.0",
    "@radix-ui/react-slot": "^1.3.0",
    "@radix-ui/react-tooltip": "^1.2.12",
    "@radix-ui/react-tabs": "^1.1.17",
    "@radix-ui/react-dialog": "^1.1.19",
    "@radix-ui/react-dropdown-menu": "^2.1.20",
    "@radix-ui/react-select": "^2.3.3",
    "@radix-ui/react-scroll-area": "^1.2.14",
    "@radix-ui/react-separator": "^1.1.11",
    "@radix-ui/react-switch": "^1.3.3",
    "@radix-ui/react-slider": "^1.4.3",
    "@radix-ui/react-checkbox": "^1.3.7",
    "@radix-ui/react-label": "^2.1.11",
    "@radix-ui/react-popover": "^1.1.19",
    "@radix-ui/react-avatar": "^1.2.2",
    "@radix-ui/react-toast": "^1.2.19",
    "date-fns": "^4.1.0",
    "zod": "^3.23.0",
    "shiki": "^1.22.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.6.0",
    "eslint": "^9.10.0",
    "eslint-config-next": "16.2.10",
    "prettier": "^3.9.5",
    "prettier-plugin-tailwindcss": "^0.8.1",
    "@tailwindcss/postcss": "^4.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

---

## 9. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Tailwind 4 migration breaks build | Test incrementally; keep CSS-first approach; use `@import "tailwindcss"` |
| React 19 breaks shared components | Test shared UI components in web first; they use standard React APIs |
| Static export limits dynamic features | Use client components for interactivity; generate static params for marketplace asset pages |
| Desktop build breaks after shared changes | Run `cd desktop && npm run typecheck && npm run build` after each shared modification |
| Performance regression | Bundle analyzer in CI; lazy load heavy components; optimize images |
| Scope creep | Stick to phases; defer non-critical enhancements to post-launch |

---

## 10. Immediate Next Steps

1. **Create this plan document** ✓
2. Initialize web dependencies (`cd web && npm install`)
3. Configure Tailwind 4 + PostCSS
4. Create design token CSS (`globals.css`)
5. Set up providers, utils, metadata helpers
6. Build UI primitive re-exports
7. Create layout components (Header, Footer, Nav)
8. Build Landing Page (Phase 1)
9. Iterate through phases with build verification at each step