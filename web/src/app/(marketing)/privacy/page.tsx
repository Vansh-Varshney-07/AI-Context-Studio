import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Privacy Policy",
  description: "AI Context Studio Privacy Policy. Learn how we collect, use, and protect your data.",
});

const lastUpdated = "January 15, 2025";
const effectiveDate = "January 15, 2025";

export default function PrivacyPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 container-app py-16 px-4">
        <article className="max-w-3xl space-y-12">
          <header className="space-y-4">
            <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">Privacy Policy</h1>
            <div className="text-sm text-[var(--color-text-muted)]">
              <p>Last updated: {lastUpdated}</p>
              <p>Effective date: {effectiveDate}</p>
            </div>
          </header>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">1. Introduction</h2>
            <p className="text-[var(--color-text-secondary)]">
              AI Context Studio ("we", "our", "us") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our website and services.
            </p>
            <p className="text-[var(--color-text-secondary)] mt-4">
              By using AI Context Studio, you agree to the collection and use of information
              in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-6 mb-3">2.1 Personal Information</h3>
            <ul className="list-disc list-inside space-y-2 text-[var(--color-text-secondary)] ml-4">
              <li><strong>Account Data:</strong> Email address, name, password hash (via Better Auth), avatar</li>
              <li><strong>Profile Data:</strong> Bio, preferences, notification settings, AI provider configurations (stored session-only)</li>
              <li><strong>Generated Assets:</strong> System prompts, instruction files, personas, workflows, MCP configs, and other assets you create</li>
            </ul>
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-6 mb-3">2.2 Usage Data</h3>
            <ul className="list-disc list-inside space-y-2 text-[var(--color-text-secondary)] ml-4">
              <li>Pages visited, time spent, feature usage</li>
              <li>Generation requests (kind, blueprint, success/failure, latency)</li>
              <li>API calls (endpoint, response status, latency)</li>
              <li>Browser/OS, device type, referrer</li>
            </ul>
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-6 mb-3">2.3 AI Provider Keys (Session-Only)</h3>
            <p className="text-[var(--color-text-secondary)]">
              When you use AI-enhanced generation, you may provide API keys for OpenAI, Anthropic, Google, Groq, or custom endpoints.
              <strong>These keys are never stored in our database.</strong> They exist only in your browser session memory
              and are transmitted directly to the respective AI provider's API. We cannot access, log, or recover them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-3 text-[var(--color-text-secondary)] ml-4">
              <li><strong>Provide Services:</strong> Authenticate you, save your assets, enable generation features</li>
              <li><strong>Improve Product:</strong> Analyze usage patterns to prioritize features, fix bugs, optimize performance</li>
              <li><strong>Communicate:</strong> Send transactional emails (verification, password reset, security alerts)</li>
              <li><strong>Security:</strong> Detect abuse, prevent fraud, enforce rate limits</li>
              <li><strong>Legal Compliance:</strong> Respond to lawful requests, enforce terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">4. Data Storage & Security</h2>
            <ul className="list-disc list-inside space-y-3 text-[var(--color-text-secondary)] ml-4">
              <li><strong>Database:</strong> PostgreSQL hosted on Neon (serverless, EU region available)</li>
              <li><strong>Encryption:</strong> TLS 1.3 in transit; passwords hashed with bcrypt (cost 12)</li>
              <li><strong>Access Control:</strong> Role-based access (user, admin); principle of least privilege</li>
              <li><strong>Retention:</strong> Account data retained while account is active; deleted within 30 days of account deletion</li>
              <li><strong>Backups:</strong> Automated daily backups with point-in-time recovery (Neon)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">5. Third-Party Services</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">We use the following subprocessors:</p>
            <ul className="list-disc list-inside space-y-2 text-[var(--color-text-secondary)] ml-4">
              <li><strong>Neon:</strong> PostgreSQL database hosting (privacy policy: <a href="https://neon.tech/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">neon.tech/privacy</a>)</li>
              <li><strong>Vercel:</strong> Hosting, edge functions, analytics (privacy policy: <a href="https://vercel.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">vercel.com/privacy</a>)</li>
              <li><strong>GitHub API:</strong> Public repository data for marketplace (no authentication, 60 req/hr)</li>
              <li><strong>AI Providers (Optional):</strong> OpenAI, Anthropic, Google, Groq — only when you explicitly provide keys and request AI generation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">6. Your Rights</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-[var(--color-text-secondary)] ml-4">
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Erase your data ("right to be forgotten")</li>
              <li>Restrict or object to processing</li>
              <li>Data portability</li>
              <li>Withdraw consent (where processing is based on consent)</li>
            </ul>
            <p className="text-[var(--color-text-secondary)] mt-4">
              To exercise these rights, email <a href="mailto:privacy@aicontext.studio" className="text-[var(--color-accent)] hover:underline">privacy@aicontext.studio</a>.
              We'll respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">7. Cookies & Tracking</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">
              We use minimal cookies. See our <a href="/cookies" className="text-[var(--color-accent)] hover:underline">Cookie Policy</a> for details.
            </p>
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-6 mb-3">Essential Cookies</h3>
            <ul className="list-disc list-inside space-y-2 text-[var(--color-text-secondary)] ml-4">
              <li><code>better-auth.session_token</code> — Authentication session (HTTP-only, Secure, SameSite=Lax)</li>
              <li><code>better-auth.refresh_token</code> — Session refresh (HTTP-only, Secure, SameSite=Lax)</li>
            </ul>
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-6 mb-3">Analytics (Opt-In)</h3>
            <p className="text-[var(--color-text-secondary)]">
              We use Vercel Analytics for aggregate, privacy-friendly metrics. No personal data is collected.
              You can opt out via browser Do Not Track or our cookie banner.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">8. Children's Privacy</h2>
            <p className="text-[var(--color-text-secondary)]">
              Our services are not directed to children under 13 (or 16 in the EU). We do not knowingly collect
              personal information from children. If you believe we have, contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">9. International Transfers</h2>
            <p className="text-[var(--color-text-secondary)]">
              Your data may be processed in the United States or other countries where our subprocessors operate.
              We rely on Standard Contractual Clauses and adequacy decisions for EU/UK data transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">10. Changes to This Policy</h2>
            <p className="text-[var(--color-text-secondary)]">
              We may update this policy. Material changes will be announced via email and/or in-app notification
              at least 30 days before taking effect. Continued use constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">11. Contact</h2>
            <p className="text-[var(--color-text-secondary)]">
              Questions about this policy? Email <a href="mailto:privacy@aicontext.studio" className="text-[var(--color-accent)] hover:underline">privacy@aicontext.studio</a>.
            </p>
          </section>
        </article>
      </div>
      <Footer />
    </main>
  );
}