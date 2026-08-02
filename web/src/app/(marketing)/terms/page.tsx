import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Terms of Service",
  description: "AI Context Studio Terms of Service. Please read carefully before using our services.",
});

const lastUpdated = "January 15, 2025";
const effectiveDate = "January 15, 2025";

export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 container-app py-16 px-4">
        <article className="max-w-3xl space-y-12">
          <header className="space-y-4">
            <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">Terms of Service</h1>
            <div className="text-sm text-[var(--color-text-muted)]">
              <p>Last updated: {lastUpdated}</p>
              <p>Effective date: {effectiveDate}</p>
            </div>
          </header>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">1. Agreement to Terms</h2>
            <p className="text-[var(--color-text-secondary)]">
              By accessing or using AI Context Studio ("the Service"), you agree to be bound by these Terms of Service
              ("Terms"). If you disagree with any part, you may not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">2. Description of Service</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">
              AI Context Studio is a web-based AI prompt engineering platform that enables users to create, customize,
              manage, and export AI instruction assets including system prompts, instruction files, personas, workflows,
              MCP configurations, skills, memories, and optimized prompts.
            </p>
            <p className="text-[var(--color-text-secondary)]">
              The Service includes: a generation engine, marketplace for community assets, tool pages for specific
              asset types, user dashboard, and administrative features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">3. Accounts & Registration</h2>
            <ul className="list-disc list-inside space-y-3 text-[var(--color-text-secondary)] ml-4">
              <li>You must be 13+ (16+ in EU) to create an account</li>
              <li>Provide accurate, complete registration information</li>
              <li>Maintain security of your credentials</li>
              <li>Notify us immediately of unauthorized access</li>
              <li>One account per person; no shared or automated accounts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">4. Acceptable Use</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-[var(--color-text-secondary)] ml-4">
              <li>Violate any law or regulation</li>
              <li>Infringe intellectual property rights</li>
              <li>Generate harmful, illegal, or abusive content</li>
              <li>Reverse engineer, decompile, or extract source code</li>
              <li>Interfere with service integrity (scraping, automation, DoS)</li>
              <li>Share accounts or access credentials</li>
              <li>Impersonate others or misrepresent affiliation</li>
              <li>Use AI provider keys you don't own or have permission for</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">5. User Content</h2>
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-6 mb-3">5.1 Ownership</h3>
            <p className="text-[var(--color-text-secondary)]">
              You retain all rights to content you create ("User Content"). By using the Service, you grant us
              a worldwide, non-exclusive, royalty-free license to host, store, process, and display your User Content
              solely to provide the Service.
            </p>
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-6 mb-3">5.2 Responsibility</h3>
            <p className="text-[var(--color-text-secondary)]">
              You are solely responsible for your User Content. We don't pre-screen content but reserve the right
              to remove content violating these Terms or law.
            </p>
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-6 mb-3">5.3 Marketplace Submissions</h3>
            <p className="text-[var(--color-text-secondary)]">
              Assets submitted to the marketplace become publicly visible. You grant other users a license to view,
              download, and use submitted assets per the asset's declared license (default: MIT).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">6. AI-Enhanced Generation</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">
              The Service offers optional AI-enhanced generation using third-party providers (OpenAI, Anthropic, Google, Groq, custom).
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--color-text-secondary)] ml-4">
              <li>You provide your own API keys; we do not provide or sell API access</li>
              <li>Keys are stored session-only in your browser; never persisted to our database</li>
              <li>You are responsible for all costs and compliance with provider terms</li>
              <li>We make no guarantees about AI output quality, accuracy, or safety</li>
              <li>AI-generated content is provided "as is" without warranty</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">7. Intellectual Property</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">
              The Service (excluding User Content) — including code, design, trademarks, logos, and documentation —
              is owned by AI Context Studio and protected by copyright, trademark, and other laws.
            </p>
            <p className="text-[var(--color-text-secondary)]">
              "AI Context Studio" and the logo are trademarks. You may not use them without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">8. Free & Paid Features</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">
              Core features are free. We may introduce paid tiers with additional features, usage limits, or support.
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--color-text-secondary)] ml-4">
              <li>Free tier: Generous limits for individuals and small teams</li>
              <li>Paid tiers: Higher limits, priority support, advanced features</li>
              <li>Prices subject to change with 30 days' notice</li>
              <li>No refunds for partial months unless required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">9. Disclaimers & Limitation of Liability</h2>
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-6 mb-3">9.1 No Warranties</h3>
            <p className="text-[var(--color-text-secondary)]">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
              EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
              AND NON-INFRINGEMENT.
            </p>
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-6 mb-3">9.2 Limitation of Liability</h3>
            <p className="text-[var(--color-text-secondary)]">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, AI CONTEXT STUDIO SHALL NOT BE LIABLE FOR
              ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING
              LOSS OF PROFITS, DATA, OR GOODWILL, EVEN IF ADVISED OF THE POSSIBILITY.
            </p>
            <p className="text-[var(--color-text-secondary)] mt-2">
              Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim,
              or $100, whichever is greater.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">10. Indemnification</h2>
            <p className="text-[var(--color-text-secondary)]">
              You agree to indemnify and hold harmless AI Context Studio from any claims, damages, or expenses
              (including attorney fees) arising from your use of the Service, violation of these Terms,
              or infringement of third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">11. Termination</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">
              We may suspend or terminate your access for Terms violations, with or without notice.
              You may delete your account anytime via settings.
            </p>
            <p className="text-[var(--color-text-secondary)]">
              Upon termination: your license ends, we may delete your data within 30 days,
              and provisions that should survive (IP, disclaimers, liability) will survive.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">12. Governing Law & Disputes</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">
              These Terms are governed by the laws of Delaware, USA, without regard to conflict of laws.
            </p>
            <p className="text-[var(--color-text-secondary)]">
              Disputes will be resolved in state or federal courts in Delaware. You consent to personal jurisdiction there.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">13. Changes to Terms</h2>
            <p className="text-[var(--color-text-secondary)]">
              We may modify these Terms. Material changes will be communicated via email and/or in-app
              at least 30 days before taking effect. Continued use constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">14. Contact</h2>
            <p className="text-[var(--color-text-secondary)]">
              Questions about these Terms? Email <a href="mailto:legal@aicontext.studio" className="text-[var(--color-accent)] hover:underline">legal@aicontext.studio</a>.
            </p>
          </section>
        </article>
      </div>
      <Footer />
    </main>
  );
}