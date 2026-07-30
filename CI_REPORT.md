# AI Context Studio - CI/CD Audit Report

**Date:** 2026-07-30  
**Repository:** workspace_2  
**Workflow:** `.github/workflows/web-ci.yml`

---

## Executive Summary

The GitHub Actions workflow for the web application has **correct structure** but **incorrect dependency resolution** due to missing transitive dependencies in `web/package.json`. The workflow will fail in clean environments with "Module not found" errors for packages required by `@ai-context-studio/shared`.

---

## Workflow Analysis

### File: `.github/workflows/web-ci.yml`

### Jobs Structure
| Job | Working Directory | Purpose |
|-----|-------------------|---------|
| typecheck | `./web` | TypeScript compilation check |
| lint | `./web` | ESLint validation |
| build | `./web` | Next.js static export build |
| deploy-preview | N/A | Netlify preview deploy |
| deploy-production | N/A | Netlify production deploy |
| test | `./web` | Test runner (placeholder) |

---

### Issues Found

#### 1. Incorrect Cache Key (All Jobs)
```yaml
cache-dependency-path: package-lock.json
```
**Problem:** Points to root `package-lock.json` but jobs run in `./web`. Should be `web/package-lock.json` for proper caching.

#### 2. Working Directory Mismatch
```yaml
defaults:
  run:
    working-directory: ./web
```
But install step uses:
```yaml
run: npm install --legacy-peer-deps --workspaces --if-present
working-directory: ..
```
**Problem:** Install runs from root with workspaces, but build runs from `./web`. Module resolution may not find hoisted deps.

#### 3. Missing Transitive Dependencies
The `web/package.json` doesn't declare dependencies that `@ai-context-studio/shared` exports. When npm hoists, it may not hoist packages that only appear in workspace sub-dependencies.

#### 4. No `npm ci` for Reproducible Builds
Uses `npm install` which can produce different results. Should use `npm ci` with lockfile.

#### 5. Netlify Deploy Instead of Vercel
Workflow deploys to Netlify but `vercel.json` exists. Confusing dual deployment targets.

---

## Vercel Configuration Audit

### File: `vercel.json`
```json
{
  "installCommand": "npm install --legacy-peer-deps --workspaces --if-present",
  "buildCommand": "npm run build --workspace=web",
  "outputDirectory": "web/out",
  "framework": "nextjs",
  "devCommand": "npm run dev --workspace=web"
}
```

### Issues

1. **Same `--legacy-peer-deps --workspaces` issue** - hoisting unreliable
2. **`buildCommand` runs from root** with `--workspace=web` - Next.js runs in `web/` but may not resolve workspace deps correctly
3. **No `npm ci`** - Uses `npm install`
4. **No `outputDirectory` validation** - `web/out` assumes static export works

---

## Next.js Configuration Audit

### File: `web/next.config.ts`
```typescript
const nextConfig: NextConfig = {
  output: "export",
  turbopack: {
    root: "../.."
  },
  // ... headers (ignored with output: export)
}
```

### Issues

1. **`turbopack.root: "../.."`** - Points to repo root. May help with workspace resolution but not guaranteed.
2. **`output: "export"` with headers** - Headers are ignored in static export (warning shown but not fatal).
3. **No `transpilePackages`** - If using workspace packages with ESM, may need transpilation.

---

## Root Cause Chain

```
1. web/package.json missing 17 deps from shared
       ↓
2. npm install --workspaces hoists incompletely
       ↓
3. shared/node_modules has deps but web can't resolve
       ↓
4. TypeScript/Next.js compilation fails: "Module not found"
       ↓
4. CI fails, Vercel fails
```

---

## Required Fixes

### 1. web/package.json - Add Missing Dependencies
Add all 17 packages that shared's UI components require (see DEPENDENCY_AUDIT.md)

### 2. shared/package.json - Remove Unused
Remove 4 unused Radix UI packages

### 3. .github/workflows/web-ci.yml - Fix Cache & Install
```yaml
# Fix cache key
cache-dependency-path: web/package-lock.json

# Use npm ci for reproducible installs
- name: Install dependencies
  run: npm ci --workspaces --if-present
  working-directory: ..

# Ensure build runs after successful install
```

### 4. vercel.json - Fix Build Command
```json
{
  "installCommand": "npm ci --workspaces --if-present",
  "buildCommand": "cd web && npm run build",
  "outputDirectory": "web/out"
}
```

### 5. next.config.ts - Add Transpile
```typescript
transpilePackages: ["@ai-context-studio/shared"]
```

---

## Verification Checklist

- [ ] Clean install works: `rm -rf node_modules && npm ci --workspaces`
- [ ] web/build passes: `cd web && npm run build`
- [ ] TypeCheck passes: `cd web && npm run typecheck`
- [ ] Lint passes: `cd web && npm run lint`
- [ ] GitHub Actions pass on push
- [ ] Vercel deployment succeeds

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Build fails in CI | High | High | Fix deps, use npm ci |
| Vercel deploy fails | High | High | Fix vercel.json commands |
| Local works but CI fails | Medium | High | Clean install test locally |
| Dependency drift | Medium | Medium | Add audit script |
| Version conflicts | Low | Medium | Align versions across workspaces |

---

## Files to Modify

1. `web/package.json` - Add 17 missing dependencies
2. `shared/package.json` - Remove 4 unused dependencies  
3. `.github/workflows/web-ci.yml` - Fix cache key, use npm ci
4. `vercel.json` - Fix install/build commands
5. `web/next.config.ts` - Add transpilePackages