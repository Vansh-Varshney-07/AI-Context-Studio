import { type Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { generateMetadata } from '@/lib/metadata';
import { downloads, sourceCode, releaseNotes, systemRequirements } from '@/data/downloads';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CTA } from '@/components/sections/cta';
import {
  Download,
  Monitor,
  FileText,
  Shield,
  Hash,
  ExternalLink,
  ArrowRight,
  Code,
} from 'lucide-react';
import { AppleIcon, LinuxIcon } from '@/components/icons/platform-icons';
import Link from 'next/link';

export const metadata: Metadata = generateMetadata({
  title: 'Download',
  description:
    'Download AI Context Studio for Windows, macOS, and Linux. Native desktop app built with Tauri — fast, secure, and lightweight. No Electron bloat.',
});

export function DownloadPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <section className="flex flex-1 flex-col">
        <section
          id="download"
          className="section bg-[var(--color-bg-secondary)]"
          aria-labelledby="download-heading"
        >
          <div className="container-app">
            <div className="animate-slide-up mb-16 text-center">
              <h2
                id="download-heading"
                className="mb-4 text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl"
              >
                Download for Your Platform
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-[var(--color-text-secondary)]">
                Native desktop app built with Tauri — fast, secure, and lightweight. No Electron
                bloat.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {downloads.map((platform, index) => (
                <div
                  key={platform.os}
                  className="animate-slide-up"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <Card className="card-hover flex h-full flex-col p-6">
                    <div className="mb-4 flex items-center gap-3">
                      {platform.os === 'Windows' && (
                        <Monitor className="h-8 w-8 text-[var(--color-accent)]" />
                      )}
                      {platform.os === 'macOS' && (
                        <AppleIcon className="h-8 w-8 text-[var(--color-accent)]" />
                      )}
                      {platform.os === 'Linux' && (
                        <LinuxIcon className="h-8 w-8 text-[var(--color-accent)]" />
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
                          {platform.os}
                        </h3>
                        <Badge variant="accent" className="text-xs">
                          {platform.recommended}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-6 flex-1 space-y-3">
                      {platform.variants.map((variant) => (
                        <div
                          key={variant.label}
                          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] p-3"
                        >
                          <div className="mb-1 flex items-center justify-between">
                            <span className="font-medium text-[var(--color-text-primary)]">
                              {variant.label}
                            </span>
                            <span className="font-mono text-sm text-[var(--color-text-muted)]">
                              {variant.size}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-text-muted)]">
                            <span className="flex-1 truncate">{variant.checksum}</span>
                            <Badge variant="outline" className="text-xs">
                              {variant.ext}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full">
                      <Link
                        href={platform.variants[0]?.url ?? '#'}
                        className="inline-flex w-full items-center justify-center gap-2"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download {platform.recommended}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </Card>
                </div>
              ))}
            </div>

            <div
              className="animate-slide-up mt-16 grid gap-8 lg:grid-cols-2"
              style={{ animationDelay: '0.4s' }}
            >
              <Card className="card-hover p-6">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[var(--color-text-primary)]">
                  <FileText className="h-5 w-5 text-[var(--color-accent)]" />
                  Source Code
                </h3>
                <p className="mb-4 text-[var(--color-text-secondary)]">
                  Build from source or audit the codebase. MIT licensed.
                </p>
                <div className="space-y-2">
                  {sourceCode.instructions.map((inst, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded bg-[var(--color-bg-tertiary)] p-2 font-mono text-sm text-[var(--color-text-secondary)]"
                    >
                      <span className="text-[var(--color-accent)]">$</span>
                      <span>{inst}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4">
                  <Link
                    href={sourceCode.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    View on GitHub <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Card>

              <Card className="card-hover p-6">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[var(--color-text-primary)]">
                  <Shield className="h-5 w-5 text-[var(--color-accent)]" />
                  Verify Downloads
                </h3>
                <p className="mb-4 text-[var(--color-text-secondary)]">
                  All releases are signed and include SHA256 checksums. Verify integrity before
                  installing.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 rounded bg-[var(--color-bg-tertiary)] p-3 text-[var(--color-text-secondary)]">
                    <Hash className="h-4 w-4 text-[var(--color-accent)]" />
                    <span className="font-mono">
                      sha256sum ai-context-studio-1.0.0-x64.AppImage
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded bg-[var(--color-bg-tertiary)] p-3 text-[var(--color-text-secondary)]">
                    <Shield className="h-4 w-4 text-[var(--color-accent)]" />
                    <span>Windows: Code-signed with EV certificate</span>
                  </div>
                  <div className="flex items-center gap-2 rounded bg-[var(--color-bg-tertiary)] p-3 text-[var(--color-text-secondary)]">
                    <AppleIcon className="h-4 w-4 text-[var(--color-accent)]" />
                    <span>macOS: Notarized by Apple</span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="animate-slide-up mt-12" style={{ animationDelay: '0.6s' }}>
              <h3 className="mb-4 text-center text-xl font-semibold text-[var(--color-text-primary)]">
                Recent Releases
              </h3>
              <div className="mx-auto max-w-3xl space-y-3">
                {releaseNotes.slice(0, 3).map((release, index) => (
                  <div
                    key={release.version}
                    className="animate-slide-up rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4"
                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-[var(--color-accent)]">
                          v{release.version}
                        </span>
                        <Badge variant="success">{release.date}</Badge>
                        {release.breaking && <Badge variant="danger">Breaking</Badge>}
                      </div>
                    </div>
                    <p className="font-medium text-[var(--color-text-primary)]">{release.title}</p>
                    <ul className="mt-2 space-y-1 text-sm text-[var(--color-text-secondary)]">
                      {release.highlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="mt-4 text-center">
                  <a
                    href="/changelog"
                    className="font-medium text-[var(--color-accent)] hover:underline"
                  >
                    View full changelog →
                  </a>
                </div>
              </div>
            </div>

            <div className="animate-slide-up mt-12 text-center" style={{ animationDelay: '0.8s' }}>
              <p className="mb-4 text-[var(--color-text-secondary)]">
                Requirements: {systemRequirements.windows} • {systemRequirements.macos} •{' '}
                {systemRequirements.linux}
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                RAM: {systemRequirements.memory} • Disk: {systemRequirements.disk}
              </p>
            </div>
          </div>
        </section>
        <CTA />
      </section>
      <Footer />
    </main>
  );
}

export default DownloadPage;
