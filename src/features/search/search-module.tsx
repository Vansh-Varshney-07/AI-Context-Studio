"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search as SearchIcon,
  X,
  Filter,
  ChevronDown,
  ChevronRight,
  FileText,
  Bot,
  Sparkles,
  GitBranch,
  BookText,
  Layers,
  Library,
  Boxes,
  Server,
  Shield,
  Zap,
  Cpu,
  Waypoints,
  Tag as TagIcon,
  Clock,
  Star,
  Download,
  Copy,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tag } from "@/components/common/tag";
import { EmptyState } from "@/components/common/empty-state";
import { moduleTransition } from "@/components/motion";
import { useToast } from "@/providers/toaster-provider";
import { cn } from "@/utils/cn";
import { copyToClipboard, downloadFile, formatRelativeTime } from "@/utils";
import { useNavigationStore } from "@/lib/navigation-store";
import { useStorage } from "@/hooks/use-storage";
import { MODULE_REGISTRY } from "@/constants/modules.registry";
import type { Asset } from "@/services/storage";

const MODULE_ICONS: Record<string, LucideIcon> = {
  dashboard: Sparkles,
  "instruction-files": FileText,
  "prompt-library": Library,
  "system-prompt-engine": Boxes,
  personas: Bot,
  skills: Cpu,
  workflows: Layers,
  memories: BookText,
  mcp: Server,
  validator: Shield,
  optimizer: Zap,
  settings: Waypoints,
};

const MODULE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  "instruction-files": "Instruction Files",
  "prompt-library": "Prompt Library",
  "system-prompt-engine": "Prompt Engine",
  personas: "Personas",
  skills: "Skills",
  workflows: "Workflows",
  memories: "Memories",
  mcp: "MCP Manager",
  validator: "Validator",
  optimizer: "Optimizer",
  settings: "Settings",
};

interface SearchResult {
  id: string;
  type: "asset" | "module";
  moduleId: string;
  title: string;
  description: string;
  content?: string;
  tags: string[];
  updatedAt: string;
  metadata?: Record<string, unknown>;
  score: number;
}

export function SearchModule() {
  const [query, setQuery] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<"all" | "assets" | "modules">("all");
  const [selectedModules, setSelectedModules] = React.useState<string[]>([]);
  const [dateRange, setDateRange] = React.useState<"all" | "today" | "week" | "month">("all");
  const [sortBy, setSortBy] = React.useState<"relevance" | "date" | "title">("relevance");
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedResult, setSelectedResult] = React.useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigationStore((s) => s.navigate);
  const { loadAll } = useStorage();
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Load assets for searching
  const [assets, setAssets] = React.useState<Asset[]>([]);
  useEffect(() => {
    loadAll().then(setAssets);
  }, [loadAll]);

  // Debounced search
  const debouncedQuery = useMemo(() => query, [query]);
  
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    setIsSearching(true);
    
    const q = debouncedQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search assets
    if (selectedType === "all" || selectedType === "assets") {
      for (const asset of assets) {
        if (selectedModules.length > 0 && !selectedModules.includes(asset.kind)) continue;
        
        const haystack = `${asset.title} ${asset.description} ${asset.kind} ${asset.tags.join(" ")} ${JSON.stringify(asset.content).toLowerCase()}`;
        if (!haystack.toLowerCase().includes(q)) continue;
        
        if (dateRange !== "all") {
          const cutoff = getDateCutoff(dateRange);
          if (new Date(asset.updatedAt) < cutoff) continue;
        }

        const score = calculateScore(q, asset.title, asset.description, asset.tags);
        results.push({
          id: asset.id,
          type: "asset",
          moduleId: asset.kind,
          title: asset.title,
          description: asset.description,
          content: typeof asset.content === "string" ? asset.content : JSON.stringify(asset.content),
          tags: asset.tags,
          updatedAt: asset.updatedAt,
          metadata: asset.metadata,
          score,
        });
      }
    }

    // Search modules
    if (selectedType === "all" || selectedType === "modules") {
      for (const module of MODULE_REGISTRY) {
        if (selectedModules.length > 0 && !selectedModules.includes(module.id)) continue;
        
        const haystack = `${module.label} ${module.description} ${module.id}`;
        if (!haystack.toLowerCase().includes(q)) continue;

        const score = calculateScore(q, module.label, module.description, []);
        results.push({
          id: module.id,
          type: "module",
          moduleId: module.id,
          title: module.label,
          description: module.description,
          tags: [],
          updatedAt: new Date().toISOString(),
          score,
        });
      }
    }

    // Sort results
    results.sort((a, b) => {
      if (sortBy === "relevance") return b.score - a.score;
      if (sortBy === "date") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

    setIsSearching(false);
    return results;
  }, [debouncedQuery, selectedType, selectedModules, dateRange, sortBy, assets]);

  const getDateCutoff = (range: string) => {
    const now = new Date();
    switch (range) {
      case "today": return new Date(now.setHours(0, 0, 0, 0));
      case "week": return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "month": return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default: return new Date(0);
    }
  };

  const calculateScore = (query: string, title: string, description: string, tags: string[]): number => {
    let score = 0;
    const q = query.toLowerCase();
    const titleLower = title.toLowerCase();
    const descLower = description.toLowerCase();
    
    // Exact title match
    if (titleLower === q) score += 100;
    // Title starts with query
    else if (titleLower.startsWith(q)) score += 50;
    // Title contains query
    else if (titleLower.includes(q)) score += 25;
    
    // Description contains
    if (descLower.includes(q)) score += 10;
    
    // Tag matches
    for (const tag of tags) {
      if (tag.toLowerCase() === q) score += 30;
      else if (tag.toLowerCase().includes(q)) score += 15;
    }
    
    return score;
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
      setRecentSearches((prev) => [searchQuery, ...prev.slice(0, 4)]);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result);
    if (result.type === "module") {
      navigate(result.moduleId as any);
    } else {
      // For assets, navigate to the module and the asset would be selected
      navigate(result.moduleId as any);
    }
  };

  const handleCopyResult = (result: SearchResult) => {
    const text = result.content || result.description;
    copyToClipboard(text);
    toast({ title: "Copied", description: "Content copied to clipboard", variant: "success" });
  };

  const handleDownloadResult = (result: SearchResult) => {
    const content = result.content || result.description;
    const filename = `${result.title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.md`;
    downloadFile(filename, content, "text/markdown");
    toast({ title: "Downloaded", description: filename, variant: "success" });
  };

  const clearSearch = () => {
    setQuery("");
    setSelectedResult(null);
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  return (
    <motion.div
      variants={moduleTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex h-full flex-col overflow-hidden"
    >
      <div className="flex h-14 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <SearchIcon className="size-4" />
          </span>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-text-primary">Search</h1>
            <p className="text-xs text-text-muted">Find assets, prompts, and modules instantly</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 text-xs bg-bg-tertiary rounded font-mono">⌘K</kbd>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="border-b border-border p-4 bg-bg-secondary/50">
          <div className="relative max-w-2xl">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
            <Input
              ref={searchInputRef}
              placeholder="Search across all modules... (⌘K to focus)"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 pr-10"
              onKeyDown={(e) => {
                if (e.key === "Escape") clearSearch();
              }}
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-bg-secondary transition-colors"
                aria-label="Clear search"
              >
                <X className="size-4 text-text-muted" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="size-3.5" />
                  Filters
                  <ChevronDown className="size-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="start" className="w-72 p-0">
                <div className="p-3 space-y-4">
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-2">Type</Label>
                    <div className="space-y-1">
                      {(["all", "assets", "modules"] as const).map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="searchType"
                            value={type}
                            checked={selectedType === type}
                            onChange={() => setSelectedType(type)}
                            className="sr-only"
                          />
                          <span className="text-sm text-text-secondary capitalize">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-2">Modules</Label>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {MODULE_REGISTRY.map((module) => (
                        <label key={module.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedModules.includes(module.id)}
                            onChange={(e) => setSelectedModules((prev) =>
                              e.target.checked ? [...prev, module.id] : prev.filter((m) => m !== module.id)
                            )}
                            className="sr-only peer"
                          />
                          <span className="flex items-center gap-2 text-sm text-text-secondary peer-checked:text-accent">
                            <module.icon className="size-3.5" />
                            <span className="truncate">{module.label}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-2">Date Range</Label>
                    <div className="space-y-1">
                      {(["all", "today", "week", "month"] as const).map((range) => (
                        <label key={range} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="dateRange"
                            value={range}
                            checked={dateRange === range}
                            onChange={() => setDateRange(range)}
                            className="sr-only"
                          />
                          <span className="text-sm text-text-secondary capitalize">{range === "all" ? "All time" : range}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-2">Sort By</Label>
                    <div className="space-y-1">
                      {([
                        { value: "relevance", label: "Relevance" },
                        { value: "date", label: "Date (newest)" },
                        { value: "title", label: "Title (A-Z)" },
                      ] as const).map((opt) => (
                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="sortBy"
                            value={opt.value}
                            checked={sortBy === opt.value}
                            onChange={() => setSortBy(opt.value)}
                            className="sr-only"
                          />
                          <span className="text-sm text-text-secondary">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button variant="ghost" size="sm" onClick={() => {
                      setSelectedType("all");
                      setSelectedModules([]);
                      setDateRange("all");
                      setSortBy("relevance");
                    }}>
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-hidden">
          {query.trim() ? (
            <AnimatePresence mode="wait">
              {isSearching ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center gap-4 text-text-muted">
                    <div className="size-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm">Searching...</p>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <SearchResultsList
                  results={results}
                  query={query}
                  onResultClick={handleResultClick}
                  onCopy={handleCopyResult}
                  onDownload={handleDownloadResult}
                  selectedResult={selectedResult}
                  onCloseResult={() => setSelectedResult(null)}
                />
              ) : (
                <EmptyState
                  icon={SearchIcon}
                  title="No results found"
                  description={`No matches for "${query}". Try adjusting your filters or search terms.`}
                />
              )}
            </AnimatePresence>
          ) : (
            <SearchHome
              recentSearches={recentSearches}
              onRecentSearchClick={handleSearch}
              onClearRecent={() => setRecentSearches([])}
              assetsCount={assets.length}
            />
          )}
        </div>

        {/* Detail Panel */}
        {selectedResult && (
          <AnimatePresence>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-bg-primary border-l border-border shadow-xl overflow-hidden flex flex-col"
              style={{ width: "480px" }}
            >
              <div className="flex h-14 items-center justify-between border-b border-border px-4">
                <h3 className="text-sm font-semibold text-text-primary truncate pr-4">{selectedResult.title}</h3>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="p-1 rounded hover:bg-bg-secondary transition-colors"
                  aria-label="Close detail"
                >
                  <X className="size-4 text-text-muted" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const Icon = MODULE_ICONS[selectedResult.moduleId] ?? FileText;
                      return <Icon className="size-4 text-accent" />;
                    })()}
                    <span className="text-xs font-medium text-text-secondary capitalize">{selectedResult.type}</span>
                    <Tag variant="muted" className="text-[10px]">{MODULE_LABELS[selectedResult.moduleId]}</Tag>
                    {selectedResult.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 ml-auto">
                        {selectedResult.tags.slice(0, 3).map((t) => (
                          <Tag key={t} variant="default" className="text-[10px]">{t}</Tag>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-text-secondary">{selectedResult.description}</p>
                  
                  {selectedResult.content && (
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted">Content Preview</Label>
                      <pre className="rounded-lg border border-border bg-cream p-3 text-sm font-mono leading-relaxed text-text-secondary whitespace-pre-wrap break-words max-h-64 overflow-auto">
                        {selectedResult.content.slice(0, 2000)}{selectedResult.content.length > 2000 ? "..." : ""}
                      </pre>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-text-muted">Updated {formatRelativeTime(selectedResult.updatedAt)}</span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleCopyResult(selectedResult)}>
                        <Copy className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDownloadResult(selectedResult)}>
                        <Download className="size-3.5" />
                      </Button>
                      <Button variant="primary" size="sm" onClick={() => handleResultClick(selectedResult)}>
                        <ArrowUpRight className="size-3.5 mr-1.5" />
                        Open
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

function SearchResultsList({
  results,
  query,
  onResultClick,
  onCopy,
  onDownload,
  selectedResult,
  onCloseResult,
}: {
  results: SearchResult[];
  query: string;
  onResultClick: (r: SearchResult) => void;
  onCopy: (r: SearchResult) => void;
  onDownload: (r: SearchResult) => void;
  selectedResult: SearchResult | null;
  onCloseResult: () => void;
}) {
  const highlightedResults = useMemo(() => results.slice(0, 50), [results]);
  
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
          {results.length > 50 && <span className="ml-2 text-text-muted">(showing first 50)</span>}
        </p>
        {highlightedResults.map((result) => (
          <SearchResultItem
            key={result.id}
            result={result}
            query={query}
            isSelected={selectedResult?.id === result.id}
            onClick={onResultClick}
            onCopy={onCopy}
            onDownload={onDownload}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

function SearchResultItem({
  result,
  query,
  isSelected,
  onClick,
  onCopy,
  onDownload,
}: {
  result: SearchResult;
  query: string;
  isSelected: boolean;
  onClick: (r: SearchResult) => void;
  onCopy: (r: SearchResult) => void;
  onDownload: (r: SearchResult) => void;
}) {
  const Icon = MODULE_ICONS[result.moduleId] || SearchIcon;
  
  return (
    <motion.button
      type="button"
      onClick={() => onClick(result)}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
        isSelected
          ? "bg-accent-light border border-accent"
          : "bg-bg-secondary/50 border border-border-subtle hover:border-border hover:bg-bg-secondary"
      )}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <Icon className="size-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-text-primary truncate">{highlightMatch(result.title, query)}</p>
          <Tag variant="muted" className="text-[10px] shrink-0">{MODULE_LABELS[result.moduleId]}</Tag>
        </div>
        <p className="text-sm text-text-muted line-clamp-2">{highlightMatch(result.description, query)}</p>
        {result.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {result.tags.slice(0, 4).map((t) => (
              <Tag key={t} variant="default" className="text-[10px]">{highlightMatch(t, query)}</Tag>
            ))}
            {result.tags.length > 4 && (
              <Tag variant="muted" className="text-[10px]">+{result.tags.length - 4}</Tag>
            )}
          </div>
        )}
        <p className="text-[10px] text-text-muted mt-1">{formatRelativeTime(result.updatedAt)}</p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onCopy(result); }} aria-label="Copy">
          <Copy className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDownload(result); }} aria-label="Download">
          <Download className="size-3.5" />
        </Button>
      </div>
    </motion.button>
  );
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-accent/30 text-accent px-0.5 rounded">{part}</mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function SearchHome({
  recentSearches,
  onRecentSearchClick,
  onClearRecent,
  assetsCount,
}: {
  recentSearches: string[];
  onRecentSearchClick: (q: string) => void;
  onClearRecent: () => void;
  assetsCount: number;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Hero */}
          <div className="text-center py-8">
            <div className="flex size-16 items-center justify-center rounded-xl bg-accent/10 text-accent mx-auto mb-4">
              <SearchIcon className="size-8" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Search Everything</h2>
            <p className="text-text-muted">Find assets, prompts, workflows, and modules across your workspace</p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-muted">
              <Tag variant="default" className="text-[10px]">{assetsCount} assets indexed</Tag>
              <Tag variant="default" className="text-[10px]">{MODULE_REGISTRY.length} modules</Tag>
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Quick Filters</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Instruction Files", icon: FileText, module: "instruction-files" },
                { label: "Prompts", icon: Library, module: "prompt-library" },
                { label: "Personas", icon: Bot, module: "personas" },
                { label: "Workflows", icon: Layers, module: "workflows" },
                { label: "Skills", icon: Cpu, module: "skills" },
                { label: "Memories", icon: BookText, module: "memories" },
                { label: "MCP Servers", icon: Server, module: "mcp" },
                { label: "All Assets", icon: Sparkles, module: "all" },
              ].map((filter) => (
                <button
                  key={filter.module}
                  onClick={() => onRecentSearchClick(`module:${filter.module}`)}
                  className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-bg-secondary/50 hover:border-accent/50 hover:bg-accent/5 transition-all"
                >
                  <filter.icon className="size-6 text-text-muted group-hover:text-accent transition-colors" />
                  <span className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text-primary">Recent Searches</h3>
                {recentSearches.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={onClearRecent} className="text-xs">
                    Clear
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.slice(0, 6).map((search) => (
                  <Button
                    key={search}
                    variant="outline"
                    size="sm"
                    onClick={() => onRecentSearchClick(search)}
                    className="gap-1"
                  >
                    <SearchIcon className="size-3.5" />
                    <span className="truncate max-w-[150px]">{search}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Search Tips */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Search Tips</h3>
              <div className="space-y-2 text-sm text-text-secondary">
                <TipRow keys={["⌘", "K"]} desc="Focus search from anywhere" />
                <TipRow keys={["Esc"]} desc="Clear search" />
                <TipRow keys={["module:"]} desc="Filter by module (e.g., module:workflows)" />
                <TipRow keys={["tag:"]} desc="Filter by tag (e.g., tag:typescript)" />
                <TipRow keys={["type:"]} desc="Filter by type (e.g., type:asset or type:module)" />
                <TipRow keys={["\"\""]} desc="Exact phrase matching" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TipRow({ keys, desc }: { keys: string[]; desc: string }) {
  return (
    <div className="flex items-center gap-3">
      <kbd className="px-2 py-1 text-xs bg-bg-tertiary rounded font-mono">
        {keys.join(" + ")}
      </kbd>
      <span className="flex-1">{desc}</span>
    </div>
  );
}