<h1 align="center">AI Context Studio</h1>

<p align="center">
  <strong>Local-first, offline-first prompt engineering studio for AI coding assistants</strong>
</p>

<p align="center">
  <a href="https://github.com/Vansh-Varshney-07/AI-Context-Studio"><img alt="GitHub" src="https://img.shields.io/badge/GitHub-Vansh--Varshney--07%2FAI--Context--Studio-blue?logo=github"></a>
  <a href="https://github.com/Vansh-Varshney-07/AI-Context-Studio/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/Vansh-Varshney-07/AI-Context-Studio?color=blue"></a>
</p>

---

## Vision

AI Context Studio is a local-first, offline-first prompt engineering studio that lets you build, customize, manage, and export AI instruction assets for any coding assistant — Cursor, Claude Code, Windsurf, VS Code Copilot, GitHub Copilot, Continue, Roo Code, OpenCode, and more.

> One definition. Every target. Define your prompts, instructions, memories, and workflows once. Export to any AI coding assistant instantly.

---

## Key Features

| Feature | Description |
|---------|-------------|
| System Prompts | Craft and version system prompts with variables, conditionals, and blueprints |
| Instruction Files | Create reusable `.md` instruction files (CLAUDE.md, AGENTS.md, .cursorrules, etc.) |
| Personas | Define AI personalities with expertise, tone, and behavioral guidelines |
| Skills | Build composable AI capabilities with typed inputs/outputs and validation |
| Workflows | Chain prompts, tools, and agents into repeatable multi-step pipelines |
| Memories | Store persistent context blocks — code snippets, conventions, reference docs |
| MCP Manager | Configure Model Context Protocol servers for databases, APIs, and custom tools |
| Asset Validator | Validate AI assets with quality scoring and compatibility checks |
| Prompt Optimizer | Optimize prompts with 16 deterministic engines (clarity, conciseness, etc.) |
| Marketplace | Discover, install, and publish community skills, personas, templates, and workflows |
| Registry | Open specification for asset packaging, versioning, and compatibility |
| Local-First | All data stays on your machine. No cloud sync. No telemetry. No account required. |

---

## Architecture

```
ai-context-studio/
├── shared/           # Shared TypeScript code (components, hooks, types, utils)
├── desktop/          # Next.js desktop application (Windows, macOS, Linux)
├── web/              # Next.js web app (landing, docs, marketplace, tools, generate)
├── marketplace/      # Rust crate for marketplace/catalog logic
├── registry/         # Rust crate for asset registry and indexing
├── assets/           # Asset storage (official, community, user, cache)
├── docs/             # Documentation
└── security/         # Security policies and audits
```

### Desktop App (`desktop/`)
- **Framework**: Next.js 16 + React 18 + TypeScript
- **Output**: Native binaries (via Tauri 2)
- **Persistence**: IndexedDB (Dexie), localStorage, Web Crypto API
- **AI Providers**: OpenAI, Anthropic, Google, DeepSeek, NVIDIA, OpenRouter, Ollama

### Web App (`web/`)
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Database**: Neon Serverless Postgres (Prisma ORM)
- **Auth**: Better Auth (email/password + GitHub + Google social)
- **Hosting**: Vercel
- **Features**: Landing, docs, marketplace, generator tools, admin panel, blog, community

### Shared Code (`shared/`)
- React components (UI primitives, layout, common)
- Custom hooks (useAIEngine, useNavigation, etc.)
- TypeScript types (Asset, Navigation, Provider, AssetKind)
- Utility functions (cn, date, file, uuid)
- Services (AI providers, storage, crypto, platform)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend (Web)** | Next.js 16, React 19, TypeScript |
| **Frontend (Desktop)** | Next.js 16, React 18, TypeScript |
| **Styling** | Tailwind CSS v4, CSS Variables |
| **UI Primitives** | Radix UI + shadcn/ui patterns |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **State** | Zustand (client), TanStack Query v5 (server) |
| **Database** | Neon Serverless Postgres (Prisma ORM) |
| **Auth** | Better Auth |
| **Validation** | Zod |
| **Syntax Highlighting** | Shiki |
| **Email** | Resend |
| **Payments** | Stripe (optional) |

---

## Quick Start

### Prerequisites
- **Node.js** 20+
- **npm** 10+ or **pnpm** 9+

### Web App
```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run build      # Production build
npm run typecheck  # TypeScript check
npm run lint       # ESLint
npm run format     # Prettier format
```

### Desktop App
```bash
cd desktop
npm install
npm run dev        # Next.js dev server
npm run build      # Build
```

### Database Setup (Web)
```bash
cd web
# Set DATABASE_URL in .env.local
npm run db:push    # Push schema to Neon
npm run db:seed    # Seed real data (users, categories, tags, docs, templates)
npm run db:studio  # Prisma Studio GUI
```

---

## Code Style

- **ESLint**: Next.js + TypeScript + React Hooks
- **Prettier**: Single quotes, 2 spaces, trailing commas, 100 char width
- **TypeScript**: Strict mode, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`
- **Naming**: PascalCase for components, camelCase for functions/variables, UPPER_SNAKE_CASE for constants
- **Functions**: `import type` for type-only imports (required by `verbatimModuleSyntax`)
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `docs:`, `refactor:`, `perf:`, `chore:`

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Make your changes
4. Run: `npm run lint && npm run typecheck && npm run build`
5. Submit a Pull Request

[Open an issue](https://github.com/Vansh-Varshney-07/AI-Context-Studio/issues) for bugs or feature requests.

---

## Deployment

### Web (Vercel)
```bash
cd web
npm run build
# Deploy via Vercel CLI or connect repo at vercel.com
```

Environment variables needed:
- `DATABASE_URL` — Neon pooled connection string
- `BETTER_AUTH_SECRET` — Random 32+ character secret
- `BETTER_AUTH_URL` — Production URL
- `NEXT_PUBLIC_APP_URL` — Production URL
- `GITHUB_OWNER` — `Vansh-Varshney-07`
- `GITHUB_REPO` — `AI-Context-Studio`
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — GitHub OAuth app
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth app
- `RESEND_API_KEY` — Email service (optional)

---

## License

MIT License — see [LICENSE](LICENSE) for details.
