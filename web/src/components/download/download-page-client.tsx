'use client';

import { Header, Footer } from '@/components/layout';
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
  AppleIcon,
  Laptop,
} from 'lucide-react';
import Link from 'next/link';
import type { Release } from '@prisma/client';

interface ReleaseWithAssets extends Release {
  assets: Array<{
    id: string;
    platform: string;
    arch: string;
    filename: string;
    size: number;
    checksum: string;
    url: string;
    signature: string | null;
    isRecommended: boolean;
  }>;
}

interface SystemRequirements {
  windows: string;
  macos: string;
  linux: string;
  node: string;
  rust: string;
  memory: string;
  disk: string;
}

interface SourceCodeInfo {
  label: string;
  description: string;
  url: string;
  releasesUrl: string;
  instructions: string[];
}

interface DownloadPageClientProps {
  releases: ReleaseWithAssets[];
  latestRelease: ReleaseWithAssets | null;
  systemRequirements: SystemRequirements;
  sourceCode: SourceCodeInfo;
}

export function DownloadPageClient({
  releases,
  latestRelease,
  systemRequirements,
  sourceCode,
}: DownloadPageClientProps) {
  const formatDate = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPlatformInfo = (platform: string) => {
    switch (platform) {
      case 'WINDOWS_X64':
        return { os: 'Windows', icon: <Monitor className="h-8 w-8 text-[var(--color-accent)]" />, recommended: 'NSIS Installer' };
      case 'MACOS_UNIVERSAL':
      case 'MACOS_ARM64':
      case 'MACOS_X64':
        return { os: 'macOS', icon: <AppleIcon className="h-8 w-8 text-[var(--color-accent)]" />, recommended: 'Universal DMG' };
      case 'LINUX_X64':
      case 'LINUX_ARM64':
      case 'LINUX_APPARMOR':
        return { os: 'Linux', icon: <Laptop className="h-8 w-8 text-[var(--color-accent)]" />, recommended: 'AppImage' };
      case 'SOURCE_CODE':
        return { os: 'Source Code', icon: <FileText className="h-8 w-8 text-[var(--color-accent)]" />, recommended: 'Git Clone' };
      default:
        return { os: platform, icon: <Monitor className="h-8 w-8 text-[var(--color-accent)]" />, recommended: 'Download' };
    }
  };

  const groupedAssets = (latestRelease?.assets || []).reduce((acc, asset) => {
    const platform = asset.platform;
    if (!acc[platform]) acc[platform] = [];
    acc[platform].push(asset);
    return acc;
  }, {} as Record<string, ReleaseWithAssets['assets']>) || {};

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

            {latestRelease && (
              <div className="grid gap-6 md:grid-cols-3">
                {Object.entries(groupedAssets).map(([platform, assets], index) => {
                  const platformInfo = getPlatformInfo(platform);
                  const recommendedAsset = assets.find(a => a.isRecommended) || assets[0] || { url: '#', platform: '' };
                  
                  return (
                    <div
                      key={platform}
                      className="animate-slide-up"
                      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                    >
                      <Card className="card-hover flex h-full flex-col p-6">
                        <div className="mb-4 flex items-center gap-3">
                          {platformInfo.icon}
                          <div>
                            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
                              {platformInfo.os}
                            </h3>
                            <Badge variant="accent" className="text-xs">
                              {platformInfo.recommended}
                            </Badge>
                          </div>
                        </div>

                        <div className="mb-6 flex-1 space-y-3">
                          {assets.map((variant) => (
                            <div
                              key={variant.id}
                              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] p-3"
                            >
                              <div className="mb-1 flex items-center justify-between">
                                <span className="font-medium text-[var(--color-text-primary)]">
                                  {variant.filename}
                                </span>
                                <span className="font-mono text-sm text-[var(--color-text-muted)]">
                                  {formatSize(variant.size)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-text-muted)]">
                                <span className="flex-1 truncate">{variant.checksum}</span>
                                <Badge variant="outline" className="text-xs">
                                  {variant.isRecommended && 'Recommended'}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>

                        <Button className="w-full">
                          <Link
                            href={recommendedAsset.url}
                            className="inline-flex w-full items-center justify-center gap-2"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download {platformInfo.recommended}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </Card>
                    </div>
                  );
                })}
              </div>
            )}

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
                      sha256sum ai-context-studio-{latestRelease?.version}-x64.AppImage
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
                {releases.slice(0, 5).map((release, index) => (
                  <div
                    key={release.id}
                    className="animate-slide-up rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4"
                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-[var(--color-accent)]">
                          v{release.version}
                        </span>
                        <Badge variant="success">{formatDate(release.publishedAt || release.createdAt)}</Badge>
                        {release.isPrerelease && <Badge variant="warning">Pre-release</Badge>}
                      </div>
                    </div>
                    <p className="font-medium text-[var(--color-text-primary)]">{release.title || `Version ${release.version}`}</p>
                    <ul className="mt-2 space-y-1 text-sm text-[var(--color-text-secondary)]">
                      {(release.description || '').split('\n').slice(0, 3).map((h, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                          {h.replace(/^[-*]\s*/, '')}
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