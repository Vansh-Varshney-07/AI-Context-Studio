"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Download,
  Star,
  Github,
  ExternalLink,
  Tag,
  Clock,
  CheckCircle,
  Code,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Share2,
  Heart,
  Eye,
  User,
  Verified,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Asset } from "@/data/marketplace";

const targetLabels: Record<string, string> = {
  "Cursor": "Cursor",
  "Claude Code": "Claude Code",
  "Windsurf": "Windsurf",
  "VS Code": "VS Code",
  "Custom": "Custom",
};

const kindLabels: Record<string, string> = {
  Skill: "Skill",
  Persona: "Persona",
  Template: "Template",
  "Prompt Pack": "Prompt Pack",
  "Instruction File": "Instruction File",
  Workflow: "Workflow",
  "MCP Server": "MCP Server",
  Collection: "Collection",
  Bundle: "Bundle",
};

const kindColors: Record<string, string> = {
  Skill: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Persona: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  Template: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Prompt Pack": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  "Instruction File": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  Workflow: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  "MCP Server": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  Collection: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Bundle: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

export function AssetDetail({ asset }: { asset: Asset }) {
  const [readmeExpanded, setReadmeExpanded] = useState(false);
  const [showFullChangelog, setShowFullChangelog] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyInstallCommand = () => {
    navigator.clipboard.writeText(`acs install ${asset.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const installCommand = `acs install ${asset.id}`;

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <nav className="border-b border-[var(--color-border)] bg-[var(--color-bg-surface)] sticky top-0 z-50" aria-label="Breadcrumb">
        <div className="container-app px-4 py-3">
          <ol className="flex items-center gap-2 text-sm" role="list">
            <li>
              <Link href="/" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-2 text-[var(--color-text-muted)]">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <Link href="/marketplace" className="hover:text-[var(--color-text-primary)] transition-colors">
                Marketplace
              </Link>
            </li>
            <li className="flex items-center gap-2 text-[var(--color-text-muted)]">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <span className="text-[var(--color-text-primary)] font-medium truncate max-w-[200px]">{asset.name}</span>
            </li>
          </ol>
        </div>
      </nav>

      <div className="container-app py-8 lg:py-12 flex-1">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors whitespace-nowrap", kindColors[asset.kind] || "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]")}>
                  {kindLabels[asset.kind] || asset.kind}
                </span>
                {asset.verified && (
                  <Badge variant="outline" className="gap-1.5">
                    <Verified className="h-3 w-3" aria-hidden="true" />
                    Verified
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)]">
                {asset.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" aria-hidden="true" />
                  <Link
                    href={`https://github.com/${asset.author}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    {asset.author}
                  </Link>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={asset.updatedAt}>{formatDate(asset.updatedAt)}</time>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span>{asset.downloads.toLocaleString()} downloads</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" aria-hidden="true" />
                  <Badge variant="outline" className="gap-1">
                    {asset.category}
                  </Badge>
                </div>
              </div>
            </header>

            <div className="border-t border-[var(--color-border)] pt-8">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="versions">Versions</TabsTrigger>
                  <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
                  <TabsTrigger value="readme">README</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-6">
                  <div className="prose prose-lg dark:prose-invert max-w-none text-[var(--color-text-secondary)]">
                    <p>{asset.description}</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Compatibility</h3>
                    <div className="flex flex-wrap gap-2">
                      {asset.compatibility.map((target) => (
                        <Badge key={target} variant="outline" className="gap-1.5">
                          <Code className="h-3 w-3" aria-hidden="true" />
                          {targetLabels[target] || target}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {asset.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-[var(--color-border)] pt-6">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Installation</h3>
                    <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg p-4">
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <code className="font-mono text-sm text-[var(--color-text-primary)] break-all">
                          {installCommand}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(installCommand);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="flex-shrink-0"
                        >
                          {copied ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1 text-[var(--color-success)]" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <span>Copy</span>
                              <ExternalLink className="h-4 w-4 ml-1" />
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Run this command in your terminal. Requires AI Context Studio CLI.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="versions" className="mt-6 space-y-4">
                  <div className="space-y-3">
                    {asset.versions.map((version, index) => (
                      <Card key={version.version} className="p-4 hover:border-[var(--color-border-strong)] transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-semibold text-lg text-[var(--color-accent)]">
                                v{version.version}
                              </span>
                              {index === 0 && (
                                <Badge variant="accent">Latest</Badge>
                              )}
                            </div>
                            <time className="text-sm text-[var(--color-text-muted)]">
                              {formatDate(version.date)}
                            </time>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Link href={`/marketplace/${asset.id}?version=${version.version}`}>
                                View Details
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-[var(--color-text-secondary)] line-clamp-2">
                          {version.changelog}
                        </div>
                      </Card>
                    ))}
                    {asset.versions.length > 5 && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowFullChangelog(!showFullChangelog)}
                      >
                        {showFullChangelog ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Show All {asset.versions.length} Versions
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="dependencies" className="mt-6">
                  <div className="space-y-4">
                    <p className="text-[var(--color-text-secondary)]">
                      This asset has no declared dependencies. It can be installed independently.
                    </p>
                    <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg p-4">
                      <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Transitive Dependencies</h4>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        No transitive dependencies detected. This asset is self-contained.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="readme" className="mt-6">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div className={cn(
                      "bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg p-6",
                      readmeExpanded ? "max-h-none" : "max-h-96 overflow-hidden"
                    )}>
                      <div className="space-y-4 text-[var(--color-text-secondary)]">
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                          {asset.name}
                        </h2>
                        <p>{asset.description}</p>
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Installation</h3>
                        <pre className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded p-4 overflow-x-auto">
                          <code className="font-mono text-sm">{installCommand}</code>
                        </pre>
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Usage</h3>
                        <p>Import and use this {kindLabels[asset.kind]?.toLowerCase() || "asset"} in your AI Context Studio workspace.</p>
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Compatibility</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {asset.compatibility.map((target) => (
                            <li key={target}>{targetLabels[target] || target}</li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-4"
                        onClick={() => setReadmeExpanded(!readmeExpanded)}
                      >
                        {readmeExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Read Full README
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <aside className="lg:col-span-1 space-y-6">
              <Card className="p-6 sticky top-24 space-y-6">
                <div className="flex items-start gap-4">
                  {asset.thumbnail && (
                    <img
                      src={asset.thumbnail}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--color-text-primary)] truncate">{asset.name}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">by {asset.author}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">Rating</span>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                      <span className="font-semibold text-[var(--color-text-primary)]">{asset.rating.toFixed(1)}</span>
                      <span className="text-sm text-[var(--color-text-muted)]">({asset.reviewCount})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">Downloads</span>
                    <span className="font-semibold text-[var(--color-text-primary)]">{asset.downloads.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">Last Updated</span>
                    <time className="font-medium text-[var(--color-text-primary)]" dateTime={asset.updatedAt}>
                      {formatDate(asset.updatedAt)}
                    </time>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">Version</span>
                    <span className="font-mono font-medium text-[var(--color-text-primary)]">v{asset.version}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[var(--color-border)]">
                  <Button className="w-full justify-center gap-2" onClick={() => {
                    navigator.clipboard.writeText(installCommand);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}>
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-[var(--color-success)]" />
                        Copied to Clipboard
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Install via CLI
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="w-full justify-center gap-2">
                    <Link href={`https://github.com/${asset.author}/${asset.id}`} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      View on GitHub
                    </Link>
                  </Button>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)]">
                  <h4 className="font-medium text-[var(--color-text-primary)] mb-3">Share</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="h-4 w-4 mr-1" /> Share
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Heart className="h-4 w-4 mr-1" /> Save
                    </Button>
                  </div>
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}