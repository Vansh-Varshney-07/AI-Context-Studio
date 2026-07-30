import type { Metadata } from 'next';
import { docCategories, getCategory, getSidebarItems } from '@/data/docs';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
import { DocLayout } from '@/components/docs/doc-layout';
import { CodeBlock, Callout, InstallCommand, VersionBadge } from '@/components/docs';
import Link from 'next/link';

export async function generateStaticParams() {
  return docCategories.flatMap((cat) =>
    cat.items.map((item) => ({
      category: cat.id,
      page: item.href.split('/').pop() || 'overview',
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}): Promise<Metadata> {
  const { category, page } = await params;
  const cat = getCategory(category);
  const item = cat?.items.find((i) => i.href.endsWith(page));
  return generatePageMetadata({
    title: item?.title || 'Documentation',
    description: `Learn about ${item?.title || 'this topic'} in AI Context Studio`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}) {
  const { category, page } = await params;
  const cat = getCategory(category);

  if (!cat) {
    return (
      <DocLayout currentCategory="getting-started">
        <h1>Page not found</h1>
      </DocLayout>
    );
  }

  const sidebarItems = getSidebarItems(category);

  return (
    <DocLayout currentCategory={category} currentPage={page}>
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] capitalize">
            {page.replace(/-/g, ' ')}
          </h1>
          <p className="text-[var(--color-text-secondary)]">Documentation for AI Context Studio.</p>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {getPageContent(category, page)}
        </div>
      </div>
    </DocLayout>
  );
}

// Code block constants - extracted to avoid Turbopack template literal parsing issues
const CODE_BLOCKS = {
  seniorCodeReviewerPrompt: `# Senior Code Reviewer

You are a senior software engineer specializing in code reviews.
Focus on: security, performance, maintainability, and team conventions.

## Review Guidelines
- Check for security vulnerabilities (SQL injection, XSS, path traversal)
- Verify error handling and edge cases
- Ensure consistent code style and naming
- Suggest performance improvements where measurable
- Flag premature optimization

## Output Format
Provide feedback as structured comments with severity:
- 🔴 Critical: Security/data loss risk
- 🟡 Warning: Bug risk or maintainability issue
- 💡 Suggestion: Improvement opportunity
- ✅ Approved: No issues found`,

  seniorCodeReviewerWithVars: `# Senior Code Reviewer

You are a &#123;&#123;language&#125;&#125; expert with &#123;&#123;years&#125;&#125; years of experience.
Focus on: security, performance, maintainability.

Project context: &#123;&#123;project_type&#125;&#125;
Team conventions: &#123;&#123;conventions&#125;&#125;`,

  agentsMd: `---
title: "Project Instructions"
targets: [cursor, claude, windsurf, vscode]
version: 1.0.0
---

# Project Instructions

## Coding Standards
- Use TypeScript strict mode
- Prefer functional components
- Max 200 lines per file

## Workflow
1. Write tests first
2. Implement feature
3. Run lint + typecheck
4. Submit PR`,

  agentsCursorMd: `---
extends: AGENTS.md
target: cursor
---

# Cursor-Specific Instructions

- Use \`@codebase\` for context
- Prefer \`@file\` references
- Enable "Include in context" for config files`,

  seniorEngineerPersona: `{
  "name": "senior-engineer",
  "title": "Senior Software Engineer",
  "expertise": ["architecture", "security", "performance", "mentoring"],
  "tone": "professional",
  "guidelines": [
    "Prioritize maintainability over cleverness",
    "Flag security issues immediately",
    "Suggest tests for new logic"
  ]
}`,

  codeReviewSkill: `{
  "name": "code-review",
  "version": "1.0.0",
  "description": "Automated code review for PRs",
  "inputs": {
    "diff": { "type": "string", "required": true },
    "language": { "type": "string", "default": "typescript" }
  },
  "outputs": {
    "comments": { "type": "array", "items": { "type": "string" } },
    "severity": { "type": "string", "enum": ["critical", "warning", "suggestion"] }
  },
  "prompt": "Review this &#123;&#123;language&#125;&#125; diff for security, performance, and style:\n\n&#123;&#123;diff&#125;&#125;"
}`,

  ciReviewWorkflow: `name: "CI Code Review"
version: "1.0"
steps:
  - id: fetch-diff
    tool: github.get_pr_diff
    params:
      repo: "&#123;&#123;repo&#125;&#125;"
      pr: "&#123;&#123;pr_number&#125;&#125;"
  - id: review
    skill: code-review
    params:
      diff: "&#123;&#123;steps.fetch-diff.output&#125;&#125;"
      language: "&#123;&#123;language&#125;&#125;"
  - id: post-comments
    tool: github.post_review_comments
    params:
      repo: "&#123;&#123;repo&#125;&#125;"
      pr: "&#123;&#123;pr_number&#125;&#125;"
      comments: "&#123;&#123;steps.review.output.comments&#125;&#125;"`,

  validateCommands: `acs validate ./my-asset.acs
acs validate ./my-asset.acs --strict`,

  manifestJson: `{
  "$schema": "https://ai-context-studio.dev/schemas/manifest-v1.json",
  "id": "code-review-assistant",
  "name": "Code Review Assistant",
  "version": "2.1.0",
  "author": "janedoe",
  "type": "skill",
  "description": "AI-powered code review for PRs...",
  "tags": ["code-review", "security", "automation"],
  "minAppVersion": "1.0.0",
  "checksum": "sha256:a1b2c3d4e5f6...",
  "license": "MIT",
  "dependencies": {
    "base-prompt": "^1.0.0"
  },
  "targets": ["cursor", "claude", "windsurf", "vscode"],
  "screenshots": ["preview.png"],
  "readme": "README.md"
}`,

  dependencyRanges: `{
  "dependencies": {
    "base-prompt": "^1.0.0",      // Compatible with 1.x.x
    "utility-functions": "~2.1.0", // Compatible with 2.1.x
    "logger": ">=1.0.0 <3.0.0"     // Custom range
  }
}`,

  postgresMcpConfig: `{
  "name": "postgres-prod",
  "command": "npx",
  "args": ["@modelcontextprotocol/server-postgres"],
  "env": {
    "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@localhost:5432/db"
  },
  "permissions": {
    "filesystem": ["read"],
    "network": ["localhost:5432"]
  }
}`,

  pythonMcpServer: `from mcp.server import Server
from mcp.types import Tool

server = Server("my-custom-server")

@server.tool()
async def get_weather(city: str) -> str:
    """Get current weather for a city."""
    # Your API call here
    return f"Weather in {city}: Sunny, 72°F"

if __name__ == "__main__":
    server.run()`,

  skillTemplate: `{
  "name": "my-skill",
  "version": "1.0.0",
  "description": "What this skill does",
  "inputs": {
    "param1": { "type": "string", "required": true, "description": "..." },
    "param2": { "type": "number", "default": 10 }
  },
  "outputs": {
    "result": { "type": "string" }
  },
  "prompt": "Your prompt template with &#123;&#123;param1&#125;&#125; and &#123;&#123;param2&#125;&#125;"
}`,

  promptFileTemplate: `---
name: "Code Review"
version: "1.0.0"
variables:
  language:
    type: string
    default: "typescript"
  severity:
    type: string
    enum: ["critical", "warning", "suggestion"]
    default: "warning"
---

# Code Review for &#123;&#123;language&#125;&#125;

Review this code for security, performance, and maintainability.

&#123;&#123;#if include_tests&#125;&#125;
Also check for test coverage.
&#123;&#123;/if&#125;&#125;

Severity threshold: &#123;&#123;severity&#125;&#125;`,

  pluginManifest: `{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "Custom exporter for XYZ format",
  "main": "dist/index.js",
  "pluginType": "exporter",
  "targets": ["xyz"],
  "permissions": ["filesystem:read", "filesystem:write"],
  "apiVersion": "1"
}`,

  exporterPlugin: `import { ExporterPlugin, Asset } from "@ai-context-studio/plugin-api";

export const myExporter: ExporterPlugin = {
  name: "my-custom-format",
  version: "1.0.0",
  targets: ["custom"],
  
  async export(asset: Asset, options: ExportOptions): Promise<ExportResult> {
    const content = renderTemplate(asset, options.template);
    return { files: [{ path: "output.custom", content }] };
  }
}`,

  architectureMermaid: `graph TD
    A[User Input] --> B[Prompt Engine]
    B --> C[Asset Store]
    C --> D[Export Pipeline]
    D --> E[Target Formatters]
    E --> F[Output Files]
    
    C --> G[Marketplace]
    C --> H[Registry Validator]
    G --> I[Remote Assets]
    I --> C`,
};

function getPageContent(category: string, page: string) {
  const contentMap: Record<string, Record<string, React.ReactNode>> = {
    'getting-started': {
      docs: (
        <>
          <h2 id="introduction">Introduction</h2>
          <p>
            AI Context Studio is a local-first prompt engineering studio that helps you build,
            customize, manage, and export AI instruction assets for multiple AI coding assistants.
            It runs entirely on your machine — no cloud sync, no account required, no telemetry by
            default.
          </p>

          <h3>What are Instruction Assets?</h3>
          <p>
            Instruction assets are structured prompts, system instructions, memories, and workflows
            that guide AI coding assistants like Cursor, Claude Code, Windsurf, VS Code Copilot, and
            others. Instead of copying prompts between tools, you define them once in AI Context
            Studio and export to any target.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li>
              <strong>Local-first:</strong> All data stays on your machine. Works fully offline.
            </li>
            <li>
              <strong>Multi-target export:</strong> One asset definition exports to 10+ AI
              assistants.
            </li>
            <li>
              <strong>Asset packaging:</strong> Versioned .acs packages with dependencies and
              checksums.
            </li>
            <li>
              <strong>Marketplace:</strong> Discover, install, and publish community assets.
            </li>
            <li>
              <strong>MCP integration:</strong> Configure and manage Model Context Protocol servers.
            </li>
            <li>
              <strong>Open source:</strong> MIT licensed, transparent development on GitHub.
            </li>
          </ul>

          <Callout type="tip" title="Quick Start">
            <p>
              New to AI Context Studio? Start with{' '}
              <Link href="/docs/getting-started/quick-start">Quick Start</Link> to get running in 5
              minutes.
            </p>
          </Callout>
        </>
      ),
      'quick-start': (
        <>
          <h2 id="quick-start">Quick Start</h2>
          <p>Get AI Context Studio running in 5 minutes.</p>

          <h3 id="prerequisites">Prerequisites</h3>
          <ul>
            <li>Windows 10 1903+, macOS 12+, or Linux (glibc 2.31+)</li>
            <li>512 MB RAM minimum (2 GB recommended)</li>
            <li>200 MB disk space</li>
          </ul>

          <h3 id="install">Install</h3>
          <InstallCommand
            command="winget install AIContextStudio.AIContextStudio"
            label="Windows"
          />
          <InstallCommand command="brew install --cask ai-context-studio" label="macOS" />
          <InstallCommand command="./ai-context-studio-1.0.0-x64.AppImage" label="Linux" />

          <h3 id="first-launch">First Launch</h3>
          <ol>
            <li>Open AI Context Studio from your applications menu</li>
            <li>Complete the welcome tour (optional)</li>
            <li>Create your first system prompt or browse the Marketplace</li>
            <li>Export to your preferred AI assistant</li>
          </ol>

          <Callout type="note" title="No Account Required">
            <p>
              AI Context Studio works immediately without creating an account. All data is stored
              locally in your user directory.
            </p>
          </Callout>

          <h3 id="next-steps">Next Steps</h3>
          <ul>
            <li>
              <Link href="/docs/getting-started/core-concepts">Core Concepts</Link> — Understand
              assets, targets, and exports
            </li>
            <li>
              <Link href="/docs/getting-started/first-asset">Your First Asset</Link> — Build a
              system prompt from scratch
            </li>
            <li>
              <Link href="/docs/marketplace/browsing">Browse Marketplace</Link> — Discover community
              assets
            </li>
          </ul>
        </>
      ),
      installation: (
        <>
          <h2 id="installation">Installation Guide</h2>
          <p>Detailed installation instructions for all supported platforms.</p>

          <h3 id="windows">Windows</h3>
          <InstallCommand
            command="winget install AIContextStudio.AIContextStudio"
            label="Windows (winget)"
          />
          <p className="mt-2">
            <strong>Alternative downloads:</strong>
          </p>
          <ul>
            <li>
              <strong>NSIS Installer</strong> (.exe) — Full install with Start Menu entry
            </li>
            <li>
              <strong>Portable</strong> (.exe) — No installation, run from any folder
            </li>
          </ul>

          <h3 id="macos">macOS</h3>
          <InstallCommand
            command="brew install --cask ai-context-studio"
            label="macOS (Homebrew)"
          />
          <p className="mt-2">
            <strong>Direct download:</strong> Universal DMG (Apple Silicon + Intel)
          </p>
          <Callout type="warning" title="Gatekeeper">
            <p>
              On first run, right-click the app and select "Open" to bypass Gatekeeper for unsigned
              builds.
            </p>
          </Callout>

          <h3 id="linux">Linux</h3>
          <InstallCommand
            command="chmod +x ai-context-studio-1.0.0-x64.AppImage && ./ai-context-studio-1.0.0-x64.AppImage"
            label="Linux (AppImage)"
          />
          <p className="mt-2">
            <strong>Alternative formats:</strong> .deb, .rpm, .tar.gz
          </p>
          <Callout type="note" title="Dependencies">
            <p>
              Requires glibc 2.31+, GTK 3.24+, WebKit2GTK 2.38+. AppImage includes most
              dependencies.
            </p>
          </Callout>

          <h3 id="verify">Verify Downloads</h3>
          <p>
            All releases include SHA256 checksums and signatures. See{' '}
            <Link href="/download#verify">Verify Downloads</Link> for instructions.
          </p>
        </>
      ),
      'core-concepts': (
        <>
          <h2 id="core-concepts">Core Concepts</h2>
          <p>Understand the fundamental building blocks of AI Context Studio.</p>

          <h3 id="assets">Assets</h3>
          <p>
            An <strong>asset</strong> is a packaged unit of AI instruction: system prompts,
            instruction files, personas, skills, workflows, memories, or MCP configs. Assets are
            versioned, have dependencies, and export to multiple targets.
          </p>

          <h3 id="targets">Targets</h3>
          <p>
            A <strong>target</strong> is an AI coding assistant or editor that consumes instruction
            assets. Supported targets: Cursor, Claude Code, Windsurf, VS Code Copilot, GitHub
            Copilot, Continue, Roo Code, OpenCode, Codex, and Generic Markdown.
          </p>
        </>
      ),
      'first-asset': (
        <>
          <h2 id="your-first-asset">Create Your First Asset</h2>
          <p>Build a system prompt asset from scratch and export it to your AI assistant.</p>

          <h3 id="step-1">Step 1: Open the Prompt Engine</h3>
          <ol>
            <li>Launch AI Context Studio</li>
            <li>Click "Prompt Engine" in the sidebar</li>
            <li>Click "New System Prompt"</li>
          </ol>

          <h3 id="step-2">Step 2: Define the Prompt</h3>
          <CodeBlock
            language="markdown"
            filename="system-prompt.md"
            code={CODE_BLOCKS.seniorCodeReviewerPrompt}
          />

          <h3 id="step-3">Step 3: Add Variables</h3>
          <p>Make your prompt reusable with variables:</p>
          <CodeBlock language="markdown" code={CODE_BLOCKS.seniorCodeReviewerWithVars} />

          <h3 id="step-4">Step 4: Export</h3>
          <ol>
            <li>Click "Export" in the toolbar</li>
            <li>Select your target (e.g., Cursor)</li>
            <li>Choose output path</li>
            <li>Click "Export"</li>
          </ol>
          <p>The asset is now ready to use in your AI assistant!</p>
        </>
      ),
    },
    installation: {
      windows: (
        <>
          <h2 id="windows-installation">Windows Installation</h2>
          <InstallCommand
            command="winget install AIContextStudio.AIContextStudio"
            label="Windows (winget)"
          />
          <h3>Manual Download</h3>
          <p>
            Download from <Link href="/download">the downloads page</Link>:
          </p>
          <ul>
            <li>
              <strong>NSIS Installer</strong> (.exe) — Full install with Start Menu, uninstaller,
              file associations
            </li>
            <li>
              <strong>Portable</strong> (.exe) — Single file, no installation, run from USB or any
              folder
            </li>
          </ul>

          <h3>Verify Checksum</h3>
          <CodeBlock
            language="powershell"
            code="certutil -hashfile ai-context-studio-1.0.0-x64-setup.exe SHA256"
          />
          <p>Compare output with the checksum on the downloads page.</p>

          <Callout type="tip" title="EV Certificate">
            <p>
              The NSIS installer is signed with an Extended Validation certificate. Windows
              SmartScreen will recognize the publisher immediately.
            </p>
          </Callout>
        </>
      ),
      macos: (
        <>
          <h2 id="macos-installation">macOS Installation</h2>
          <InstallCommand
            command="brew install --cask ai-context-studio"
            label="macOS (Homebrew)"
          />
          <h3>Direct Download</h3>
          <p>
            Download the Universal DMG from <Link href="/download">the downloads page</Link>{' '}
            (supports both Apple Silicon and Intel).
          </p>

          <h3>Installation Steps</h3>
          <ol>
            <li>
              Open the downloaded <code>.dmg</code> file
            </li>
            <li>Drag "AI Context Studio" to the Applications folder</li>
            <li>Eject the DMG</li>
            <li>Launch from Applications or Spotlight</li>
          </ol>

          <Callout type="warning" title="Gatekeeper">
            <p>
              Unsigned builds require right-click → "Open" on first launch. Homebrew cask handles
              this automatically.
            </p>
          </Callout>

          <h3>Verify Checksum</h3>
          <CodeBlock language="bash" code="shasum -a 256 ai-context-studio-1.0.0-universal.dmg" />
          <p>Verify notarization:</p>
          <CodeBlock language="bash" code="spctl -a -v /Applications/AI Context Studio.app" />
        </>
      ),
      linux: (
        <>
          <h2 id="linux-installation">Linux Installation</h2>
          <InstallCommand
            command="chmod +x ai-context-studio-1.0.0-x64.AppImage && ./ai-context-studio-1.0.0-x64.AppImage"
            label="Linux (AppImage)"
          />
          <h3>Package Formats</h3>
          <ul>
            <li>
              <strong>AppImage</strong> — Runs on any distribution with FUSE
            </li>
            <li>
              <strong>.deb</strong> — Debian, Ubuntu, Mint, Pop!_OS
            </li>
            <li>
              <strong>.rpm</strong> — Fedora, RHEL, openSUSE
            </li>
            <li>
              <strong>.tar.gz</strong> — Manual extraction, any distro
            </li>
          </ul>

          <Callout type="note" title="Dependencies">
            <p>
              Requires: glibc 2.31+, GTK 3.24+, WebKit2GTK 2.38+, libayatana-appindicator3 (for tray
              icon).
            </p>
          </Callout>

          <h3>Verify Checksum</h3>
          <CodeBlock language="bash" code="sha256sum ai-context-studio-1.0.0-x64.AppImage" />
          <p>Verify GPG signature:</p>
          <CodeBlock
            language="bash"
            code="gpg --verify ai-context-studio-1.0.0-x64.AppImage.sig ai-context-studio-1.0.0-x64.AppImage"
          />
        </>
      ),
    },
    desktop: {
      workspace: (
        <>
          <h2 id="workspace">Workspace Overview</h2>
          <p>
            The workspace is your main dashboard. It shows recent assets, quick actions, and
            marketplace highlights.
          </p>
        </>
      ),
      'instruction-files': (
        <>
          <h2 id="instruction-files">Instruction Files</h2>
          <p>
            Create AGENTS.md and per-target agent instructions with frontmatter and template syntax.
          </p>

          <h3 id="agents-md">AGENTS.md</h3>
          <p>
            The <code>AGENTS.md</code> file is the universal instruction format. Define once, export
            to all targets.
          </p>
          <CodeBlock language="markdown" filename="AGENTS.md" code={CODE_BLOCKS.agentsMd} />

          <h3 id="per-target">Per-Target Instructions</h3>
          <p>Override or extend instructions for specific targets:</p>
          <CodeBlock
            language="markdown"
            filename="AGENTS.cursor.md"
            code={CODE_BLOCKS.agentsCursorMd}
          />

          <h3 id="template-syntax">Template Syntax</h3>
          <p>
            Use <code>&#123;&#123;variable&#125;&#125;</code> for interpolation. Variables can be
            defined in frontmatter or passed at export time.
          </p>
        </>
      ),
      'prompt-library': (
        <>
          <h2 id="prompt-library">Prompt Library</h2>
          <p>Browse, search, and use curated prompt templates for common tasks.</p>

          <h3>Categories</h3>
          <ul>
            <li>
              <strong>Code Generation</strong> — Components, APIs, tests, migrations
            </li>
            <li>
              <strong>Refactoring</strong> — Modernize, extract, optimize, fix patterns
            </li>
            <li>
              <strong>Documentation</strong> — README, API docs, comments, diagrams
            </li>
            <li>
              <strong>Debugging</strong> — Error analysis, logging, profiling
            </li>
            <li>
              <strong>Architecture</strong> — Design reviews, ADRs, tech decisions
            </li>
          </ul>

          <h3>Using Templates</h3>
          <ol>
            <li>Open Prompt Library from sidebar</li>
            <li>Filter by category or search</li>
            <li>Click a template to preview</li>
            <li>Click "Use Template" to create a new asset</li>
            <li>Fill in variables and customize</li>
          </ol>
        </>
      ),
      'prompt-engine': (
        <>
          <h2 id="prompt-engine">Prompt Engine</h2>
          <p>
            The Prompt Engine is a visual builder for complex prompts with variables, conditionals,
            and composition.
          </p>

          <h3>Features</h3>
          <ul>
            <li>
              <strong>Variables</strong> — Define reusable &#123;&#123;placeholders&#125;&#125;
            </li>
            <li>
              <strong>Conditionals</strong> —{' '}
              <code>&#123;&#123;#if feature&#125;&#125;...&#123;&#123;/if&#125;&#125;</code> blocks
            </li>
            <li>
              <strong>Loops</strong> —{' '}
              <code>&#123;&#123;#each items&#125;&#125;...&#123;&#123;/each&#125;&#125;</code> for
              repetitive sections
            </li>
            <li>
              <strong>Composition</strong> — false
            </li>
            <li>
              <strong>Preview</strong> — Real-time rendered output with sample data
            </li>
          </ul>

          <Callout type="tip" title="Handlebars Syntax">
            <p>
              The Prompt Engine uses Handlebars-compatible syntax. See{' '}
              <a href="https://handlebarsjs.com/">Handlebars docs</a> for advanced features.
            </p>
          </Callout>
        </>
      ),
      personas: (
        <>
          <h2 id="personas">Personas</h2>
          <p>Define reusable AI personalities with expertise, tone, and behavioral guidelines.</p>

          <h3>Creating a Persona</h3>
          <ol>
            <li>Open "Personas" from sidebar → "New Persona"</li>
            <li>Define name, role, expertise areas</li>
            <li>Set tone (formal, casual, encouraging, direct)</li>
            <li>Add behavioral guidelines and constraints</li>
            <li>
              Save and use in prompts with <code>&#123;&#123;persona:name&#125;&#125;</code>
            </li>
          </ol>

          <CodeBlock
            language="json"
            filename="senior-engineer.persona.json"
            code={CODE_BLOCKS.seniorEngineerPersona}
          />
        </>
      ),
      skills: (
        <>
          <h2 id="skills">Skills Development</h2>
          <p>Build composable AI capabilities with inputs, outputs, and validation.</p>

          <h3>Skill Structure</h3>
          <CodeBlock
            language="json"
            filename="code-review.skill.json"
            code={CODE_BLOCKS.codeReviewSkill}
          />

          <h3>Input Types</h3>
          <ul>
            <li>
              <code>string</code> — Text input
            </li>
            <li>
              <code>number</code> — Numeric input
            </li>
            <li>
              <code>boolean</code> — True/false
            </li>
            <li>
              <code>array</code> — List of values
            </li>
            <li>
              <code>object</code> — Structured data
            </li>
            <li>
              <code>file</code> — File reference
            </li>
          </ul>

          <h3>Best Practices</h3>
          <ul>
            <li>Keep skills focused on a single responsibility</li>
            <li>Validate inputs in the prompt template</li>
            <li>Use descriptive parameter names and descriptions</li>
            <li>Test with edge cases before publishing</li>
          </ul>
        </>
      ),
      workflows: (
        <>
          <h2 id="workflows">Workflows</h2>
          <p>Chain prompts, tools, and agents into repeatable multi-step pipelines.</p>

          <h3>Workflow Definition</h3>
          <CodeBlock
            language="yaml"
            filename="ci-review.workflow.yaml"
            code={CODE_BLOCKS.ciReviewWorkflow}
          />

          <h3>Execution</h3>
          <p>
            Workflows run in the desktop app or via CLI:{' '}
            <code>acs workflow run ci-review --repo=my/repo --pr=42</code>
          </p>
        </>
      ),
      memories: (
        <>
          <h2 id="memories">Memories</h2>
          <p>Store persistent context blocks that agents can recall across sessions.</p>

          <h3>Memory Types</h3>
          <ul>
            <li>
              <strong>Project Memories</strong> — Architecture decisions, conventions, team
              preferences
            </li>
            <li>
              <strong>Code Snippets</strong> — Reusable patterns, boilerplate, utility functions
            </li>
            <li>
              <strong>Reference Docs</strong> — API specs, schema definitions, external links
            </li>
          </ul>

          <h3>Usage</h3>
          <p>
            Reference memories in prompts with <code>&#123;&#123;memory:name&#125;&#125;</code> or
            let agents auto-retrieve relevant context.
          </p>
        </>
      ),
      mcp: (
        <>
          <h2 id="mcp-manager">MCP Manager</h2>
          <p>
            Configure Model Context Protocol servers for database, filesystem, and custom tool
            access.
          </p>

          <h3>Built-in Servers</h3>
          <ul>
            <li>
              <strong>Filesystem</strong> — Read/write files in allowed directories
            </li>
            <li>
              <strong>PostgreSQL</strong> — Query and inspect databases
            </li>
            <li>
              <strong>GitHub</strong> — Repository operations, PRs, issues
            </li>
            <li>
              <strong>HTTP</strong> — Generic REST API access
            </li>
          </ul>

          <h3>Adding Custom Servers</h3>
          <ol>
            <li>Click "Add Server" in MCP Manager</li>
            <li>
              Enter command (e.g., <code>npx @modelcontextprotocol/server-github</code>)
            </li>
            <li>Configure environment variables and permissions</li>
            <li>Test connection</li>
          </ol>

          <Callout type="warning" title="Sandboxing">
            <p>
              MCP servers run in isolated subprocesses with restricted filesystem and network
              access. Configure permissions carefully.
            </p>
          </Callout>
        </>
      ),
      validator: (
        <>
          <h2 id="asset-validator">Asset Validator</h2>
          <p>Validate .acs asset packages against the Registry specification before publishing.</p>

          <h3>Validation Checks</h3>
          <ul>
            <li>Manifest schema compliance</li>
            <li>Required fields present</li>
            <li>Semantic version format</li>
            <li>Dependency resolution</li>
            <li>Checksum verification</li>
            <li>Target compatibility</li>
          </ul>

          <h3>CLI Usage</h3>
          <CodeBlock language="bash" code={CODE_BLOCKS.validateCommands} />
        </>
      ),
      optimizer: (
        <>
          <h2 id="prompt-optimizer">Prompt Optimizer</h2>
          <p>Automatically improve prompts through evaluation, iteration, and A/B testing.</p>

          <h3>Optimization Pipeline</h3>
          <ol>
            <li>
              <strong>Analyze</strong> — Identify verbosity, ambiguity, missing context
            </li>
            <li>
              <strong>Rewrite</strong> — Apply best practices (specificity, examples, structure)
            </li>
            <li>
              <strong>Evaluate</strong> — Run against test cases, measure quality
            </li>
            <li>
              <strong>Iterate</strong> — Refine based on scores
            </li>
          </ol>

          <Callout type="tip" title="Evaluation Criteria">
            <ul>
              <li>Clarity & specificity</li>
              <li>Completeness of instructions</li>
              <li>Example quality</li>
              <li>Token efficiency</li>
            </ul>
          </Callout>
        </>
      ),
      settings: (
        <>
          <h2 id="settings">Settings</h2>
          <p>Configure AI Context Studio preferences.</p>

          <h3>Categories</h3>
          <ul>
            <li>
              <strong>General</strong> — Theme, language, startup behavior, telemetry
            </li>
            <li>
              <strong>Editor</strong> — Font size, tab width, line numbers, minimap
            </li>
            <li>
              <strong>Export</strong> — Default targets, output paths, overwrite behavior
            </li>
            <li>
              <strong>Marketplace</strong> — Auto-update, notifications, verified-only
            </li>
            <li>
              <strong>Security</strong> — Keychain backend, encryption, sandbox strictness
            </li>
            <li>
              <strong>Advanced</strong> — Log level, experimental features, data directory
            </li>
          </ul>
        </>
      ),
    },
    marketplace: {
      browsing: (
        <>
          <h2 id="browsing-assets">Browsing Marketplace Assets</h2>
          <p>Discover community assets with powerful search and filtering.</p>

          <h3>Categories</h3>
          <ul>
            <li>
              <strong>Skills</strong> — Composable AI capabilities with I/O schemas
            </li>
            <li>
              <strong>Personas</strong> — Reusable AI personalities
            </li>
            <li>
              <strong>Templates</strong> — Project starters, component scaffolds
            </li>
            <li>
              <strong>Prompt Packs</strong> — Curated prompt collections
            </li>
            <li>
              <strong>Instruction Files</strong> — AGENTS.md, per-target configs
            </li>
            <li>
              <strong>Workflows</strong> — Multi-step automation pipelines
            </li>
            <li>
              <strong>MCP Servers</strong> — Database, API, and tool integrations
            </li>
            <li>
              <strong>Collections</strong> — Curated asset groups
            </li>
            <li>
              <strong>Bundles</strong> — Related assets sold/installed together
            </li>
          </ul>

          <h3>Filters</h3>
          <p>
            Filter by: Category, Type, Verified publishers, Target compatibility, Sort by (Trending,
            Recent, Rating, Downloads).
          </p>
        </>
      ),
      installing: (
        <>
          <h2 id="installing-assets">Installing Assets</h2>
          <p>One-click install from marketplace or CLI.</p>

          <h3>Desktop App</h3>
          <ol>
            <li>Open Marketplace tab</li>
            <li>Find an asset</li>
            <li>Click "Install"</li>
            <li>Asset downloads and validates automatically</li>
          </ol>

          <h3>CLI</h3>
          <InstallCommand command="acs install code-review-assistant" label="All Platforms" />

          <h3>Version Selection</h3>
          <p>
            Install specific versions: <code>acs install asset@1.2.0</code>
          </p>
        </>
      ),
      publishing: (
        <>
          <h2 id="publishing-assets">Publishing Assets</h2>
          <p>Share your assets with the community.</p>

          <h3>Prerequisites</h3>
          <ul>
            <li>GitHub account (for authentication)</li>
            <li>
              Asset passes validation (<code>acs validate</code>)
            </li>
            <li>README.md with usage examples</li>
            <li>At least one screenshot</li>
          </ul>

          <h3>Publishing Steps</h3>
          <ol>
            <li>
              Run <code>acs publish</code> in asset directory
            </li>
            <li>Authenticate with GitHub</li>
            <li>Fill in marketplace metadata (category, tags, description)</li>
            <li>Upload screenshots</li>
            <li>Submit for review</li>
          </ol>

          <Callout type="note" title="Review Process">
            <p>
              First-time publishers go through manual review (24-48 hours). Verified publishers get
              auto-approval.
            </p>
          </Callout>
        </>
      ),
      'asset-types': (
        <>
          <h2 id="asset-types">Asset Types</h2>
          <p>Understanding the different kinds of assets in the marketplace.</p>

          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Use Case</th>
                <th>Schema</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Skill</td>
                <td>Composable capability with typed I/O</td>
                <td>skill.schema.json</td>
              </tr>
              <tr>
                <td>Persona</td>
                <td>AI personality with expertise/tone</td>
                <td>persona.schema.json</td>
              </tr>
              <tr>
                <td>Template</td>
                <td>Project/component scaffolding</td>
                <td>template.schema.json</td>
              </tr>
              <tr>
                <td>Prompt Pack</td>
                <td>Curated prompt collection</td>
                <td>promptPack.schema.json</td>
              </tr>
              <tr>
                <td>Instruction File</td>
                <td>AGENTS.md, per-target configs</td>
                <td>instructionFile.schema.json</td>
              </tr>
              <tr>
                <td>Workflow</td>
                <td>Multi-step automation</td>
                <td>workflow.schema.json</td>
              </tr>
              <tr>
                <td>MCP Server</td>
                <td>External tool integration</td>
                <td>mcpServer.schema.json</td>
              </tr>
              <tr>
                <td>Collection</td>
                <td>Curated asset group</td>
                <td>collection.schema.json</td>
              </tr>
              <tr>
                <td>Bundle</td>
                <td>Related assets sold together</td>
                <td>bundle.schema.json</td>
              </tr>
            </tbody>
          </table>
        </>
      ),
      versioning: (
        <>
          <h2 id="versioning">Versioning Strategy</h2>
          <p>All assets follow Semantic Versioning (MAJOR.MINOR.PATCH).</p>

          <ul>
            <li>
              <strong>MAJOR</strong> — Breaking changes to inputs/outputs, removed features
            </li>
            <li>
              <strong>MINOR</strong> — New features, backward compatible
            </li>
            <li>
              <strong>PATCH</strong> — Bug fixes, documentation, internal improvements
            </li>
          </ul>

          <h3>Dependency Ranges</h3>
          <p>Use standard semver ranges in dependencies:</p>
          <CodeBlock language="json" code={CODE_BLOCKS.dependencyRanges} />
        </>
      ),
      compatibility: (
        <>
          <h2 id="compatibility">Target Compatibility</h2>
          <p>Assets declare which AI assistants they support.</p>

          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Cursor</th>
                <th>Claude Code</th>
                <th>Windsurf</th>
                <th>VS Code</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>System Prompts</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>Instruction Files</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>Prompt Library</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>Personas</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>Skills</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
                <td>❌</td>
              </tr>
              <tr>
                <td>Workflows</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
                <td>❌</td>
              </tr>
              <tr>
                <td>Memories</td>
                <td>✅</td>
                <td>❌</td>
                <td>❌</td>
                <td>❌</td>
              </tr>
              <tr>
                <td>MCP Configs</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
            </tbody>
          </table>
        </>
      ),
    },
    registry: {
      schema: (
        <>
          <h2 id="asset-schema">Asset Schema (manifest.json)</h2>
          <p>The manifest.json is the heart of every .acs asset package.</p>

          <CodeBlock
            language="json"
            filename="manifest.json"
            showLineNumbers
            code={CODE_BLOCKS.manifestJson}
          />
        </>
      ),
      manifest: (
        <>
          <h2 id="manifest-format">Manifest Format</h2>
          <p>Complete field reference for manifest.json.</p>

          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Required</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>id</td>
                <td>string (slug)</td>
                <td>✅</td>
                <td>Unique identifier (kebab-case)</td>
              </tr>
              <tr>
                <td>name</td>
                <td>string</td>
                <td>✅</td>
                <td>Human-readable name</td>
              </tr>
              <tr>
                <td>version</td>
                <td>semver</td>
                <td>✅</td>
                <td>Semantic version</td>
              </tr>
              <tr>
                <td>author</td>
                <td>string</td>
                <td>✅</td>
                <td>Author name or org</td>
              </tr>
              <tr>
                <td>type</td>
                <td>enum</td>
                <td>✅</td>
                <td>Asset kind (skill, persona, etc.)</td>
              </tr>
              <tr>
                <td>description</td>
                <td>string</td>
                <td>✅</td>
                <td>Markdown description</td>
              </tr>
              <tr>
                <td>tags</td>
                <td>string[]</td>
                <td>❌</td>
                <td>Searchable tags</td>
              </tr>
              <tr>
                <td>minAppVersion</td>
                <td>semver</td>
                <td>✅</td>
                <td>Minimum app version</td>
              </tr>
              <tr>
                <td>checksum</td>
                <td>sha256:hex</td>
                <td>✅</td>
                <td>Package integrity hash</td>
              </tr>
              <tr>
                <td>license</td>
                <td>SPDX</td>
                <td>✅</td>
                <td>SPDX license identifier</td>
              </tr>
              <tr>
                <td>dependencies</td>
                <td>object</td>
                <td>❌</td>
                <td>Dep map with semver ranges</td>
              </tr>
              <tr>
                <td>targets</td>
                <td>string[]</td>
                <td>✅</td>
                <td>Compatible export targets</td>
              </tr>
              <tr>
                <td>screenshots</td>
                <td>string[]</td>
                <td>❌</td>
                <td>Preview image paths</td>
              </tr>
              <tr>
                <td>readme</td>
                <td>string</td>
                <td>❌</td>
                <td>Path to markdown docs</td>
              </tr>
            </tbody>
          </table>
        </>
      ),
      metadata: (
        <>
          <h2 id="metadata-fields">Metadata Fields</h2>
          <p>Additional fields for marketplace presentation and discovery.</p>

          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>featured</td>
                <td>boolean</td>
                <td>Show in marketplace featured section</td>
              </tr>
              <tr>
                <td>verified</td>
                <td>boolean</td>
                <td>Publisher verified by marketplace team</td>
              </tr>
              <tr>
                <td>deprecated</td>
                <td>boolean</td>
                <td>Mark as deprecated with migration path</td>
              </tr>
              <tr>
                <td>private</td>
                <td>boolean</td>
                <td>Hidden from public marketplace</td>
              </tr>
              <tr>
                <td>monetization</td>
                <td>object</td>
                <td>Pricing config for paid assets</td>
              </tr>
              <tr>
                <td>analytics</td>
                <td>object</td>
                <td>Opt-in usage analytics config</td>
              </tr>
            </tbody>
          </table>
        </>
      ),
      dependencies: (
        <>
          <h2 id="dependencies">Dependency Management</h2>
          <p>Assets can depend on other assets with semantic version ranges.</p>

          <h3>Dependency Resolution</h3>
          <ol>
            <li>Parse all dependency ranges</li>
            <li>Build dependency graph</li>
            <li>Detect cycles (error if found)</li>
            <li>Select highest compatible versions</li>
            <li>Download and validate all dependencies</li>
            <li>Install in topological order</li>
          </ol>

          <Callout type="warning" title="Version Conflicts">
            <p>
              If two assets require incompatible versions of the same dependency, installation fails
              with a clear error message suggesting resolution.
            </p>
          </Callout>

          <h3>Transitive Dependencies</h3>
          <p>
            Dependencies of dependencies are automatically resolved and installed. The lockfile (
            <code>asset-lock.json</code>) pins exact versions for reproducible installs.
          </p>
        </>
      ),
      validation: (
        <>
          <h2 id="validation">Asset Validation</h2>
          <p>Validate assets locally before publishing.</p>

          <h3>CLI Validation</h3>
          <InstallCommand command="acs validate ./my-asset.acs" label="All Platforms" />

          <h3>Validation Checks</h3>
          <ul>
            <li>Manifest schema compliance (JSON Schema Draft 7)</li>
            <li>Required fields present and correctly typed</li>
            <li>Semantic version format</li>
            <li>Checksum matches package contents</li>
            <li>Dependencies resolvable and compatible</li>
            <li>Target compatibility declared</li>
            <li>License is valid SPDX identifier</li>
            <li>Readme exists and is valid markdown</li>
            <li>Screenshots are valid images</li>
          </ul>

          <h3>Strict Mode</h3>
          <InstallCommand command="acs validate ./my-asset.acs --strict" label="All Platforms" />
        </>
      ),
    },
    mcp: {
      '': (
        <>
          <h2 id="mcp-introduction">Model Context Protocol (MCP)</h2>
          <p>
            MCP is an open standard for connecting AI assistants to external data sources and tools.
          </p>

          <h3>How It Works</h3>
          <ol>
            <li>
              AI Context Studio acts as an MCP <strong>client</strong>
            </li>
            <li>
              MCP <strong>servers</strong> expose resources (files, database rows, API endpoints)
            </li>
            <li>
              Servers declare <strong>tools</strong> (functions the AI can call)
            </li>
            <li>AI calls tools through the MCP protocol</li>
          </ol>

          <h3>Supported Servers</h3>
          <ul>
            <li>
              <strong>Filesystem</strong> — Read/write local files
            </li>
            <li>
              <strong>PostgreSQL/MySQL</strong> — Query databases safely
            </li>
            <li>
              <strong>GitHub</strong> — Repos, PRs, issues, actions
            </li>
            <li>
              <strong>HTTP</strong> — Generic REST API access
            </li>
            <li>
              <strong>Custom</strong> — Write your own in any language
            </li>
          </ul>
        </>
      ),
      'server-config': (
        <>
          <h2 id="mcp-server-configuration">MCP Server Configuration</h2>
          <p>Configure servers in AI Context Studio's MCP Manager.</p>

          <h3>Adding a Server</h3>
          <ol>
            <li>Open MCP Manager → "Add Server"</li>
            <li>Enter name, command, and arguments</li>
            <li>Set environment variables</li>
            <li>Configure permissions (filesystem paths, network hosts)</li>
            <li>Test connection</li>
          </ol>

          <h3>Example: PostgreSQL</h3>
          <CodeBlock language="json" code={CODE_BLOCKS.postgresMcpConfig} />

          <h3>Permissions</h3>
          <p>Each server declares required permissions. AI Context Studio enforces sandboxing:</p>
          <ul>
            <li>
              <strong>Filesystem</strong> — Read/write specific directories
            </li>
            <li>
              <strong>Network</strong> — Allowlisted hosts/ports
            </li>
            <li>
              <strong>Process</strong> — Subprocess execution (rare)
            </li>
          </ul>
        </>
      ),
      'client-setup': (
        <>
          <h2 id="mcp-client-setup">Client Setup</h2>
          <p>Use MCP servers from your AI assistant.</p>

          <h3>Cursor</h3>
          <p>
            MCP servers configured in AI Context Studio are automatically available in Cursor when
            you export MCP config.
          </p>
          <CodeBlock language="bash" code="acs mcp export --target=cursor > ~/.cursor/mcp.json" />

          <h3>Claude Code</h3>
          <CodeBlock
            language="bash"
            code="acs mcp export --target=claude > ~/.config/claude-code/mcp.json"
          />

          <h3>Custom Clients</h3>
          <p>Export generic MCP config for any compatible client:</p>
          <CodeBlock language="bash" code="acs mcp export --format=json" />
        </>
      ),
      'built-in': (
        <>
          <h2 id="built-in-mcp-servers">Built-in MCP Servers</h2>
          <p>Pre-configured servers included with AI Context Studio.</p>

          <table>
            <thead>
              <tr>
                <th>Server</th>
                <th>Package</th>
                <th>Capabilities</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Filesystem</td>
                <td>@modelcontextprotocol/server-filesystem</td>
                <td>Read/write/list files in allowed dirs</td>
              </tr>
              <tr>
                <td>PostgreSQL</td>
                <td>@modelcontextprotocol/server-postgres</td>
                <td>Query, schema, explain plans</td>
              </tr>
              <tr>
                <td>GitHub</td>
                <td>@modelcontextprotocol/server-github</td>
                <td>Repos, PRs, issues, actions</td>
              </tr>
              <tr>
                <td>SQLite</td>
                <td>@modelcontextprotocol/server-sqlite</td>
                <td>Local database queries</td>
              </tr>
              <tr>
                <td>HTTP</td>
                <td>@modelcontextprotocol/server-http</td>
                <td>Generic REST API access</td>
              </tr>
              <tr>
                <td>Git</td>
                <td>@modelcontextprotocol/server-git</td>
                <td>Git operations, history, diffs</td>
              </tr>
            </tbody>
          </table>
        </>
      ),
      custom: (
        <>
          <h2 id="custom-mcp-servers">Custom MCP Servers</h2>
          <p>Build your own MCP servers in any language.</p>

          <h3>Python Example</h3>
          <CodeBlock language="python" code={CODE_BLOCKS.pythonMcpServer} />

          <h3>Registration</h3>
          <ol>
            <li>Build your server as an executable</li>
            <li>
              Add to AI Context Studio: <code>"command": "./my-server"</code>
            </li>
            <li>Declare tools in manifest for autocomplete</li>
          </ol>
        </>
      ),
      troubleshooting: (
        <>
          <h2 id="mcp-troubleshooting">MCP Troubleshooting</h2>
          <p>Common issues and solutions.</p>

          <h3>Connection Refused</h3>
          <ul>
            <li>Check server command and arguments</li>
            <li>Verify environment variables</li>
            <li>Check server logs in AI Context Studio → MCP Manager → Logs</li>
          </ul>

          <h3>Permission Denied</h3>
          <ul>
            <li>Add required filesystem paths to server permissions</li>
            <li>Add network hosts to allowlist</li>
            <li>Restart AI Context Studio after changes</li>
          </ul>

          <h3>Tool Not Found</h3>
          <ul>
            <li>Ensure server declares tools in manifest</li>
            <li>Restart MCP connection after server updates</li>
            <li>Check tool name spelling in prompts</li>
          </ul>
        </>
      ),
    },
    skills: {
      development: (
        <>
          <h2 id="skills-development">Skills Development Guide</h2>
          <p>Build powerful, composable AI capabilities.</p>

          <h3>Skill Anatomy</h3>
          <CodeBlock language="json" code={CODE_BLOCKS.skillTemplate} />

          <h3>Input Types</h3>
          <ul>
            <li>
              <code>string</code> — Text input
            </li>
            <li>
              <code>number</code> — Numeric input
            </li>
            <li>
              <code>boolean</code> — True/false
            </li>
            <li>
              <code>array</code> — List of values
            </li>
            <li>
              <code>object</code> — Structured data
            </li>
            <li>
              <code>file</code> — File reference
            </li>
          </ul>

          <h3>Best Practices</h3>
          <ul>
            <li>Keep skills focused on a single responsibility</li>
            <li>Validate inputs in the prompt template</li>
            <li>Use descriptive parameter names and descriptions</li>
            <li>Test with edge cases before publishing</li>
          </ul>
        </>
      ),
      'prompt-files': (
        <>
          <h2 id="prompt-files">Prompt Files</h2>
          <p>Reusable prompt templates with variables, conditionals, and composition.</p>

          <h3>File Format</h3>
          <p>
            Prompt files use <code>.prompt.md</code> extension with frontmatter:
          </p>
          <CodeBlock
            language="markdown"
            filename="code-review.prompt.md"
            code={CODE_BLOCKS.promptFileTemplate}
          />

          <h3>Advanced Features</h3>
          <ul>
            <li>
              <strong>Conditionals</strong> —{' '}
              <code>&#123;&#123;#if var&#125;&#125;...&#123;&#123;/if&#125;&#125;</code>
            </li>
            <li>
              <strong>Loops</strong> —{' '}
              <code>&#123;&#123;#each items&#125;&#125;...&#123;&#123;/each&#125;&#125;</code>
            </li>
            false
            <li>
              <strong>Helpers</strong> — <code>&#123;&#123;uppercase name&#125;&#125;</code>,{' '}
              <code>&#123;&#123;json data&#125;&#125;</code>
            </li>
          </ul>
        </>
      ),
    },
    'api-keys': {
      '': (
        <>
          <h2 id="api-keys-management">API Keys Management</h2>
          <p>Securely store and manage provider API keys.</p>

          <h3>Supported Providers</h3>
          <ul>
            <li>OpenAI (GPT-4, GPT-3.5)</li>
            <li>Anthropic (Claude 3 Opus/Sonnet/Haiku)</li>
            <li>Google (Gemini Pro/Flash)</li>
            <li>Cohere, Mistral, Together AI, and more</li>
          </ul>

          <h3>Storage</h3>
          <p>Keys are encrypted and stored in your OS keychain:</p>
          <ul>
            <li>
              <strong>Windows:</strong> Credential Manager
            </li>
            <li>
              <strong>macOS:</strong> Keychain Access
            </li>
            <li>
              <strong>Linux:</strong> Secret Service (libsecret)
            </li>
          </ul>

          <Callout type="note" title="No Plaintext">
            <p>
              API keys are never written to disk in plaintext. The desktop app uses platform-native
              secure storage exclusively.
            </p>
          </Callout>

          <h3>Usage</h3>
          <p>
            Keys are automatically injected when exporting to targets that require them. You never
            copy/paste keys manually.
          </p>
        </>
      ),
      security: (
        <>
          <h2 id="security-best-practices">Security Best Practices</h2>
          <p>Keep your AI Context Studio setup secure.</p>

          <h3>Local-First Principles</h3>
          <ul>
            <li>All data stays on your machine by default</li>
            <li>No telemetry or usage tracking without explicit opt-in</li>
            <li>No account required for core functionality</li>
            <li>Easy data export and deletion</li>
          </ul>

          <h3>Credential Security</h3>
          <ul>
            <li>Use OS keychain for all API keys</li>
            <li>Rotate keys periodically</li>
            <li>Use scoped/limited keys where possible</li>
            <li>Never commit keys to version control</li>
          </ul>

          <h3>MCP Safety</h3>
          <ul>
            <li>Review server permissions before enabling</li>
            <li>Use read-only filesystem access when possible</li>
            <li>Restrict network access to required hosts only</li>
            <li>Monitor server logs for unexpected activity</li>
          </ul>

          <h3>Asset Verification</h3>
          <ul>
            <li>Verify checksums before installing assets</li>
            <li>Prefer verified publishers</li>
            <li>Review asset source code for custom skills/workflows</li>
            <li>
              Run <code>acs validate</code> on downloaded assets
            </li>
          </ul>
        </>
      ),
    },
    'developer-guide': {
      '': (
        <>
          <h2 id="developer-guide">Developer Guide</h2>
          <p>Extend AI Context Studio with plugins, custom exporters, and integrations.</p>

          <h3>Architecture Overview</h3>
          <p>AI Context Studio consists of:</p>
          <ul>
            <li>
              <strong>Core (Rust/Tauri)</strong> — App shell, filesystem, keychain, IPC
            </li>
            <li>
              <strong>UI (Next.js/React)</strong> — Workspace, editors, marketplace browser
            </li>
            <li>
              <strong>Engine (TypeScript)</strong> — Prompt rendering, export pipeline, validation
            </li>
            <li>
              <strong>Registry (Rust)</strong> — Schema validation, dependency resolution, packaging
            </li>
          </ul>

          <h3>Plugin System</h3>
          <p>Create plugins to add custom exporters, validators, or UI extensions.</p>

          <CodeBlock
            language="typescript"
            filename="my-exporter.plugin.ts"
            code={CODE_BLOCKS.exporterPlugin}
          />
        </>
      ),
      architecture: (
        <>
          <h2 id="architecture">System Architecture</h2>
          <p>High-level architecture of AI Context Studio.</p>

          <h3>Data Flow</h3>
          <CodeBlock language="mermaid" code={CODE_BLOCKS.architectureMermaid} />

          <h3>Components</h3>
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Technology</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>App Shell</td>
                <td>Tauri 2 + Rust</td>
                <td>Native window, menu, tray, auto-update</td>
              </tr>
              <tr>
                <td>UI</td>
                <td>Next.js 15 + React 19</td>
                <td>Workspace, editors, marketplace</td>
              </tr>
              <tr>
                <td>Prompt Engine</td>
                <td>TypeScript + Handlebars</td>
                <td>Template rendering, variables, conditionals</td>
              </tr>
              <tr>
                <td>Export Pipeline</td>
                <td>TypeScript</td>
                <td>Asset → target format transformation</td>
              </tr>
              <tr>
                <td>Registry</td>
                <td>Rust</td>
                <td>Schema validation, dependency resolution</td>
              </tr>
              <tr>
                <td>MCP Client</td>
                <td>TypeScript + Rust</td>
                <td>Protocol implementation, sandboxing</td>
              </tr>
            </tbody>
          </table>

          <h3>Security Model</h3>
          <ul>
            <li>Rust core handles all privileged operations (keychain, filesystem, network)</li>
            <li>UI runs in sandboxed WebView with restricted IPC</li>
            <li>MCP servers run in isolated subprocesses with capability-based permissions</li>
            <li>All external communication uses TLS 1.3</li>
          </ul>
        </>
      ),
      'plugin-sdk': (
        <>
          <h2 id="plugin-sdk">Plugin SDK Reference</h2>
          <p>Build extensions for AI Context Studio.</p>

          <h3>Plugin Types</h3>
          <ul>
            <li>
              <strong>Exporter</strong> — Custom output formats
            </li>
            <li>
              <strong>Validator</strong> — Additional asset validation rules
            </li>
            <li>
              <strong>Importer</strong> — Import from external formats
            </li>
            <li>
              <strong>UI Extension</strong> — Custom panels, editors, menu items
            </li>
            <li>
              <strong>MCP Server</strong> — Custom tool integrations
            </li>
          </ul>

          <h3>Plugin Manifest</h3>
          <CodeBlock language="json" code={CODE_BLOCKS.pluginManifest} />

          <h3>Development Workflow</h3>
          <ol>
            <li>
              <code>acs plugin create my-plugin</code> — Scaffold
            </li>
            <li>Implement plugin interface</li>
            <li>
              <code>acs plugin test</code> — Run test suite
            </li>
            <li>
              <code>acs plugin pack</code> — Create .acp package
            </li>
            <li>Publish to marketplace or install locally</li>
          </ol>
        </>
      ),
    },
  };

  const categoryContent = contentMap[category];
  if (categoryContent && categoryContent[page]) {
    return categoryContent[page];
  }

  return (
    <div>
      <h2>Content Coming Soon</h2>
      <p className="text-[var(--color-text-muted)]">
        Documentation for <strong>{page.replace(/-/g, ' ')}</strong> in <strong>{category}</strong>{' '}
        is being written.
      </p>
    </div>
  );
}
