"use client";

import { MotionDiv } from "@/components/ui/motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Star,
  Download,
  ExternalLink,
  Zap,
  Bot,
  FileText,
  Package,
  GitBranch,
  Server,
  Layers,
  Boxes,
} from "lucide-react";

interface Asset {
  id: string;
  name: string;
  description: string;
  shortDesc: string | null;
  category: { id: string; slug: string; name: string; icon: string | null } | null;
  downloads: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  featured: boolean;
  tags: string[];
}

interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  _count?: { assets: number };
}

interface MarketplacePreviewClientProps {
  initialAssets: Asset[];
  initialCategories: Category[];
}

const categoryIcons: Record<string, typeof Search> = {
  skills: Zap,
  personas: Bot,
  templates: FileText,
  "prompt-packs": Package,
  "instruction-files": FileText,
  workflows: GitBranch,
  "mcp-servers": Server,
  collections: Layers,
  bundles: Boxes,
};

export function MarketplacePreviewClient({ initialAssets, initialCategories }: MarketplacePreviewClientProps) {
  const assets = initialAssets;
  const categories = initialCategories;

  return (
    <section
      id="marketplace"
      className="section bg-[var(--color-bg-secondary)]"
      aria-labelledby="marketplace-heading"
    >
      <div className="container-app">
        <MotionDiv
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2
            id="marketplace-heading"
            className="mb-4 text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl"
          >
            Marketplace — Discover & Share Assets
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--color-text-secondary)]">
            {assets.length > 0
              ? "Browse community-curated skills, personas, templates, and workflows. One-click install to your desktop app."
              : "No assets published yet. Be the first to share your work!"}
          </p>
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            {categories.slice(0, 8).map((cat) => {
              const Icon = categoryIcons[cat.slug as keyof typeof categoryIcons] || Search;
              const count = cat._count?.assets || 0;
              return (
                <Badge key={cat.slug} variant="outline" className="gap-1.5">
                  <Icon className="h-3 w-3" />
                  {cat.name} <span className="text-[var(--color-text-muted)]">({count})</span>
                </Badge>
              );
            })}
          </div>
        </MotionDiv>

        {assets.length > 0 ? (
          <MotionDiv
            className="grid gap-6 lg:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {assets.slice(0, 3).map((asset, index) => (
              <MotionDiv
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-hover flex h-full flex-col p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Badge variant={asset.verified ? "accent" : "outline"} className="gap-1">
                      {asset.verified && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                      )}
                      {(asset.category?.name ?? (asset.category?.slug ? asset.category.slug.charAt(0).toUpperCase() + asset.category.slug.slice(1).replace("-", " ") : "Unknown"))}
                    </Badge>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {asset.downloads.toLocaleString()} downloads
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">
                    {asset.name}
                  </h3>
                  <p className="mb-4 flex-1 text-[var(--color-text-secondary)]">
                    {asset.description}
                  </p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {asset.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center gap-4 border-t border-[var(--color-border)] pt-4">
                    <div className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                      <Star className="h-4 w-4 text-[var(--color-warning)]" fill="currentColor" />
                      <span>{asset.rating}</span>
                      <span className="text-[var(--color-text-muted)]">({asset.reviewCount})</span>
                    </div>
                    {asset.featured && (
                      <Badge variant="dot" dotColor="accent" className="ml-auto text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="mr-1 h-4 w-4" />
                      Install
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </MotionDiv>
            ))}
          </MotionDiv>
        ) : (
          <div className="mt-8">
            <p className="text-center text-[var(--color-text-secondary)] mb-4">
              No assets published yet. Be the first to share your work!
            </p>
            <div className="text-center">
              <a href="https://github.com/Vansh-Varshney-07/AI-Context-Studio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                <Button size="lg" variant="outline">Contribute on GitHub</Button>
              </a>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <a href="/marketplace" className="inline-flex items-center gap-2">
            <Button size="lg">Explore Marketplace</Button>
            <span className="text-sm text-[var(--color-text-muted)]">
              {categories.reduce((sum, cat) => sum + (cat._count?.assets || 0), 0)} assets
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}