"use client";

import { motion } from "framer-motion";
import {
  BookText,
  Brain,
  GitBranch,
  Search,
  Plus,
  Filter,
  Pin,
  Star,
  Tag as TagIcon,
  Copy,
  Download,
  Zap,
  Settings,
  ChevronLeft,
  X,
  MoreHorizontal,
  FileText,
  Book,
  Bookmark,
} from "lucide-react";
import * as React from "react";
import { useState } from "react";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Card } from "@components/ui/card";
import { ScrollArea } from "@components/ui/scroll-area";
import { Tag } from "@components/common/tag";
import { EmptyState } from "@components/common/empty-state";
import { moduleTransition } from "@components/motion";
import { useToast } from "@providers/toaster-provider";
import { cn } from "@utils/cn";
import { copyToClipboard, downloadFile } from "@utils";

import { MEMORY_TYPES, DEFAULT_COLLECTIONS } from "./data";
import type { MemoryBlock, MemoryCollection, MemoryType } from "./types";

const MEMORY_TYPE_LABELS: Record<string, string> = {
  context: "Context",
  knowledge: "Knowledge",
  decision: "Decision",
  standard: "Standard",
  reference: "Reference",
};

export function MemoriesModule() {
  const [search, setSearch] = React.useState("");
  const [selectedCollection, setSelectedCollection] = React.useState<MemoryCollection | null>(null);
  const [selectedBlock, setSelectedBlock] = React.useState<MemoryBlock | null>(null);
  const [selectedType, setSelectedType] = React.useState<MemoryType | "all">("all");
  const [showPinnedOnly, setShowPinnedOnly] = React.useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const { toast } = useToast();

  const allBlocks = React.useMemo(() => {
    return DEFAULT_COLLECTIONS.flatMap((c) => c.blocks);
  }, []);

  const filteredBlocks = React.useMemo(() => {
    return allBlocks.filter((block) => {
      if (selectedType !== "all" && block.type !== selectedType) return false;
      if (showPinnedOnly && !block.pinned) return false;
      if (showFavoritesOnly && !block.favorite) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const haystack = `${block.title} ${block.content} ${block.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [allBlocks, selectedType, showPinnedOnly, showFavoritesOnly, search]);

  return (
    <motion.div
      variants={moduleTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid h-full grid-cols-[18rem_minmax(0,1fr)] overflow-hidden"
    >
      <aside className="flex h-full flex-col border-r border-border bg-bg-secondary overflow-hidden">
        <div className="flex flex-col gap-3 p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
            <Input
              placeholder="Search memories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              size="sm"
            />
          </div>
          <div className="space-y-1">
            <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">Types</p>
            {["all", ...MEMORY_TYPES.map((t) => t.type)].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type as any)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                  selectedType === type
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                }`}
              >
{type !== "all" && (
                  <span className="size-2 rounded-full bg-accent/20" />
                )}
                <span className="truncate flex-1 capitalize">{type === "all" ? "All Types" : type}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-border space-y-1">
            <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">Filters</p>
            <FilterToggle
              label="Pinned only"
              icon={Pin}
              active={showPinnedOnly}
              onToggle={setShowPinnedOnly}
            />
            <FilterToggle
              label="Favorites only"
              icon={Star}
              active={showFavoritesOnly}
              onToggle={setShowFavoritesOnly}
            />
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 p-3">
              {DEFAULT_COLLECTIONS.map((collection) => (
                <div key={collection.id} className="space-y-1">
                  <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    {collection.name} ({collection.blocks.length})
                  </p>
                  {collection.blocks.map((block) => {
                    return (
                      <MemoryBlockItem
                        key={block.id}
                        block={block}
                        active={selectedBlock?.id === block.id}
                        onClick={() => setSelectedBlock(block)}
                      />
                    );
                  })}
                </div>
              ))}
            {filteredBlocks.length === 0 && search && (
              <>
                <div className="flex h-full items-center justify-center p-6">
                  <EmptyState
                    icon={Search}
                    title="No memories found"
                    description="Adjust your search or filters to see results."
                  />
                </div>
              </>
            )}
            </div>
            </ScrollArea>
        </div>
      </aside>

      <section className="flex h-full flex-col overflow-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <BookText className="size-4" />
            </span>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-text-primary">Memories & Context</h1>
              <p className="text-xs text-text-muted">Long-running context and knowledge blocks</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setCreating(true)} size="sm">
              <Plus className="mr-1.5 size-3.5" />
              New Memory
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          {selectedBlock ? (
            <MemoryDetailPane
              block={selectedBlock}
              onClose={() => setSelectedBlock(null)}
              onEdit={() => {}}
              onDelete={() => toast({ title: "Delete not implemented yet", variant: "warning" })}
            />
          ) : creating ? (
            <MemoryBuilderPane onClose={() => setCreating(false)} onSubmit={() => { setCreating(false); toast({ title: "Created", variant: "success" }) }} />
          ) : (
            <MemoriesGrid blocks={filteredBlocks} onSelect={setSelectedBlock} creating={creating} onCreateClose={() => setCreating(false)} />
          )}
        </div>
      </section>
    </motion.div>
  );
}

function MemoryBlockItem({ block, active, onClick }: { block: MemoryBlock; active: boolean; onClick: () => void }) {
  const typeInfo = MEMORY_TYPES.find((t) => t.type === block.type);
      const TypeIcon = typeInfo?.icon;
      return (
        <button
          type="button"
          onClick={onClick}
          className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
            active
              ? "bg-accent/10 text-text-primary"
              : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
          }`}
        >
          <span className="size-6 shrink-0 flex items-center justify-center rounded-md bg-accent/10 text-accent">
            {TypeIcon && <TypeIcon className="size-3.5" />}
          </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <p className="truncate font-medium">{block.title}</p>
          {block.pinned && <Pin className="size-3 shrink-0 text-accent" />}
          {block.favorite && <Star className="size-3 shrink-0 text-amber-500" />}
        </div>
        <p className="truncate text-xs text-text-muted mt-0.5">{block.content.slice(0, 80)}…</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {block.tags.slice(0, 2).map((t) => (
            <Tag key={t} variant="muted" className="text-[9px]">{t}</Tag>
          ))}
          {block.tags.length > 2 && <Tag variant="muted" className="text-[9px]">+{block.tags.length - 2}</Tag>}
        </div>
      </div>
    </button>
  );
}

function FilterToggle({ label, icon: Icon, active, onToggle }: { label: string; icon: React.ComponentType<{ className?: string }>; active: boolean; onToggle: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(!active)}
      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
        active
          ? "bg-accent/10 text-accent"
          : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
      }`}
    >
      <Icon className="size-3.5 shrink-0" />
      <span className="truncate">{label}</span>
      {active && <span className="ml-auto size-1.5 rounded-full bg-accent" />}
    </button>
  );
}

function MemoriesGrid({
  blocks,
  onSelect,
  creating,
  onCreateClose,
}: {
  blocks: MemoryBlock[];
  onSelect: (b: MemoryBlock) => void;
  creating: boolean;
  onCreateClose: () => void;
}) {
  if (creating) {
    return <MemoryBuilderPane onClose={onCreateClose} onSubmit={() => {}} />;
  }

  if (blocks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState icon={BookText} title="No memories yet" description="Create your first memory block to get started." />
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 p-4 overflow-y-auto">
      {blocks.map((block) => {
        const typeInfo = MEMORY_TYPES.find((t) => t.type === block.type);
        return (
          <motion.article
            key={block.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group flex h-full flex-col rounded-xl border border-border-subtle bg-bg-primary p-4 transition-all hover:border-border hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                {typeInfo?.icon && <typeInfo.icon className="size-4" />}
              </span>
              <div className="flex items-center gap-1 ml-auto">
                {block.pinned && <Pin className="size-3.5 text-accent" />}
                {block.favorite && <Star className="size-3.5 text-amber-500" />}
              </div>
            </div>
            <h3 className="font-medium text-text-primary mb-1">{block.title}</h3>
            <p className="text-sm text-text-muted mb-3 line-clamp-3">{block.content}</p>
            <div className="mt-auto flex flex-wrap gap-1">
              <Tag variant="muted" className="text-[10px] capitalize">{MEMORY_TYPE_LABELS[block.type]}</Tag>
              {block.tags.slice(0, 3).map((t) => (
                <Tag key={t} variant="default" className="text-[9px]">{t}</Tag>
              ))}
              {block.tags.length > 3 && (
                <Tag variant="muted" className="text-[9px]">+{block.tags.length - 3}</Tag>
              )}
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}

function MemoryDetailPane({
  block,
  onClose,
  onEdit,
  onDelete,
}: {
  block: MemoryBlock;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const typeInfo = MEMORY_TYPES.find((t) => t.type === block.type);
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <button type="button" onClick={onClose} className="p-1 rounded hover:bg-bg-secondary transition-colors" aria-label="Back">
          <ChevronLeft className="size-4 rotate-180 text-text-muted" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-primary">{block.title}</p>
          <p className="truncate text-xs text-text-muted">{MEMORY_TYPE_LABELS[block.type]}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-error hover:text-error">Delete</Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">Type</p>
            <Tag variant="accent" className="text-xs capitalize">{MEMORY_TYPE_LABELS[block.type]}</Tag>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">Tags</p>
            <div className="flex flex-wrap gap-1">
              {block.tags.map((t) => (
                <Tag key={t} variant="default" className="text-[10px]">{t}</Tag>
              ))}
            </div>
          </div>

          {block.pinned && (
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Pin className="size-3 text-accent" />
              Pinned
            </div>
          )}
          {block.favorite && (
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Star className="size-3 text-amber-500" />
              Favorite
            </div>
          )}

          <div className="space-y-2 pt-4 border-t border-border">
            <p className="text-sm font-medium text-text-secondary">Content</p>
            <div className="rounded-lg border border-border bg-bg-secondary p-4">
              <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-text-secondary">{block.content}</pre>
            </div>
          </div>

          <div className="space-y-2 text-xs text-text-muted">
            <p>Created: {new Date(block.createdAt).toLocaleDateString()}</p>
            <p>Updated: {new Date(block.updatedAt).toLocaleDateString()}</p>
            {block.source && <p>Source: {block.source}</p>}
          </div>
        </div>
      </div>

      <div className="border-t border-border p-4 bg-bg-secondary/60">
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="ghost" onClick={onEdit}>Edit</Button>
          <Button variant="ghost" className="text-error hover:text-error" onClick={onDelete}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

function MemoryBuilderPane({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [type, setType] = React.useState<MemoryType>("context");
  const [tags, setTags] = React.useState("");
  const [pinned, setPinned] = React.useState(false);
  const [favorite, setFavorite] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, type, tags, pinned, favorite });
  };

  return (
    <div className="flex h-full items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl rounded-xl border border-border bg-bg-primary p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Create New Memory</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-bg-secondary transition-colors" aria-label="Close">
            <X className="size-4 text-text-muted" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ title, content, type, tags, pinned, favorite }); }} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="memory-title">Title</Label>
            <Input id="memory-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Project Overview" required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="memory-type">Type</Label>
            <select
              id="memory-type"
              value={type}
              onChange={(e) => setType(e.target.value as MemoryType)}
              className="flex w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {MEMORY_TYPES.map((t) => (
                <option key={t.type} value={t.type}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="memory-content">Content</Label>
            <textarea
              id="memory-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="flex w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus resize-none"
              placeholder="Enter memory content…"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="memory-tags">Tags (comma separated)</Label>
            <Input id="memory-tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="context, architecture, decisions" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="memory-pinned">Pin to top</Label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="memory-pinned"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
                className="rounded border-border text-accent focus-visible:ring-2 focus-visible:ring-focus"
              />
              <Label htmlFor="memory-pinned" className="text-sm text-text-secondary cursor-pointer">Pin this memory to the top of lists</Label>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="memory-favorite">Favorite</Label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="memory-favorite"
                checked={favorite}
                onChange={(e) => setFavorite(e.target.checked)}
                className="rounded border-border text-accent focus-visible:ring-2 focus-visible:ring-focus"
              />
              <Label htmlFor="memory-favorite" className="text-sm text-text-secondary cursor-pointer">Mark as favorite</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">
              <Zap className="mr-1.5 size-3.5" />
              Create Memory
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

