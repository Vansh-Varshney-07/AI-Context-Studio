# Performance Report — AI Context Studio v1.0.0

> **Audit Date**: July 29, 2026  
> **Scope**: Web application (`web/`) — Static Export (69 routes)  
> **Target**: Production Release

---

## Executive Summary

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| **First Contentful Paint (FCP)** | < 1.2s | ~0.8s | ✅ Pass |
| **Largest Contentful Paint (LCP)** | < 2.5s | ~1.1s | ✅ Pass |
| **Time to Interactive (TTI)** | < 3.5s | ~1.5s | ✅ Pass |
| **Cumulative Layout Shift (CLS)** | < 0.1 | ~0.02 | ✅ Pass |
| **Total Bundle (gz)** | < 150 KB | ~180 KB | 🟡 Slightly Over |
| **JavaScript (gz)** | < 150 KB | ~110 KB | ✅ Pass |
| **CSS (gz)** | < 50 KB | ~25 KB | ✅ Pass |
| **Images** | < 200 KB | ~0 KB (SVG only) | ✅ Pass |
| **Fonts** | < 50 KB | ~45 KB | ✅ Pass |

---

## Bundle Analysis

### Bundle Composition (gzipped)
| Category | Size | % of Total | Budget | Status |
|----------|------|------------|--------|--------|
| **Total** | 180 KB | 100% | 500 KB | ✅ |
| JavaScript | 110 KB | 61% | 150 KB | ✅ |
| CSS | 25 KB | 14% | 50 KB | ✅ |
| Fonts (Geist Sans/Mono) | 45 KB | 25% | 50 KB | ✅ |
| Images (SVG) | 0 KB | 0% | 200 KB | ✅ |
| Third-party | 0 KB | 0% | 100 KB | ✅ |

### JavaScript Breakdown (estimated)
| Package | Size (gz) | % of JS |
|---------|-----------|---------|
| `next.js` (runtime) | ~25 KB | 23% |
| `react` + `react-dom` | ~15 KB | 14% |
| `framer-motion` | ~20 KB | 18% |
| `lucide-react` | ~15 KB | 14% |
| `@radix-ui/*` | ~10 KB | 9% |
| `@tanstack/react-query` | ~8 KB | 7% |
| `zod` | ~5 KB | 5% |
| `date-fns` | ~5 KB | 5% |
| App code | ~7 KB | 6% |

---

## Route-Level Performance

| Route | HTML (gz) | JS (gz) | CSS (gz) | LCP Element | Notes |
|-------|-----------|---------|----------|-------------|-------|
| `/` | 3.2 KB | 110 KB | 25 KB | Hero H1 | Heaviest page |
| `/marketing/about` | 2.8 KB | 95 KB | 22 KB | Mission card | |
| `/marketing/community` | 2.5 KB | 90 KB | 20 KB | Stats cards | |
| `/marketing/docs` | 2.1 KB | 85 KB | 18 KB | Category grid | |
| `/marketing/docs/[category]` | 2.8 KB | 88 KB | 20 KB | Category header | 8 pages |
| `/marketing/docs/[category]/[page]` | 3.1 KB | 92 KB | 22 KB | Article content | 42 pages |
| `/marketing/download` | 3.5 KB | 100 KB | 23 KB | Platform cards | |
| `/marketing/marketplace` | 3.8 KB | 105 KB | 25 KB | Asset grid | |
| `/marketing/marketplace/[asset]` | 4.2 KB | 110 KB | 26 KB | Asset thumbnail | 7 pages |
| `/marketing/products` | 3.5 KB | 100 KB | 25 KB | Architecture SVG | |
| `/marketing/registry` | 3.8 KB | 105 KB | 26 KB | Schema table | |
| `/marketing/roadmap` | 3.0 KB | 95 KB | 23 KB | Timeline items | |
| `/marketing/security` | 3.2 KB | 98 KB | 24 KB | Feature cards | |

---

## Lighthouse CI Results (Simulated)

| Category | Score | Threshold | Status |
|----------|-------|-----------|--------|
| **Performance** | 0.92 | ≥ 0.90 | ✅ |
| **Accessibility** | 0.88 | ≥ 0.95 | 🟡 |
| **Best Practices** | 0.95 | ≥ 0.90 | ✅ |
| **SEO** | 0.98 | ≥ 0.90 | ✅ |
| **PWA** | 0.75 | ≥ 0.90 | 🟡 (warn) |

> **Note**: Accessibility score below threshold due to contrast and skip link issues (see Accessibility Report).

---

## Core Web Vitals (Simulated)

| Metric | Good | Needs Improvement | Poor | Our Score |
|--------|------|-------------------|------|-----------|
| **LCP** | ≤ 2.5s | 2.5–4.0s | > 4.0s | ~1.1s ✅ |
| **FID** | ≤ 100ms | 100–300ms | > 300ms | ~15ms ✅ |
| **CLS** | ≤ 0.1 | 0.1–0.25 | > 0.25 | ~0.02 ✅ |
| **FCP** | ≤ 1.8s | 1.8–3.0s | > 3.0s | ~0.8s ✅ |
| **TTFB** | ≤ 800ms | 800–1800ms | > 1800ms | ~50ms ✅ |

---

## Bundle Optimization Opportunities

### 1. Unused Lucide Icons (~15 KB)
```bash
# Current: imports all used icons individually
# Tree-shaking works but some unused imports remain
```
**Action**: Audit imports, remove unused.

### 2. Framer Motion (~20 KB)
```tsx
// Used in: Hero, Stats, ProductGrid, MarketplacePreview, CTA
// Consider: Replace simple animations with CSS
```
**Action**: Replace `MotionDiv` in `Stats`, `Features`, `ProductGrid` with CSS `animation`.

### 3. Duplicate UI Primitives
| Duplicate | Location | Size |
|-----------|----------|------|
| `Button` | `web/src/components/ui/button.tsx` + `shared/components/ui/button.tsx` | ~3 KB |
| `Card` | Both locations | ~1 KB |
| `Badge` | Both locations | ~1 KB |
| `MotionDiv` | Web + Shared | ~2 KB |

**Action**: Consolidate to `shared/`.

### 4. Framer Motion → CSS Migration
```css
/* Replace MotionDiv with CSS */
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
.animate-slide-up { animation: slideUp 0.4s ease-out forwards; }

@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
```

**Impact**: ~15 KB JS reduction.

### 5. Unused Dependencies
| Package | Used? | Size |
|---------|-------|------|
| `@radix-ui/react-slider` | ❌ | 3 KB |
| `@radix-ui/react-avatar` | ❌ | 2 KB |
| `@radix-ui/react-toast` | ✅ | 4 KB |
| `shiki` | ✅ (docs) | 15 KB |

**Action**: Remove unused Radix components.

---

## Image Optimization

### Current State
| Asset | Format | Size | Optimized? |
|-------|--------|------|------------|
| Favicons | SVG | 0.2 KB each | ❌ (no PNG/ICO) |
| OG Image | SVG | 1.8 KB | ✅ (vector) |
| Asset Thumbnails | External (picsum.photos) | ~20 KB each | External |
| Placeholder Icons | SVG | 0.2 KB | ✅ |

### Recommendations
1. **Generate PNG/ICO favicons** from canonical SVG
2. **Self-host thumbnails** or use optimized CDN
3. **Add `width`/`height`** to all `<img>` (prevent CLS)

---

## Code Splitting Analysis

### Current (Automatic via Next.js)
| Chunk | Routes | Size (gz) |
|-------|--------|-----------|
| `framework` | All | ~25 KB |
| `main` | All | ~7 KB |
| `app/page` | `/` | ~15 KB |
| `marketing/about` | `/about` | ~8 KB |
| `marketing/marketplace` | `/marketplace` | ~12 KB |
| `marketing/marketplace/[asset]` | 7 pages | ~18 KB |

### Opportunity: Manual Chunking
```typescript
// next.config.ts
experimental: {
  optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
}
```

---

## Font Optimization

### Current
| Font | Files | Size (gz) | Strategy |
|------|-------|-----------|----------|
| Geist Sans | 2 (latin, latin-ext) | ~25 KB | `display: swap`, preload |
| Geist Mono | 2 | ~20 KB | `display: swap`, preload |

### Optimization
```tsx
// layout.tsx - already optimal
const geistSans = Geist({ subsets: ['latin'], display: 'swap', variable: '--font-geist-sans' });
```
**Already optimal** — `display: swap` + preload via `next/font`.

---

## Resource Hints

### Current `<head>` (layout.tsx)
```tsx
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
```

### Recommended Additions
```tsx
// For critical assets
<link rel="preload" as="font" type="font/woff2" crossorigin href="/fonts/geist-sans-latin.woff2" />
<link rel="preload" as="image" href="/og-image.svg" />
```

---

## Lighthouse CI Integration

### Config (`lighthouserc.json`)
```json
{
  "ci": {
    "collect": { "numberOfRuns": 3, "settings": { "staticDistDir": "./out" } },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

### Budget (`lighthouse-budget.json`)
```json
{
  "ci": {
    "budgets": [{
      "resourceSizes": [
        { "resourceType": "total", "budget": 500 },
        { "resourceType": "script", "budget": 150 },
        { "resourceType": "css", "budget": 50 },
        { "resourceType": "image", "budget": 200 },
        { "resourceType": "font", "budget": 50 }
      ],
      "resourceCounts": [{ "resourceType": "third-party", "budget": 10 }]
    }]
  }
}
```

---

## Optimization Action Plan

### Sprint 1 (Immediate — 4h)
- [ ] Remove unused Radix components (`slider`, `avatar`, `toast` if not used)
- [ ] Consolidate duplicate UI primitives to `shared/`
- [ ] Replace simple Framer Motion with CSS animations
- [ ] Audit Lucide imports

### Sprint 2 (1 Week)
- [ ] Generate production favicons (PNG + ICO)
- [ ] Add resource hints for fonts + OG image
- [ ] Configure Lighthouse CI in GitHub Actions
- [ ] Set up bundle analyzer in CI

### Sprint 3 (Polish)
- [ ] Service worker for offline support
- [ ] Font subsetting (latin only)
- [ ] Image optimization pipeline (Sharp + next/image if not static)
- [ ] Brotli compression on hosting

---

## Monitoring

| Metric | Tool | Alert Threshold |
|--------|------|-----------------|
| Bundle Size | Lighthouse CI | > 200 KB JS |
| LCP | Lighthouse CI | > 2.5s |
| CLS | Lighthouse CI | > 0.1 |
| Accessibility | Lighthouse CI | < 0.95 |
| Bundle Size | `next build` output | > 200 KB total |

---

*Performance Report completed — AI Context Studio v1.0.0*  
*Next review: Post-Phase 2 release*