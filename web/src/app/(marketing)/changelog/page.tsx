import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Changelog",
  description: "Track all releases, new features, improvements, and bug fixes for AI Context Studio.",
});

const changelog = [
  {
    version: "v1.0.0",
    date: "2025-01-15",
    type: "major" as const,
    title: "Initial Release",
    changes: [
      { type: "added", description: "System Prompt Engine with 6 blueprints (system-prompt, instruction-file, prompt-template, context-file, memory, workflow)" },
      { type: "added", description: "Instruction Files module with 9 targets (Cursor, GitHub Copilot, Windsurf, Cline, Roo Code, VS Code, Zed, Continue, Generic)" },
      { type: "added", description: "10 built-in personas (Code Reviewer, Architect, DevOps, Security, Mentor, Technical Writer, QA, Data Scientist, Product Manager, Debugger)" },
      { type: "added", description: "7 workflows (Code Review, Feature Development, Bug Investigation, Refactoring, Documentation, Release, Security Audit)" },
      { type: "added", description: "MCP Config Generator for 11 clients (Claude Desktop, Cursor, OpenCode, Continue, Cline, Roo Code, Windsurf, Codex CLI, Gemini CLI, VS Code, Zed)" },
      { type: "added", description: "12 atomic AI skills across programming, writing, analysis, devops categories" },
      { type: "added", description: "5 optimization engines (Token Optimizer, Context Compressor, Prompt Refiner, Structured Output, Chain-of-Thought)" },
      { type: "added", description: "Asset Validator with quality scoring, compatibility matrix, token efficiency" },
      { type: "added", description: "Memories Manager with 5 block types (Context, Knowledge, Decision, Standard, Reference)" },
      { type: "added", description: "Marketplace with 9 asset kinds, search, filters, and GitHub API integration" },
      { type: "added", description: "Generate page with AI enhancement (OpenAI, Anthropic, Google, Groq, custom)" },
      { type: "added", description: "Tools hub with 8 individual tool pages" },
      { type: "added", description: "Admin panel API routes (users, assets, blog, announcements, feature flags, analytics)" },
      { type: "added", description: "Better Auth authentication (email/password, email verification, password reset)" },
      { type: "added", description: "PostgreSQL database with Prisma ORM (Neon serverless)" },
      { type: "added", description: "SEO: sitemap.xml, robots.txt, metadata, JSON-LD structured data" },
    ],
  },
  {
    version: "v1.1.0",
    date: "2025-02-01",
    type: "minor" as const,
    title: "AI Enhancement & Marketplace Improvements",
    changes: [
      { type: "added", description: "AI-powered generation with provider selection (OpenAI, Anthropic, Google, Groq, custom endpoint)" },
      { type: "added", description: "Session-only API key storage (never persisted to database)" },
      { type: "added", description: "Marketplace GitHub API integration with 60 req/hr limit (no token required)" },
      { type: "added", description: "Asset detail pages with tabs (Overview, Content, Files, Versions, Dependencies)" },
      { type: "added", description: "SystemPromptTemplate admin management with 10 default templates" },
      { type: "improved", description: "Generate page UX: live preview, copy/download, blueprint switching" },
      { type: "fixed", description: "Build errors in tool client components (skills, mcp-config, memories, personas, validate)" },
      { type: "fixed", description: "TypeScript strict mode compliance across all components" },
    ],
  },
  {
    version: "v1.2.0",
    date: "2025-03-15",
    type: "minor" as const,
    title: "Admin Panel & User Dashboard",
    changes: [
      { type: "added", description: "Full admin panel at /admin with sidebar navigation" },
      { type: "added", description: "User management (roles, status, impersonation, audit logs)" },
      { type: "added", description: "Asset management (CRUD, moderation, featured flags, bulk actions)" },
      { type: "added", description: "Blog/announcements editor with markdown support" },
      { type: "added", description: "Feature flags with percentage rollout and targeting" },
      { type: "added", description: "Analytics dashboard (traffic, generations, conversions, retention)" },
      { type: "added", description: "User dashboard: generation history, saved drafts, API key management" },
      { type: "added", description: "GeneratedFile Prisma model for persistent asset storage" },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 container-app py-16 px-4">
        <header className="mb-12 max-w-3xl">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">Changelog</h1>
          <p className="text-[var(--color-text-secondary)] text-lg">
            All notable changes to AI Context Studio. Follows <a href="https://keepachangelog.com/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">Keep a Changelog</a> and <a href="https://semver.org/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">Semantic Versioning</a>.
          </p>
        </header>

        <div className="max-w-3xl space-y-8">
          {changelog.map((release) => (
            <section key={release.version} className="space-y-4">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl font-bold text-[var(--color-text-primary)]">{release.version}</span>
                <span className="text-[var(--color-text-muted)]">{release.date}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  release.type === "major" ? "bg-purple-500/20 text-purple-400" :
                  release.type === "minor" ? "bg-blue-500/20 text-blue-400" :
                  "bg-green-500/20 text-green-400"
                }`}>
                  {release.type}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">{release.title}</h2>
              <ul className="space-y-2">
                {release.changes.map((change, i) => (
                  <li key={i} className="flex gap-3 text-[var(--color-text-secondary)]">
                    <span className={`shrink-0 text-xs font-medium px-1.5 py-0.5 rounded ${
                      change.type === "added" ? "bg-green-500/20 text-green-400" :
                      change.type === "improved" ? "bg-blue-500/20 text-blue-400" :
                      change.type === "fixed" ? "bg-red-500/20 text-red-400" :
                      change.type === "removed" ? "bg-gray-500/20 text-gray-400" :
                      "bg-gray-500/20 text-gray-400"
                    }`}>
                      {change.type.toUpperCase()}
                    </span>
                    <span>{change.description}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-16 max-w-3xl">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Upcoming</h2>
          <ul className="space-y-2 text-[var(--color-text-secondary)]">
            <li className="flex gap-3">
              <span className="shrink-0 text-xs font-medium px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">PLANNED</span>
              <span>v1.3.0: Community features (comments, ratings, collections)</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 text-xs font-medium px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">PLANNED</span>
              <span>v1.4.0: Team workspaces & sharing</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 text-xs font-medium px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">PLANNED</span>
              <span>v2.0.0: Cloud sync & collaboration</span>
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </main>
  );
}