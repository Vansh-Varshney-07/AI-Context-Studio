import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">AI Context Studio</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/#features" className="text-sm text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/#download" className="text-sm text-gray-300 hover:text-white transition-colors">
                Download
              </Link>
              <Link href="/docs" className="text-sm text-gray-300 hover:text-white transition-colors">
                Docs
              </Link>
              <a
                href="https://github.com/ai-context-studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                GitHub
              </a>
            </nav>
            <Link
              href="/#download"
              className="hidden md:inline-flex items-center justify-center rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
            >
              Download Free
            </Link>
          </div>
        </div>
      </header>

      <section className="relative flex-1 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-7xl">
              Build, customize, and export{" "}
              <span className="text-violet-400">AI instruction assets</span>
              <br />
              for any coding assistant
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-lg text-gray-300">
              Local-first, offline-first prompt engineering studio. Create system prompts, instruction files,
              memories, MCP configurations, and workflows — then export to Cursor, Claude Code, Windsurf,
              VS Code, and more.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/#download"
                className="w-full rounded-md bg-violet-600 px-8 py-4 text-lg font-medium text-white hover:bg-violet-700 transition-colors sm:w-auto"
              >
                Download for Desktop
              </Link>
              <Link
                href="/docs"
                className="w-full rounded-md border border-white/20 bg-white/5 px-8 py-4 text-lg font-medium text-white hover:bg-white/10 transition-colors sm:w-auto"
              >
                Read Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-white/10 bg-white/5 py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">Everything you need</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-300">
              A complete toolkit for prompt engineering across all major AI coding assistants.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "FileText",
                title: "System Prompts",
                desc: "Craft and version system prompts with variables, conditionals, and blueprints.",
              },
              {
                icon: "FileCode",
                title: "Instruction Files",
                desc: "Write reusable .md instruction files with frontmatter and template syntax.",
              },
              {
                icon: "Database",
                title: "Memories & Context",
                desc: "Store persistent memories, code snippets, and reference docs for agents.",
              },
              {
                icon: "Plug",
                title: "MCP Servers",
                desc: "Configure and generate Model Context Protocol server configs for any client.",
              },
              {
                icon: "GitBranch",
                title: "Workflows",
                desc: "Chain prompts, tools, and agents into repeatable multi-step workflows.",
              },
              {
                icon: "Package",
                title: "Export Anywhere",
                desc: "One-click export to Cursor, Claude Code, Windsurf, VS Code, and custom formats.",
              },
            ].map((feature, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-6 hover:border-violet-500/50 transition-colors">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-600/20">
                  <svg className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="download" className="py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">Download for your platform</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-300">
              Native desktop app with Tauri — fast, secure, and lightweight.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { os: "Windows", icon: "Monitor", badge: "NSIS Installer", href: "#" },
              { os: "macOS", icon: "Monitor", badge: "Universal .dmg", href: "#" },
              { os: "Linux", icon: "Monitor", badge: "AppImage / .deb", href: "#" },
            ].map((platform, i) => (
              <div key={i} className="relative rounded-2xl border border-white/10 bg-white/5 p-8 text-center hover:border-violet-500/50 transition-colors">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-violet-600/20 mx-auto">
                  <svg className="h-8 w-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mb-1 text-2xl font-bold text-white">{platform.os}</h3>
                <span className="mb-4 inline-block rounded-full bg-violet-600/20 px-3 py-1 text-sm text-violet-400">
                  {platform.badge}
                </span>
                <a
                  href={platform.href}
                  className="inline-flex items-center justify-center rounded-md bg-violet-600 px-6 py-3 text-base font-medium text-white hover:bg-violet-700 transition-colors"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/5 py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">Open source & community driven</h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300">
            Built in the open. Contribute, audit, and extend. MIT licensed.
          </p>
          <a
            href="https://github.com/ai-context-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-8 py-4 text-lg font-medium text-white hover:bg-white/10 transition-colors"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            View on GitHub
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-white/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">AI Context Studio</span>
            </div>
            <p className="text-sm text-gray-400">
              © 2026 AI Context Studio. MIT Licensed.
            </p>
            <div className="flex items-center gap-6">
              <a href="https://github.com/ai-context-studio" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                GitHub
              </a>
              <a href="/docs" className="text-gray-400 hover:text-white transition-colors">
                Documentation
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Community
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}