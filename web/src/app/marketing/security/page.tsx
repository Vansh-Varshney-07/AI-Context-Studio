import { type Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { generateMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CTA } from "@/components/sections/cta";
import { Shield, Lock, Key, Server, Globe, Eye, CheckCircle, AlertCircle, Github, ExternalLink, Link as LinkIcon } from "lucide-react";

export const metadata: Metadata = generateMetadata({
  title: "Security",
  description: "AI Context Studio is local-first by design. Learn about our encryption, data privacy, API key management, MCP sandboxing, and responsible disclosure.",
});

export function SecurityPage() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "Local-First Architecture",
      description: "All data stays on your machine. No cloud sync, no telemetry, no account required. Your prompts, memories, and configurations never leave your device.",
      status: "implemented",
    },
    {
      icon: Shield,
      title: "Encryption at Rest",
      description: "Sensitive data (API keys, credentials) encrypted using OS-native keychain (Windows Credential Manager, macOS Keychain, Linux Secret Service). AES-256 for custom storage.",
      status: "implemented",
    },
    {
      icon: Key,
      title: "API Keys Stay Local",
      description: "Provider API keys are stored encrypted in your system keychain. Never written to plaintext files, never synced, never transmitted except to the provider you authorize.",
      status: "implemented",
    },
    {
      icon: Server,
      title: "MCP Server Isolation",
      description: "Model Context Protocol servers run in isolated subprocesses with restricted permissions. No filesystem access beyond configured directories. No network access unless explicitly granted.",
      status: "implemented",
    },
    {
      icon: Globe,
      title: "No Cloud Dependencies",
      description: "Zero required cloud services. Works fully offline. Optional cloud features (sync, sharing) are opt-in and clearly separated from core functionality.",
      status: "implemented",
    },
    {
      icon: Eye,
      title: "Open Source Transparency",
      description: "MIT licensed. Full source code auditable on GitHub. No hidden binaries, no obfuscated code. Community can verify security claims independently.",
      status: "implemented",
    },
  ];

  const privacyPrinciples = [
    "No telemetry or usage tracking by default",
    "No user accounts or authentication required",
    "No data collection or profiling",
    "No forced updates or telemetry",
    "Clear data ownership — you own all your assets",
    "Easy data export and deletion",
  ];

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 flex flex-col">
        <section className="section bg-[var(--color-bg-secondary)]" aria-labelledby="security-heading">
          <div className="container-app">
            <div className="text-center mb-16 animate-slide-up">
              <h2 id="security-heading" className="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
                Security & Privacy — Local-First by Design
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                AI Context Studio is built on a fundamental principle: your data belongs to you. Every architectural decision prioritizes local control, encryption, and transparency.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
              {securityFeatures.map((feature, index) => (
                <Card key={feature.title} className="card-hover p-6 h-full animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)] mb-4">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">{feature.title}</h3>
                  <p className="text-[var(--color-text-secondary)] mb-4">{feature.description}</p>
                  <Badge variant={feature.status === "implemented" ? "success" : "warning"} className="text-xs">
                    {feature.status === "implemented" ? "Implemented" : "Planned"}
                  </Badge>
                </Card>
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-2 mb-16">
              <Card className="card-hover p-8">
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-[var(--color-accent)]" />
                  Privacy Principles
                </h3>
                <ul className="space-y-3">
                  {privacyPrinciples.map((principle, index) => (
                    <li key={index} className="flex items-start gap-3 text-[var(--color-text-secondary)]">
                      <CheckCircle className="h-5 w-5 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                      {principle}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="card-hover p-8">
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-[var(--color-warning)]" />
                  Responsible Disclosure
                </h3>
                <p className="text-[var(--color-text-secondary)] mb-4">
                  We take security seriously. If you discover a vulnerability, please report it responsibly:
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 p-3 bg-[var(--color-bg-tertiary)] rounded-lg">
                    <LinkIcon className="h-4 w-4 text-[var(--color-accent)]" />
                    <span className="font-mono">security@ai-context-studio.dev</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[var(--color-bg-tertiary)] rounded-lg">
                    <Github className="h-4 w-4 text-[var(--color-accent)]" />
                    <a href="https://github.com/ai-context-studio/security" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">
                      Security Policy on GitHub
                    </a>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[var(--color-bg-tertiary)] rounded-lg">
                    <Key className="h-4 w-4 text-[var(--color-accent)]" />
                    <a href="/security.txt" className="text-[var(--color-accent)] hover:underline">
                      security.txt (RFC 9116)
                    </a>
                  </div>
                </div>
                <p className="text-[var(--color-text-muted)] text-xs mt-4">
                  We aim to acknowledge reports within 48 hours and provide a fix timeline within 7 days for critical issues.
                </p>
              </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-3 mb-16">
              <Card className="card-hover p-6">
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-[var(--color-accent)]" />
                  Encryption Details
                </h3>
                <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <li><strong>Keychain:</strong> OS-native (Windows Credential Manager, macOS Keychain, Linux Secret Service)</li>
                  <li><strong>Custom Storage:</strong> AES-256-GCM with PBKDF2 key derivation</li>
                  <li><strong>Transit:</strong> TLS 1.3 for all provider communications</li>
                  <li><strong>Verification:</strong> SHA-256 checksums on all assets</li>
                </ul>
              </Card>

              <Card className="card-hover p-6">
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                  <Server className="h-5 w-5 text-[var(--color-accent)]" />
                  MCP Sandboxing
                </h3>
                <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <li><strong>Process Isolation:</strong> Each MCP server runs in separate subprocess</li>
                  <li><strong>Filesystem:</strong> Restricted to declared directories only</li>
                  <li><strong>Network:</strong> Denied by default, explicit allowlist</li>
                  <li><strong>Capabilities:</strong> Declared in manifest, enforced at runtime</li>
                </ul>
              </Card>

              <Card className="card-hover p-6">
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                  <Github className="h-5 w-5 text-[var(--color-accent)]" />
                  Audit & Compliance
                </h3>
                <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <li><strong>License:</strong> MIT — permissive, auditable</li>
                  <li><strong>Dependencies:</strong> Minimal, pinned, regularly updated</li>
                  <li><strong>Supply Chain:</strong> SBOM generated per release</li>
                  <li><strong>Signing:</strong> Windows EV cert, macOS notarization</li>
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