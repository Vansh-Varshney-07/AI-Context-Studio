import { type Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { generateMetadata } from '@/lib/metadata';
import { Card } from '@/components/ui/card';
import { CTA } from '@/components/sections/cta';
import { SimpleAccordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  HelpCircle,
  Download,
  Code,
  Package,
  Shield,
  Plug,
  BookOpen,
  Search,
  ChevronRight,
} from 'lucide-react';
import { Callout } from '@/components/docs/callout';

export const metadata: Metadata = generateMetadata({
  title: 'FAQ',
  description:
    'Frequently asked questions about AI Context Studio. Find answers about installation, features, marketplace, registry, MCP, security, licensing, and more.',
});

const faqCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: HelpCircle,
    questions: [
      {
        q: 'What is AI Context Studio?',
        a: 'AI Context Studio is a local-first prompt engineering studio that helps you build, customize, manage, and export AI instruction assets (system prompts, instruction files, personas, skills, workflows, memories, MCP configs) for multiple AI coding assistants — all from a single desktop application that runs entirely on your machine.',
      },
      {
        q: 'Is AI Context Studio free?',
        a: 'Yes. The desktop application is completely free and open source (MIT licensed). There are no subscription fees, no feature gates, and no account required. Optional cloud features (sync, teams) may be offered in the future as paid services, but the core product will always remain free and local-first.',
      },
      {
        q: 'Which operating systems are supported?',
        a: 'Windows 10 (1903+), macOS 12 (Monterey+), and Linux (glibc 2.31+, GTK 3.24+, WebKit2GTK 2.38+). We provide native installers: NSIS (.exe) and portable for Windows, Universal DMG for macOS, and AppImage/.deb/.rpm for Linux.',
      },
      {
        q: 'Do I need an internet connection to use it?',
        a: 'No. AI Context Studio works fully offline. All features — prompt engineering, asset management, marketplace browsing (with cached data), registry validation, and export — work without internet. Only optional features like marketplace sync, cloud backup, and update checks require connectivity.',
      },
      {
        q: 'Which AI coding assistants are supported?',
        a: 'Cursor, Claude Code, Windsurf, VS Code Copilot, GitHub Copilot, Continue, Roo Code, OpenCode, Codex, and generic Markdown export. Each target has specific capabilities (system prompts, instruction files, personas, skills, workflows, memories, MCP configs) mapped in our compatibility matrix.',
      },
    ],
  },
  {
    id: 'installation',
    title: 'Installation & Updates',
    icon: Download,
    questions: [
      {
        q: 'How do I verify my download?',
        a: 'Every release includes SHA256 checksums and signatures. On Windows, the NSIS installer is code-signed with an EV certificate. On macOS, the DMG is notarized by Apple. On Linux, AppImages include GPG signatures. See the Downloads page for verification commands.',
      },
      {
        q: 'How do I update AI Context Studio?',
        a: 'The app checks for updates automatically on startup (configurable in Settings). When an update is available, you\'ll see a notification with a one-click install option. You can also manually check via Help → Check for Updates or download the latest release from GitHub.',
      },
      {
        q: 'Can I run multiple versions side by side?',
        a: 'Yes. The portable Windows version and Linux AppImage are self-contained — you can run different versions from different folders. On macOS, you can rename the app bundle. The installed versions use separate data directories per version.',
      },
      {
        q: 'What are the system requirements?',
        a: 'Minimum: 512 MB RAM (2 GB recommended), 200 MB disk space. Modern CPU with SSE4.2 support. No GPU required. Linux requires glibc 2.31+, GTK 3.24+, WebKit2GTK 2.38+, and libayatana-appindicator3 for the tray icon.',
      },
      {
        q: 'Does it auto-update on Linux?',
        a: 'AppImage users can use AppImageUpdate or download the new AppImage manually. Package manager installations (deb/rpm) update via your system package manager. Flatpak and Snap versions (if available) update through their respective stores.',
      },
    ],
  },
  {
    id: 'features',
    title: 'Core Features',
    icon: Code,
    questions: [
      {
        q: 'What are "instruction assets"?',
        a: 'Instruction assets are structured, versioned packages (.acs files) containing AI guidance: system prompts, instruction files (AGENTS.md), personas, skills (composable capabilities with typed I/O), workflows (multi-step pipelines), memories (persistent context blocks), and MCP server configurations. Each asset has a manifest.json with metadata, dependencies, and checksums.',
      },
      {
        q: 'How does the Prompt Engine work?',
        a: 'The Prompt Engine is a visual builder using Handlebars-compatible syntax. You define variables ({{variable}}), conditionals ({{#if feature}}...{{/if}}), loops ({{#each items}}...{{/each}}), and compose reusable prompt fragments. Preview renders in real-time with sample data. Exports generate target-specific instruction files.',
      },
      {
        q: 'Can I use variables in my prompts?',
        a: 'Yes. Define variables in the Prompt Engine or in AGENTS.md frontmatter. Variables support defaults, types (string, number, boolean, enum), and can be overridden at export time via CLI or UI. Example: {{language}} defaults to "typescript" but can be set to "python" per export.',
      },
      {
        q: 'What are "Memories" and how do they work?',
        a: 'Memories are persistent context blocks (architecture decisions, code snippets, API specs, team conventions) that agents can recall across sessions. Reference them in prompts with {{memory:name}} or let the agent auto-retrieve relevant memories based on semantic similarity. Memories are stored locally in your workspace.',
      },
      {
        q: 'How do Workflows differ from Skills?',
        a: 'A Skill is a single composable capability with defined inputs/outputs (like a function). A Workflow chains multiple skills, prompts, and tools into a multi-step pipeline with conditional logic, parallel execution, and error handling. Workflows can call skills, MCP tools, and external APIs.',
      },
    ],
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    icon: Package,
    questions: [
      {
        q: 'Is the marketplace free to use?',
        a: 'Yes. Browsing, searching, and installing assets is completely free. Publishing is also free. Optional paid assets and creator monetization are planned for the future but will always be opt-in for both publishers and consumers.',
      },
      {
        q: 'How do I install an asset from the marketplace?',
        a: 'In the desktop app: open the Marketplace tab, find an asset, click "Install". The asset downloads, validates against the registry schema, resolves dependencies, and installs to your local asset store. Via CLI: `acs install asset-name`.',
      },
      {
        q: 'What does "Verified" mean on an asset?',
        a: 'Verified assets come from publishers who have completed identity verification (GitHub OAuth + manual review). Verified publishers get auto-approval for new versions. Unverified publishers go through manual review (24-48 hours) for each submission.',
      },
      {
        q: 'Can I install specific versions of an asset?',
        a: 'Yes. Use `acs install asset@1.2.0` for a specific version, or `acs install asset@latest` for the newest. The desktop app shows available versions on the asset detail page.',
      },
      {
        q: 'How are asset dependencies handled?',
        a: 'Assets declare dependencies in manifest.json with semver ranges (e.g., "base-prompt": "^1.0.0"). The resolver builds a dependency graph, detects cycles, selects highest compatible versions, downloads all transitive dependencies, validates checksums, and installs in topological order. A lockfile (asset-lock.json) pins exact versions for reproducibility.',
      },
    ],
  },
  {
    id: 'registry',
    title: 'Registry & Packaging',
    icon: Shield,
    questions: [
      {
        q: 'What is the .acs package format?',
        a: 'An .acs file is a ZIP archive containing: manifest.json (asset metadata), content/ (prompts, instructions, memories, workflows), preview.png (optional), README.md (optional), and asset-lock.json (dependency lockfile). The manifest follows a strict JSON Schema (Draft 7) with required fields: id, name, version, author, type, description, minAppVersion, checksum, license, targets.',
      },
      {
        q: 'How does semantic versioning work for assets?',
        a: 'Assets follow SemVer: MAJOR for breaking changes (removed inputs, changed output schema), MINOR for backward-compatible additions (new optional inputs, new features), PATCH for bug fixes and docs. Dependencies use standard semver ranges (^, ~, >=, <). The resolver picks the highest compatible version.',
      },
      {
        q: 'What is the compatibility matrix?',
        a: 'Each asset declares which AI targets it supports (cursor, claude, windsurf, vscode, custom). The registry defines a feature-level matrix showing which asset types work on which targets (e.g., Skills work on Cursor/Claude/Windsurf but not VS Code Copilot). This helps users filter assets by their editor.',
      },
      {
        q: 'How do I validate my asset before publishing?',
        a: 'Run `acs validate ./my-asset.acs` locally. It checks: manifest schema compliance, required fields, semver format, checksum match, dependency resolvability, target declarations, license validity, and README presence. Use `--strict` for additional checks (no deprecated fields, best practices).',
      },
      {
        q: 'Can I host a private registry?',
        a: 'Yes. The registry specification is open. You can run a private registry server (reference implementation in Rust) for internal asset distribution. Configure the desktop app to use your registry URL in Settings → Marketplace. Federation between registries is on the roadmap.',
      },
    ],
  },
  {
    id: 'mcp',
    title: 'MCP (Model Context Protocol)',
    icon: Plug,
    questions: [
      {
        q: 'What is MCP and why does AI Context Studio support it?',
        a: 'Model Context Protocol (MCP) is an open standard (by Anthropic) for connecting AI assistants to external data sources and tools. AI Context Studio acts as an MCP client: you configure servers (filesystem, PostgreSQL, GitHub, HTTP, custom), and the app manages connections, permissions, and exports MCP configs for your AI assistants.',
      },
      {
        q: 'Which MCP servers are built in?',
        a: 'Filesystem (read/write allowed directories), PostgreSQL/MySQL (read-only query + schema inspection), GitHub (repos, PRs, issues, actions), HTTP (generic REST with auth), and a custom server template. Community servers can be added via npm/pip/Go binaries.',
      },
      {
        q: 'How does sandboxing work for MCP servers?',
        a: 'Each MCP server runs in an isolated subprocess with restricted permissions: filesystem access limited to declared directories, network access limited to declared hosts/ports, no process spawning unless explicitly allowed. The desktop app enforces this via OS-level sandboxing (AppArmor/seccomp on Linux, sandbox-exec on macOS, Job Objects on Windows).',
      },
      {
        q: 'Can I write my own MCP server?',
        a: 'Yes. Use the TypeScript/Python/Rust/Go SDKs. The server exposes tools (functions), resources (readable data), and prompts (templates). Deploy as a binary or script. Add it in AI Context Studio → MCP Manager → "Add Custom Server" with the command and args. See /docs/mcp/custom for a tutorial.',
      },
      {
        q: 'Does MCP work with all AI assistants?',
        a: 'MCP configs export to Cursor, Claude Code, and any client supporting the MCP spec. VS Code Copilot has experimental MCP support. For unsupported editors, export as generic JSON and adapt manually. The registry tracks target compatibility per server.',
      },
    ],
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    icon: Shield,
    questions: [
      {
        q: 'Is my data sent anywhere?',
        a: 'No. By default, zero data leaves your machine. No telemetry, no usage analytics, no crash reporting, no update checks that send identifiers. Optional features (marketplace sync, update notifications) are opt-in and clearly labeled. See our Security page for the full threat model.',
      },
      {
        q: 'How are API keys stored?',
        a: 'API keys (OpenAI, Anthropic, etc.) are stored in your OS credential store: Windows Credential Manager, macOS Keychain, or Linux Secret Service (libsecret). They are never written to disk in plaintext. The app requests the key from the keychain only when making provider API calls.',
      },
      {
        q: 'Is the code open source? Can I audit it?',
        a: 'Yes, 100% open source under MIT license. Full source on GitHub. No obfuscated binaries, no hidden modules. The desktop app is built with Tauri (Rust + WebView), so the backend is auditable Rust code. Reproducible builds are a goal for v1.1.',
      },
      {
        q: 'How do I report a security vulnerability?',
        a: 'Email security@ai-context-studio.dev (PGP key on /security.txt). We acknowledge within 48 hours and aim for a fix timeline within 7 days for critical issues. See the Security page for our full responsible disclosure policy and security.txt (RFC 9116).',
      },
      {
        q: 'Does the app have telemetry?',
        a: 'No telemetry by default. An optional, anonymous, opt-in "usage insights" toggle exists in Settings → Privacy. If enabled, it sends aggregated feature usage (no prompts, no code, no file paths) to help prioritize development. You can verify the payload in the open-source telemetry module.',
      },
    ],
  },
  {
    id: 'licensing',
    title: 'Licensing & Legal',
    icon: BookOpen,
    questions: [
      {
        q: 'What license is AI Context Studio under?',
        a: 'MIT License. You can use, modify, distribute, and sell the software commercially. The only requirement is preserving the license notice. Assets you create with the tool are yours — you own the copyright and can license them however you wish.',
      },
      {
        q: 'Can I sell assets I create on the marketplace?',
        a: 'Paid assets and creator monetization are planned for a future release. The infrastructure (licensing, payments, revenue split) is being designed. Currently all marketplace assets are free. When monetization launches, it will be opt-in with transparent revenue sharing (target: 85/15 creator/platform).',
      },
      {
        q: 'Are there any trademark restrictions?',
        a: '"AI Context Studio" name and logo are trademarked. You can\'t name your fork or derivative product "AI Context Studio" or use our branding in a way that implies endorsement. Forks should use a different name. See the Trademark Policy in the repo.',
      },
      {
        q: 'What about third-party dependencies?',
        a: 'All dependencies are permissively licensed (MIT, Apache-2.0, BSD, ISC). No GPL or viral licenses in the dependency tree. We generate an SBOM (Software Bill of Materials) per release and scan for vulnerabilities in CI.',
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: Search,
    questions: [
      {
        q: 'The app won\'t start on Linux',
        a: 'Ensure FUSE is installed (`sudo apt install fuse libfuse2` or equivalent). For AppImage, run `chmod +x file.AppImage`. Check `dmesg` for kernel messages. Try running with `--no-sandbox` if WebKit sandboxing conflicts with your kernel. See /docs/installation/linux for details.',
      },
      {
        q: 'macOS says the app is damaged / can\'t be opened',
        a: 'This is Gatekeeper on unsigned/notarized builds. Fix: `xattr -cr /Applications/AI\\ Context\\ Studio.app` then right-click → Open. Homebrew cask (`brew install --cask ai-context-studio`) handles this automatically. Official releases are notarized.',
      },
      {
        q: 'Windows SmartScreen blocks the installer',
        a: 'The NSIS installer is EV code-signed. SmartScreen may still warn on new versions until reputation builds. Click "More info" → "Run anyway". The portable .exe has no installer reputation — use the NSIS installer for smoother experience.',
      },
      {
        q: 'Marketplace shows no assets / fails to load',
        a: 'Check internet connection. The marketplace uses a static JSON index hosted on GitHub Pages/CDN. If blocked by firewall/proxy, allow `https://raw.githubusercontent.com` and `https://cdn.jsdelivr.net`. Cached data shows last successful fetch. Try "Refresh" in the Marketplace tab.',
      },
      {
        q: 'MCP server fails to connect',
        a: 'Check: 1) Server command exists in PATH (or use full path). 2) Environment variables are set correctly. 3) Permissions (filesystem paths, network hosts) are granted in MCP Manager. 4) Server logs (View Logs button) for errors. 5) Version compatibility — some servers require specific MCP protocol versions.',
      },
      {
        q: 'Export produces empty / incorrect files',
        a: 'Verify: 1) Asset has content (not just manifest). 2) Target is compatible with asset type (see compatibility matrix). 3) Variables in prompt have values (check frontmatter or export dialog). 4) Output directory is writable. 5) Try "Preview Export" to see rendered output before saving.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <section className="flex flex-1 flex-col">
        <section id="faq" className="section" aria-labelledby="faq-heading">
          <div className="container-app">
            <div className="animate-slide-up mb-16 text-center">
              <h2
                id="faq-heading"
                className="mb-4 text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl"
              >
                Frequently Asked Questions
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-[var(--color-text-secondary)]">
                Everything you need to know about AI Context Studio. Can\'t find your answer?{' '}
                <a href="https://github.com/Vansh-Varshney-07/AI-Context-Studio/discussions" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">
                  Ask the community
                </a>
                {' '}or{' '}
                <a href="mailto:support@ai-context-studio.dev" className="text-[var(--color-accent)] hover:underline">
                  email us
                </a>
                .
              </p>
            </div>

            <div className="space-y-8">
              {faqCategories.map((category, catIndex) => (
                <Card key={category.id} className="animate-slide-up overflow-hidden" style={{ animationDelay: `${catIndex * 0.05}s` }}>
                  <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent-light)] text-[var(--color-accent)]">
                        <category.icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="text-2xl font-semibold text-[var(--color-text-primary)]">{category.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
{category.questions.map((faq, qIndex) => (
                <SimpleAccordion key={`${category.id}-${qIndex}`} title={faq.q} defaultOpen={qIndex === 0}>
                  <p className="text-[var(--color-text-secondary)]">{faq.a}</p>
                </SimpleAccordion>
              ))}
                  </div>
                </Card>
              ))}
            </div>

            <div className="animate-slide-up mt-12 text-center" style={{ animationDelay: '0.3s' }}>
              <Callout type="tip" title="Still have questions?">
                <p className="mb-4">
                  Search the full documentation, browse GitHub Discussions, or open an issue.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/docs/search"
                    className="inline-flex items-center gap-2"
                  >
                    <Button size="lg">Search Documentation</Button>
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                  <a
                    href="https://github.com/Vansh-Varshney-07/AI-Context-Studio/discussions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <Button size="lg" variant="outline">GitHub Discussions</Button>
                    <ChevronRight className="h-5 w-5" />
                  </a>
                </div>
              </Callout>
            </div>
          </div>
        </section>
        <CTA />
      </section>
      <Footer />
    </main>
  );
}