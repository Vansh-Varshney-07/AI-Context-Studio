import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Cookie Policy",
  description: "AI Context Studio Cookie Policy. Learn what cookies we use and how to manage them.",
});

const lastUpdated = "January 15, 2025";

export default function CookiesPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 container-app py-16 px-4">
        <article className="max-w-3xl space-y-12">
          <header className="space-y-4">
            <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">Cookie Policy</h1>
            <div className="text-sm text-[var(--color-text-muted)]">
              <p>Last updated: {lastUpdated}</p>
            </div>
          </header>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">What Are Cookies?</h2>
            <p className="text-[var(--color-text-secondary)]">
              Cookies are small text files stored on your device when you visit a website. They help the site
              remember your preferences, authenticate you, and understand how you use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">How We Use Cookies</h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              AI Context Studio uses only essential cookies for authentication. We do not use advertising,
              tracking, or third-party analytics cookies.
            </p>

            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Essential Cookies (Always Active)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="pb-3 font-semibold text-[var(--color-text-primary)]">Name</th>
                    <th className="pb-3 font-semibold text-[var(--color-text-primary)]">Purpose</th>
                    <th className="pb-3 font-semibold text-[var(--color-text-primary)]">Type</th>
                    <th className="pb-3 font-semibold text-[var(--color-text-primary)]">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--color-text-secondary)]">
                  <tr className="border-b border-[var(--color-border)]">
                    <td className="py-3 font-mono">better-auth.session_token</td>
                    <td>Authenticates your session; keeps you logged in</td>
                    <td>HTTP-only, Secure, SameSite=Lax</td>
                    <td>7 days (rolling)</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border)]">
                    <td className="py-3 font-mono">better-auth.refresh_token</td>
                    <td>Refreshes your session without re-login</td>
                    <td>HTTP-only, Secure, SameSite=Lax</td>
                    <td>30 days (rolling)</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border)]">
                    <td className="py-3 font-mono">better-auth.session_data</td>
                    <td>Stores minimal session metadata (user ID, roles)</td>
                    <td>HTTP-only, Secure, SameSite=Lax</td>
                    <td>7 days (rolling)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-8 mb-4">Analytics (Opt-In Only)</h3>
            <p className="text-[var(--color-text-secondary)] mb-4">
              We use Vercel Analytics for aggregate, privacy-friendly metrics. This only activates if you
              accept optional analytics or have "Do Not Track" disabled in your browser.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="pb-3 font-semibold text-[var(--color-text-primary)]">Name</th>
                    <th className="pb-3 font-semibold text-[var(--color-text-primary)]">Purpose</th>
                    <th className="pb-3 font-semibold text-[var(--color-text-primary)]">Provider</th>
                    <th className="pb-3 font-semibold text-[var(--color-text-primary)]">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--color-text-secondary)]">
                  <tr className="border-b border-[var(--color-border)]">
                    <td className="py-3 font-mono">v_a</td>
                    <td>Page views, session count (anonymous)</td>
                    <td>Vercel</td>
                    <td>1 year</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border)]">
                    <td className="py-3 font-mono">v_s</td>
                    <td>Session identifier (anonymous)</td>
                    <td>Vercel</td>
                    <td>Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Managing Cookies</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">
              You can control cookies through your browser settings:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--color-text-secondary)] ml-4">
              <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
              <li><strong>Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies</li>
            </ul>
            <p className="text-[var(--color-text-secondary)] mt-4">
              <strong>Note:</strong> Disabling essential cookies will break authentication and prevent you from using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Do Not Track</h2>
            <p className="text-[var(--color-text-secondary)]">
              We respect the <code className="bg-[var(--color-bg-tertiary)] px-1 rounded font-mono">DNT: 1</code> header.
              If enabled, optional analytics cookies will not be set.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Third-Party Cookies</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">
              We do not set third-party cookies directly. However, external services may set cookies when you interact with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--color-text-secondary)] ml-4">
              <li><strong>GitHub:</strong> When clicking GitHub links (governed by <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">GitHub Privacy</a>)</li>
              <li><strong>AI Providers:</strong> When using AI-enhanced generation, requests go directly to OpenAI, Anthropic, Google, or Groq (governed by their respective privacy policies)</li>
              <li><strong>Vercel:</strong> Hosting infrastructure may set technical cookies (governed by <a href="https://vercel.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">Vercel Privacy</a>)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Changes to This Policy</h2>
            <p className="text-[var(--color-text-secondary)]">
              We may update this policy. Changes will be posted here with an updated "Last updated" date.
              Material changes will be announced via in-app notification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Contact</h2>
            <p className="text-[var(--color-text-secondary)]">
              Questions about cookies? Email <a href="mailto:privacy@aicontext.studio" className="text-[var(--color-accent)] hover:underline">privacy@aicontext.studio</a>.
            </p>
          </section>
        </article>
      </div>
      <Footer />
    </main>
  );
}