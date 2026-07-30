"use client";

import { MotionDiv } from "@/components/ui/motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Tag, Star, Download, ExternalLink, Zap, Bot, FileText, Package, GitBranch, Server, Layers, Boxes, Check } from "lucide-react";
import { marketplaceCategories, featuredAssets } from "@/data/marketplace";

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

export function MarketplacePreview() {
  return (
    <section id="marketplace" className="section bg-[var(--color-bg-secondary)]" aria-labelledby="marketplace-heading">
      <div className="container-app">
        <MotionDiv
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 id="marketplace-heading" className="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            Marketplace — Discover & Share Assets
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8">
            Browse 3,400+ community-curated skills, personas, templates, and workflows. One-click install to your desktop app.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {marketplaceCategories.slice(0, 8).map((cat) => {
              const Icon = categoryIcons[cat.id as keyof typeof categoryIcons] || Search;
              return (
                <Badge key={cat.id} variant="outline" className="gap-1.5">
                  <Icon className="h-3 w-3" />
                  {cat.label} <span className="text-[var(--color-text-muted)]">({cat.count})</span>
                </Badge>
              );
            })}
          </div>
        </MotionDiv>

        <MotionDiv
          className="grid gap-6 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {featuredAssets.slice(0, 3).map((asset, index) => (
            <MotionDiv
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-hover h-full flex flex-col p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant={asset.verified ? "accent" : "outline"} className="gap-1">
                    {asset.verified && <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />}
                    {asset.category.charAt(0).toUpperCase() + asset.category.slice(1).replace("-", " ")}
                  </Badge>
                  <span className="text-xs text-[var(--color-text-muted)]">{asset.downloads.toLocaleString()} downloads</span>
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">{asset.title}</h3>
                <p className="text-[var(--color-text-secondary)] mb-4 flex-1">{asset.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {asset.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-[var(--color-border)]">
                  <div className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                    <Star className="h-4 w-4 text-[var(--color-warning)]" fill="currentColor" />
                    <span>{asset.rating}</span>
                    <span className="text-[var(--color-text-muted)]">({asset.reviewCount})</span>
                  </div>
                  {asset.featured && (
                    <Badge variant="dot" dotColor="accent" className="text-xs ml-auto">
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-1" />
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

        <div className="mt-12 text-center">
          <a href="/marketplace" className="inline-flex items-center gap-2">
            <Button size="lg">Explore Marketplace</Button>
            <span className="text-sm text-[var(--color-text-muted)]">3,400+ assets</span>
          </a>
        </div>
      </div>
    </section>
  );
}