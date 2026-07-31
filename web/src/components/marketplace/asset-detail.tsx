'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Download,
  Star,
  Github,
  ExternalLink,
  Clock,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Share2,
  Heart,
  User,
  Verified,
  Package,
  Code,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const targetLabels: Record<string, string> = {
  Cursor: 'Cursor',
  'Claude Code': 'Claude Code',
  Windsurf: 'Windsurf',
  'VS Code': 'VS Code',
  Custom: 'Custom',
};

const kindLabels: Record<string, string> = {
  SKILL: 'Skill',
  PERSONA: 'Persona',
  TEMPLATE: 'Template',
  PROMPT_PACK: 'Prompt Pack',
  INSTRUCTION_FILE: 'Instruction File',
  WORKFLOW: 'Workflow',
  MCP_SERVER: 'MCP Server',
  COLLECTION: 'Collection',
  BUNDLE: 'Bundle',
};

const kindColors: Record<string, string> = {
  SKILL: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  PERSONA: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  TEMPLATE: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  PROMPT_PACK: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  INSTRUCTION_FILE: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  WORKFLOW: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  MCP_SERVER: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  COLLECTION: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  BUNDLE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

interface AssetWithRelations {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDesc: string | null;
  kind: string;
  authorId: string;
  categoryId: string;
  status: string;
  visibility: string;
  currentVersionId: string | null;
  downloads: number;
  stars: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  featured: boolean;
  deprecated: boolean;
  deprecationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  author: { id: string; name: string | null; username: string | null; avatar: string | null; bio: string | null };
  category: { id: string; slug: string; name: string; icon: string | null } | null;
  tags: Array<{ tag: { id: string; slug: string; name: string; color: string | null } }>;
  compatibilities: Array<{ target: string; minVersion: string | null; maxVersion: string | null; verified: boolean }>;
  versions: Array<{ id: string; version: string; changelog: string; readme: string | null; createdAt: Date; status: string; isPrerelease: boolean }>;
  screenshots: Array<{ url: string; alt: string | null; sortOrder: number }>;
  dependencies: Array<{
    id: string;
    versionRange: string;
    isOptional: boolean;
    type: string;
    dependency: { id: string; slug: string; name: string; kind: string; author: { username: string | null } };
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    title: string | null;
    content: string;
    createdAt: Date;
    user: { id: string; name: string | null; username: string | null; avatar: string | null };
  }>;
  _count: { reviews: number; downloads_: number };
}

export function AssetDetail({ asset }: { asset: AssetWithRelations }) {
  const [readmeExpanded, setReadmeExpanded] = useState(false);
  const [showFullChangelog, setShowFullChangelog] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyInstallCommand = () => {
    navigator.clipboard.writeText(`acs install ${asset.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const installCommand = `acs install ${asset.slug}`;
  const currentVersion = asset.versions[0];
  const tags = asset.tags.map((t) => t.tag);
  const compatibilities = asset.compatibilities;
  const dependencies = asset.dependencies;

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <nav
        className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]"
        aria-label="Breadcrumb"
      >
        <div className="container-app px-4 py-3">
          <ol className="flex items-center gap-2 text-sm" role="list">
            <li>
              <Link
                href="/"
                className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                Home
              </Link>
            </li>
            <li className="flex items-center gap-2 text-[var(--color-text-muted)]">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <Link
                href="/marketplace"
                className="transition-colors hover:text-[var(--color-text-primary)]"
              >
                Marketplace
              </Link>
            </li>
            <li className="flex items-center gap-2 text-[var(--color-text-muted)]">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <span className="max-w-[200px] truncate font-medium text-[var(--color-text-primary)]">
                {asset.name}
              </span>
            </li>
          </ol>
        </div>
      </nav>

      <div className="container-app flex-1 py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors',
                    kindColors[asset.kind] ||
                      'border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'
                  )}
                >
                  {kindLabels[asset.kind] || asset.kind}
                </span>
                {asset.verified && (
                  <Badge variant="outline" className="gap-1.5">
                    <Verified className="h-3 w-3" aria-hidden="true" />
                    Verified
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-[var(--color-text-primary)] lg:text-4xl">
                {asset.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" aria-hidden="true" />
                  <Link
                    href={`https://github.com/${asset.author.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    {asset.author.name || asset.author.username}
                  </Link>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={asset.updatedAt.toISOString()}>{formatDate(asset.updatedAt)}</time>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span>{asset.downloads.toLocaleString()} downloads</span>
                </div>
                {asset.category && (
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" aria-hidden="true" />
                    <Badge variant="outline" className="gap-1">
                      {asset.category.name}
                    </Badge>
                  </div>
                )}
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
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      Compatibility
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {compatibilities.map((target) => (
                        <Badge key={target.target} variant="outline" className="gap-1.5">
                          <Code className="h-3 w-3" aria-hidden="true" />
                          {targetLabels[target.target] || target.target}
                          {target.verified && <CheckCircle className="h-3 w-3 text-green-500" />}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag.id} variant="outline" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-[var(--color-border)] pt-6">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      Installation
                    </h3>
                    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] p-4">
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <code className="font-mono text-sm break-all text-[var(--color-text-primary)]">
                          {installCommand}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyInstallCommand}
                          className="flex-shrink-0"
                        >
                          {copied ? (
                            <>
                              <CheckCircle className="mr-1 h-4 w-4 text-[var(--color-success)]" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <span>Copy</span>
                              <ExternalLink className="ml-1 h-4 w-4" />
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
                      <Card
                        key={version.id}
                        className="p-4 transition-colors hover:border-[var(--color-border-strong)]"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-lg font-semibold text-[var(--color-accent)]">
                                v{version.version}
                              </span>
                              {index === 0 && <Badge variant="accent">Latest</Badge>}
                              {version.isPrerelease && <Badge variant="outline" className="text-xs">Pre-release</Badge>}
                              <Badge variant="outline" className="text-xs capitalize">{version.status.toLowerCase()}</Badge>
                            </div>
                            <time className="text-sm text-[var(--color-text-muted)]">
                              {formatDate(version.createdAt)}
                            </time>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              View Details <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3 line-clamp-2 text-sm text-[var(--color-text-secondary)]">
                          {version.changelog}
                        </div>
                        {version.readme && (
                          <div className="mt-3 line-clamp-2 text-sm text-[var(--color-text-secondary)]">
                            {version.readme}
                          </div>
                        )}
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
                            <ChevronUp className="mr-1 h-4 w-4" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="mr-1 h-4 w-4" />
                            Show All {asset.versions.length} Versions
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="dependencies" className="mt-6">
                  <div className="space-y-4">
                    {dependencies.length === 0 ? (
                      <p className="text-[var(--color-text-secondary)]">
                        This asset has no declared dependencies. It can be installed independently.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {dependencies.map((dep) => (
                          <Card key={dep.id} className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Link
                                  href={`/marketplace/${dep.dependency.slug}`}
                                  className="font-mono font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)]"
                                >
                                  {dep.dependency.name}
                                </Link>
                                <Badge variant="outline" className="text-xs">{dep.dependency.kind}</Badge>
                                <span className="text-xs text-[var(--color-text-muted)]">by @{dep.dependency.author.username}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">{dep.versionRange}</Badge>
                                {dep.isOptional && <Badge variant="outline" className="text-xs">Optional</Badge>}
                                <Badge variant="outline" className="text-xs capitalize">{dep.type.toLowerCase()}</Badge>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}

                    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] p-4">
                      <h4 className="mb-2 font-medium text-[var(--color-text-primary)]">
                        Transitive Dependencies
                      </h4>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Dependencies are resolved automatically during installation. A lockfile pins exact versions.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="readme" className="mt-6">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div
                      className={cn(
                        'rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] p-6',
                        readmeExpanded ? 'max-h-none' : 'max-h-96 overflow-hidden'
                      )}
                    >
                      <div className="space-y-4 text-[var(--color-text-secondary)]">
                        {currentVersion?.readme ? (
                          <div dangerouslySetInnerHTML={{ __html: currentVersion.readme }} />
                        ) : (
                          <>
                            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                              {asset.name}
                            </h2>
                            <p>{asset.description}</p>
                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                              Installation
                            </h3>
                            <pre className="overflow-x-auto rounded border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
                              <code className="font-mono text-sm">{installCommand}</code>
                            </pre>
                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                              Usage
                            </h3>
                            <p>
                              Import and use this {kindLabels[asset.kind]?.toLowerCase() || 'asset'} in
                              your AI Context Studio workspace.
                            </p>
                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                              Compatibility
                            </h3>
                            <ul className="list-inside list-disc space-y-1">
                              {compatibilities.map((target) => (
                                <li key={target.target}>{targetLabels[target.target] || target.target}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-4"
                        onClick={() => setReadmeExpanded(!readmeExpanded)}
                      >
                        {readmeExpanded ? (
                          <>
                            <ChevronUp className="mr-1 h-4 w-4" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="mr-1 h-4 w-4" />
                            Read Full README
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <aside className="space-y-6 lg:col-span-1">
              <Card className="sticky top-24 space-y-6 p-6">
                <div className="flex items-start gap-4">
                  {asset.screenshots[0] && (
                    <Image
                      src={asset.screenshots[0].url}
                      alt=""
                      width={64}
                      height={64}
                      className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                      aria-hidden="true"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-[var(--color-text-primary)]">
                      {asset.name}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)]">by {asset.author.name || asset.author.username}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">Rating</span>
                    <div className="flex items-center gap-2">
                      <Star
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                        aria-hidden="true"
                      />
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {asset.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-[var(--color-text-muted)]">
                        ({asset.reviewCount})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">Downloads</span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {asset.downloads.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">Last Updated</span>
                    <time
                      className="font-medium text-[var(--color-text-primary)]"
                      dateTime={asset.updatedAt.toISOString()}
                    >
                      {formatDate(asset.updatedAt)}
                    </time>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">Version</span>
                    <span className="font-mono font-medium text-[var(--color-text-primary)]">
                      v{currentVersion?.version || '1.0.0'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
                  <Button
                    className="w-full justify-center gap-2"
                    onClick={copyInstallCommand}
                  >
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
                    <Link
                      href={`https://github.com/${asset.author.username}/${asset.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4" />
                      View on GitHub
                    </Link>
                  </Button>
                </div>

                <div className="border-t border-[var(--color-border)] pt-4">
                  <h4 className="mb-3 font-medium text-[var(--color-text-primary)]">Share</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="mr-1 h-4 w-4" /> Share
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Heart className="mr-1 h-4 w-4" /> Save
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