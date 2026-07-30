# AI Context Studio - Dependency Audit Report

**Date:** 2026-07-30  
**Repository:** workspace_2  
**Monorepo Structure:** Root with `web/`, `desktop/`, `shared/` workspaces

---

## Executive Summary

The monorepo uses **npm workspaces** with three packages:
- `web/` - Next.js 16 static export (Vercel deployment)
- `desktop/` - Next.js + Tauri desktop app  
- `shared/` - Shared UI components, hooks, utilities, types

**Critical Finding:** The `web/` package is missing **17 transitive dependencies** required by `@ai-context-studio/shared` UI components. This causes build failures in clean environments (GitHub Actions, Vercel).

---

## Package Dependency Analysis

### Root package.json
```json
{
  "private": true,
  "workspaces": ["web", "shared"],
  "devDependencies": {
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3"
  }
}
```
- ✅ No runtime dependencies (correct for workspace root)
- ✅ Only TypeScript types for shared tooling

---

### shared/package.json - @ai-context-studio/shared

**Current Dependencies (28):**
| Package | Version | Actually Used? | Used By |
|---------|---------|----------------|---------|
| @radix-ui/react-avatar | ^1.2.6 | ❌ No | None |
| @radix-ui/react-checkbox | ^1.3.11 | ✅ Yes | Checkbox.tsx |
| @radix-ui/react-dialog | ^1.1.19 | ❌ No | None |
| @radix-ui/react-dropdown-menu | ^2.1.20 | ❌ No | None |
| @radix-ui/react-label | ^2.1.15 | ✅ Yes | Label.tsx |
| @radix-ui/react-popover | ^1.1.23 | ✅ Yes | Popover.tsx |
| @radix-ui/react-scroll-area | ^1.2.14 | ✅ Yes | ScrollArea.tsx |
| @radix-ui/react-select | ^2.3.3 | ✅ Yes | Select.tsx |
| @radix-ui/react-separator | ^1.1.15 | ✅ Yes | Separator.tsx |
| @radix-ui/react-slider | ^1.4.7 | ✅ Yes | Slider.tsx |
| @radix-ui/react-slot | ^1.3.0 | ✅ Yes | Button.tsx |
| @radix-ui/react-switch | ^1.3.7 | ✅ Yes | Switch.tsx |
| @radix-ui/react-tabs | ^1.1.17 | ✅ Yes | Tabs.tsx |
| @radix-ui/react-toast | ^1.2.19 | ❌ No | None |
| @radix-ui/react-tooltip | ^1.2.12 | ✅ Yes | Tooltip.tsx |
| clsx | ^2.1.1 | ✅ Yes | cn.ts utility |
| lucide-react | ^0.453.0 | ✅ Yes | Multiple components |
| tailwind-merge | ^3.6.0 | ✅ Yes | cn.ts utility |

**Unused Dependencies (4) - Should Remove:**
1. `@radix-ui/react-avatar` - Not imported anywhere
2. `@radix-ui/react-dialog` - Not imported anywhere
3. `@radix-ui/react-dropdown-menu` - Not imported anywhere
4. `@radix-ui/react-toast` - Not imported anywhere (Toaster uses internal implementation)

**DevDependencies:**
- `@types/react`, `@types/react-dom`, `typescript` - ✅ Correct

---

### web/package.json - ai-context-studio-web

**Current Dependencies (9):**
| Package | Version | Purpose |
|---------|---------|---------|
| @ai-context-studio/shared | * | Workspace dependency |
| @tanstack/react-query | ^5.59.0 | Data fetching |
| date-fns | ^4.1.0 | Date formatting |
| framer-motion | ^11.0.0 | Animations |
| next | 16.2.10 | Framework |
| react | ^19.0.0 | React |
| react-dom | ^19.0.0 | React DOM |
| shiki | ^1.22.0 | Syntax highlighting |
| zod | ^3.23.0 | Validation |

**MISSING - Required by shared UI components (17):**
| Package | Required By (shared component) |
|---------|--------------------------------|
| @radix-ui/react-avatar | Exported but unused - can skip |
| @radix-ui/react-checkbox | Checkbox.tsx |
| @radix-ui/react-dialog | Exported but unused - can skip |
| @radix-ui/react-dropdown-menu | Exported but unused - can skip |
| @radix-ui/react-label | Label.tsx |
| @radix-ui/react-popover | Popover.tsx |
| @radix-ui/react-scroll-area | ScrollArea.tsx |
| @radix-ui/react-select | Select.tsx |
| @radix-ui/react-separator | Separator.tsx ❌ **CURRENT ERROR** |
| @radix-ui/react-slot | Button.tsx |
| @radix-ui/react-slider | Slider.tsx |
| @radix-ui/react-switch | Switch.tsx |
| @radix-ui/react-tabs | Tabs.tsx ❌ **CURRENT ERROR** |
| @radix-ui/react-toast | Exported but unused - can skip |
| @radix-ui/react-tooltip | Tooltip.tsx |
| clsx | cn.ts utility ❌ **CURRENT ERROR** |
| tailwind-merge | cn.ts utility ❌ **CURRENT ERROR** |

**DevDependencies (16):** ✅ Correct for build tooling

---

### desktop/package.json - ai-context-studio

**Dependencies (38):** ✅ Self-contained, includes all Radix UI, clsx, tailwind-merge, lucide-react, framer-motion, zustand, etc.

**Key Differences from web/shared:**
- Uses `zustand` (not in web/shared)
- Uses `@hookform/resolvers`, `react-hook-form` (forms)
- Uses `idb` (IndexedDB)
- Uses `@tauri-apps/*` plugins
- Higher React version (19.2.4 vs 19.0.0)
- Higher framer-motion (12.42.2 vs 11.0.0)

**Desktop works because:** All dependencies declared directly, no workspace dependency resolution needed.

---

## Import Analysis - shared/ Components

### Radix UI Imports in shared/components/ui/
```
Button.tsx         → @radix-ui/react-slot
Checkbox.tsx       → @radix-ui/react-checkbox
Label.tsx          → @radix-ui/react-label
Popover.tsx        → @radix-ui/react-popover
ScrollArea.tsx     → @radix-ui/react-scroll-area
Select.tsx         → @radix-ui/react-select
Separator.tsx      → @radix-ui/react-separator
Slider.tsx         → @radix-ui/react-slider
Switch.tsx         → @radix-ui/react-switch
Tabs.tsx           → @radix-ui/react-tabs
Tooltip.tsx        → @radix-ui/react-tooltip
```

### Utility Imports
```
cn.ts              → clsx, tailwind-merge
```

### Lucide Icons Used
- Multiple components import individual icons from `lucide-react`

### Framer Motion Used
- command-palette.tsx (shared/components/common & layout)
- main-workspace.tsx (shared/components/layout)
- presets.ts (shared/components/motion)

---

## Dependency Resolution Issues

### Current Resolution Path
```
web/
  node_modules/
    @ai-context-studio/shared → ../../shared (symlink)
    @radix-ui/* → NOT PRESENT (hoisted to root or missing)
    clsx → NOT PRESENT
    tailwind-merge → NOT PRESENT
```

### Expected Resolution (with fix)
```
web/
  node_modules/
    @ai-context-studio/shared → ../../shared (symlink)
    @radix-ui/react-separator → (hoisted from root or local)
    @radix-ui/react-tabs → (hoisted from root or local)
    clsx → (hoisted from root or local)
    tailwind-merge → (hoisted from root or local)
    ... all other Radix packages
```

---

## Duplicate/Version Conflicts

| Package | shared | web | desktop | Conflict? |
|---------|--------|-----|---------|-----------|
| @radix-ui/react-* | Various | MISSING | Various | Yes - web missing |
| clsx | ^2.1.1 | MISSING | ^2.1.1 | Yes - web missing |
| tailwind-merge | ^3.6.0 | MISSING | ^3.6.0 | Yes - web missing |
| lucide-react | ^0.453.0 | MISSING | ^1.24.0 | Version diff (minor) |
| framer-motion | MISSING | ^11.0.0 | ^12.42.2 | Major version diff |
| react | peer | ^19.0.0 | 19.2.4 | Minor version diff |
| @tanstack/react-query | MISSING | ^5.59.0 | ^5.101.2 | Version diff |

---

## Recommendations

### Immediate (Fix Build)
1. **Add 17 missing dependencies to web/package.json** (see list above)
2. **Remove 4 unused dependencies from shared/package.json**
3. **Run clean install test** to verify

### Short-term (Stabilize)
1. **Align framer-motion versions** across packages
2. **Use npm ci in CI** instead of npm install
3. **Add dependency audit script** to catch missing transitive deps
4. **Consider pnpm workspaces** for better hoisting control

### Long-term (Architecture)
1. **Single lockfile strategy** - Use root package-lock.json only
2. **Peer dependencies** - Mark React, Radix UI as peerDependencies in shared
3. **Shared dependency management** - Consider a shared deps package or root-level deps

---

## Files to Modify

1. **web/package.json** - Add 17 missing dependencies
2. **shared/package.json** - Remove 4 unused dependencies
3. **package-lock.json** - Will regenerate after fix

---

## Verification Commands

```bash
# Clean test
cd D:\AI-Lab\workspace_2
rm -rf node_modules web/node_modules shared/node_modules
rm package-lock.json

# Fresh install (as CI would)
npm install --legacy-peer-deps --workspaces --if-present

# Verify resolution
ls node_modules/@radix-ui/
ls node_modules/clsx
ls node_modules/tailwind-merge

# Build web
cd web
npm run build
npm run lint
npm run typecheck
```