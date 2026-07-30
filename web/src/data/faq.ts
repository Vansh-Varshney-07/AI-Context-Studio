export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export const faqCategories = [
  { id: "general", label: "General", icon: "HelpCircle" },
  { id: "installation", label: "Installation", icon: "Download" },
  { id: "usage", label: "Usage", icon: "MousePointer" },
  { id: "marketplace", label: "Marketplace", icon: "Package" },
  { id: "development", label: "Development", icon: "Code" },
  { id: "troubleshooting", label: "Troubleshooting", icon: "AlertTriangle" },
];

export const faq: FAQItem[] = [
  // General
  {
    category: "general",
    question: "What is AI Context Studio?",
    answer: "AI Context Studio is a local-first, offline-first prompt engineering studio for AI coding assistants. It lets you build, customize, manage, and export AI instruction assets (system prompts, instruction files, memories, MCP configs, workflows, skills, personas) to multiple targets like Cursor, Claude Code, Windsurf, VS Code, Copilot, and more — all from a single workspace.",
  },
  {
    category: "general",
    question: "Is it really free and open source?",
    answer: "Yes. AI Context Studio is MIT licensed and completely free to use. The desktop app, web marketplace, registry specification, and all core infrastructure are open source. There are no hidden costs, no telemetry, no forced cloud sync, and no account required.",
  },
  {
    category: "general",
    question: "What does 'local-first' mean?",
    answer: "Local-first means your data lives on your machine by default. No cloud storage, no mandatory accounts, no telemetry. You own your prompts, memories, API keys, and assets. Cloud features (sync, collaboration) are opt-in and coming in a future release with end-to-end encryption.",
  },
  {
    category: "general",
    question: "Which AI coding assistants are supported?",
    answer: "Currently supported export targets: Cursor (.cursorrules), Claude Code (CLAUDE.md), Windsurf (.windsurfrules), VS Code (.vscode/prompts), GitHub Copilot (.github/copilot-instructions.md), OpenAI Codex (AGENTS.md), Google Gemini (GEMINI.md), Continue (.continuerules.json), Roo Code (.roo/rules), and generic AGENTS.md. More targets are added regularly.",
  },
  {
    category: "general",
    question: "Can I use it without an internet connection?",
    answer: "Yes! The desktop app works fully offline. All core features — prompt editing, asset management, export, MCP configuration — work without internet. Only marketplace browsing, updates, and optional cloud sync require connectivity.",
  },

  // Installation
  {
    category: "installation",
    question: "How do I install AI Context Studio?",
    answer: "Download the appropriate installer for your platform from the Download page: Windows (NSIS .exe), macOS (Universal .dmg), or Linux (AppImage, .deb, .rpm, .tar.gz). Run the installer and follow the setup wizard. No additional dependencies required.",
  },
  {
    category: "installation",
    question: "Does it work on Linux?",
    answer: "Yes. We provide AppImage (runs on most distributions), .deb (Debian/Ubuntu), .rpm (Fedora/RHEL/openSUSE), and .tar.gz. Requires glibc 2.31+, GTK 3.24+, and WebKit2GTK 2.38+. Most modern distributions (Ubuntu 22.04+, Fedora 36+, Arch, etc.) work out of the box.",
  },
  {
    category: "installation",
    question: "Is there a portable version for Windows?",
    answer: "Yes. The Windows download page offers both an NSIS installer (recommended) and a portable .exe that runs without installation. The portable version stores all data in its own folder.",
  },
  {
    category: "installation",
    question: "How do I verify the download checksum?",
    answer: "Each download lists a SHA256 checksum. Verify on Windows: `certutil -hashfile <file> SHA256`. On macOS/Linux: `shasum -a 256 <file>` or `sha256sum <file>`. Compare with the checksum on the download page. Linux AppImages also include GPG signatures.",
  },

  // Usage
  {
    category: "usage",
    question: "How do I create a system prompt?",
    answer: "Open the Prompt Engine module in the desktop app. Use the structured form to define role, context, instructions, variables, and output format. Preview the generated prompt in real-time, then export to your target AI assistant with one click.",
  },
  {
    category: "usage",
    question: "What are Instruction Files?",
    answer: "Instruction Files are markdown files (.md) with frontmatter that define project-level instructions for AI assistants. The most common is AGENTS.md (used by Codex, generic) and CLAUDE.md (used by Claude Code). You can create per-target instruction files from templates.",
  },
  {
    category: "usage",
    question: "How do Memories work?",
    answer: "Memories are persistent context blocks that you can attach to any prompt or workflow. They store code snippets, documentation, API references, or any reference material. Memories are versioned, searchable, and can be shared across projects.",
  },
  {
    category: "usage",
    question: "What is MCP and how do I use it?",
    answer: "MCP (Model Context Protocol) is an open standard for connecting AI assistants to external tools and data sources. In AI Context Studio, the MCP Manager lets you configure, validate, and export MCP server configurations for databases, APIs, file systems, and custom tools. Supported clients: Claude, Cursor, Windsurf, Continue.",
  },
  {
    category: "usage",
    question: "Can I import/export my assets?",
    answer: "Yes. Assets are packaged as .acs files (zip-based format with manifest.json + content). You can export any asset for backup or sharing, and import .acs files into the desktop app. The marketplace also uses this format for distribution.",
  },

  // Marketplace
  {
    category: "marketplace",
    question: "How do I install assets from the marketplace?",
    answer: "Browse the marketplace on the web or in the desktop app. Click 'Install' on any asset to copy the install command (e.g., `acs install code-review-assistant`). Run this command in your terminal, or use the desktop app's built-in installer.",
  },
  {
    category: "marketplace",
    question: "Are marketplace assets vetted?",
    answer: "Verified assets (badge with checkmark) are published by the AI Context Studio team or trusted partners and have passed automated validation. Community assets are not pre-vetted but show download counts, ratings, and source code links. Always review before installing.",
  },
  {
    category: "marketplace",
    question: "Can I publish my own assets?",
    answer: "Yes! Create an asset in the desktop app, then use `acs publish` to submit to the marketplace. Assets must pass validation and follow the registry specification. See the Publishing guide in the docs for details.",
  },
  {
    category: "marketplace",
    question: "What asset types are supported?",
    answer: "The marketplace supports: Skills (atomic AI capabilities), Personas (AI roles), Templates (project starters), Prompt Packs (curated prompt collections), Instruction Files (AGENTS.md, CLAUDE.md, etc.), Workflows (multi-step pipelines), MCP Servers (tool configurations), Collections (curated groups), and Bundles (multi-asset packages).",
  },

  // Development
  {
    category: "development",
    question: "How do I contribute to AI Context Studio?",
    answer: "Contributions are welcome! Check the GitHub repository for 'good first issue' labels. Follow the contributing guide for code style, testing, and PR process. You can also contribute by publishing assets to the marketplace, improving documentation, or reporting bugs.",
  },
  {
    category: "development",
    question: "Can I build custom exporters or integrations?",
    answer: "Yes. The Plugin SDK (in development) will allow building custom exporters, validators, and UI extensions. Currently, you can extend the export system by modifying the open-source desktop app code. See the Developer Guide in the docs.",
  },
  {
    category: "development",
    question: "What is the tech stack?",
    answer: "Desktop: Tauri 2 + Next.js 16 + React 19 + TypeScript + Rust. Web: Next.js 16 (static export) + React 19 + Tailwind CSS 4. Shared: TypeScript components, hooks, types, utils. Registry/Marketplace: Rust crates. Build: pnpm, Cargo.",
  },

  // Troubleshooting
  {
    category: "troubleshooting",
    question: "The app won't start on macOS — 'app is damaged'",
    answer: "This happens with unsigned/notarized builds. Fix: Right-click the app → Open → Open. Or run: `xattr -d com.apple.quarantine /Applications/AI\\ Context\\ Studio.app`. Our releases are notarized; this only affects development builds.",
  },
  {
    category: "troubleshooting",
    question: "Linux AppImage fails to run",
    answer: "Ensure you have FUSE installed: `sudo apt install fuse libfuse2` (Debian/Ubuntu) or `sudo dnf install fuse` (Fedora). Then make executable: `chmod +x *.AppImage` and run. If still failing, try `./*.AppImage --no-sandbox`.",
  },
  {
    category: "troubleshooting",
    question: "Export to Cursor/Claude not working",
    answer: "Ensure the target application is installed and you have write permissions to its config directory. For Cursor: `~/.cursor/rules/`. For Claude Code: project root. Check the desktop app's export logs (Help → View Logs) for specific errors.",
  },
  {
    category: "troubleshooting",
    question: "How do I report a bug or request a feature?",
    answer: "Open an issue on GitHub: https://github.com/ai-context-studio/ai-context-studio/issues. Use the bug report or feature request template. Include your OS, app version, steps to reproduce, and any error logs.",
  },
];

export const faqByCategory = faqCategories.map((cat) => ({
  ...cat,
  items: faq.filter((f) => f.category === cat.id),
}));