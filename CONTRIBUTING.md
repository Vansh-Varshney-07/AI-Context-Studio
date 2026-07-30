# Contributing to AI Context Studio

Thank you for your interest in contributing! This guide will help you get started.

## 🚀 Quick Start

```bash
# Fork the repo, then:
git clone https://github.com/your-username/ai-context-studio.git
cd ai-context-studio

# Install dependencies
cd web && pnpm install
cd ../desktop && pnpm install
cd ../marketplace && cargo build
cd ../registry && cargo build
```

## 📋 Ways to Contribute

| Type | Description |
|------|-------------|
| **🐛 Bug Reports** | Found a bug? [Open an issue](https://github.com/ai-context-studio/ai-context-studio/issues/new?template=bug_report.md) |
| **✨ Feature Requests** | Have an idea? [Request a feature](https://github.com/ai-context-studio/ai-context-studio/issues/new?template=feature_request.md) |
| **📝 Documentation** | Fix typos, add examples, improve guides |
| **💻 Code** | Bug fixes, new features, refactoring |
| **🎨 Design** | UI/UX improvements, icons, illustrations |
| **🌐 Translation** | Help translate the UI/docs |
| **🧪 Testing** | Add unit tests, E2E tests, report regressions |

---

## 🛠 Development Setup

### Prerequisites
- **Node.js** 20+ (LTS recommended)
- **Rust** 1.77+ (for desktop + Rust crates)
- **pnpm** 9+ (recommended) or npm 10+
- **Git** 2.40+

### Web Development
```bash
cd web
pnpm install
pnpm run dev          # http://localhost:3000
pnpm run build        # Static export to ./out/
pnpm run typecheck    # TypeScript check
pnpm run lint         # ESLint
pnpm run format       # Prettier
```

### Desktop Development
```bash
cd desktop
pnpm install
pnpm run dev          # Next.js dev server
pnpm run tauri dev    # Tauri dev window (hot reload)
pnpm run tauri build  # Native binaries (NSIS/DMG/AppImage)
```

### Rust Crates
```bash
cargo build --workspace
cargo test --workspace
cargo clippy --workspace
cargo fmt --all
```

---

## 📝 Code Style

### TypeScript / React
- **Strict mode**: All `tsconfig.json` use strict TypeScript
- **ESLint**: Next.js + TypeScript + React Hooks + Import Order
- **Prettier**: Single quotes, 2 spaces, trailing commas, 100 char width
- **Naming**: PascalCase for components, camelCase for functions/variables, UPPER_SNAKE_CASE for constants

```tsx
// ✅ Good
interface UserSettings {
  theme: 'light' | 'dark';
  autoSave: boolean;
}

function useUserSettings(): UserSettings {
  const [settings, setSettings] = useState<UserSettings>(defaults);
  return settings;
}

// ❌ Bad
interface user_settings {  // snake_case
  theme: string;
  auto_save: boolean;
}

function getSettings() {  // missing return type
  return { theme: 'dark', autoSave: true };
}
```

### Rust
```bash
# Format
cargo fmt --all

# Lint
cargo clippy --workspace -- -D warnings

# Test
cargo test --workspace
```

---

## 🔄 Pull Request Process

### Before Submitting
1. **Sync with main**: `git fetch upstream && git rebase upstream/main`
2. **Run checks**:
   ```bash
   # Web
   cd web && pnpm run lint && pnpm run typecheck && pnpm run format:check
   
   # Desktop
   cd ../desktop && pnpm run lint && pnpm run typecheck
   
   # Rust
   cargo fmt --all --check && cargo clippy --workspace -- -D warnings
   ```
3. **Write tests** for new functionality
5. **Update documentation** if needed

### PR Template
```markdown
## Summary
Brief description of changes.

## Type
- [ ] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Documentation
- [ ] Performance
- [ ] Other

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing performed

## Screenshots (if UI)
| Before | After |
|--------|-------|
| ![before](url) | ![after](url) |

## Checklist
- [ ] Code follows style guide
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No console.log/debugger statements
- [ ] No breaking changes (or documented in CHANGELOG)
```

### Review Process
1. **Automated checks** must pass (CI)
2. **Code review** by maintainer
3. **Approval** from at least 1 maintainer
6. **Squash and merge** (linear history)

---

## 🏷 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add marketplace search filters
fix: fix desktop build on Windows
docs: update README with new deployment steps
refactor: consolidate button variants
perf: lazy-load marketplace assets
test: add unit tests for cn utility
chore: update dependencies
```

### Types
| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code restructuring |
| `perf` | Performance improvement |
| `test` | Tests |
| `chore` | Maintenance |
| `build` | Build system |
| `ci` | CI/CD |
| `style` | Formatting |

---

## 🏷 Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready, protected |
| `develop` | Integration branch (optional) |
| `feat/*` | Features |
| `fix/*` | Bug fixes |
| `docs/*` | Documentation |
| `refactor/*` | Refactoring |
| `release/*` | Release preparation |

---

## 🧪 Testing

### Web
```bash
cd web
pnpm run test          # Unit tests (Vitest)
pnpm run test:e2e      # E2E tests (Playwright)
pnpm run test:coverage # Coverage report
```

### Desktop
```bash
cd desktop
pnpm run test          # Unit tests
pnpm run test:e2e      # Tauri + Playwright
```

### Rust
```bash
cargo test --workspace
cargo test --workspace -- --nocapture  # Verbose
```

---

## 📚 Documentation Standards

### Markdown
- Use **ATX headings** (`#`, `##`, `###`)
- Use **fenced code blocks** with language hints
- Use **relative links** for internal references
- Use **tables** for structured data
- Use **task lists** for checklists

### Code Examples
```markdown
```typescript
// Always include language hint
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```
```

### API Documentation
- Use **JSDoc** for TypeScript functions
- Use **doc comments** for Rust (`///`)

---

## 🏷 Release Process

### Versioning
[Semantic Versioning](https://semver.org/) — `MAJOR.MINOR.PATCH`

| Version | When |
|---------|------|
| `MAJOR` | Breaking changes |
| `MINOR` | New features (backward compatible) |
| `PATCH` | Bug fixes (backward compatible) |

### Release Checklist
- [ ] Update `CHANGELOG.md`
- [ ] Update version in `package.json` / `Cargo.toml`
- [ ] Create signed tag: `git tag -s v1.2.3 -m "Release v1.2.3"`
- [ ] Push tag: `git push origin v1.2.3`
- [ ] GitHub Actions builds and publishes releases
- [ ] Update `CHANGELOG.md` with release notes

---

## 📞 Getting Help

| Channel | Purpose |
|---------|---------|
| [GitHub Discussions](https://github.com/ai-context-studio/ai-context-studio/discussions) | Questions, ideas, general discussion |
| [GitHub Issues](https://github.com/ai-context-studio/ai-context-studio/issues) | Bugs, feature requests |
| [Discord](https://discord.gg/ai-context-studio) | Real-time chat, community |
| [Security](SECURITY.md) | Security vulnerabilities |

---

## 📜 Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). We are committed to a welcoming, inclusive community.

---

## 📞 Maintainers

| Name | Role | GitHub |
|------|------|--------|
| Sarah Chen | Founder & Core Maintainer | [@sarahchen](https://github.com/sarahchen) |
| Marcus Johnson | Desktop Platform Lead | [@marcusj](https://github.com/marcusj) |
| Priya Patel | Marketplace & Registry | [@priyapatel](https://github.com/priyapatel) |
| Alex Rivera | Security & Infrastructure | [@alexr](https://github.com/alexr) |
| Jordan Kim | Developer Experience | [@jordankim](https://github.com/jordankim) |
| Taylor Moore | Community & Docs | [@taylorm](https://github.com/taylorm) |

---

*Thank you for contributing to AI Context Studio! 🚀*