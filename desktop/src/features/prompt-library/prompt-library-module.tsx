import { motion } from "framer-motion";
import {
  ChevronRight,
  Clock,
  Copy,
  Download,
  Search,
  Star,
  Tag as TagIcon,
  Zap,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";
import { useState } from "react";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { ScrollArea } from "@components/ui/scroll-area";
import { Tag } from "@components/common/tag";
import { formatRelativeTime } from "@utils/date";
import { moduleTransition } from "@components/motion";
import type { PromptCategory } from "@/shared/types/domain";
import type { PromptTemplate } from "./types";
import { SEED_PROMPTS } from "./seed";
import { PROMPT_CATEGORIES, PROMPT_SUBCATEGORIES } from "@constants/prompt-categories";
import { cn } from "@utils/cn";
import { copyToClipboard, downloadFile } from "@utils";
import { useAIEngine } from "@hooks";
import type { EngineAnswers } from "@/features/system-prompt-engine/types";

/**
 * Prompt Library module renderer.
 *
 * Layout: [Sidebar: category tree + search + filters] | [Editor: reference prompt / custom builder]
 */
export function PromptLibraryModule() {
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<PromptCategory>("personal");
  const [selectedSubcategory, setSelectedSubcategory] = React.useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = React.useState<PromptTemplate | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = React.useState(false);
  const [showRecentOnly, setShowRecentOnly] = React.useState(false);

  const { generate, isGenerating, isStreaming, lastOutput, error, clear } = useAIEngine();
  const [streamingContent, setStreamingContent] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const filteredPrompts = React.useMemo(() => {
    return SEED_PROMPTS.filter((p) => {
      if (p.category !== selectedCategory) return false;
      if (selectedSubcategory && p.subcategory !== selectedSubcategory) return false;
      if (showFavoritesOnly && !p.favorite) return false;
      if (showRecentOnly) {
        const recentCutoff = new Date(Date.now() - 30 * 86400000);
        if (new Date(p.updatedAt) < recentCutoff) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const haystack = `${p.title} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedSubcategory, showFavoritesOnly, showRecentOnly, search]);

  const subcategories = PROMPT_SUBCATEGORIES[selectedCategory] ?? [];

  return (
    <motion.div
      variants={moduleTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid h-full grid-cols-[18rem_minmax(0,1fr)] overflow-hidden"
    >
      <PromptLibrarySidebar
        search={search}
        onSearchChange={setSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedSubcategory={selectedSubcategory}
        onSubcategoryChange={setSelectedSubcategory}
        showFavoritesOnly={showFavoritesOnly}
        onFavoritesToggle={setShowFavoritesOnly}
        showRecentOnly={showRecentOnly}
        onRecentToggle={setShowRecentOnly}
        subcategories={subcategories}
        promptCounts={getPromptCounts(selectedCategory)}
      />
      <PromptLibraryEditor
        selectedPrompt={selectedPrompt}
        onPromptSelect={setSelectedPrompt}
        prompts={filteredPrompts}
        onEnhance={async (prompt) => {
          if (isEnhancing) return;
          setIsEnhancing(true);
          setStreamingContent("");
          clear();

          const answers = {
            purpose: `Enhance and polish this prompt template: ${prompt.title}`,
            customInstructions: prompt.referencePrompt,
          } as EngineAnswers;

          try {
            await generate("prompt-template", answers, {
              stream: true,
              onStream: (chunk) => setStreamingContent((prev) => (prev ?? "") + chunk),
            });
          } catch {
            // Error handled by hook
          } finally {
            setIsEnhancing(false);
          }
        }}
        isGenerating={isGenerating || isEnhancing}
        isStreaming={isStreaming}
        streamingContent={streamingContent}
        error={error}
        onClear={clear}
      />
    </motion.div>
  );
}

function getPromptCounts(category: PromptCategory) {
  const counts: Record<string, number> = {};
  for (const p of SEED_PROMPTS) {
    if (p.category === category) {
      counts[p.subcategory] = (counts[p.subcategory] ?? 0) + 1;
    }
  }
  return counts;
}

/**
 * Sidebar: search, category pills, subcategory list with counts, filters.
 */
function PromptLibrarySidebar({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSubcategory,
  onSubcategoryChange,
  showFavoritesOnly,
  onFavoritesToggle,
  showRecentOnly,
  onRecentToggle,
  subcategories,
  promptCounts,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  selectedCategory: PromptCategory;
  onCategoryChange: (c: PromptCategory) => void;
  selectedSubcategory: string | null;
  onSubcategoryChange: (s: string | null) => void;
  showFavoritesOnly: boolean;
  onFavoritesToggle: (v: boolean) => void;
  showRecentOnly: boolean;
  onRecentToggle: (v: boolean) => void;
  subcategories: string[];
  promptCounts: Record<string, number>;
}) {
  return (
    <aside className="flex h-full flex-col border-r border-border bg-bg-secondary/60 overflow-hidden">
      <div className="flex flex-col gap-3 p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Search promptsâ€¦"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
            size="sm"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {PROMPT_CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "primary" : "ghost"}
              size="sm"
              onClick={() => onCategoryChange(cat.id)}
              className="whitespace-nowrap"
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-4 p-3">
            <div className="space-y-1">
              <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Subcategories
              </p>
              {subcategories.map((sub) => (
                <SubcategoryItem
                  key={sub}
                  label={sub}
                  count={promptCounts[sub] ?? 0}
                  active={selectedSubcategory === sub}
                  onClick={() => onSubcategoryChange(selectedSubcategory === sub ? null : sub)}
                />
              ))}
            </div>

            <div className="pt-3 border-t border-border space-y-1">
              <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Filters
              </p>
              <FilterToggle
                label="Favorites only"
                icon={Star}
                active={showFavoritesOnly}
                onToggle={onFavoritesToggle}
              />
              <FilterToggle
                label="Recent (30 days)"
                icon={Clock}
                active={showRecentOnly}
                onToggle={onRecentToggle}
              />
            </div>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}

const SubcategoryItem = React.forwardRef<HTMLButtonElement, {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}>(({ label, count, active, onClick }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={onClick}
    className={cn(
      "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
      "hover:bg-bg-secondary hover:text-text-primary",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
      active ? "bg-accent-light text-accent" : "text-text-secondary hover:text-text-primary",
    )}
  >
    <span className="truncate flex-1">{label}</span>
    {count > 0 && (
      <span className="shrink-0 rounded-full bg-bg-tertiary px-2 text-[10px] font-medium text-text-muted">
        {count}
      </span>
    )}
  </button>
));
SubcategoryItem.displayName = "SubcategoryItem";

const FilterToggle = React.forwardRef<HTMLButtonElement, {
  label: string;
  icon: LucideIcon;
  active: boolean;
  onToggle: (v: boolean) => void;
}>(({ label, icon: Icon, active, onToggle }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={() => onToggle(!active)}
    className={cn(
      "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
      "hover:bg-bg-secondary",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
      active ? "bg-accent-light text-accent" : "text-text-secondary hover:text-text-primary",
    )}
  >
    <Icon className="size-3.5 shrink-0" />
    <span className="truncate">{label}</span>
    {active && <span className="ml-auto size-1.5 rounded-full bg-accent" />}
  </button>
));
FilterToggle.displayName = "FilterToggle";

/**
 * Editor: split view â€” left: reference prompt (read-only), right: custom builder.
 * When no prompt selected, shows empty state with list of available prompts.
 */
function PromptLibraryEditor({
  selectedPrompt,
  onPromptSelect,
  prompts,
  onEnhance,
  isGenerating,
  isStreaming,
  streamingContent,
  error,
  onClear,
}: {
  selectedPrompt: PromptTemplate | null;
  onPromptSelect: (p: PromptTemplate | null) => void;
  prompts: PromptTemplate[];
  onEnhance?: (prompt: PromptTemplate) => Promise<void>;
  isGenerating?: boolean;
  isStreaming?: boolean;
  streamingContent?: string | null;
  error?: string | null;
  onClear?: () => void;
}) {
  if (!selectedPrompt) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <h2 className="text-sm font-semibold text-text-primary">Prompt Editor</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">
              {prompts.length} prompt{prompts.length !== 1 ? "s" : ""} in view
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <PromptListPrompts prompts={prompts} onSelect={onPromptSelect} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => onPromptSelect(null)}
            className="p-1 rounded hover:bg-bg-secondary transition-colors"
            aria-label="Back to list"
          >
            <ChevronRight className="size-4 rotate-180 text-text-muted" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">
              {selectedPrompt.title}
            </p>
            <p className="truncate text-xs text-text-muted">
              {selectedPrompt.category} / {selectedPrompt.subcategory}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tag variant={selectedPrompt.favorite ? "accent" : "default"}>
            {selectedPrompt.favorite ? "â˜… Favorite" : "Add to favorites"}
          </Tag>
          <Tag variant="muted">{formatRelativeTime(selectedPrompt.updatedAt)}</Tag>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="grid h-full grid-cols-2">
          <ReferencePromptPane prompt={selectedPrompt} />
<CustomPromptBuilderPane
            basePrompt={selectedPrompt}
            onEnhance={onEnhance ?? ((prompt: PromptTemplate) => Promise.resolve())}
            isGenerating={Boolean(isGenerating)}
            isStreaming={Boolean(isStreaming)}
            streamingContent={streamingContent ?? null}
            error={error ?? null}
            onClear={onClear ?? null}
          />
        </div>
      </div>
    </div>
  );
}

function PromptListPrompts({
  prompts,
  onSelect,
}: {
  prompts: PromptTemplate[];
  onSelect: (p: PromptTemplate) => void;
}) {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center text-text-muted">
        <p className="text-sm">No prompts match your filters.</p>
        <p className="text-xs">Adjust search or filters to see results.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-w-2xl mx-auto">
      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        Available prompts
      </p>
      {prompts.map((p) => (
        <motion.button
          key={p.id}
          type="button"
          onClick={() => onSelect(p)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex w-full items-start gap-3 rounded-lg border border-border-subtle bg-bg-tertiary/50 p-3 text-left transition-all hover:border-border hover:bg-bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <div className="flex size-9 items-center justify-center shrink-0 rounded-md bg-accent-light text-accent">
            <Star className="size-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-text-primary">{p.title}</p>
            <p className="mt-0.5 text-xs text-text-muted">{p.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {p.tags.slice(0, 3).map((t) => (
                <Tag key={t} variant="muted" className="text-[10px]">
                  {t}
                </Tag>
              ))}
              {p.tags.length > 3 && (
                <Tag variant="muted" className="text-[10px]">
                  +{p.tags.length - 3}
                </Tag>
              )}
            </div>
          </div>
          <ChevronRight className="size-4 shrink-0 text-text-muted" />
        </motion.button>
      ))}
    </div>
  );
}

function ReferencePromptPane({ prompt }: { prompt: PromptTemplate }) {
  return (
    <div className="flex h-full flex-col border-r border-border bg-bg-tertiary/50">
      <div className="flex h-12 items-center gap-3 border-b border-border px-4 bg-bg-secondary/60">
        <div className="flex size-8 items-center justify-center rounded-lg bg-accent-light text-accent">
          <Star className="size-4" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Reference Prompt</p>
          <p className="text-xs text-text-muted">Canonical template â€” read only</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-text-secondary">
          {prompt.referencePrompt}
        </pre>
      </div>
      <div className="border-t border-border px-4 py-3 bg-bg-secondary/60">
        <div className="flex flex-wrap gap-1">
          {prompt.tags.map((t) => (
            <Tag key={t} variant="default" className="text-[10px]">
              {t}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
}

function CustomPromptBuilderPane({
  basePrompt,
  onEnhance,
  isGenerating,
  isStreaming,
  streamingContent,
  error,
  onClear,
}: {
  basePrompt: PromptTemplate;
  onEnhance: (prompt: PromptTemplate) => Promise<void>;
  isGenerating: boolean;
  isStreaming: boolean;
  streamingContent: string | null;
  error: string | null;
  onClear: (() => void) | null;
}) {
  const { lastOutput, clear } = useAIEngine();
  const [customPrompt, setCustomPrompt] = React.useState(basePrompt.referencePrompt);

  // Extract {{VAR}} placeholders from reference prompt
  const defaultVariables = React.useMemo(() => {
    const vars = Array.from(basePrompt.referencePrompt.matchAll(/\{\{(\w+)\}\}/g)).map(
      (m) => m[1],
    );
    const uniq = [...new Set(vars)].filter((v): v is string => typeof v === "string");
    const result: Record<string, string> = {};
    for (const v of uniq) result[v] = "";
    return result;
  }, [basePrompt.referencePrompt]);

  const [variables, setVariables] = React.useState(defaultVariables);

  return (
    <div className="flex h-full flex-col bg-bg-primary">
      <div className="flex h-12 items-center gap-3 border-b border-border px-4 bg-bg-secondary/60">
        <div className="flex size-8 items-center justify-center rounded-lg bg-accent-light text-accent">
          <Star className="size-4" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Custom Builder</p>
          <p className="text-xs text-text-muted">Fill variables & edit your variant</p>
        </div>
      </div>

      {Object.keys(variables).length > 0 && (
        <div className="border-b border-border p-4 bg-bg-secondary/40">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Variables ({Object.keys(variables).length})
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {Object.entries(variables).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <Label className="text-[10px] font-medium text-text-secondary">
                  {"{{" + key + "}}"}
                </Label>
                <Input
                  size="sm"
                  value={value}
                  onChange={(e) => setVariables((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={`Value for ${key}`}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              let filled = basePrompt.referencePrompt;
              for (const [k, v] of Object.entries(variables)) {
                filled = filled.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), v);
              }
              setCustomPrompt(filled);
            }}
            className="mt-2 text-xs font-medium text-accent hover:underline"
          >
            Apply variables to editor â†’
          </button>
        </div>
      )}

      <div className="flex-1 overflow-hidden p-4">
        <textarea
          value={isStreaming && streamingContent ? streamingContent : customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="h-full w-full rounded-md border border-border bg-cream px-3 py-2 text-sm font-mono leading-relaxed text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus resize-none"
          spellCheck={false}
          readOnly={isStreaming}
        />
      </div>

      <div className="border-t border-border p-3 bg-bg-secondary/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            {isGenerating && (
              <>
                <span className="size-2 rounded-full bg-accent animate-pulse" />
                {isStreaming ? "Streamingâ€¦" : "Generatingâ€¦"}
              </>
            )}
            {error && (
              <>
                <span className="size-2 rounded-full bg-error" />
                {error}
              </>
            )}
            {lastOutput && !isGenerating && !isStreaming && (
              <>
                <span className="size-2 rounded-full bg-success" />
                Enhanced
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(isStreaming && streamingContent ? streamingContent : customPrompt)} disabled={!customPrompt}>
              Copy
            </Button>
            <Button variant="ghost" size="sm" onClick={() => downloadFile(`${basePrompt.id}.md`, isStreaming && streamingContent ? streamingContent : customPrompt, "text/markdown")} disabled={!customPrompt}>
              Export .md
            </Button>
            <Button size="sm" disabled>
              Save as new prompt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

