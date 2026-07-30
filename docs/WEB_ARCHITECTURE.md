# AI Context Studio — Web Architecture Document

> **Companion to**: `PROJECT_STATE_REPORT.md`  
> **Focus**: `web/` project deep-dive  
> **Version**: Phase 1 Web Release

---

## 1. Architecture Overview

### 1.1 High-Level Structure
```
web/
├── public/                 # Static assets (favicons, og-image, manifest, robots)
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── layout.tsx      # Root layout (fonts, providers, analytics)
│   │   ├── page.tsx        # Landing page composition
│   │   ├── globals.css     # Design system (CSS variables + Tailwind v4)
│   │   ├── loading.tsx     # Global loading UI
│   │   ├── not-found.tsx   # 404 page
│   │   ├── robots.ts       # Dynamic robots.txt
│   │   ├── sitemap.ts      # Dynamic sitemap.xml
│   │   ├── manifest.ts     # PWA manifest (static JSON)
│   │   └── marketing/      # All marketing pages under /marketing/*
│   │       ├── layout.tsx  # Header + Footer wrapper
│   │       ├── page.tsx    # Landing page (re-exported from root)
│   │       ├── about/      # About page
│   │       ├── community/  # Community page
│   │       ├── docs/       # Documentation (12 categories, 42 pages)
│   │       ├── download/   # Download page
│   │       ├── marketplace/# Marketplace browse + detail
│   │       ├── products/   # Products page
│   │       ├── registry/   # Registry specification
│   │       ├── roadmap/    # Roadmap timeline
│   │       └── security/   # Security page
│   ├── components/
│   │   ├── ui/             # shadcn/ui primitives (20 components)
│   │   ├── layout/         # Header, Footer
│   │   ├── sections/       # Landing page sections (11 components)
│   │   ├── marketplace/    # Marketplace-specific (AssetDetail, CategoryPage)
│   │   ├── products/       # Products page (ArchitectureDiagram, FeatureComparison, WhySeparateApps)
│   │   ├── docs/           # DocLayout, Sidebar, TOC, CodeBlock, Callout, InstallCommand, VersionBadge
│   │   ├── common/         # AnimatedCounter, FloatingPreview, GradientText, ScrollReveal, Skeleton, EmptyState
│   │   └── registry/       # Registry page components (SchemaTable, CompatibilityMatrix, etc.)
│   ├── data/               # Constants, marketplace data, docs data, downloads, stats
│   ├── hooks/              # useReducedMotion, useMediaQuery, useScrollReveal
│   ├── lib/                # animations.ts, metadata.ts, utils.ts
│   ├── providers/          # WebProviders (QueryClient, Tooltip, Toaster)
│   ├── types/              # web.ts (NavItem, FooterSection, DownloadChecksum, etc.)
│   └── styles/             # (empty - using globals.css)
├── scripts/                # generate-favicons.js, verify-branding.js
├── lighthouserc.json       # Lighthouse CI config
├── lighthouse-budget.json  # Performance budgets
└── Configuration files
```

### 1.2 Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Next.js App Router** | Native code-splitting, streaming, static export support |
| **Static Export (`output: "export"`)** | Zero server cost, CDN-friendly, GitHub Pages/Vercel compatible |
| **Route Group `(marketing)`** | Shared Header/Footer layout without URL prefix pollution |
| **CSS Variables + Tailwind v4** | Design tokens in CSS, no JS config needed, themeable |
| **CSS Variable Mapping (`@theme inline`)** | Tailwind v4 native, no `tailwind.config.ts` needed |
| **Static Params (`generateStaticParams`)** | Pre-render all dynamic routes at build time |
| **Route Groups for Marketing** | Clean separation from potential future app routes |
| **shadcn/ui + Radix UI** | Accessible primitives, customizable, tree-shakeable |
| **Framer Motion** | Production-grade animations, reduced motion support |
| **Lucide React** | Consistent icon system, tree-shakeable |

---

## 2. Routing Architecture

### 2.1 Route Manifest (69 Static Routes)
```
├── /                                    → Landing (○ Static)
├── /_not-found                          → 404 (○ Static)
├── /manifest.json                       → PWA (○ Static)
├── /robots.txt                          → Robots (○ Static)
├── /sitemap.xml                         → Sitemap (○ Static)
├── /marketing/about                     → About (○ Static)
├── /marketing/community                 → Community (○ Static)
├── /marketing/docs                      → Docs Index (○ Static)
├── /marketing/docs/[category]           → 8 categories (● SSG)
├── /marketing/docs/[category]/[page]    → 42 pages (● SSG)
├── /marketing/download                  → Download (○ Static)
├── /marketing/marketplace               → Marketplace (○ Static)
├── /marketing/marketplace/[asset]       → 7 assets (● SSG)
├── /marketing/products                  → Products (○ Static)
├── /marketing/registry                  → Registry (○ Static)
├── /marketing/roadmap                   → Roadmap (○ Static)
└── /marketing/security                  → Security (○ Static)
```

### 2.2 Dynamic Route Implementation
| Route | `generateStaticParams` | Data Source |
|-------|------------------------|-------------|
| `/marketing/docs/[category]` | `docCategories.map(c => ({category: c.id}))` | `src/data/docs.ts` |
| `/marketing/docs/[category]/[page]` | `docCategories.flatMap(c => c.items.map(i => ({category: c.id, page: i.href.split("/").pop()})))` | `src/data/docs.ts` |
| `/marketing/marketplace/[asset]` | `assets.map(a => ({asset: a.id}))` | `src/data/marketplace.ts` |

### 2.3 Navigation Model
- **Client-side only**: No page reloads between marketing pages (Header/Footer persist)
- **URL is source of truth**: `NavigationSync` component syncs Zustand store ↔ URL
- **Module-based**: Each marketing page is a "module" in shared navigation store

---

## 3. Component Architecture

### 3.1 Hierarchy
```
RootLayout
├── WebProviders (QueryClient, Tooltip, Toaster)
├── Analytics (GA4, respects DNT)
├── Header (fixed, scroll shadow, mobile menu)
├── Main (page content)
└── Footer
```

### 3.2 Landing Page Composition (`src/app/page.tsx`)
```tsx
<Header />
<section className="flex-1 flex flex-col">
  <Hero />           // Full-screen, animated, dual CTA, floating preview
  <Stats />          // Animated counters (4)
  <Features />       // 6 feature cards
  <ProductGrid />    // 6 products (2 coming soon)
  <MarketplacePreview />  // 3 featured assets
  <DesktopPreview />      // Floating UI mockup
  <RegistryPreview />     // Schema + field table
  <SearchPreview />       // Animated search bar
  <DownloadCTA />         // OS tabs, checksums
  <GitHubCTA />           // Star button
  <CTA />                 // Final conversion section
</section>
<Footer />
```

### 3.3 Section Components (`src/components/sections/`)
| Component | Lines | Animations | Dependencies |
|-----------|-------|------------|--------------|
| `hero.tsx` | 148 | Framer Motion (fadeIn, slideUp, delay stagger) | `Button`, `Link`, `lucide-react` |
| `stats.tsx` | ~60 | AnimatedCounter | `AnimatedCounter`, `useReducedMotion` |
| `features.tsx` | ~60 | hover lift | `Card`, `lucide-react` |
| `product-grid.tsx` | 78 | stagger entrance | `Card`, `Button`, `MotionDiv` |
| `marketplace-preview.tsx` | ~60 | stagger | `Card`, `Badge` |
| `desktop-preview.tsx` | ~80 | float animation | `FloatingPreview` |
| `registry-preview.tsx` | ~60 | slide up | `CodeBlock` (inline) |
| `search-preview.tsx` | ~40 | animated input | `Input`, `Search` icon |
| `download-cta.tsx` | 168 | OS tabs, copy cmd | `OSCommand`, `Button` |
| `github-cta.tsx` | 40 | pulse | `Button`, `Github` |
| `cta.tsx` | 58 | fade in | `Button`, stats |

### 3.3 Marketing Page Components

#### Documentation System (`src/components/docs/`)
| Component | Purpose | Key Features |
|-----------|---------|--------------|
| `doc-layout.tsx` | Page shell | Sidebar nav, TOC, Edit on GitHub, mobile drawer |
| `sidebar.tsx` | Navigation | Collapsible sections, active highlighting, badge support |
| `toc.tsx` | Table of Contents | IntersectionObserver, sticky, smooth scroll |
| `code-block.tsx` | Code display | Copy button, line numbers, filename, language |
| `callout.tsx` | Alerts | 4 types (note/tip/warning/danger) with icons |
| `install-command.tsx` | CLI commands | Copy button, OS-aware |
| `version-badge.tsx` | Version tags | 4 statuses (stable/beta/alpha/deprecated) |
| `os-selector.tsx` | OS tabs | Win/macOS/Linux with icons |

#### Marketplace (`src/components/marketplace/`)
| Component | Purpose |
|-----------|---------|
| `category-page.tsx` | Full marketplace: search, filters (category, kind, compatibility, verified), sort, asset grid, pagination, mobile sidebar |
| `asset-detail.tsx` | Tabs (Overview/Versions/Deps/Readme), sidebar (rating, downloads, install cmd, share), breadcrumbs |

#### Products Page (`src/components/products/`)
| Component | Purpose |
|-----------|---------|
| `architecture-diagram.tsx` | SVG-based system diagram with animated connections |
| `feature-comparison.tsx` | 6×6 feature matrix with checkmarks |
| `why-separate-apps.tsx` | 6 reasons with icons, product overview cards |

#### Registry (`src/components/registry/`)
| Component | Purpose |
|-----------|---------|
| `registry-page.tsx` | 8-tab interface (Schema, Fields, Types, Versioning, Dependencies, Compatibility, Validator, Structure) |

---

## 4. Data Layer

### 4.1 Content Data Files
| File | Exports | Consumers |
|------|---------|-----------|
| `constants.ts` | `mainNav`, `ctaButtons`, `socialLinks`, `footerSections`, `features`, `products`, `stats`, `animatedStats`, `heroStats` | Layout, Landing, Footer |
| `marketplace.ts` | `Asset`, `assets[]`, `getAssetsByCategory`, `getCategories`, `getAssetKinds`, `getAssetById`, `marketplaceCategories`, `featuredAssets`, `categoryIcons` | Marketplace pages, AssetDetail |
| `docs.ts` | `DocSidebarItem`, `DocCategory`, `docCategories[]`, `docSearchIndex`, `quickLinks`, `getCategory`, `getSidebarItems` | Docs pages, DocLayout |
| `downloads.ts` | `PlatformDownload`, `downloads[]`, `sourceCode`, `releaseNotes`, `systemRequirements` | Download page |
| `navigation.ts` | `mainNav`, `ctaButtons`, `socialLinks`, `footerSections` | Header, Footer |
| `community.ts` | `communityStats`, `featuredCreators`, `recentContributors`, `communityLinks`, `howToContribute`, `governance` | Community page |
| `roadmap.ts` | `RoadmapItem`, `RoadmapPhase`, `roadmapPhases[]`, `roadmapStats` | Roadmap page |
| `stats.ts` | `StatItem`, `stats[]` | Stats section |
| `faq.ts` | `FAQItem`, `faqs[]` | (Reserved) |

### 4.2 TypeScript Contracts
```typescript
// marketplace.ts
interface Asset {
  id: string; name: string; description: string;
  author: string; authorAvatar: string;
  category: string; kind: string;
  tags: string[]; version: string;
  rating: number; reviewCount: number;
  downloads: number; updatedAt: string;
  compatibility: string[]; verified: boolean;
  thumbnail?: string; readme: string;
  dependencies: string[]; versions: VersionHistory[];
}

// constants.ts
interface NavItem { label: string; href: string; external?: boolean; }
interface FooterSection { title: string; links: NavItem[]; }
```

---

## 5. Styling & Design System

### 5.1 CSS Variables (`globals.css` — 408 lines)
```css
@theme inline {
  /* Colors */
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F5F1E8;
  --color-bg-tertiary: #FAF7F2;
  --color-bg-surface: #FFFFFF;
  --color-accent: #3B82F6;
  --color-accent-hover: #2563EB;
  --color-accent-light: #DBEAFE;
  --color-violet: #8B5CF6;
  --color-cyan: #06B6D4;
  --color-text-primary: #111827;
  --color-text-secondary: #4B5563;
  --color-text-muted: #9CA3AF;
  --color-border: #E5E7EB;
  /* ... 40+ variables */
  
  /* Typography */
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --text-xs: 0.6875rem;  /* 11px */ ... --text-6xl: 4.5rem;
  
  /* Spacing (8px grid) */
  --space-1: 0.25rem; /* 4px */ ... --space-32: 8rem;
  
  /* Motion */
  --duration-fast: 150ms; --duration-base: 200ms; --duration-slow: 300ms;
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.22, 1, 0.36, 1);
  
  /* Z-Index */
  --z-dropdown: 100; ... --z-toast: 800;
}
```

### 5.2 Utility Classes (CSS)
| Category | Classes |
|----------|---------|
| **Container** | `.container-app` (1280px), `.container-wide` (1440px) |
| **Typography** | `.text-balance`, `.text-pretty` |
| **Card** | `.card`, `.card-hover`, `.card-elevated`, `.card-glass` |
| **Button** | `.btn` + 7 variants (primary/secondary/ghost/outline/danger/glass/subtle) × 5 sizes |
| **Input** | `.input`, `.input-search` |
| **Label** | `.label` |
| **Badge** | `.badge` + 10 variants (default/accent/violet/cyan/success/warning/error/outline/dot) |
| **Divider** | `.divider`, `.divider-strong` |
| **Empty State** | `.empty-state` |
| **Section** | `.section` (py-16 sm:py-24 lg:py-32) |
| **Animations** | `.animate-in`, `.animate-slide-up`, `.animate-slide-down` |

### 5.3 Motion Presets (`lib/animations.ts`)
```typescript
export const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } } };
export const slideUp = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } } };
export const cardHover = { rest: { y: 0, scale: 1 }, hover: { y: -2, scale: 1.01, transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] } } };
export const listStagger = { hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } } };
export const moduleTransition = { hidden: { opacity: 0, y: 6, filter: "blur(4px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } } };
```

### 5.4 Responsive Breakpoints
| Breakpoint | Tailwind | Usage |
|------------|----------|-------|
| Mobile | `< 640px` | Stack layouts, mobile menu, stacked CTAs |
| Tablet | `640px - 1023px` | 2-col grids, side-by-side CTAs |
| Desktop | `1024px - 1279px` | 3-col grids, full nav visible |
| Large | `1280px - 1535px` | Max-width containers, comfortable reading |
| XL | `≥ 1536px` | Full width, generous whitespace |

---

## 6. Metadata & SEO

### 6.1 Metadata Generation (`lib/metadata.ts`)
```typescript
generateMetadata(overrides) → Metadata {
  title: template "%s | AI Context Studio",
  description: fallback to site description,
  keywords: 10 AI/prompt/dev keywords,
  authors: [{ name: "AI Context Studio Team" }],
  openGraph: { type: "website", locale: "en_US", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", images: [ogImage] },
  robots: { index: true, follow: true, googleBot: { maxImagePreview: "large" } },
  icons: { icon: [SVG + PNG], shortcut: SVG, apple: SVG },
  manifest: "/manifest.json",
  // themeColor MOVED to generateViewport() to fix build warning
}
```

### 6.2 Generated SEO Files
| File | Source | Content |
|------|--------|---------|
| `robots.txt` | `src/app/robots.ts` | Allow all, disallow `/api/`, sitemap reference |
| `sitemap.xml` | `src/app/sitemap.ts` | All 69 routes, weekly/daily/yearly frequencies |
| `manifest.json` | `src/app/manifest.ts` + `public/manifest.json` | PWA manifest (icons, theme_color, shortcuts) |
| `robots.txt` (public) | `public/robots.txt` | Static fallback |
| `manifest.json` (public) | `public/manifest.json` | Static fallback |

### 6.3 Structured Data (JSON-LD)
| Schema | Purpose |
|--------|---------|
| `Organization` | Name, URL, logo, social links, description |
| `WebSite` | SearchAction for marketplace |
| `SoftwareApplication` | Category: DeveloperApplication, OS: Win/macOS/Linux, free, in stock |

---

## 7. Build & Performance

### 7.1 Build Configuration (`next.config.ts`)
```typescript
{
  devIndicators: false,
  reactStrictMode: true,
  output: "export",                    // Static export
  images: { unoptimized: true },      // Required for static export
  compiler: { removeConsole: isDev ? false : { exclude: ["error", "warn"] } },
  async headers() { /* CSP + security headers (ignored in static export) */ }
}
```

### 7.2 Build Output
| Metric | Value |
|--------|-------|
| **Routes** | 69 |
| **Static (○)** | 15 |
| **SSG (●)** | 54 |
| **Build Time** | ~11s (5.9s compile + 5.3s TS + 0.6s static gen) |
| **First Load JS** | ~180 kB |
| **Largest Page** | Marketplace asset detail (~4.2 kB) |

### 7.3 Performance Budgets (`lighthouse-budget.json`)
| Resource | Budget |
|----------|--------|
| Total | 500 KB |
| Script | 150 KB |
| CSS | 50 KB |
| Images | 200 KB |
| Font | 50 KB |
| Third-party | 100 KB |
| Third-party count | 10 |

### 7.4 Lighthouse CI Targets (`lighthouserc.json`)
| Category | Threshold |
|----------|-----------|
| Performance | ≥ 0.90 |
| Accessibility | ≥ 0.95 |
| Best Practices | ≥ 0.90 |
| SEO | ≥ 0.90 |
| PWA | ≥ 0.90 (warn) |

---

## 8. Deployment Configuration

### 8.1 Static Export Details
| Setting | Value |
|---------|-------|
| `output` | `"export"` |
| `images.unoptimized` | `true` |
| `trailingSlash` | Not set (default) |
| `generateStaticParams` | All dynamic routes |
| `generateMetadata` | Per-page (async) |

### 8.2 Vercel Compatibility
| Feature | Status |
|---------|--------|
| Static Export | ✅ Supported |
| Edge Functions | ❌ Not used |
| ISR | ❌ Not used (static only) |
| Image Optimization | ❌ Disabled (unoptimized) |
| Middleware | ❌ Not used |

### 8.3 GitHub Pages Compatibility
| Requirement | Status |
|-------------|--------|
| `output: "export"` | ✅ |
| `basePath` support | Not configured (would need `basePath: "/repo-name"`) |
| `assetPrefix` | Not configured |
| 404.html | ✅ (`/not-found` → `404.html`) |

---

## 9. Asset Pipeline

### 9.1 Current Assets
| Asset | Source | Format | Status |
|-------|--------|--------|--------|
| Favicon | `public/favicon.svg` | SVG | Placeholder |
| Favicon 16/32/180/192/512 | `public/icons/*.svg` | SVG | Placeholders |
| Apple Touch | `public/icons/apple.svg` | SVG | Placeholder |
| OG Image | `public/og-image.svg` | SVG (1200×630) | Placeholder |
| Manifest | `public/manifest.json` | JSON | ✅ Complete |

### 9.2 Generation Pipeline (Ready)
| Script | Purpose | Dependencies |
|--------|---------|--------------|
| `scripts/generate-favicons.js` | SVG → PNG (16, 32, 48, 180, 192, 512) | `sharp` |
| `npx to-ico` | PNG → `favicon.ico` | `to-ico` |

---

## 10. Scripts & Utilities

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Dev server |
| `build` | `next build` | Production build + static export |
| `start` | `next start` | Preview export |
| `lint` | `next lint` | ESLint |
| `typecheck` | `tsc --noEmit` | TypeScript check |
| `format` | `prettier --write` | Format code |
| `format:check` | `prettier --check` | Check formatting |

---

## 11. Accessibility & Quality

### 11.1 Accessibility Features
| Feature | Implementation |
|---------|----------------|
| **Semantic HTML** | `<nav>`, `<main>`, `<section>`, `<header>`, `<footer>`, `<article>` |
| **ARIA** | `aria-label`, `aria-labelledby`, `aria-expanded`, `aria-controls`, `role` |
| **Focus Management** | `:focus-visible` rings, skip links, modal trap (Radix) |
| **Reduced Motion** | `@media (prefers-reduced-motion: reduce)` disables all animations |
| **Color Contrast** | WCAG AA (text 4.5:1, UI 3:1) — verified in design tokens |
| **Keyboard Navigation** | All interactive elements reachable, logical tab order |
| **Screen Readers** | Alt text, `aria-hidden` on decorative icons, live regions for toasts |

### 11.2 Quality Gates
| Gate | Command | Threshold |
|------|---------|-----------|
| **TypeScript** | `npm run typecheck` | Zero errors |
| **ESLint** | `npm run lint` | Zero errors |
| **Prettier** | `npm run format:check` | Zero diffs |
| **Build** | `npm run build` | Zero errors, 69 routes |
| **Lighthouse** | `npx lhci autorun` | Perf ≥0.9, A11y ≥0.95 |

---

## 12. Future Improvements (Post-Phase 1)

| Area | Improvement | Effort |
|------|-------------|--------|
| **Images** | Replace SVG placeholders with real PNG/ICO favicons | Low |
| **Analytics** | Add GA4/Umami with cookie consent | Medium |
| **i18n** | Add `next-intl` for multi-language | Medium |
| **Search** | Add Algolia DocSearch to docs | Low |
| **A/B Testing** | Add PostHog/Umami for CTA optimization | Medium |
| **CSP** | Tighten CSP for production (remove `unsafe-inline`) | Low |
| **Edge** | Move to Vercel Edge for faster TTFB | Medium |
| **ISR** | Enable ISR for marketplace if dynamic data added | Medium |

---

*End of Web Architecture Document*  
*Part of Phase 1 Web Release documentation suite*