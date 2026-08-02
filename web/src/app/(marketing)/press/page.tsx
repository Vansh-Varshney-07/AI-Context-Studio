import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Press Kit",
  description: "Official press resources for AI Context Studio. Logos, screenshots, brand guidelines, and company information.",
});

const pressAssets = [
  { name: "Logo (Dark)", description: "Primary logo for dark backgrounds", format: "SVG", size: "12 KB" },
  { name: "Logo (Light)", description: "Primary logo for light backgrounds", format: "SVG", size: "12 KB" },
  { name: "Logo Mark Only", description: "Icon mark without wordmark", format: "SVG", size: "8 KB" },
  { name: "Hero Screenshot", description: "Main dashboard view", format: "PNG", size: "1.2 MB" },
  { name: "Generate Page", description: "AI generation interface", format: "PNG", size: "1.4 MB" },
  { name: "Marketplace View", description: "Asset marketplace browse", format: "PNG", size: "1.1 MB" },
];

const companyInfo = {
  name: "AI Context Studio",
  tagline: "Local-first AI prompt engineering studio",
  founded: "2024",
  headquarters: "Remote (Global)",
  website: "https://aicontext.studio",
  github: "https://github.com/Vansh-Varshney-07/AI-Context-Studio",
  description: `AI Context Studio is a premium web application for AI instruction engineering. Users create, customize, manage, and export AI assets (system prompts, instruction files, personas, workflows, MCP configs, skills, and more) for multiple AI coding assistants including Cursor, GitHub Copilot, Windsurf, Cline, Roo Code, VS Code, Zed, Continue, and generic Markdown.`,
  mission: "Empower developers to harness AI effectively through well-crafted, reusable, and portable instruction assets.",
  keyStats: [
    { label: "Asset Kinds", value: "9" },
    { label: "Built-in Personas", value: "10" },
    { label: "MCP Clients Supported", value: "11" },
    { label: "AI Providers Integrated", value: "5" },
    { label: "Optimization Engines", value: "5" },
  ],
};

export default function PressPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 container-app py-16 px-4">
        <header className="mb-16 max-w-3xl">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">Press Kit</h1>
          <p className="text-[var(--color-text-secondary)] text-lg">
            Resources for journalists, bloggers, and content creators covering AI Context Studio.
          </p>
        </header>

        <section className="mb-16 max-w-4xl">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Company Overview</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">{companyInfo.name}</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">{companyInfo.tagline}</p>
              <p className="text-[var(--color-text-secondary)] mb-6">{companyInfo.description}</p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-[var(--color-text-muted)]">Founded</dt><dd className="text-[var(--color-text-primary)]">{companyInfo.founded}</dd></div>
                <div className="flex justify-between"><dt className="text-[var(--color-text-muted)]">Headquarters</dt><dd className="text-[var(--color-text-primary)]">{companyInfo.headquarters}</dd></div>
                <div className="flex justify-between"><dt className="text-[var(--color-text-muted)]">Website</dt><dd className="text-[var(--color-text-primary)]"><a href={companyInfo.website} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">{companyInfo.website}</a></dd></div>
                <div className="flex justify-between"><dt className="text-[var(--color-text-muted)]">GitHub</dt><dd className="text-[var(--color-text-primary)]"><a href={companyInfo.github} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">{companyInfo.github}</a></dd></div>
              </dl>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">Mission</h3>
              <p className="text-[var(--color-text-secondary)] mb-8">{companyInfo.mission}</p>
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">Key Stats</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {companyInfo.keyStats.map((stat, i) => (
                  <div key={i} className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-center">
                    <div className="text-3xl font-bold text-[var(--color-accent)]">{stat.value}</div>
                    <div className="text-sm text-[var(--color-text-muted)]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 max-w-4xl">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Brand Assets</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">All assets are available for editorial use. Please do not modify logos or use them in a way that implies endorsement.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pressAssets.map((asset, i) => (
              <div key={i} className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <h3 className="font-medium text-[var(--color-text-primary)] mb-1">{asset.name}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-2">{asset.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-[var(--color-text-muted)]">
                  <span className="px-2 py-0.5 rounded bg-[var(--color-bg-tertiary)]">{asset.format}</span>
                  <span className="px-2 py-0.5 rounded bg-[var(--color-bg-tertiary)]">{asset.size}</span>
                </div>
                <button className="mt-3 text-sm text-[var(--color-accent)] hover:underline" disabled>Download (coming soon)</button>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 max-w-4xl">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Brand Guidelines</h2>
          <div className="space-y-4 text-[var(--color-text-secondary)]">
            <div>
              <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Name Usage</h3>
              <p>Always use "AI Context Studio" (capitalized). Do not use "AI Context studio", "Ai Context Studio", or "aicontextstudio".</p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Colors</h3>
              <p>Primary: <code className="bg-[var(--color-bg-tertiary)] px-1 rounded">#6366f1</code> (Indigo 500) · Background: <code className="bg-[var(--color-bg-tertiary)] px-1 rounded">#0f0f0f</code> · Surface: <code className="bg-[var(--color-bg-tertiary)] px-1 rounded">#1a1a1a</code></p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Logo Clear Space</h3>
              <p>Maintain clear space equal to the height of the "A" in the logo mark on all sides.</p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Do Not</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Stretch, rotate, or distort the logo</li>
                <li>Change logo colors</li>
                <li>Add effects (shadows, gradients, outlines)</li>
                <li>Place on busy backgrounds without sufficient contrast</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="max-w-2xl">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Media Contact</h2>
          <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            <p className="text-[var(--color-text-secondary)] mb-4">For press inquiries, interview requests, or additional assets:</p>
            <a href="mailto:press@aicontext.studio" className="text-[var(--color-accent)] hover:underline font-medium">press@aicontext.studio</a>
            <p className="text-sm text-[var(--color-text-muted)] mt-2">We typically respond within 1-2 business days.</p>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}