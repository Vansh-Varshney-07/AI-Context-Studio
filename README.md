<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/ai-context-studio/ai-context-studio/main/shared/branding/logo-dark.svg" width="120">
    <img alt="AI Context Studio" src="https://raw.githubusercontent.com/ai-context-studio/ai-context-studio/main/shared/branding/logo-light.svg" width="120">
  </picture>
</p>

<h1 align="center">AI Context Studio</h1>

<p align="center">
  <strong>Local-first, offline-first prompt engineering studio for AI coding assistants</strong>
</p>

<p align="center">
  <a href="https://github.com/ai-context-studio/ai-context-studio/actions/workflows/ci.yml"><img alt="CI Status" src="https://img.shields.io/github/actions/workflow/status/ai-context-studio/ai-context-studio/ci.yml?branch=main&logo=github"></a>
  <a href="https://github.com/ai-context-studio/ai-context-studio/releases"><img alt="Latest Release" src="https://img.shields.io/github/v/release/ai-context-studio/ai-context-studio?logo=github"></a>
  <a href="https://github.com/ai-context-studio/ai-context-studio/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/ai-context-studio/ai-context-studio?color=blue"></a>
  <a href="https://github.com/ai-context-studio/ai-context-studio/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/ai-context-studio/ai-context-studio?style=social"></a>
  <a href="https://discord.gg/ai-context-studio"><img alt="Discord" src="https://img.shields.io/discord/123456789?label=Discord&logo=discord&color=5865F2"></a>
</p>

---

## 🎯 Vision

**AI Context Studio** is a local-first, offline-first prompt engineering studio that lets you build, customize, manage, and export AI instruction assets for **any** coding assistant — Cursor, Claude Code, Windsurf, VS Code Copilot, GitHub Copilot, Continue, Roo Code, OpenCode, and more.

> **One definition. Every target.** Define your prompts, instructions, memories, and workflows once. Export to any AI coding assistant instantly.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **🧠 System Prompts** | Craft and version system prompts with variables, conditionals, and blueprints |
| **📝 Instruction Files** | Create reusable `.md` instruction files with frontmatter and template syntax |
| **👤 Personas** | Define AI personalities with expertise, tone, and behavioral guidelines |
| **🧩 Skills** | Build composable AI capabilities with typed inputs/outputs and validation |
| **🔗 Workflows** | Chain prompts, tools, and agents into repeatable multi-step pipelines |
| **🧠 Memories** | Store persistent context blocks — code snippets, conventions, reference docs |
| **🔌 MCP Manager** | Configure Model Context Protocol servers for databases, APIs, and custom tools |
| **📦 Asset Export** | One-click export to Cursor, Claude Code, Windsurf, VS Code, and 10+ targets |
| **🏪 Marketplace** | Discover, install, and publish community skills, personas, templates, and workflows |
| **📋 Registry** | Open specification for asset packaging, versioning, and compatibility |
| **🔐 Local-First** | All data stays on your machine. No cloud sync. No telemetry. No account required. |

---

## 🏗 Architecture

```
ai-context-studio/
├── shared/           # Shared TypeScript/Rust code (components, hooks, types, utils)
├── desktop/          # Tauri 2 + Next.js desktop application (Windows, macOS, Linux)
├── web/              # Next.js static export (landing, docs, marketplace browser)
├── marketplace/      # Rust crate for marketplace/catalog logic
├── registry/         # Rust crate for asset registry and indexing
├── assets/           # Asset storage (official, community, user, cache)
├── docs/             # Documentation
└── security/         # Security policies and audits
```

### Desktop App (`desktop/`)
- **Framework**: Tauri 2 + Next.js 16 + React 18
- **Language**: TypeScript + Rust
- **Output**: Native binaries (Windows NSIS, macOS DMG, Linux AppImage)
- **Build**: Static export → Tauri bundle

### Web App (`web/`)
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Output**: Static HTML/CSS/JS (`output: "export"`)
- **Hosting**: GitHub Pages, Vercel, Netlify, any static host
- **Features**: Landing page, Documentation, Marketplace browser, Download page

### Shared Code (`shared/`)
- React components (UI primitives, layout, common)
- Custom hooks (`useNavigation`, `useAIEngine`, `useKeyboard`, etc.)
- TypeScript types (Asset, Navigation, Provider, AssetKind)
- Utility functions (`cn`, date, file, uuid)
- Providers (React Query, Toaster, Tooltip)
- Services (AI providers, storage, crypto, platform)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend (Web)** | Next.js 16, React 19, TypeScript |
| **Frontend (Desktop)** | Tauri 2, Next.js 16, React 18 |
| **Styling** | Tailwind CSS v4, CSS Variables, `@tailwindcss/postcss` |
| **UI Primitives** | Radix UI + shadcn/ui patterns |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **State** | Zustand (client), TanStack Query v5 (server) |
| **Forms** | React Hook Form + Zod |
| **Validation** | Zod (schemas → TS types) |
| **Storage** | IndexedDB (Dexie), localStorage, Web Crypto API |
| **Desktop** | Tauri 2 (Rust), NSIS/DMG/AppImage |
| **Marketplace/Registry** | Rust (serde, semver, thiserror) |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20+
- **Rust** 1.77+ (for desktop + marketplace/registry)
- **pnpm** (recommended) or npm

### Web App (Static Site)
```bash
cd web
pnpm install
pnpm run dev        # http://localhost:3000
pnpm run build      # Outputs to ./out/
```

### Desktop App
```bash
cd desktop
pnpm install
pnpm run dev        # Next.js dev server
pnpm run tauri dev  # Tauri dev window
pnpm run tauri build # Native binaries
```

### Rust Workspace (Marketplace + Registry)
```bash
cargo build --workspace
```

---

## 📦 Project Structure (Web)

```
web/
├── public/                 # Static assets (favicons, og-image, manifest, robots)
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout (fonts, providers, analytics)
│   │   ├── page.tsx        # Landing page composition
│   │   ├── globals.css     # Design system (CSS vars + Tailwind v4)
│   │   ├── loading.tsx     # Global loading UI
│   │   ├── not-found.tsx   # 404 page
│   │   ├── robots.ts       # Dynamic robots.txt
│   │   ├── sitemap.ts      # Dynamic sitemap.xml
│   │   ├── manifest.ts     # PWA manifest
│   │   └── marketing/      # All marketing pages
│   ├── components/
│   │   ├── ui/             # shadcn/ui primitives (20 components)
│   │   ├── layout/         # Header, Footer
│   │   ├── sections/       # Landing sections (Hero, Stats, Features, etc.)
│   │   ├── marketplace/    # Marketplace components
│   │   ├── products/       # Products page components
│   │   ├── docs/           # DocLayout, Sidebar, TOC, CodeBlock, Callout
│   │   ├── common/         # AnimatedCounter, ScrollReveal, Skeleton, etc.
│   │   └── registry/       # Registry page components
│   ├── data/               # Constants, marketplace, docs, downloads data
│   ├── hooks/              # useReducedMotion, useMediaQuery, useScrollReveal
│   ├── lib/                # animations, metadata, utils
│   ├── providers/          # WebProviders (QueryClient, Tooltip, Toaster)
│   └── types/              # Web-specific types
├── scripts/                # generate-favicons.js, verify-branding.js
├── lighthouserc.json       # Lighthouse CI config
├── lighthouse-budget.json  # Performance budgets
└── Configuration files
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/ARCHITECTURE.md) | System architecture, tech decisions, folder discipline |
| [Roadmap](docs/PROJECT_ROADMAP.md) | 8-phase development plan |
| [Web Architecture](docs/WEB_ARCHITECTURE.md) | Deep dive into web app architecture |
| [Project State](docs/PROJECT_STATE_REPORT.md) | Complete snapshot before release |
| [Security](docs/SECURITY_REVIEW.md) | Security review findings |
| [Accessibility](docs/ACCESSIBILITY_REPORT.md) | WCAG AA audit results |
| [Performance](docs/PERFORMANCE_REPORT.md) | Lighthouse scores, budgets, optimizations |

---

## 🌐 Deployment

### Web (Static Export)
```bash
cd web
pnpm run build    # Outputs to ./out/
# Deploy ./out/ to Vercel, Netlify, GitHub Pages, Cloudflare Pages
```

**Vercel**: Connect repo → Framework: Next.js → Output: `out/` → Deploy

**GitHub Pages**: 
```yaml
# .github/workflows/deploy.yml
- uses: actions/upload-pages-artifact@v3
  with: { path: ./web/out }
```

### Desktop
```bash
cd desktop
pnpm run tauri build
# Output: desktop/src-tauri/target/release/bundle/
# Windows: .msi/.exe (NSIS)
# macOS: .dmg (Universal)
# Linux: .AppImage
```

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) first.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Make your changes with tests
4. Run `pnpm run lint && pnpm run typecheck && pnpm run format:check`
5. Submit a Pull Request

### Code Style
- **ESLint**: Next.js + TypeScript + React Hooks
- **Prettier**: Single quotes, 2 spaces, trailing commas, 100 char width
- **TypeScript**: Strict mode, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`

---

## 🗺 Roadmap

| Phase | Focus | Timeline |
|--------|-------|----------|
| **Phase 1** | ✅ Web Release (landing, docs, marketplace, registry, download) | **Done** |
| **Phase 2** | Desktop polish (Windows/macOS/Linux parity) | Q3 2024 |
| **Phase 3** | Marketplace backend (Rust API, search, auth) | Q4 2024 |
| **Phase 4** | Backend (sync, teams, cloud optional) | Q1 2025 |
| **Phase 5** | Community ecosystem (plugin SDK, themes, extensions) | Q2 2025 |
| **Phase 6** | AI-powered features (prompt optimizer, agent orchestration) | Q3 2025 |
| **Phase 7** | Enterprise (SSO, audit logs, compliance, SLA) | Q4 2025 |

---

## 🔒 Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting and security policy.

**Key Principles**:
- Local-first: No data leaves your machine without explicit action
- Encrypted credential storage (OS keychain)
- Sandboxed MCP servers
- Code-signed releases (Windows EV, macOS notarization)
- SBOM generated per release

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **shadcn/ui** — Beautiful, accessible UI primitives
- **Radix UI** — Unstyled, accessible primitives
- **Framer Motion** — Delightful animations
- **Lucide** — Clean, consistent icons
- **Tauri** — Native desktop from web tech
- **Next.js** — The React framework for production
- **Vercel** — Deployment platform

---

<p align="center">
  Made with ❤️ by the AI Context Studio team and contributors
</p>

<p align="center">
  <a href="https://github.com/ai-context-studio/ai-context-studio/stargazers">
    <img alt="Star History" src="https://api.star-history.com/svg?repos=ai-context-studio/ai-context-studio&type=Date">
  </a>
</p>