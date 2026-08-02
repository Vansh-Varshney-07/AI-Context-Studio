import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Careers",
  description: "Join the AI Context Studio team. We're building the future of AI prompt engineering.",
});

const jobs = [
  {
    title: "Senior Full Stack Engineer",
    type: "Full-time",
    location: "Remote (UTC±4)",
    description: "Build the core platform using Next.js, TypeScript, PostgreSQL, and AI integrations. Own features end-to-end from design to deployment.",
    requirements: [
      "5+ years React/Next.js production experience",
      "Strong TypeScript, PostgreSQL, Prisma",
      "Experience with AI/LLM APIs (OpenAI, Anthropic)",
      "Ownership mindset, excellent communication",
    ],
    niceToHave: ["Open source contributions", "Developer tooling experience", "Neon/Postgres expertise"],
  },
  {
    title: "Developer Experience Engineer",
    type: "Full-time",
    location: "Remote (UTC±4)",
    description: "Improve the developer experience of AI Context Studio. Build SDKs, CLIs, documentation, and integrations for popular AI coding assistants.",
    requirements: [
      "3+ years DX/engineering experience",
      "Deep knowledge of VS Code, Cursor, JetBrains ecosystems",
      "MCP, LSP, and language server protocol familiarity",
      "Technical writing and documentation skills",
    ],
    niceToHave: ["VS Code extension development", "Open source community management", "TypeScript library authoring"],
  },
  {
    title: "AI/ML Engineer (Prompt Engineering)",
    type: "Full-time",
    location: "Remote (UTC±4)",
    description: "Research and implement advanced prompt engineering techniques. Optimize our generation engines, build evaluation frameworks, and push the boundaries of AI-assisted development.",
    requirements: [
      "Strong background in prompt engineering, RAG, agents",
      "Experience with LLM evaluation and benchmarking",
      "Python/TypeScript proficiency",
      "Published research or notable open source AI work",
    ],
    niceToHave: ["Fine-tuning experience", "MLOps", "LangChain/LlamaIndex"],
  },
  {
    title: "Product Designer",
    type: "Full-time",
    location: "Remote (UTC±4)",
    description: "Design intuitive interfaces for complex AI workflows. Create design systems, prototype interactions, and collaborate closely with engineers.",
    requirements: [
      "4+ years product design for developer tools",
      "Figma expertise, design systems experience",
      "Understanding of technical constraints",
      "Portfolio showing complex B2B/SaaS work",
    ],
    niceToHave: ["Frontend implementation skills", "Motion design (Framer Motion)", "AI interface design experience"],
  },
];

const benefits = [
  { title: "Remote First", description: "Work from anywhere with flexible hours. We trust you to do your best work." },
  { title: "Competitive Equity", description: "Meaningful ownership in a growing company. We're building for the long term." },
  { title: "Learning Budget", description: "$2,000/year for courses, conferences, books, and certifications." },
  { title: "AI Tool Allowance", description: "Monthly budget for AI subscriptions (Cursor, ChatGPT Plus, Claude, etc.)." },
  { title: "Health & Wellness", description: "Comprehensive health insurance, mental health support, and wellness stipend." },
  { title: "Equipment", description: "MacBook Pro or equivalent, monitor, keyboard, and whatever you need to be productive." },
];

export default function CareersPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 container-app py-16 px-4">
        <header className="mb-16 max-w-3xl text-center mx-auto">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">Careers</h1>
          <p className="text-[var(--color-text-secondary)] text-lg">
            We're a small, ambitious team building the best AI prompt engineering platform.
            If you care about developer experience, AI, and building tools developers love,
            we'd love to hear from you.
          </p>
        </header>

        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8">Open Positions</h2>
          <div className="space-y-6">
            {jobs.map((job, i) => (
              <article key={i} className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-[var(--color-text-muted)]">
                      <span className="px-2 py-0.5 rounded bg-[var(--color-accent)]/20 text-[var(--color-accent)]">{job.type}</span>
                      <span className="flex items-center gap-1"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> {job.location}</span>
                    </div>
                  </div>
                </div>
                <p className="text-[var(--color-text-secondary)] mb-4">{job.description}</p>
                <div className="grid gap-4 md:grid-cols-2 mb-4">
                  <div>
                    <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Requirements</h4>
                    <ul className="space-y-1 text-sm text-[var(--color-text-secondary)]">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="flex gap-2"><span className="text-[var(--color-accent)]">→</span>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Nice to Have</h4>
                    <ul className="space-y-1 text-sm text-[var(--color-text-secondary)]">
                      {job.niceToHave.map((item, i) => (
                        <li key={i} className="flex gap-2"><span className="text-[var(--color-text-muted)]">+</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <a href="mailto:careers@aicontext.studio?subject=Application:%20{job.title}" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] hover:underline">
                  Apply →
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8">Benefits</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, i) => (
              <div key={i} className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">{benefit.title}</h3>
                <p className="text-[var(--color-text-secondary)]">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-2xl mx-auto text-center p-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Don't see a role that fits?</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">We're always looking for exceptional people. Send us your portfolio and a note about why you want to work on AI Context Studio.</p>
          <a href="mailto:careers@aicontext.studio" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-accent)] text-white font-medium hover:opacity-90 transition-opacity">
            Send Open Application
          </a>
        </section>
      </div>
      <Footer />
    </main>
  );
}