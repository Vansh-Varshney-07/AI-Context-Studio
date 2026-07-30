# Changelog

All notable changes to AI Context Studio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Initial web release (Phase 1)
  - Landing page with hero, stats, features, product grid, marketplace preview, desktop preview, registry preview, search preview, download CTA, GitHub CTA
  - Documentation site with 12 categories, 42 pages
  - Marketplace browser with category tabs, filters, search, sort
  - Marketplace asset detail pages with tabs (overview, versions, dependencies, readme)
  - Products page with architecture diagram, feature comparison table, "Why Separate Apps?" section
  - Registry specification page with schema, fields, asset types, versioning, dependencies, compatibility matrix, validator, package structure
  - Roadmap page with filterable timeline and expandable details
  - Security page with encryption, MCP sandboxing, responsible disclosure
  - About page with mission, vision, values, history, team
  - Community page with stats, featured creators, recent contributors
  - Download page with platform variants, checksums, source code, release notes
  - Security page with encryption details, MCP sandboxing, responsible disclosure
  - PWA manifest, robots.txt, sitemap.xml, Open Graph, Twitter Cards
  - Analytics component (GA4, respects DNT)
  - Lighthouse CI configuration and performance budgets

- Desktop app (Tauri 2 + Next.js)
  - Dashboard with sidebar, main workspace, top-right user section
  - Instruction Files module (AGENTS.md, per-target configs)
  - Prompt Library with categories, editor, templates
  - Personas management
  - Skills development with I/O schemas
  - Workflows (YAML, multi-step)
  - Memories & Context persistence
  - MCP Manager with server config, permissions
  - Asset Validator
  - Prompt Optimizer with iterative improvement
  - Settings (theme, editor, export, marketplace, security, advanced)

- Shared codebase
  - 20+ UI primitives (Button, Card, Badge, Input, Label, Select, Tabs, Checkbox, Slider, Switch, Tabs, Tooltip, Toaster, Popover, Separator, ScrollArea, Avatar, DropdownMenu, CommandPalette)
  - Layout components (AppShell, Sidebar, Topbar, MainWorkspace, WorkspaceShell, UserSection)
  - Common components (CommandPalette, EmptyState, ErrorBoundary, Skeleton, Spinner, Tag)
  - Motion presets (fadeIn, slideUp, cardHover, listStagger, moduleTransition, baseTransition)
  - Navigation store (Zustand, URL-sync, history stack)
  - Provider system (React Query, Tooltip, Toaster)
  - AI Provider adapters (OpenAI, Anthropic, Google, DeepSeek, NVIDIA, Ollama, OpenRouter)
  - Crypto service (Web Crypto AES-GCM, PBKDF2)
  - Storage service (Dexie/IndexedDB)
  - Platform abstraction (Capacitor-style)

### Changed
- N/A (initial release)

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A

---

## [0.1.0] - 2024-01-15

### Added
- Initial project scaffolding
- Monorepo structure with shared/desktop/web
- Tauri + Next.js desktop foundation
- Next.js static export web foundation
- Shared UI component library
- Basic navigation and layout system

---

## Release Types

| Type | Description |
|------|-------------|
| **Major** | Breaking changes to public APIs, data formats, or architecture |
| **Minor** | New features, new pages, new components (backward compatible) |
| **Patch** | Bug fixes, typo fixes, dependency updates (backward compatible) |

---

## Release Process

1. Update `CHANGELOG.md` with new version
2. Update version in `package.json` / `Cargo.toml`
3. Create signed tag: `git tag -s v1.2.3 -m "Release v1.2.3"`
4. Push tag: `git push origin v1.2.3`
5. GitHub Actions builds and publishes releases
5. Update `CHANGELOG.md` with release notes

---

## Links

- [GitHub Releases](https://github.com/ai-context-studio/ai-context-studio/releases)
- [GitHub Issues](https://github.com/ai-context-studio/ai-context-studio/issues)
- [GitHub Discussions](https://github.com/ai-context-studio/ai-context-studio/discussions)