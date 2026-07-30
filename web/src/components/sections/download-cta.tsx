"use client";

import Link from "next/link";
import { Download, Monitor, FileText, Shield, Hash, ExternalLink, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { downloads, sourceCode, releaseNotes, systemRequirements } from "@/data/downloads";
import { AppleIcon, LinuxIcon } from "@/components/icons/platform-icons";

export function DownloadCTA() {
  return (
    <section id="download" className="section bg-[var(--color-bg-secondary)]" aria-labelledby="download-heading">
      <div className="container-app">
        <div className="text-center mb-16 animate-slide-up">
          <h2 id="download-heading" className="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            Download for Your Platform
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Native desktop app built with Tauri — fast, secure, and lightweight. No Electron bloat.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          {downloads.map((platform, index) => (
            <div key={platform.os} className="animate-slide-up" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
              <Card className="card-hover h-full p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  {platform.os === "Windows" && <Monitor className="h-8 w-8 text-[var(--color-accent)]" />}
                  {platform.os === "macOS" && <AppleIcon className="h-8 w-8 text-[var(--color-accent)]" />}
                  {platform.os === "Linux" && <LinuxIcon className="h-8 w-8 text-[var(--color-accent)]" />}
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">{platform.os}</h3>
                    <Badge variant="accent" className="text-xs">{platform.recommended}</Badge>
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  {platform.variants.map((variant) => (
                    <div key={variant.label} className="p-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-[var(--color-text-primary)]">{variant.label}</span>
                        <span className="text-sm text-[var(--color-text-muted)] font-mono">{variant.size}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-mono">
                        <span className="flex-1 truncate">{variant.checksum}</span>
                        <Badge variant="outline" className="text-xs">{variant.ext}</Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full">
                  <Link href={platform.variants[0]?.url ?? "#"} className="inline-flex items-center gap-2 w-full justify-center">
                    <Download className="h-4 w-4 mr-2" />
                    Download {platform.recommended}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </Card>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2 mt-16 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <Card className="card-hover p-6">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[var(--color-accent)]" />
              Source Code
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-4">Build from source or audit the codebase. MIT licensed.</p>
            <div className="space-y-2">
              {sourceCode.instructions.map((inst, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-mono text-[var(--color-text-secondary)] bg-[var(--color-bg-tertiary)] p-2 rounded">
                  <span className="text-[var(--color-accent)]">$</span>
                  <span>{inst}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4">
              <Link href={sourceCode.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                View on GitHub <ExternalLink className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </Card>

          <Card className="card-hover p-6">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-[var(--color-accent)]" />
              Verify Downloads
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-4">All releases are signed and include SHA256 checksums. Verify integrity before installing.</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-[var(--color-text-secondary)] bg-[var(--color-bg-tertiary)] p-3 rounded">
                <Hash className="h-4 w-4 text-[var(--color-accent)]" />
                <span className="font-mono">sha256sum ai-context-studio-1.0.0-x64.AppImage</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-text-secondary)] bg-[var(--color-bg-tertiary)] p-3 rounded">
                <Shield className="h-4 w-4 text-[var(--color-accent)]" />
                <span>Windows: Code-signed with EV certificate</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-text-secondary)] bg-[var(--color-bg-tertiary)] p-3 rounded">
                <AppleIcon className="h-4 w-4 text-[var(--color-accent)]" />
                <span>macOS: Notarized by Apple</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-12 animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 text-center">Recent Releases</h3>
          <div className="max-w-3xl mx-auto space-y-3">
            {releaseNotes.slice(0, 3).map((release, index) => (
              <div
                key={release.version}
                className="p-4 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg animate-slide-up"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-[var(--color-accent)]">v{release.version}</span>
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
            <div className="text-center mt-4">
              <a href="/changelog" className="text-[var(--color-accent)] hover:underline font-medium">
                View full changelog →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center animate-slide-up" style={{ animationDelay: "0.8s" }}>
          <p className="text-[var(--color-text-secondary)] mb-4">
            Requirements: {systemRequirements.windows} • {systemRequirements.macos} • {systemRequirements.linux}
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            RAM: {systemRequirements.memory} • Disk: {systemRequirements.disk}
          </p>
        </div>
      </div>
    </section>
  );
}