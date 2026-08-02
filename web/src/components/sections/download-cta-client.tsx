"use client";

import Link from "next/link";
import { Download, Monitor, FileText, Shield, Hash, ExternalLink, ArrowRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppleIcon, LinuxIcon } from "@/components/icons/platform-icons";

interface GitHubReleaseAsset {
  name: string;
  size: number;
  browser_download_url: string;
  content_type: string;
}

interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string | null;
  published_at: string;
  html_url: string;
  assets: GitHubReleaseAsset[];
  prerelease: boolean;
  draft: boolean;
}

interface DownloadCTAClientProps {
  initialReleases: GitHubRelease[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function getPlatformFromAsset(asset: GitHubReleaseAsset): { os: string; icon: React.ReactNode; recommended: string; label: string } | null {
  const name = asset.name.toLowerCase();
  
  if (name.endsWith(".exe")) {
    if (name.includes("portable")) {
      return { os: "Windows", icon: <Monitor className="h-8 w-8 text-[var(--color-accent)]" />, recommended: "Portable", label: "Portable Executable" };
    }
    return { os: "Windows", icon: <Monitor className="h-8 w-8 text-[var(--color-accent)]" />, recommended: "NSIS Installer", label: "NSIS Installer (Recommended)" };
  }
  
  if (name.endsWith(".dmg")) {
    if (name.includes("universal")) {
      return { os: "macOS", icon: <AppleIcon className="h-8 w-8 text-[var(--color-accent)]" />, recommended: "Universal DMG", label: "Universal DMG (Apple Silicon + Intel)" };
    }
    if (name.includes("arm64")) {
      return { os: "macOS", icon: <AppleIcon className="h-8 w-8 text-[var(--color-accent)]" />, recommended: "Apple Silicon", label: "Apple Silicon (ARM64)" };
    }
    return { os: "macOS", icon: <AppleIcon className="h-8 w-8 text-[var(--color-accent)]" />, recommended: "DMG", label: "macOS DMG" };
  }
  
  if (name.endsWith(".AppImage")) {
    return { os: "Linux", icon: <LinuxIcon className="h-8 w-8 text-[var(--color-accent)]" />, recommended: "AppImage", label: "AppImage (Universal)" };
  }
  
  if (name.endsWith(".deb")) {
    return { os: "Linux", icon: <LinuxIcon className="h-8 w-8 text-[var(--color-accent)]" />, recommended: "DEB", label: "Debian/Ubuntu (.deb)" };
  }
  
  if (name.endsWith(".rpm")) {
    return { os: "Linux", icon: <LinuxIcon className="h-8 w-8 text-[var(--color-accent)]" />, recommended: "RPM", label: "Fedora/RHEL (.rpm)" };
  }
  
  if (name.endsWith(".tar.gz")) {
    return { os: "Linux", icon: <LinuxIcon className="h-8 w-8 text-[var(--color-accent)]" />, recommended: "Tarball", label: "Tarball" };
  }
  
  return null;
}

interface PlatformEntry {
  os: string;
  icon: React.ReactNode;
  variants: Array<{ label: string; size: string; url: string; checksum: string; ext: string }>;
  recommended: string;
}

function groupAssetsByPlatform(release: GitHubRelease): PlatformEntry[] {
  const platforms: Record<string, { os: string; icon: React.ReactNode; variants: Array<{ label: string; size: string; url: string; checksum: string; ext: string }>; recommended: string }> = {};
  
  for (const asset of release.assets) {
    const platform = getPlatformFromAsset(asset);
    if (!platform) continue;
    
    if (!platforms[platform.os]) {
      platforms[platform.os] = {
        os: platform.os,
        icon: platform.icon,
        variants: [],
        recommended: platform.recommended,
      };
    }
    
    const platformEntry = platforms[platform.os]!;
    platformEntry.variants.push({
      label: platform.label,
      size: formatBytes(asset.size),
      url: asset.browser_download_url,
      checksum: "SHA256 available on release page",
      ext: asset.name.split(".").pop() || "",
    });
  }
  
  // Ensure consistent order: Windows, macOS, Linux
  const order = ["Windows", "macOS", "Linux"];
  return order.map((os) => platforms[os]).filter((p): p is PlatformEntry => p !== undefined);
}

export function DownloadCTAClient({ initialReleases }: DownloadCTAClientProps) {
  const latestRelease = initialReleases[0];
  const platforms = latestRelease ? groupAssetsByPlatform(latestRelease) : [];

  return (
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
            Native desktop app built with Tauri — fast, secure, and lightweight. No Electron bloat.
          </p>
        </div>

        {platforms.length > 0 ? (
          <div className="animate-slide-up grid gap-6 md:grid-cols-3" style={{ animationDelay: "0.2s" }}>
            {platforms.map((platform, index) => (
              <div key={platform.os} className="animate-slide-up" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <Card className="card-hover flex h-full flex-col p-6">
                  <div className="mb-4 flex items-center gap-3">
                    {platform.icon}
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
                      <div key={variant.label} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] p-3">
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
                      href={platform.variants[0]?.url ?? "#"}
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
        ) : (
          <div className="animate-slide-up text-center py-12">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-[var(--color-accent)]" />
            <p className="text-[var(--color-text-secondary)]">Loading releases from GitHub...</p>
            <a href="https://github.com/Vansh-Varshney-07/AI-Context-Studio/releases" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2">
              <Button variant="outline" size="lg">View All Releases on GitHub</Button>
            </a>
          </div>
        )}

        <div className="animate-slide-up mt-16 grid gap-8 lg:grid-cols-2" style={{ animationDelay: "0.4s" }}>
          <Card className="card-hover p-6">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[var(--color-text-primary)]">
              <FileText className="h-5 w-5 text-[var(--color-accent)]" />
              Source Code
            </h3>
            <p className="mb-4 text-[var(--color-text-secondary)]">
              Build from source or audit the codebase. MIT licensed.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded bg-[var(--color-bg-tertiary)] p-2 font-mono text-sm text-[var(--color-text-secondary)]">
                <span className="text-[var(--color-accent)]">$</span>
                <span>git clone https://github.com/Vansh-Varshney-07/AI-Context-Studio.git</span>
              </div>
              <div className="flex items-center gap-2 rounded bg-[var(--color-bg-tertiary)] p-2 font-mono text-sm text-[var(--color-text-secondary)]">
                <span className="text-[var(--color-accent)]">$</span>
                <span>cd AI-Context-Studio/desktop && npm install</span>
              </div>
              <div className="flex items-center gap-2 rounded bg-[var(--color-bg-tertiary)] p-2 font-mono text-sm text-[var(--color-text-secondary)]">
                <span className="text-[var(--color-accent)]">$</span>
                <span>npm run build && npm run tauri build</span>
              </div>
            </div>
            <Button variant="outline" className="mt-4">
              <Link
                href="https://github.com/Vansh-Varshney-07/AI-Context-Studio"
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
              All releases are signed and include SHA256 checksums. Verify integrity before installing.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 rounded bg-[var(--color-bg-tertiary)] p-3 text-[var(--color-text-secondary)]">
                <Hash className="h-4 w-4 text-[var(--color-accent)]" />
                <span className="font-mono">{"sha256sum <filename>"}</span>
              </div>
              <div className="flex items-center gap-2 rounded bg-[var(--color-bg-tertiary)] p-3 text-[var(--color-text-secondary)]">
                <Shield className="h-4 w-4 text-[var(--color-accent)]" />
                <span>Windows: Code-signed with EV certificate</span>
              </div>
              <div className="flex items-center gap-2 rounded bg-[var(--color-bg-tertiary)] p-3 text-[var(--color-text-secondary)]">
                <AppleIcon className="h-4 w-4 text-[var(--color-accent)]" />
                <span>macOS: Notarized by Apple</span>
              </div>
              <div className="flex items-center gap-2 rounded bg-[var(--color-bg-tertiary)] p-3 text-[var(--color-text-secondary)]">
                <LinuxIcon className="h-4 w-4 text-[var(--color-accent)]" />
                <span>Linux: GPG signed AppImages</span>
              </div>
            </div>
          </Card>
        </div>

        {initialReleases.length > 0 && (
          <div className="animate-slide-up mt-12" style={{ animationDelay: "0.6s" }}>
            <h3 className="mb-4 text-center text-xl font-semibold text-[var(--color-text-primary)]">
              Recent Releases
            </h3>
            <div className="mx-auto max-w-3xl space-y-3">
              {initialReleases.slice(0, 3).map((release, index) => (
                <div
                  key={release.tag_name}
                  className="animate-slide-up rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-[var(--color-accent)]">
                        {release.tag_name}
                      </span>
                      <Badge variant={release.prerelease ? "warning" : "success"}>{formatDate(release.published_at)}</Badge>
                    </div>
                  </div>
                  <p className="font-medium text-[var(--color-text-primary)]">{release.name || `Release ${release.tag_name}`}</p>
                  {release.body && (
                    <ul className="mt-2 space-y-1 text-sm text-[var(--color-text-secondary)]">
                      {release.body.split("\n").filter(line => line.trim().startsWith("-") || line.trim().startsWith("*")).slice(0, 3).map((line, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                          {line.replace(/^[-*]\s*/, "").trim()}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <div className="mt-4 text-center">
                <a
                  href="https://github.com/Vansh-Varshney-07/AI-Context-Studio/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--color-accent)] hover:underline"
                >
                  View all releases on GitHub →
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="animate-slide-up mt-12 text-center" style={{ animationDelay: "0.8s" }}>
          <p className="mb-4 text-[var(--color-text-secondary)]">
            Requirements: Windows 10 1903+ • macOS 12+ (Universal) • Linux glibc 2.31+, GTK 3.24+, WebKit2GTK 2.38+
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            RAM: Minimum 512 MB (2 GB recommended) • Disk: 200 MB for app + assets
          </p>
        </div>
      </div>
    </section>
  );
}