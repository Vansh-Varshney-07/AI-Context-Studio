# Build Failure Analysis Report

**Date:** 2026-07-30  
**Repository:** workspace_2  
**Branch:** main

---

## Executive Summary

The web application fails to build in GitHub Actions and Vercel due to **missing transitive dependencies** from the `shared` workspace package. The `shared` package exports UI components that depend on Radix UI primitives, `clsx`, and `tailwind-merge`, but these are not declared in `web/package.json`.

**Root Cause:** npm workspaces hoisting is unreliable in CI/Vercel clean builds. Next.js with Turbopack running in `web/` directory cannot resolve dependencies that only exist in the root `node_modules` hoisted by workspace install.

---

## Error Evidence

### GitHub Actions Failure
```
Module not found: Can't resolve '@radix-ui/react-separator'
Module not found: Can't resolve '@radix-ui/react-tabs'
Module not found: Can't resolve 'clsx'
Module not found: Can't resolve 'tailwind-merge'
```

### Vercel Deployment Failure
Same missing module errors during `npm run build --workspace=web`

---

## Why Desktop Works but Web Fails

| Aspect | Desktop | Web |
|--------|---------|-----|
| **Package Manager** | Standalone `package.json` | npm workspace (`@ai-context-studio/shared`) |
| **Dependencies** | All declared explicitly in `desktop/package.json` | Only declares `@ai-context-studio/shared: "*"` |
| **Radix UI** | All 15+ packages in `dependencies` | None - expects transitive from shared |
| **clsx/tailwind-merge** | Direct dependency | Missing - only in shared |
| **Build Tool** | Next.js + Tauri | Next.js 16 + Turbopack (export) |
| **Node Resolution** | Standard Next.js | Turbopack with custom root |

---

## Why GitHub Actions Fails

### CI Workflow Analysis (`.github/workflows/web-ci.yml`)

```yaml
- name: Install all dependencies (root + workspaces)
  run: npm install --legacy-peer-deps --workspaces --if-present
  working-directory: ..
```

**Issues:**
1. `--legacy-peer-deps` can cause incomplete hoisting
2. Cache key only uses root `package-lock.json` - workspace changes may not invalidate
3. Build runs in `./web` but resolution may not reach root `node_modules`

### Missing Workspace Dependencies in web/package.json
The web app imports `@ai-context-studio/shared` which exports:
- `Button` → needs `@radix-ui/react-slot`
- `Checkbox` → needs `@radix-ui/react-checkbox`
- `Label` → needs `@radix-ui/react-label`
- `Popover` → needs `@radix-ui/react-popover`
- `ScrollArea` → needs `@radix-ui/react-scroll-area`
- `Select` → needs `@radix-ui/react-select`
- `Separator` → needs `@radix-ui/react-separator` ❌ **MISSING**
- `Slider` → needs `@radix-ui/react-slider`
- `Switch` → needs `@radix-ui/react-switch`
- `Tabs` → needs `@radix-ui/react-tabs` ❌ **MISSING**
- `Tooltip` → needs `@radix-ui/react-tooltip`
- `cn()` utility → needs `clsx` + `tailwind-merge` ❌ **MISSING**

---

## Why Vercel Fails

### vercel.json Configuration
```json
{
  "installCommand": "npm install --legacy-peer-deps --workspaces --if-present",
  "buildCommand": "npm run build --workspace=web",
  "outputDirectory": "web/out"
}
```

**Issues:**
1. Same `--legacy-peer-deps` hoisting problem
2. `buildCommand` runs in workspace context but Next.js runs in `web/` subdirectory
3. Turbopack `root: "../.."` may not include root `node_modules` in module resolution
4. No `npm ci` for reproducible installs

---

## Why Local Build Sometimes Works

1. **Pre-existing node_modules** - Previous installs hoisted deps to root
2. **npm cache** - Local cache may have packages
3. **Symlinks** - Workspace symlinks may exist from prior `npm install`
4. **Different npm version** - Local vs CI npm hoisting behavior varies

---

## Dependency Graph

```
web/
├── @ai-context-studio/shared (workspace:*)
│   ├── @radix-ui/react-separator  ← NOT in web deps
│   ├── @radix-ui/react-tabs       ← NOT in web deps
│   ├── clsx                       ← NOT in web deps
│   ├── tailwind-merge             ← NOT in web deps
│   ├── @radix-ui/react-slot       ← NOT in web deps
│   ├── @radix-ui/react-checkbox   ← NOT in web deps
│   └── ... 10 more Radix packages  ← NOT in web deps
├── @tanstack/react-query
├── date-fns
├── framer-motion
├── next
├── react
├── react-dom
├── shiki
└── zod
```

---

## Fix Required

### web/package.json - Add Missing Transitive Dependencies

```json
"dependencies": {
  "@ai-context-studio/shared": "*",
  "@tanstack/react-query": "^5.59.0",
  "date-fns": "^4.1.0",
  "framer-motion": "^11.0.0",
  "next": "16.2.10",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "shiki": "^1.22.0",
  "zod": "^3.23.0",
  // ADD THESE (from shared's UI component requirements):
  "@radix-ui/react-avatar": "^1.2.6",
  "@radix-ui/react-checkbox": "^1.3.11",
  "@radix-ui/react-dialog": "^1.1.19",
  "@radix-ui/react-dropdown-menu": "^2.1.20",
  "@radix-ui/react-label": "^2.1.15",
  "@radix-ui/react-popover": "^1.1.23",
  "@radix-ui/react-scroll-area": "^1.2.14",
  "@radix-ui/react-select": "^2.3.3",
  "@radix-ui/react-separator": "^1.1.15",
  "@radix-ui/react-slot": "^1.3.0",
  "@radix-ui/react-slider": "^1.4.7",
  "@radix-ui/react-switch": "^1.3.7",
  "@radix-ui/react-tabs": "^1.1.17",
  "@radix-ui/react-toast": "^1.2.19",
  "@radix-ui/react-tooltip": "^1.2.12",
  "clsx": "^2.1.1",
  "lucide-react": "^0.453.0",
  "tailwind-merge": "^3.6.0"
}
```

### shared/package.json - Clean Up Unused

Remove unused dependencies (not imported by any shared component):
- `@radix-ui/react-avatar`
- `@radix-ui/react-dialog`
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-toast`

---

## Verification Steps

```bash
# Clean test
cd web
rm -rf node_modules .next out
cd ..
rm -rf node_modules package-lock.json

# Fresh install (as CI would)
npm install --legacy-peer-deps --workspaces --if-present

# Verify all workspaces have deps
ls node_modules/@radix-ui/
ls node_modules/clsx
ls node_modules/tailwind-merge

# Build web
cd web
npm run build
npm run lint
npm run typecheck
```

---

## Prevention Strategy

1. **Explicit transitive deps** - Always declare in consuming package what its dependencies' exports need
2. **CI uses `npm ci`** - Replace `npm install` with `npm ci` for reproducible builds
3. **Lockfile per workspace** - Consider separate lockfiles or `npm workspaces` with proper hoisting config
4. **Build verification** - Add `npm run build` to CI before deploy
5. **Dependency audit script** - Add script to detect missing transitive deps