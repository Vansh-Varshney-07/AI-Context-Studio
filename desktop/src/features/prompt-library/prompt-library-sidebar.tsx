"use client";

import { motion } from "framer-motion";
import { Search, Star, Clock, Tag, ChevronRight } from "lucide-react";
import * as React from "react";
import { useState } from "react";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { SEED_PROMPTS } from "./seed";
import { PROMPT_SUBCATEGORIES } from "@constants/prompt-categories";
import type { PromptCategory } from "@/shared/types/domain";
import type { PromptTemplate } from "./types";
import { cn } from "@utils/cn";

interface PromptLibrarySidebarProps {
  category: PromptCategory;
  subcategory: string;
  onCategoryChange: (cat: PromptCategory) => void;
  onSubcategoryChange: (sub: string) => void;
  onPromptSelect: (prompt: PromptTemplate) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function PromptLibrarySidebar({
  category,
  subcategory,
  onCategoryChange,
  onSubcategoryChange,
  onPromptSelect,
  searchQuery,
  onSearchChange,
}: PromptLibrarySidebarProps) {
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [recentOnly, setRecentOnly] = useState(false);

  const filtered = React.useMemo(() => {
    let list = SEED_PROMPTS.filter((p) => p.category === category);
    if (subcategory !== "All") {
      list = list.filter((p) => p.subcategory === subcategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (favoritesOnly) list = list.filter((p) => p.favorite);
    if (recentOnly) list = list.slice(0, 10);
    return list;
  }, [category, subcategory, searchQuery, favoritesOnly, recentOnly]);

  return (
    <aside className="flex h-full flex-col border-r border-border-subtle bg-bg-surface/60 w-72 shrink-0">
      <div className="border-b border-border-subtle p-3">
        <label htmlFor="prompt-search" className="sr-only">
          Search prompts
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-fg-muted" />
          <Input
            id="prompt-search"
            type="search"
            placeholder="Search promptsâ€¦"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <nav className="flex-1 overflow-y-auto p-3 space-y-4" aria-label="Prompt categories">
          <CategoryList
            category={category}
            onChange={onCategoryChange}
          />
          <SubcategoryList
            category={category}
            subcategory={subcategory}
            onChange={onSubcategoryChange}
          />
          <FilterChips
            favoritesOnly={favoritesOnly}
            setFavoritesOnly={setFavoritesOnly}
            recentOnly={recentOnly}
            setRecentOnly={setRecentOnly}
          />
        </nav>

        <div className="border-t border-border-subtle p-3">
          <PromptList
            prompts={filtered}
            onSelect={onPromptSelect}
          />
        </div>
      </div>
    </aside>
  );
}

const CATEGORIES: { id: PromptCategory; label: string; icon: React.ReactNode }[] = [
  { id: "personal", label: "Personal", icon: <Tag className="size-4" /> },
  { id: "programming", label: "Programming", icon: <Clock className="size-4" /> },
  { id: "business", label: "Business", icon: <ChevronRight className="size-4" /> },
  { id: "writing", label: "Writing", icon: <Star className="size-4" /> },
  { id: "education", label: "Education", icon: <Search className="size-4" /> },
  { id: "ai-specific", label: "AI Specific", icon: <Star className="size-4" /> },
];

function CategoryList({
  category,
  onChange,
}: { category: PromptCategory; onChange: (c: PromptCategory) => void }) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
        Categories
      </p>
      <div className="flex flex-col gap-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              "text-fg-secondary hover:text-fg-primary hover:bg-white/5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              cat.id === category && "bg-white/[0.06] text-fg-primary",
            )}
          >
            <span className={cn("size-4 shrink-0", cat.id === category ? "text-[var(--accent-primary-hover)]" : "text-fg-muted")}>
              {cat.icon}
            </span>
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SubcategoryList({
  category,
  subcategory,
  onChange,
}: { category: PromptCategory; subcategory: string; onChange: (s: string) => void }) {
  const subs = PROMPT_SUBCATEGORIES[category] ?? [];
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
        Subcategories
      </p>
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => onChange("All")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            "text-fg-secondary hover:text-fg-primary hover:bg-white/5",
            subcategory === "All" && "bg-white/[0.06] text-fg-primary",
          )}
        >
          All
        </button>
        {subs.map((sub) => (
          <button
            key={sub}
            type="button"
            onClick={() => onChange(sub)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              "text-fg-secondary hover:text-fg-primary hover:bg-white/5",
              subcategory === sub && "bg-white/[0.06] text-fg-primary",
            )}
          >
            {sub}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterChips({
  favoritesOnly,
  setFavoritesOnly,
  recentOnly,
  setRecentOnly,
}: { favoritesOnly: boolean; setFavoritesOnly: (v: boolean) => void; recentOnly: boolean; setRecentOnly: (v: boolean) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={favoritesOnly}
          onChange={(e) => setFavoritesOnly(e.target.checked)}
          className="size-4 accent-[var(--accent-primary)]"
        />
        <span className="text-sm text-fg-secondary">Favorites only</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={recentOnly}
          onChange={(e) => setRecentOnly(e.target.checked)}
          className="size-4 accent-[var(--accent-primary)]"
        />
        <span className="text-sm text-fg-secondary">Recent only</span>
      </label>
    </div>
  );
}

function PromptList({
  prompts,
  onSelect,
}: { prompts: PromptTemplate[]; onSelect: (p: PromptTemplate) => void }) {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-center px-4 text-xs text-fg-muted">
        No prompts match your filters.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1.5 max-h-[40vh] overflow-y-auto">
      {prompts.map((prompt) => (
        <PromptListItem key={prompt.id} prompt={prompt} onSelect={onSelect} />
      ))}
    </div>
  );
}

function PromptListItem({
  prompt,
  onSelect,
}: { prompt: PromptTemplate; onSelect: (p: PromptTemplate) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(prompt)}
      className="flex items-start gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium text-fg-primary">
            {prompt.title}
          </span>
          {prompt.favorite && <Star className="size-3.5 text-[var(--status-warning)]" />}
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs text-fg-muted">
          {prompt.description}
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          {prompt.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="default" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </button>
  );
}

