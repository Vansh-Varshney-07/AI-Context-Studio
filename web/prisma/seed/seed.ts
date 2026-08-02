import { PrismaClient, Role, RoadmapStatus, AnnouncementType, BlogStatus, ContactType, ContactStatus, PurchaseStatus, VersionStatus, SubscriberStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  console.log("🌱 Starting database seed...");

  // ============================================
  // USERS
  // ============================================
  const passwordHash = await hash("password123", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@aicontextstudio.dev" },
    update: {},
    create: {
      email: "admin@aicontextstudio.dev",
      name: "Vansh Varshney",
      username: "Vansh-Varshney-07",
      role: "OWNER",
      emailVerified: true,
      passwordHash,
      bio: "Founder of AI Context Studio. Building local-first AI tooling.",
      avatar: "https://github.com/Vansh-Varshney-07.png",
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@aicontextstudio.dev" },
    update: {},
    create: {
      email: "demo@aicontextstudio.dev",
      name: "Demo User",
      username: "demouser",
      role: "USER",
      emailVerified: true,
      passwordHash,
      bio: "Exploring AI Context Studio",
    },
  });

  console.log("✅ Users created");

  // ============================================
  // PROFILES
  // ============================================
  await prisma.profile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      displayName: "Vansh Varshney",
      headline: "Founder @ AI Context Studio | AI Tooling",
      location: "India",
      website: "https://github.com/Vansh-Varshney-07",
      github: "https://github.com/Vansh-Varshney-07",
      skills: ["TypeScript", "React", "Rust", "Tauri", "Next.js", "PostgreSQL", "AI/ML"],
      socialLinks: [
        { label: "GitHub", url: "https://github.com/Vansh-Varshney-07", icon: "Github" },
      ],
      preferences: { theme: "system", notifications: true },
    },
  });

  await prisma.profile.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      displayName: "Demo User",
      headline: "Exploring AI Context Studio",
      skills: ["React", "TypeScript", "AI"],
      preferences: { theme: "system", notifications: true },
    },
  });

  console.log("✅ Profiles created");

  // ============================================
  // CATEGORIES
  // ============================================
  const categories = [
    { slug: "skills", name: "Skills", description: "Atomic AI capabilities for specific tasks", icon: "Code", sortOrder: 1 },
    { slug: "personas", name: "Personas", description: "AI roles with defined expertise and personality", icon: "User", sortOrder: 2 },
    { slug: "templates", name: "Templates", description: "Project starters and boilerplates", icon: "FileText", sortOrder: 3 },
    { slug: "prompt-packs", name: "Prompt Packs", description: "Curated collections of prompts for specific domains", icon: "Package", sortOrder: 4 },
    { slug: "instruction-files", name: "Instruction Files", description: "AGENTS.md, CLAUDE.md, and other instruction formats", icon: "FileText", sortOrder: 5 },
    { slug: "workflows", name: "Workflows", description: "Multi-step pipelines and automation", icon: "GitBranch", sortOrder: 6 },
    { slug: "mcp-servers", name: "MCP Servers", description: "Model Context Protocol server configurations", icon: "Server", sortOrder: 7 },
    { slug: "collections", name: "Collections", description: "Curated groups of related assets", icon: "Layers", sortOrder: 8 },
    { slug: "bundles", name: "Bundles", description: "Multi-asset packages for complete solutions", icon: "Boxes", sortOrder: 9 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("✅ Categories created");

  // ============================================
  // TAGS
  // ============================================
  const tags = [
    { slug: "code-review", name: "code-review", color: "#EF4444" },
    { slug: "security", name: "security", color: "#DC2626" },
    { slug: "automation", name: "automation", color: "#3B82F6" },
    { slug: "github", name: "github", color: "#181717" },
    { slug: "gitlab", name: "gitlab", color: "#FC6D26" },
    { slug: "architecture", name: "architecture", color: "#8B5CF6" },
    { slug: "mentoring", name: "mentoring", color: "#10B981" },
    { slug: "best-practices", name: "best-practices", color: "#06B6D4" },
    { slug: "react", name: "react", color: "#61DAFB" },
    { slug: "typescript", name: "typescript", color: "#3178C6" },
    { slug: "storybook", name: "storybook", color: "#FF4785" },
    { slug: "testing", name: "testing", color: "#C21325" },
    { slug: "accessibility", name: "accessibility", color: "#0096D6" },
    { slug: "api", name: "api", color: "#FF6B35" },
    { slug: "rest", name: "rest", color: "#4A90D9" },
    { slug: "graphql", name: "graphql", color: "#E10098" },
    { slug: "grpc", name: "grpc", color: "#6C5CE7" },
    { slug: "clean-architecture", name: "clean-architecture", color: "#2C3E50" },
    { slug: "ddd", name: "ddd", color: "#34495E" },
    { slug: "ci-cd", name: "ci-cd", color: "#2088FF" },
    { slug: "github-actions", name: "github-actions", color: "#2671E5" },
    { slug: "deployment", name: "deployment", color: "#00D4AA" },
    { slug: "postgresql", name: "postgresql", color: "#336791" },
    { slug: "database", name: "database", color: "#4479A1" },
    { slug: "sql", name: "sql", color: "#E38D13" },
    { slug: "mcp", name: "mcp", color: "#8B5CF6" },
    { slug: "frontend", name: "frontend", color: "#F97316" },
    { slug: "starter", name: "starter", color: "#22C55E" },
    { slug: "boilerplate", name: "boilerplate", color: "#84CC16" },
    { slug: "sast", name: "sast", color: "#DC2626" },
    { slug: "compliance", name: "compliance", color: "#16A34A" },
    { slug: "secrets", name: "secrets", color: "#F59E0B" },
    { slug: "owasp", name: "owasp", color: "#EF4444" },
    { slug: "audit", name: "audit", color: "#6366F1" },
    { slug: "career", name: "career", color: "#8B5CF6" },
    { slug: "ui", name: "ui", color: "#EC4899" },
    { slug: "design", name: "design", color: "#F59E0B" },
    { slug: "layers", name: "layers", color: "#6366F1" },
    { slug: "dependency-inversion", name: "dependency-inversion", color: "#8B5CF6" },
    { slug: "readonly", name: "readonly", color: "#10B981" },
    { slug: "vue", name: "vue", color: "#42B883" },
    { slug: "svelte", name: "svelte", color: "#FF3E00" },
    { slug: "solid", name: "solid", color: "#2C4F7C" },
    { slug: "agents", name: "agents", color: "#8B5CF6" },
    { slug: "plugin-sdk", name: "plugin-sdk", color: "#6366F1" },
    { slug: "workflows", name: "workflows", color: "#3B82F6" },
    { slug: "marketplace", name: "marketplace", color: "#EC4899" },
    { slug: "community", name: "community", color: "#10B981" },
    { slug: "milestone", name: "milestone", color: "#F59E0B" },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }

  console.log("✅ Tags created");

  // ============================================
  // BLOG CATEGORIES
  // ============================================
  const blogCategories = [
    { slug: "releases", name: "Releases", color: "#22C55E", sortOrder: 1 },
    { slug: "announcements", name: "Announcements", color: "#3B82F6", sortOrder: 2 },
    { slug: "devlogs", name: "Dev Logs", color: "#8B5CF6", sortOrder: 3 },
    { slug: "tutorials", name: "Tutorials", color: "#F59E0B", sortOrder: 4 },
    { slug: "showcases", name: "Showcases", color: "#EC4899", sortOrder: 5 },
  ];

  for (const cat of blogCategories) {
    await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("✅ Blog categories created");

  // ============================================
  // ROADMAP ITEMS (real project milestones)
  // ============================================
  const roadmapItems = [
    {
      id: "roadmap-1",
      title: "Desktop App v1.0",
      description: "Core workspace with system prompts, instruction files, memories, MCP, workflows, and export to 10+ targets.",
      status: "COMPLETED",
      phase: "Completed",
      quarter: "Q1 2024",
      progress: 100,
      order: 1,
      tags: ["Desktop", "Tauri", "Next.js", "React"],
      details: "Initial release with full workspace: dashboard, prompt library, system prompt engine, personas, skills, workflows, memories, MCP manager, asset validator, prompt optimizer, settings, and search.",
      links: [{ label: "Release Notes", href: "/changelog#v1.0.0" }],
    },
    {
      id: "roadmap-2",
      title: "Web Marketplace & Documentation",
      description: "Browse, search, and filter assets with categories, compatibility badges, ratings, and install commands.",
      status: "IN_PROGRESS",
      phase: "In Progress",
      quarter: "Q3 2024",
      progress: 60,
      order: 2,
      tags: ["Web", "Marketplace", "Search", "Docs"],
      details: "Static marketplace browser with 9 categories, advanced filters (type, verified, compatibility, sort), asset detail pages with screenshots, version history, and one-click install commands. Complete documentation site.",
      links: [{ label: "Browse Marketplace", href: "/marketplace" }, { label: "Read Docs", href: "/docs" }],
    },
    {
      id: "roadmap-3",
      title: "Online Hub (Sync & Collaboration)",
      description: "Cross-device sync, team workspaces, shared collections, version history, and access controls for cloud-backed asset management.",
      status: "PLANNED",
      phase: "Planned",
      quarter: "Q4 2024",
      progress: 10,
      order: 3,
      tags: ["Cloud", "Sync", "Teams", "PostgreSQL"],
      details: "End-to-end encrypted sync using client-side encryption. Team workspaces with role-based access. Conflict resolution for concurrent edits. Offline-first with background sync.",
      links: [{ label: "Track Progress", href: "https://github.com/Vansh-Varshney-07/AI-Context-Studio" }],
    },
    {
      id: "roadmap-4",
      title: "Plugin SDK",
      description: "TypeScript SDK for building custom exporters, validators, integrations, and UI extensions. Includes CLI scaffolding and publishing workflow.",
      status: "PLANNED",
      phase: "Planned",
      quarter: "Q1 2025",
      progress: 0,
      order: 4,
      tags: ["SDK", "TypeScript", "Plugin System", "CLI"],
      details: "Declarative plugin manifest, hook system for build/export/validate lifecycle, TypeScript types for all asset kinds, example plugins for Notion, Obsidian, and custom formats.",
      links: [{ label: "SDK Docs", href: "/docs/developer-guide#plugin-sdk" }],
    },
  ];

  for (const item of roadmapItems) {
    await prisma.roadmapItem.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }

  console.log("✅ Roadmap items created");

  // ============================================
  // DOCUMENTATION
  // ============================================
  const docCategories = [
    { slug: "getting-started", name: "Getting Started", description: "Learn the basics and get up and running quickly", sortOrder: 1 },
    { slug: "desktop", name: "Desktop App", description: "Master the desktop application features", sortOrder: 2 },
    { slug: "marketplace", name: "Marketplace", description: "Discover, install, and publish assets", sortOrder: 3 },
    { slug: "registry", name: "Registry", description: "Asset packaging, versioning, and distribution", sortOrder: 4 },
    { slug: "mcp", name: "MCP Servers", description: "Configure and use Model Context Protocol servers", sortOrder: 5 },
    { slug: "skills", name: "Skills", description: "Create and use atomic AI capabilities", sortOrder: 6 },
    { slug: "prompt-files", name: "Prompt Files", description: "AGENTS.md, CLAUDE.md, and instruction files", sortOrder: 7 },
    { slug: "api-keys", name: "API Keys", description: "Manage API keys for cloud services", sortOrder: 8 },
    { slug: "security", name: "Security", description: "Security best practices, audits, and responsible disclosure", sortOrder: 9 },
    { slug: "developer-guide", name: "Developer Guide", description: "Extend AI Context Studio with plugins and integrations", sortOrder: 10 },
    { slug: "architecture", name: "Architecture", description: "Technical architecture and design decisions", sortOrder: 11 },
  ];

  for (const cat of docCategories) {
    await prisma.docCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const docPages = [
    {
      slug: "introduction",
      title: "Introduction",
      description: "What is AI Context Studio and why should you use it?",
      content: `# Introduction

Welcome to **AI Context Studio** — a local-first, offline-first prompt engineering studio for AI coding assistants.

## What is AI Context Studio?

AI Context Studio helps you build, customize, manage, and export AI instruction assets (system prompts, instruction files, memories, MCP configs, workflows, skills, personas) to multiple targets like Cursor, Claude Code, Windsurf, VS Code, Copilot, and more — all from a single workspace.

## Key Features

### 🏠 Local-First Architecture

Your data lives on your machine by default. No cloud storage, no mandatory accounts, no telemetry. You own your prompts, memories, API keys, and assets.

### 📦 Asset Types

- **System Prompts** — Structured prompts with variables, conditionals, and blueprints
- **Instruction Files** — AGENTS.md, CLAUDE.md, .cursorrules, and custom formats
- **Memories** — Persistent context blocks (code snippets, docs, API references)
- **MCP Servers** — Configure and validate Model Context Protocol servers
- **Workflows** — Chain prompts, tools, and agents into repeatable pipelines
- **Skills** — Atomic AI capabilities with typed inputs/outputs
- **Personas** — AI roles with defined expertise and personality

### 🎯 Multi-Target Export

One-click export to:
- Cursor (.cursorrules)
- Claude Code (CLAUDE.md)
- Windsurf (.windsurfrules)
- VS Code (.vscode/prompts)
- GitHub Copilot (.github/copilot-instructions.md)
- OpenAI Codex (AGENTS.md)
- Google Gemini (GEMINI.md)
- Continue (.continuerules.json)
- Roo Code (.roo/rules)
- Generic AGENTS.md

### 🔌 MCP Integration

Full Model Context Protocol support for connecting AI assistants to external tools and data sources.

### 🛡️ Security & Privacy

- No telemetry or analytics by default
- Local encryption for sensitive data
- Sandboxed MCP execution
- Regular third-party security audits

## Getting Started

1. [Download the desktop app](/download)
2. [Follow the quick start guide](/docs/getting-started)
3. [Create your first asset](/docs/first-asset)
4. [Explore the marketplace](/marketplace)

## Community

- [GitHub Discussions](https://github.com/Vansh-Varshney-07/AI-Context-Studio/discussions) — Questions, ideas, showcases
- [Contributing Guide](/community#contribute) — How to contribute

## License

MIT License — Free for personal and commercial use.`,
      contentHtml: null,
      categoryId: (await prisma.docCategory.findUnique({ where: { slug: "getting-started" } }))!.id,
      sortOrder: 1,
      isPublished: true,
      version: "1.2",
    },
    {
      slug: "getting-started",
      title: "Quick Start",
      description: "Get up and running in 5 minutes",
      content: `# Quick Start

Get AI Context Studio running in 5 minutes.

## 1. Download & Install

| Platform | Download |
|----------|----------|
| Windows | [NSIS Installer](https://github.com/Vansh-Varshney-07/AI-Context-Studio/releases/latest/download/ai-context-studio-setup.exe) / [Portable](https://github.com/Vansh-Varshney-07/AI-Context-Studio/releases/latest/download/ai-context-studio-portable.exe) |
| macOS | [Universal DMG](https://github.com/Vansh-Varshney-07/AI-Context-Studio/releases/latest/download/ai-context-studio-universal.dmg) |
| Linux | [AppImage](https://github.com/Vansh-Varshney-07/AI-Context-Studio/releases/latest/download/ai-context-studio.AppImage) / [DEB](https://github.com/Vansh-Varshney-07/AI-Context-Studio/releases/latest/download/ai-context-studio.deb) / [RPM](https://github.com/Vansh-Varshney-07/AI-Context-Studio/releases/latest/download/ai-context-studio.rpm) |

Verify checksums on the [download page](/download).

## 2. Launch & Welcome

Open the app. You'll see the welcome screen with:
- **Quick Start** — Guided setup
- **Open Workspace** — Existing projects
- **Marketplace** — Browse assets

Click **Quick Start**.

## 3. Configure Targets

Select which AI assistants you use:
- ☑️ Cursor
- ☑️ Claude Code
- ☑️ Windsurf
- ☐ VS Code
- ☐ GitHub Copilot
- ...and more

The app detects installed editors automatically.

## 4. Create Your First Asset

Let's create a **Skill** — an atomic AI capability.

1. Click **Skills** in the sidebar
2. Click **New Skill**
3. Fill in:
- **Name**: \`code-reviewer\`
- **Description**: Reviews code for bugs and style
- **Input**: Code snippet (string)
- **Output**: Review comments (structured)
4. Write the prompt in the editor
5. Click **Save**

## 5. Export to Your Editor

1. Select your skill
2. Click **Export**
3. Choose targets (Cursor, Claude Code, etc.)
4. Click **Export All**

The app generates the appropriate config files in your project.

## 6. Test It

Open a file in Cursor, type \`// @code-reviewer\`, and watch the AI review your code!

## Next Steps

- [Explore the marketplace](/marketplace) for ready-made assets
- [Learn about instruction files](/docs/prompt-files)
- [Set up MCP servers](/docs/mcp)
- [Build a workflow](/docs/workflows)

## Troubleshooting

- **Export not working?** Check file permissions in target directories
- **App won't start?** See [installation troubleshooting](/docs/installation#troubleshooting)
- **Need help?** Join [GitHub Discussions](https://github.com/Vansh-Varshney-07/AI-Context-Studio/discussions)`,
      contentHtml: null,
      categoryId: (await prisma.docCategory.findUnique({ where: { slug: "getting-started" } }))!.id,
      sortOrder: 2,
      isPublished: true,
      version: "1.2",
    },
    {
      slug: "installation",
      title: "Installation",
      description: "Detailed installation instructions for all platforms",
      content: `# Installation

Detailed installation guide for Windows, macOS, and Linux.

## System Requirements

| Platform | Minimum Version |
|----------|-----------------|
| Windows | Windows 10 1903+ (64-bit) |
| macOS | macOS 12+ (Monterey) — Universal binary supports Intel & Apple Silicon |
| Linux | glibc 2.31+, GTK 3.24+, WebKit2GTK 2.38+ |

## Windows

### NSIS Installer (Recommended)

1. Download \`ai-context-studio-setup.exe\`
2. Run the installer
3. Follow the setup wizard
4. Launch from Start Menu

### Portable Version

1. Download \`ai-context-studio-portable.exe\`
2. Place in desired folder
3. Run directly — no installation needed
4. All data stored in same folder

### Verify Checksum

\`\`\`powershell
certutil -hashfile ai-context-studio-setup.exe SHA256
\`\`\`

Compare with checksum on [releases page](https://github.com/Vansh-Varshney-07/AI-Context-Studio/releases).

## macOS

### Universal DMG (Recommended)

1. Download \`ai-context-studio-universal.dmg\`
2. Open DMG
3. Drag to Applications folder
4. Launch from Applications or Spotlight

### First Run (Gatekeeper)

If you see "app is damaged" or "unidentified developer":

\`\`\`bash
xattr -d com.apple.quarantine /Applications/AI\ Context\ Studio.app
\`\`\`

Or right-click → Open → Open.

Our releases are notarized by Apple.

### Verify Checksum

\`\`\`bash
shasum -a 256 ai-context-studio-universal.dmg
\`\`\`

### Verify Notarization

\`\`\`bash
spctl -a -v /Applications/AI\ Context\ Studio.app
\`\`\`

## Linux

### AppImage (Universal)

1. Download \`ai-context-studio.AppImage\`
2. Make executable: \`chmod +x ai-context-studio.AppImage\`
3. Run: \`./ai-context-studio.AppImage\`

Requires FUSE: \`sudo apt install fuse libfuse2\` (Debian/Ubuntu) or \`sudo dnf install fuse\` (Fedora).

### DEB Package (Debian/Ubuntu)

\`\`\`bash
sudo dpkg -i ai-context-studio.deb
sudo apt-get install -f
\`\`\`

### RPM Package (Fedora/RHEL/openSUSE)

\`\`\`bash
sudo rpm -i ai-context-studio.rpm
\`\`\`

### Tarball

\`\`\`bash
tar -xzf ai-context-studio.tar.gz
./ai-context-studio
\`\`\`

### Verify Checksum

\`\`\`bash
sha256sum ai-context-studio.AppImage
\`\`\`

### GPG Signature Verification

\`\`\`bash
gpg --verify ai-context-studio.AppImage.sig ai-context-studio.AppImage
\`\`\`

## Building from Source

\`\`\`bash
git clone https://github.com/Vansh-Varshney-07/AI-Context-Studio.git
cd AI-Context-Studio/desktop
npm install
npm run build
npm run tauri build
\`\`\`

Requirements: Node.js 20+, Rust 1.77+, system dependencies.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| macOS "app is damaged" | \`xattr -d com.apple.quarantine\` |
| Linux AppImage fails | Install FUSE: \`sudo apt install fuse libfuse2\` |
| Windows SmartScreen | Click "More info" → "Run anyway" |
| Export to Cursor fails | Check \`~/.cursor/rules/\` permissions |

See [FAQ](/faq#installation) for more.`,
      contentHtml: null,
      categoryId: (await prisma.docCategory.findUnique({ where: { slug: "getting-started" } }))!.id,
      sortOrder: 3,
      isPublished: true,
      version: "1.2",
    },
  ];

  for (const page of docPages) {
    const existing = await prisma.docPage.findUnique({ where: { slug: page.slug } });
    if (existing) continue;

    await prisma.docPage.create({
      data: page,
    });
    console.log(`✅ Doc page created: ${page.title}`);
  }

  console.log("✅ Documentation created");

  // ============================================
  // FEATURE FLAGS
  // ============================================
  const flags = [
    { key: "marketplace_purchase", name: "Marketplace Purchases", description: "Enable paid asset purchases via Stripe", enabled: false, rollout: 0 },
    { key: "cloud_sync", name: "Cloud Sync", description: "Enable cross-device sync (beta)", enabled: false, rollout: 5 },
    { key: "agent_orchestration", name: "Agent Orchestration", description: "Enable multi-agent workflows (beta)", enabled: true, rollout: 25 },
    { key: "plugin_sdk", name: "Plugin SDK", description: "Enable plugin development SDK", enabled: true, rollout: 100 },
    { key: "mcp_marketplace", name: "MCP Marketplace", description: "Browse and install MCP servers from marketplace", enabled: true, rollout: 100 },
    { key: "analytics_dashboard", name: "Creator Analytics", description: "Analytics dashboard for asset creators", enabled: false, rollout: 0 },
    { key: "enterprise_sso", name: "Enterprise SSO", description: "SAML/OIDC SSO for enterprise customers", enabled: false, rollout: 0 },
  ];

  for (const flag of flags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: {},
      create: flag,
    });
  }

  console.log("✅ Feature flags created");

  // ============================================
  // SEO PAGES
  // ============================================
  const seoPages = [
    { path: "/", title: "AI Context Studio", description: "Build, customize, manage, and export AI instruction assets for multiple AI coding assistants. Local-first, offline-first, no auth required.", ogTitle: "AI Context Studio", ogDescription: "Local-first prompt engineering studio for AI coding assistants.", ogImage: "https://aicontextstudio.dev/og-home.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/marketplace", title: "Marketplace — AI Context Studio", description: "Discover, install, and publish community AI assets — skills, personas, templates, prompt packs, workflows, and MCP servers.", ogTitle: "Marketplace — AI Context Studio", ogDescription: "Browse community AI assets.", ogImage: "https://aicontextstudio.dev/og-marketplace.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/download", title: "Download — AI Context Studio", description: "Download AI Context Studio for Windows, macOS, and Linux. Native installers, portable versions, and source code.", ogTitle: "Download — AI Context Studio", ogDescription: "Native apps for Windows, macOS, and Linux.", ogImage: "https://aicontextstudio.dev/og-download.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/docs", title: "Documentation — AI Context Studio", description: "Complete documentation for AI Context Studio. Getting Started, Desktop App, Marketplace, Registry, MCP, Skills, Prompt Files, API Keys, Security, Developer Guide, Architecture.", ogTitle: "Documentation — AI Context Studio", ogDescription: "Full documentation with guides, API reference, and examples.", ogImage: "https://aicontextstudio.dev/og-docs.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/blog", title: "Blog & Updates — AI Context Studio", description: "Latest news, release notes, announcements, development logs, tutorials, and community showcases from AI Context Studio.", ogTitle: "Blog & Updates — AI Context Studio", ogDescription: "Release notes, announcements, tutorials, and showcases.", ogImage: "https://aicontextstudio.dev/og-blog.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/security", title: "Security — AI Context Studio", description: "Security policy, responsible disclosure, CVE history, audit reports, and security best practices for AI Context Studio.", ogTitle: "Security — AI Context Studio", ogDescription: "Security policy, audits, and responsible disclosure.", ogImage: "https://aicontextstudio.dev/og-security.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/roadmap", title: "Roadmap — AI Context Studio", description: "Transparent roadmap with completed, in-progress, planned, and future features. Vote on priorities and track progress.", ogTitle: "Roadmap — AI Context Studio", ogDescription: "Public roadmap with community voting.", ogImage: "https://aicontextstudio.dev/og-roadmap.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/community", title: "Community — AI Context Studio", description: "Join the AI Context Studio community. GitHub Discussions, contributors, creators, showcases, and events.", ogTitle: "Community — AI Context Studio", ogDescription: "GitHub, contributors, and showcases.", ogImage: "https://aicontextstudio.dev/og-community.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/registry", title: "Registry — AI Context Studio", description: "Open specification for AI asset packaging, versioning, dependencies, and compatibility. Reference implementation in Rust.", ogTitle: "Registry — AI Context Studio", ogDescription: "Asset packaging specification and reference implementation.", ogImage: "https://aicontextstudio.dev/og-registry.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/products", title: "Products — AI Context Studio", description: "Desktop App, Online Hub (coming soon), Marketplace, Registry, Community, and Future Cloud platform.", ogTitle: "Products — AI Context Studio", ogDescription: "Desktop App, Marketplace, Registry, and more.", ogImage: "https://aicontextstudio.dev/og-products.png", twitterCard: "summary_large_image", robots: "index, follow" },
    { path: "/faq", title: "FAQ — AI Context Studio", description: "Frequently asked questions about AI Context Studio. General, Installation, Usage, Marketplace, Development, Troubleshooting.", ogTitle: "FAQ — AI Context Studio", ogDescription: "Answers to common questions.", ogImage: "https://aicontextstudio.dev/og-faq.png", twitterCard: "summary_large_image", robots: "index, follow" },
  ];

  for (const page of seoPages) {
    await prisma.seoPage.upsert({
      where: { path: page.path },
      update: {},
      create: page,
    });
  }

  console.log("✅ SEO pages created");

  // ============================================
  // SYSTEM PROMPT TEMPLATES (for AI generation feature)
  // ============================================
  const systemPromptTemplates = [
    {
      key: "system_prompt_claude_md",
      name: "CLAUDE.md Generator",
      description: "Generate concise CLAUDE.md instruction files for Claude Code",
      category: "instruction-file",
      targetId: "claude",
      content: `You are an expert at creating CLAUDE.md instruction files for Claude Code.

CLAUDE.md files are markdown files that provide persistent instructions to Claude Code across sessions. They should be:
- Concise and to-the-point
- Descriptive but not lengthy (this is part of every prompt)
- Focus on project-specific conventions, architecture decisions, and workflows
- Suggest using specific parts in skills or personas when appropriate

Structure your output as a valid CLAUDE.md file with:
1. Project overview (2-3 sentences)
2. Key conventions (bullet points)
3. Architecture notes (if any)
4. Workflow instructions (if any)
5. References to skills/personas (if applicable)`,
      constraints: "Keep concise, to-the-point, descriptive but not lengthy. This is part of every prompt. Suggest using specific parts in skills or personas.",
      isActive: true,
      isDefault: true,
      sortOrder: 1,
      createdBy: adminUser.id,
    },
    {
      key: "system_prompt_agents_md",
      name: "AGENTS.md Generator",
      description: "Generate general AGENTS.md instruction files for OpenAI Codex and generic use",
      category: "instruction-file",
      targetId: "general",
      content: `You are an expert at creating AGENTS.md instruction files for AI coding assistants.

AGENTS.md is a universal instruction file format used by OpenAI Codex and other AI tools. It should:
- Be concise and actionable
- Define project conventions, coding standards, and workflows
- Not be overly lengthy (this is part of every prompt context)
- Suggest modular breakdown into skills or personas for complex topics

Structure as a valid AGENTS.md with:
1. Project purpose (2-3 sentences)
2. Coding conventions
3. Architecture patterns
4. Common workflows
5. Links to detailed docs (if any)`,
      constraints: "Keep concise, to-the-point, descriptive but not lengthy. This is part of every prompt. Suggest using specific parts in skills or personas.",
      isActive: true,
      isDefault: true,
      sortOrder: 2,
      createdBy: adminUser.id,
    },
    {
      key: "system_prompt_cursor",
      name: ".cursorrules Generator",
      description: "Generate Cursor-specific rule files",
      category: "instruction-file",
      targetId: "cursor",
      content: `You are an expert at creating .cursorrules files for Cursor IDE.

.cursorrules files define custom rules that Cursor's AI follows. They should:
- Be specific to Cursor's capabilities
- Use Cursor's rule syntax (globs, descriptions, actions)
- Be concise and actionable
- Focus on code generation preferences, style guides, and project conventions

Structure with clear rule definitions.`,
      constraints: "Keep concise, to-the-point, descriptive but not lengthy. Use Cursor rule syntax. Suggest using specific parts in skills or personas.",
      isActive: true,
      isDefault: true,
      sortOrder: 3,
      createdBy: adminUser.id,
    },
    {
      key: "system_prompt_copilot",
      name: "Copilot Instructions Generator",
      description: "Generate GitHub Copilot instruction files",
      category: "instruction-file",
      targetId: "copilot",
      content: `You are an expert at creating .github/copilot-instructions.md files for GitHub Copilot.

These files provide repository-specific instructions to Copilot. They should:
- Be concise and focused on code generation preferences
- Define coding standards, naming conventions, and patterns
- Not be overly verbose (part of every prompt context)
- Reference skills/personas for complex topics

Output as valid markdown for .github/copilot-instructions.md.`,
      constraints: "Keep concise, to-the-point, descriptive but not lengthy. This is part of every prompt. Suggest using specific parts in skills or personas.",
      isActive: true,
      isDefault: true,
      sortOrder: 4,
      createdBy: adminUser.id,
    },
    {
      key: "system_prompt_system",
      name: "System Prompt Generator",
      description: "Generate general system/role prompts for any AI assistant",
      category: "system-prompt",
      targetId: null,
      content: `You are an expert at creating system prompts for AI coding assistants.

System prompts define the AI's role, behavior, and constraints. They should:
- Clearly define the AI's role and expertise
- Set explicit boundaries and constraints
- Use structured format with variables/conditionals when needed
- Be reusable across different contexts
- Suggest breaking complex prompts into skills or personas

Output a complete system prompt ready for use.`,
      constraints: "Keep concise, to-the-point, descriptive but not lengthy. Define clear role and constraints. Suggest using specific parts in skills or personas.",
      isActive: true,
      isDefault: true,
      sortOrder: 5,
      createdBy: adminUser.id,
    },
    {
      key: "system_prompt_persona",
      name: "Persona Generator",
      description: "Generate AI persona definitions with expertise and personality",
      category: "persona",
      targetId: null,
      content: `You are an expert at creating AI persona definitions.

Personas define an AI's role, expertise, communication style, and decision-making approach. They should:
- Define clear expertise areas and background
- Specify communication style (concise, detailed, tutorial, etc.)
- Include decision-making principles
- Be usable across multiple AI targets
- Suggest related skills for specific capabilities

Output a complete persona definition.`,
      constraints: "Keep concise, to-the-point, descriptive but not lengthy. Define expertise, style, and principles. Suggest using specific parts in skills.",
      isActive: true,
      isDefault: true,
      sortOrder: 6,
      createdBy: adminUser.id,
    },
    {
      key: "system_prompt_skill",
      name: "Skill Generator",
      description: "Generate composable AI skill definitions with typed I/O",
      category: "skill",
      targetId: null,
      content: `You are an expert at creating AI skill definitions.

Skills are atomic, composable capabilities with typed inputs and outputs. They should:
- Have a single, well-defined purpose
- Specify input schema (what the skill receives)
- Specify output schema (what the skill produces)
- Include the prompt/template that implements the skill
- Be composable with other skills in workflows
- Be reusable across different projects

Output a complete skill definition with I/O schemas.`,
      constraints: "Keep concise, to-the-point, descriptive but not lengthy. Define clear I/O schemas. This is a composable unit.",
      isActive: true,
      isDefault: true,
      sortOrder: 7,
      createdBy: adminUser.id,
    },
    {
      key: "system_prompt_workflow",
      name: "Workflow Generator",
      description: "Generate multi-step workflow pipelines with conditional logic",
      category: "workflow",
      targetId: null,
      content: `You are an expert at creating AI workflow definitions.

Workflows chain multiple skills, prompts, and tools into multi-step pipelines. They should:
- Define a clear sequence or graph of steps
- Specify conditional routing between steps
- Handle errors and fallbacks
- Share memory/state between steps
- Be executable by an orchestrator
- Reference existing skills by name

Output a complete workflow definition.`,
      constraints: "Keep concise, to-the-point, descriptive but not lengthy. Define steps, conditions, and skill references.",
      isActive: true,
      isDefault: true,
      sortOrder: 8,
      createdBy: adminUser.id,
    },
    {
      key: "system_prompt_memory",
      name: "Memory Generator",
      description: "Generate persistent memory/context blocks for agents",
      category: "memory",
      targetId: null,
      content: `You are an expert at creating memory/context blocks for AI agents.

Memories are persistent context blocks that agents can recall across sessions. They should:
- Store reference material (architecture decisions, code patterns, API specs)
- Be searchable and versioned
- Have clear scope and applicability
- Be attachable to prompts or workflows
- Support semantic retrieval

Output a complete memory block with content and metadata.`,
      constraints: "Keep concise, to-the-point, descriptive but not lengthy. Define clear scope and content for retrieval.",
      isActive: true,
      isDefault: true,
      sortOrder: 9,
      createdBy: adminUser.id,
    },
    {
      key: "system_prompt_context",
      name: "Context File Generator",
      description: "Generate reference documentation and context files",
      category: "context-file",
      targetId: null,
      content: `You are an expert at creating context/reference files for AI assistants.

Context files provide reference documentation that agents can consult. They should:
- Be well-organized with clear sections
- Include practical examples
- Be kept up-to-date with the codebase
- Focus on information that changes infrequently
- Support cross-referencing with skills/personas

Output a complete context/reference file.`,
      constraints: "Keep concise, to-the-point, descriptive but not lengthy. Organize for easy reference. Suggest linking to skills or personas.",
      isActive: true,
      isDefault: true,
      sortOrder: 10,
      createdBy: adminUser.id,
    },
  ];

  for (const template of systemPromptTemplates) {
    await prisma.systemPromptTemplate.upsert({
      where: { key: template.key },
      update: {},
      create: template,
    });
  }

  console.log("✅ System prompt templates created");

  // ============================================
  // NEWSLETTER
  // ============================================
  // Just ensure table exists - subscribers will come from the newsletter form

  console.log("✅ Database seed completed successfully!");
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    🎉 SEED COMPLETE 🎉                       ║
╠══════════════════════════════════════════════════════════════╣
║  Users:          2 (admin, demo)                             ║
║  Categories:     9                                           ║
║  Tags:           30                                          ║
║  Blog Categories: 5                                          ║
║  Roadmap Items:  4 (real project milestones)                 ║
║  Doc Categories: 11                                          ║
║  Doc Pages:      3                                           ║
║  Feature Flags:  7                                           ║
║  SEO Pages:      11                                          ║
║  System Prompts: 10 (for AI generation feature)              ║
╚══════════════════════════════════════════════════════════════╝

Tables with graceful empty states (no seed data):
  - Assets (marketplace) — "No assets published yet"
  - Blog Posts — "No blog posts published yet"
  - Community Posts — "No discussions yet"
  - Releases — Uses GitHub API
  - Security Advisories — "No advisories"
  - Audit Reports — "No reports"
  - Registry Packages — "No packages"

Test accounts:
  admin@aicontextstudio.dev / password123 (OWNER)
  demo@aicontextstudio.dev / password123 (USER)
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });