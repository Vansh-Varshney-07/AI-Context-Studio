import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Contact",
  description: "Get in touch with the AI Context Studio team. We'd love to hear from you.",
});

const contactMethods = [
  { title: "General Inquiries", email: "hello@aicontext.studio", description: "Questions, feedback, or just want to say hi" },
  { title: "Press & Media", email: "press@aicontext.studio", description: "Interviews, press kits, media requests" },
  { title: "Careers", email: "careers@aicontext.studio", description: "Job applications and recruiting inquiries" },
  { title: "Security Issues", email: "security@aicontext.studio", description: "Report security vulnerabilities (PGP key available)" },
  { title: "Support", email: "support@aicontext.studio", description: "Technical help, bug reports, feature requests" },
  { title: "Partnerships", email: "partners@aicontext.studio", description: "Integrations, partnerships, enterprise sales" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Vansh-Varshney-07/AI-Context-Studio", description: "Source code, issues, discussions" },
  { label: "GitHub Discussions", href: "https://github.com/Vansh-Varshney-07/AI-Context-Studio/discussions", description: "Community Q&A, ideas, showcases" },
];

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 container-app py-16 px-4">
        <header className="mb-16 max-w-3xl">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">Contact Us</h1>
          <p className="text-[var(--color-text-secondary)] text-lg">
            We're a small team but we read every message. Choose the best channel below.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2 max-w-4xl">
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Email</h2>
            <div className="space-y-4">
              {contactMethods.map((method, i) => (
                <a key={i} href={`mailto:${method.email}`} className="block p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent)]/50 transition-colors">
                  <h3 className="font-semibold text-[var(--color-text-primary)]">{method.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">{method.description}</p>
                  <p className="text-sm font-mono text-[var(--color-accent)] mt-2">{method.email}</p>
                </a>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Community & Social</h2>
            <div className="space-y-4">
              {socialLinks.map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent)]/50 transition-colors">
                  <h3 className="font-semibold text-[var(--color-text-primary)] flex items-center gap-2">{social.label}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">{social.description}</p>
                </a>
              ))}
            </div>
          </section>

          <section className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Before You Email</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Bug Report?</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-3">Please include: browser/OS, steps to reproduce, expected vs actual behavior, and screenshots if applicable.</p>
                <a href="https://github.com/Vansh-Varshney-07/AI-Context-Studio/issues/new?template=bug_report.md" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-accent)] hover:underline">Open GitHub Issue →</a>
              </div>
              <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Feature Request?</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-3">We love ideas! Check existing discussions first, then share your use case and why it would be valuable.</p>
                <a href="https://github.com/Vansh-Varshney-07/AI-Context-Studio/discussions/categories/ideas" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-accent)] hover:underline">Start Discussion →</a>
              </div>
              <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <h3 className="font-medium text-[var(--color-text-primary)] mb-2">General Question?</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-3">Check our FAQ and docs first — you might find an instant answer.</p>
                <a href="/faq" className="text-sm text-[var(--color-accent)] hover:underline">View FAQ →</a>
              </div>
            </div>
          </section>

          <section className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Response Times</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { type: "Security", time: "24 hours", color: "text-red-400" },
                { type: "Support", time: "1-2 business days", color: "text-blue-400" },
                { type: "General", time: "2-3 business days", color: "text-green-400" },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-center">
                  <div className={`text-2xl font-bold ${item.color}`}>{item.time}</div>
                  <div className="text-sm text-[var(--color-text-muted)]">{item.type} inquiries</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}