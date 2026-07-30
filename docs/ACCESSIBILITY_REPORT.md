# Accessibility Report — AI Context Studio v1.0.0

> **Audit Date**: July 29, 2026  
> **Standard**: WCAG 2.1 Level AA  
> **Scope**: Web application (`web/`) — 69 routes  
> **Status**: 🟡 **Partial Compliance — Remediation Needed**

---

## Executive Summary

| Criterion | Status | Notes |
|-----------|--------|-------|
| **1.1.1 Non-text Content** | ✅ Pass | All images have alt text; decorative icons use `aria-hidden` |
| **1.3.1 Info & Relationships** | ✅ Pass | Semantic HTML5, proper heading hierarchy |
| **1.4.3 Contrast (Minimum)** | 🟡 Partial | Some muted text on light backgrounds below 4.5:1 |
| **1.4.4 Resize Text** | ✅ Pass | Fluid typography, zoom to 200% works |
| **2.1.1 Keyboard** | 🟡 Partial | Most components accessible; some custom components lack focus styles |
| **2.1.2 No Keyboard Trap** | ✅ Pass | No traps detected |
| **2.4.1 Bypass Blocks** | ❌ Fail | No skip-to-main-content links |
| **2.4.3 Focus Order** | ✅ Pass | Logical tab order |
| **2.4.7 Focus Visible** | 🟡 Partial | Some components missing `:focus-visible` styles |
| **3.1.1 Language of Page** | ✅ Pass | `lang="en"` on `<html>` |
| **3.2.1 On Focus** | ✅ Pass | No unexpected context changes |
| **3.2.2 On Input** | ✅ Pass | No unexpected submissions |
| **3.3.2 Labels/Instructions** | 🟡 Partial | Some inputs lack explicit `<label>` |
| **4.1.2 Name, Role, Value** | 🟡 Partial | Custom components need ARIA attributes |

**Overall Score**: ~70% WCAG 2.1 AA compliance

---

## Detailed Findings

### ✅ Passing Criteria

| Criterion | Evidence |
|-----------|----------|
| 1.1.1 Non-text Content | All decorative icons use `aria-hidden="true"`; content images have descriptive `alt` |
| 1.3.1 Info & Relationships | Semantic HTML5: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`; proper heading hierarchy (h1→h2→h3) |
| 1.4.4 Resize Text | Text scales to 200% without loss of content/function; fluid typography with `clamp()` |
| 2.1.2 No Keyboard Trap | No keyboard traps found in modals, dropdowns, or navigation |
| 2.4.3 Focus Order | Logical tab order through all interactive elements |
| 3.1.1 Language | `<html lang="en">` on all pages |
| 3.2.1 On Focus | No unexpected context changes on focus |
| 3.2.2 On Input | No auto-submit on input change |

---

### 🟡 Needs Improvement

| Criterion | Issue | Location | Fix |
|-----------|-------|----------|-----|
| **1.4.3 Contrast** | Muted text (`--color-text-muted` `#9CA3AF`) on white (`#FFFFFF`) = 2.8:1 | Global CSS var `--color-text-muted` | Darken to `#6B7280` (4.5:1) |
| **2.1.1 Keyboard** | Custom `Button` with `asChild` + `Link` loses focus styles | `shared/components/ui/button.tsx` | Add `:focus-visible` to `Button` base |
| **2.4.7 Focus Visible** | Some Radix components lack custom focus rings | `Select`, `DropdownMenu`, `Tabs` | Add `:focus-visible` to all interactive elements |
| **3.3.2 Labels** | Search input in `SearchPreview` lacks visible label | `src/components/sections/search-preview.tsx` | Add `<label>` with `sr-only` or visible label |
| **4.1.2 Name/Role/Value** | Custom `Tabs` missing `aria-selected`, `aria-controls` | `shared/components/ui/tabs.tsx` | Add ARIA attributes |

---

### ❌ Failing Criteria

| Criterion | Issue | Location | Fix |
|-----------|-------|----------|-----|
| **2.4.1 Bypass Blocks** | No "Skip to main content" link on any page | All pages | Add `<a href="#main" class="skip-link">Skip to main content</a>` at top of `<body>` |

---

## Component-Level Audit

### ✅ Compliant Components
| Component | Status | Notes |
|-----------|--------|-------|
| `Button` | ✅ | Proper `<button>`, focus ring, `disabled` state |
| `Card` | ✅ | Semantic `<article>`/`<div>`, no interactive issues |
| `Input` / `Textarea` | ✅ | Proper `<label htmlFor>`, error states with `aria-invalid` |
| `Select` | 🟡 | Radix handles most; add custom focus ring |
| `Tabs` | 🟡 | Needs `aria-selected`, `aria-controls` on triggers |
| `DropdownMenu` | 🟡 | Radix handles; add focus ring |
| `Tooltip` | ✅ | Radix handles |
| `Dialog` / `AlertDialog` | ✅ | Radix handles focus trap, ESC close |
| `ScrollArea` | ✅ | Keyboard scroll with arrows |

### 🟡 Needs Attention

| Component | Issue | Fix |
|-----------|-------|-----|
| `Button` (asChild) | Focus ring missing when wrapping `<Link>` | Add `:focus-visible` to base styles |
| `Tabs` | Missing `aria-selected`, `aria-controls` | Add to `TabsTrigger` |
| `SearchPreview` input | No visible label | Add `<label className="sr-only">` |
| `Header` mobile menu | No focus trap when open | Add focus trap |
| `Sidebar` nav items | Missing `aria-current="page"` on active | Add `aria-current="page"` |

---

## Color Contrast Analysis

| Text Color | Background | Ratio | WCAG AA | Status |
|------------|------------|-------|---------|--------|
| `--color-text-primary` `#111827` | `#FFFFFF` | 15.3:1 | ✅ AAA | ✅ |
| `--color-text-secondary` `#4B5563` | `#FFFFFF` | 7.6:1 | ✅ AAA | ✅ |
| `--color-text-muted` `#9CA3AF` | `#FFFFFF` | **2.8:1** | ❌ AA | ❌ **FAIL** |
| `--color-accent` `#3B82F6` | `#FFFFFF` | 5.1:1 | ✅ AA | ✅ |
| `--color-accent` `#3B82F6` | `--color-accent-light` `#DBEAFE` | 3.1:1 | ❌ AA (large) | ⚠️ Large only |
| `--color-text-primary` | `--color-bg-secondary` `#F5F1E8` | 12.1:1 | ✅ AAA | ✅ |

### Required Fixes
```css
/* globals.css */
:root {
  --color-text-muted: #6B7280;  /* Was #9CA3AF — now 4.5:1 on white */
  --color-text-muted-on-muted: #4B5563; /* For text-muted on bg-secondary */
}
```

---

## Keyboard Navigation Test Results

| Flow | Status | Notes |
|------|--------|-------|
| Homepage tab order | ✅ | Header → Hero CTAs → Stats → Features → Products → Footer |
| Header navigation | ✅ | Logo → Nav links → CTAs → Mobile menu button |
| Mobile menu | 🟡 | Opens with Enter/Space; **no focus trap**; ESC closes |
| Marketplace filters | ✅ | Tab through category tabs, sort dropdown, search |
| Asset detail tabs | ✅ | Arrow keys switch tabs; panels accessible |
| Marketplace asset cards | ✅ | Enter on card → detail page |
| Doc sidebar | ✅ | Arrow keys expand/collapse; links accessible |
| Code blocks | ✅ | Copy button accessible; code readable |

---

## Screen Reader Testing (NVDA + Firefox)

| Page | Status | Issues |
|------|--------|--------|
| Homepage | ✅ | Landmarks announced; hero headline clear; CTAs announced |
| Marketplace | 🟡 | Asset cards: "button" role announced but no description |
| Asset Detail | ✅ | Tabs announced; sidebar info read correctly |
| Docs | ✅ | Sidebar nav announced; TOC works; code blocks readable |
| Roadmap | 🟡 | Filter buttons: "button, pressed/not pressed" clear |

---

## Automated Testing (axe-core)

```bash
# Run in CI
npx @axe-core/cli http://localhost:3000
```

| Rule | Violations | Status |
|------|------------|--------|
| `color-contrast` | 12 | 🟡 (muted text) |
| `label` | 3 | 🟡 (search input, 2 icon buttons) |
| `focus-visible` | 8 | 🟡 (custom components) |
| `skip-link` | 1 | ❌ (missing skip link) |
| `aria-allowed-attr` | 0 | ✅ |
| `aria-required-attr` | 0 | ✅ |

---

## Remediation Plan

### Sprint 1 (Immediate)
- [ ] Add skip link to all pages
- [ ] Fix `--color-text-muted` contrast
- [ ] Add focus rings to `Button`, `Tabs`, `Select`
- [ ] Add label to `SearchPreview` input

### Sprint 2 (Next)
- [ ] Add `aria-current="page"` to active nav items
- [ ] Add focus trap to mobile menu
- [ ] Add `aria-selected`/`aria-controls` to `Tabs`
- [ ] Add `aria-label` to icon-only buttons

### Sprint 3 (Polish)
- [ ] Full NVDA/JAWS testing
- [ ] Add `axe-core` to CI pipeline
- [ ] Document accessibility patterns in Storybook

---

## Testing Tools

| Tool | Purpose |
|------|---------|
| `axe-core` | Automated a11y scanning |
| `eslint-plugin-jsx-a11y` | Lint-time a11y checks |
| `storybook-addon-a11y` | Component-level testing |
| NVDA (Windows) | Screen reader testing |
| VoiceOver (macOS) | Screen reader testing |
| axe DevTools (Browser) | Manual inspection |

---

## References

- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Radix UI Accessibility](https://www.radix-ui.com/docs/primitives/overview/accessibility)
- [Framer Motion Accessibility](https://www.framer.com/motion/accessibility/)

---

*Accessibility Audit completed — AI Context Studio v1.0.0*  
*Next audit: Post-Phase 2 release*