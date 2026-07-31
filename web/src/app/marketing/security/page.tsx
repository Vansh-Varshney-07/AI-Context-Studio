import { type Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { generateMetadata } from '@/lib/metadata';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CTA } from '@/components/sections/cta';
import {
  Shield,
  Lock,
  Key,
  Server,
  Globe,
  Eye,
  CheckCircle,
  AlertCircle,
  Github,
  Link as LinkIcon,
} from 'lucide-react';

export const metadata: Metadata = generateMetadata({
  title: 'Security',
  description:
    'AI Context Studio is local-first by design. Learn about our encryption, data privacy, API key management, MCP sandboxing, and responsible disclosure.',
});

export function SecurityPage() {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'Local-First Architecture',
      description:
        'All data stays on your machine. No cloud sync, no telemetry, no account required. Your prompts, memories, and configurations never leave your device.',
      status: 'implemented',
    },
    {
      icon: Shield,
      title: 'Encryption at Rest',
      description:
        'Sensitive data (API keys, credentials) encrypted using OS-native keychain (Windows Credential Manager, macOS Keychain, Linux Secret Service). AES-256 for custom storage.',
      status: 'implemented',
    },
    {
      icon: Key,
      title: 'API Keys Stay Local',
      description:
        'Provider API keys are stored encrypted in your system keychain. Never written to plaintext files, never synced, never transmitted except to the provider you authorize.',
      status: 'implemented',
    },
    {
      icon: Server,
      title: 'MCP Server Isolation',
      description:
        'Model Context Protocol servers run in isolated subprocesses with restricted permissions. No filesystem access beyond configured directories. No network access unless explicitly granted.',
      status: 'implemented',
    },
    {
      icon: Globe,
      title: 'No Cloud Dependencies',
      description:
        'Zero required cloud services. Works fully offline. Optional cloud features (sync, sharing) are opt-in and clearly separated from core functionality.',
      status: 'implemented',
    },
    {
      icon: Eye,
      title: 'Open Source Transparency',
      description:
        'MIT licensed. Full source code auditable on GitHub. No hidden binaries, no obfuscated code. Community can verify security claims independently.',
      status: 'implemented',
    },
  ];

  const privacyPrinciples = [
    'No telemetry or usage tracking by default',
    'No user accounts or authentication required',
    'No data collection or profiling',
    'No forced updates or telemetry',
    'Clear data ownership — you own all your assets',
    'Easy data export and deletion',
  ];

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <section className="flex flex-1 flex-col">
        <section
          className="section bg-[var(--color-bg-secondary)]"
          aria-labelledby="security-heading"
        >
          <div className="container-app">
            <div className="animate-slide-up mb-16 text-center">
              <h2
                id="security-heading"
                className="mb-4 text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl"
              >
                Security & Privacy — Local-First by Design
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-[var(--color-text-secondary)]">
                AI Context Studio is built on a fundamental principle: your data belongs to you.
                Every architectural decision prioritizes local control, encryption, and
                transparency.
              </p>
            </div>

            <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {securityFeatures.map((feature, index) => (
                <Card
                  key={feature.title}
                  className="card-hover animate-slide-up h-full p-6"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)]">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">
                    {feature.title}
                  </h3>
                  <p className="mb-4 text-[var(--color-text-secondary)]">{feature.description}</p>
                  <Badge
                    variant={feature.status === 'implemented' ? 'success' : 'warning'}
                    className="text-xs"
                  >
                    {feature.status === 'implemented' ? 'Implemented' : 'Planned'}
                  </Badge>
                </Card>
              ))}
            </div>

            <div className="mb-16 grid gap-8 lg:grid-cols-2">
              <Card className="card-hover p-8">
                <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-[var(--color-text-primary)]">
                  <Shield className="h-6 w-6 text-[var(--color-accent)]" />
                  Privacy Principles
                </h3>
                <ul className="space-y-3">
                  {privacyPrinciples.map((principle, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-[var(--color-text-secondary)]"
                    >
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-success)]" />
                      {principle}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="card-hover p-8">
                <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-[var(--color-text-primary)]">
                  <AlertCircle className="h-6 w-6 text-[var(--color-warning)]" />
                  Responsible Disclosure
                </h3>
                <p className="mb-4 text-[var(--color-text-secondary)]">
                  We take security seriously. If you discover a vulnerability, please report it
                  responsibly:
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 rounded-lg bg-[var(--color-bg-tertiary)] p-3">
                    <LinkIcon className="h-4 w-4 text-[var(--color-accent)]" />
                    <span className="font-mono">security@ai-context-studio.dev</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-[var(--color-bg-tertiary)] p-3">
                    <Github className="h-4 w-4 text-[var(--color-accent)]" />
                    <a
                      href="https://github.com/ai-context-studio/security"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-accent)] hover:underline"
                    >
                      Security Policy on GitHub
                    </a>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-[var(--color-bg-tertiary)] p-3">
                    <Key className="h-4 w-4 text-[var(--color-accent)]" />
                    <a href="/security.txt" className="text-[var(--color-accent)] hover:underline">
                      security.txt (RFC 9116)
                    </a>
                  </div>
                </div>
                <p className="mt-4 text-xs text-[var(--color-text-muted)]">
                  We aim to acknowledge reports within 48 hours and provide a fix timeline within 7
                  days for critical issues.
                </p>
              </Card>
            </div>

            <div className="mb-16 grid gap-8 lg:grid-cols-3">
              <Card className="card-hover p-6">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[var(--color-text-primary)]">
                  <Lock className="h-5 w-5 text-[var(--color-accent)]" />
                  Encryption Details
                </h3>
                <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <li>
                    <strong>Keychain:</strong> OS-native (Windows Credential Manager, macOS
                    Keychain, Linux Secret Service)
                  </li>
                  <li>
                    <strong>Custom Storage:</strong> AES-256-GCM with PBKDF2 key derivation
                  </li>
                  <li>
                    <strong>Transit:</strong> TLS 1.3 for all provider communications
                  </li>
                  <li>
                    <strong>Verification:</strong> SHA-256 checksums on all assets
                  </li>
                </ul>
              </Card>

              <Card className="card-hover p-6">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[var(--color-text-primary)]">
                  <Server className="h-5 w-5 text-[var(--color-accent)]" />
                  MCP Sandboxing
                </h3>
                <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <li>
                    <strong>Process Isolation:</strong> Each MCP server runs in separate subprocess
                  </li>
                  <li>
                    <strong>Filesystem:</strong> Restricted to declared directories only
                  </li>
                  <li>
                    <strong>Network:</strong> Denied by default, explicit allowlist
                  </li>
                  <li>
                    <strong>Capabilities:</strong> Declared in manifest, enforced at runtime
                  </li>
                </ul>
              </Card>

              <Card className="card-hover p-6">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[var(--color-text-primary)]">
                  <Github className="h-5 w-5 text-[var(--color-accent)]" />
                  Audit & Compliance
                </h3>
                <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <li>
                    <strong>License:</strong> MIT — permissive, auditable
                  </li>
                  <li>
                    <strong>Dependencies:</strong> Minimal, pinned, regularly updated
                  </li>
                  <li>
                    <strong>Supply Chain:</strong> SBOM generated per release
                  </li>
                  <li>
                    <strong>Signing:</strong> Windows EV cert, macOS notarization
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>
        <CTA />
      </section>
      <Footer />
    </main>
  );
}

export default SecurityPage;
