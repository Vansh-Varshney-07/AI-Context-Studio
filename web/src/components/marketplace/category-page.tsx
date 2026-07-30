"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronDown, ChevronUp, Search, Filter, X, Star, Download, Package, User, Tag, Clock, CheckCircle, SlidersHorizontal, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton, EmptyState, AssetCardSkeleton } from "@/components/common";
import { assets, type Asset, getAssetsByCategory, getCategories, getAssetKinds } from "@/data/marketplace";

const CATEGORIES = getCategories();
const KINDS = getAssetKinds();
const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "recent", label: "Most Recent" },
  { value: "rating", label: "Highest Rated" },
  { value: "downloads", label: "Most Downloads" },
  { value: "alphabetical", label: "A-Z" },
];

function SortDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full justify-between gap-2 h-10 px-3">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent className="w-48">
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function RatingStars({ rating, count, size = "sm" }: { rating: number; count?: number; size?: "sm" | "md" }) {
  const starSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(starSize, n <= Math.round(rating) ? "text-yellow-400 fill-current" : "text-[var(--color-border)]")}
          fill={n <= Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
      {count && <span className="text-xs text-[var(--color-text-muted)] ml-1">({count.toLocaleString()})</span>}
    </div>
  );
}

function CompatibilityBadge({ targets }: { targets: string[] }) {
  const targetIcons: Record<string, React.ReactNode> = {
    "Cursor": <Package className="h-3 w-3" />,
    "Claude Code": <User className="h-3 w-3" />,
    "Windsurf": <Tag className="h-3 w-3" />,
    "VS Code": <Package className="h-3 w-3" />,
    "Custom": <Package className="h-3 w-3" />,
  };
  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Compatible targets">
      {targets.slice(0, 4).map((t) => (
        <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
          {targetIcons[t] || <Package className="h-3 w-3" />}
          <span>{t}</span>
        </span>
      ))}
      {targets.length > 4 && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--color-accent-light)] text-[var(--color-accent)] border border-[var(--color-accent)]">
          +{targets.length - 4}
        </span>
      )}
    </div>
  );
}

function VersionBadge({ version }: { version: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">
      v{version}
    </span>
  );
}

function AssetCard({ asset }: { asset: Asset }) {
  return (
    <div className="group">
      <Card className="card-hover h-full flex flex-col overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-surface)]">
        <div className="relative aspect-video overflow-hidden bg-[var(--color-bg-tertiary)]">
          {asset.thumbnail ? (
            <img
              src={asset.thumbnail}
              alt={asset.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
              <Package className="h-12 w-12" />
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-1.5">
            <Badge variant="outline" className="text-xs">{asset.kind}</Badge>
            {asset.verified && (
              <Badge variant="accent" className="text-xs gap-1">
                <CheckCircle className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
        </div>

        <div className="p-4 space-y-3 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-[var(--color-text-primary)] truncate">{asset.name}</h3>
              <p className="text-sm text-[var(--color-text-muted)] truncate">by {asset.author}</p>
            </div>
            <VersionBadge version={asset.version} />
          </div>

          <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">{asset.description}</p>

          <div className="flex items-center justify-between">
            <RatingStars rating={asset.rating} count={asset.reviewCount} size="sm" />
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1">{asset.downloads.toLocaleString()} downloads</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {asset.updatedAt}</span>
            </div>
          </div>

          <CompatibilityBadge targets={asset.compatibility} />

          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--color-border)]">
            {asset.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs h-5 px-2">{tag}</Badge>
            ))}
            {asset.tags.length > 4 && (
              <Badge variant="outline" className="text-xs h-5 px-2">+{asset.tags.length - 4}</Badge>
            )}
          </div>

          <div className="flex items-center gap-2 mt-auto pt-3 border-t border-[var(--color-border)]">
            <Button variant="ghost" size="sm" className="flex-1 flex items-center justify-center gap-1.5">
              <Download className="h-4 w-4" />
              Install
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center justify-center gap-1.5">
              <Tag className="h-4 w-4" />
              Details
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function FilterSidebar({ 
  selectedCategory, 
  onCategoryChange, 
  selectedKinds, 
  onKindsChange, 
  verifiedOnly, 
  onVerifiedChange,
  compatibility, 
  onCompatibilityChange,
  resultsCount,
  onClearFilters 
}: {
  selectedCategory: string;
  onCategoryChange: (c: string) => void;
  selectedKinds: string[];
  onKindsChange: (k: string[]) => void;
  verifiedOnly: boolean;
  onVerifiedChange: (v: boolean) => void;
  compatibility: string[];
  onCompatibilityChange: (c: string[]) => void;
  resultsCount: number;
  onClearFilters: () => void;
}) {
  const [openSections, setOpenSections] = useState<string[]>(["Category", "Type", "Compatibility"]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]);
  };

  return (
    <aside className="w-72 flex-shrink-0 hidden lg:block">
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[var(--color-text-primary)]">Filters</h2>
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
              <X className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          </div>

          <Separator />

          <FilterSection title="Category" open={openSections.includes("Category")} onToggle={() => toggleSection("Category")}>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => onCategoryChange(cat)}
                    className="h-4 w-4 text-[var(--color-accent)] border-[var(--color-border)] focus:ring-[var(--color-accent)]"
                  />
                  <span className="text-sm text-[var(--color-text-secondary)]">{cat}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Type" open={openSections.includes("Type")} onToggle={() => toggleSection("Type")}>
            <div className="space-y-2">
              {KINDS.map((kind) => (
                <label key={kind} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedKinds.includes(kind)}
                    onChange={(e) => onKindsChange(e.target.checked ? [...selectedKinds, kind] : selectedKinds.filter(k => k !== kind))}
                    className="h-4 w-4 text-[var(--color-accent)] border-[var(--color-border)] rounded focus:ring-[var(--color-accent)]"
                  />
                  <span className="text-sm text-[var(--color-text-secondary)]">{kind}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Compatibility" open={openSections.includes("Compatibility")} onToggle={() => toggleSection("Compatibility")}>
            <div className="space-y-2">
              {["Cursor", "Claude Code", "Windsurf", "VS Code", "Custom"].map((target) => (
                <label key={target} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={compatibility.includes(target)}
                    onChange={(e) => onCompatibilityChange(e.target.checked ? [...compatibility, target] : compatibility.filter(t => t !== target))}
                    className="h-4 w-4 text-[var(--color-accent)] border-[var(--color-border)] rounded focus:ring-[var(--color-accent)]"
                  />
                  <span className="text-sm text-[var(--color-text-secondary)]">{target}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Verified Only" open={openSections.includes("Verified")} onToggle={() => toggleSection("Verified")}>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => onVerifiedChange(e.target.checked)}
                  className="h-4 w-4 text-[var(--color-accent)] border-[var(--color-border)] rounded focus:ring-[var(--color-accent)]"
                />
                <span className="text-sm text-[var(--color-text-secondary)]">Verified publishers only</span>
              </label>
            </div>
          </FilterSection>
        </div>
      </ScrollArea>
    </aside>
  );
}

function FilterSection({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)]"
        aria-expanded={open}
      >
        <span>{title}</span>
        {open ? <ChevronUp className="h-4 w-4 text-[var(--color-text-muted)]" /> : <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />}
      </button>
      <AnimatePresence>
        {open && (
          <div
            className="overflow-hidden"
          >
            <div className="pt-2">{children}</div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchBar({ value, onChange, onClear }: { value: string; onChange: (v: string) => void; onClear: () => void }) {
  return (
    <div className="relative flex-1 max-w-xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" aria-hidden="true" />
      <Input
        type="search"
        placeholder="Search assets..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10 h-10"
        aria-label="Search marketplace"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          aria-label="Clear search"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

function ResultsHeader({ count, selectedCategory, searchQuery, hasActiveFilters }: { 
  count: number; 
  selectedCategory: string; 
  searchQuery: string; 
  hasActiveFilters: boolean; 
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Showing <span className="font-semibold text-[var(--color-text-primary)]">{count}</span> asset{count !== 1 ? "s" : ""}
          {selectedCategory !== "All" && <span className="ml-2">in <span className="font-medium">{selectedCategory}</span></span>}
          {searchQuery && <span className="ml-2">for <span className="font-medium">"{searchQuery}"</span></span>}
        </p>
      </div>
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <SlidersHorizontal className="h-4 w-4" />
          Active filters
        </div>
      )}
    </div>
  );
}

export function MarketplaceCategoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedKinds, setSelectedKinds] = useState<string[]>(searchParams.get("kind")?.split(",").filter(Boolean) || []);
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get("verified") === "true");
  const [compatibility, setCompatibility] = useState<string[]>(searchParams.get("compat")?.split(",").filter(Boolean) || []);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "trending");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory && selectedCategory !== "All") params.set("category", selectedCategory);
    if (selectedKinds.length > 0) params.set("kind", selectedKinds.join(","));
    if (verifiedOnly) params.set("verified", "true");
    if (compatibility.length > 0) params.set("compat", compatibility.join(","));
    if (sortBy !== "trending") params.set("sort", sortBy);
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchQuery, selectedCategory, selectedKinds, verifiedOnly, compatibility, sortBy, router, pathname]);

  const filteredAssets = useMemo(() => {
    let result = getAssetsByCategory(selectedCategory);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query) ||
        a.author.toLowerCase().includes(query) ||
        a.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    if (selectedKinds.length > 0) {
      result = result.filter(a => selectedKinds.includes(a.kind));
    }

    if (verifiedOnly) {
      result = result.filter(a => a.verified);
    }

    if (compatibility.length > 0) {
      result = result.filter(a => compatibility.every(t => a.compatibility.includes(t)));
    }

    switch (sortBy) {
      case "recent":
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "downloads":
        result.sort((a, b) => b.downloads - a.downloads);
        break;
      case "alphabetical":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "trending":
      default:
        result.sort((a, b) => (b.rating * Math.log(b.downloads + 1)) - (a.rating * Math.log(a.downloads + 1)));
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, selectedKinds, verifiedOnly, compatibility, sortBy]);

  const hasActiveFilters = selectedCategory !== "All" || selectedKinds.length > 0 || verifiedOnly || compatibility.length > 0;

  const clearFilters = useCallback(() => {
    setSelectedCategory("All");
    setSelectedKinds([]);
    setVerifiedOnly(false);
    setCompatibility([]);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg-surface)] sticky top-0 z-50">
        <div className="container-app px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Marketplace</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">Discover, install, and publish community AI assets</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <SearchBar value={searchQuery} onChange={setSearchQuery} onClear={() => setSearchQuery("")} />
              <Button variant="outline" size="sm" onClick={() => setShowSidebar(true)} className="lg:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <FilterSidebar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedKinds={selectedKinds}
          onKindsChange={setSelectedKinds}
          verifiedOnly={verifiedOnly}
          onVerifiedChange={setVerifiedOnly}
          compatibility={compatibility}
          onCompatibilityChange={setCompatibility}
          resultsCount={filteredAssets.length}
          onClearFilters={clearFilters}
        />

        <main className="flex-1 min-w-0 p-4 lg:p-6 lg:ml-0">
          <ResultsHeader 
            count={filteredAssets.length} 
            selectedCategory={selectedCategory} 
            searchQuery={searchQuery} 
            hasActiveFilters={hasActiveFilters} 
          />

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--color-text-muted)]">Sort by:</span>
              <SortDropdown value={sortBy} onChange={setSortBy} />
              <div className="flex border border-[var(--color-border)] rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn("p-2 transition-colors", viewMode === "grid" ? "bg-[var(--color-accent-light)] text-[var(--color-accent)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]")}
                  aria-label="Grid view"
                >
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-current rounded" />
                    <div className="w-2 h-2 bg-current rounded" />
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-current rounded" />
                    <div className="w-2 h-2 bg-current rounded" />
                  </div>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn("p-2 transition-colors", viewMode === "list" ? "bg-[var(--color-accent-light)] text-[var(--color-accent)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]")}
                  aria-label="List view"
                >
                  <div className="flex flex-col gap-1">
                    <div className="w-full h-1 bg-current rounded" />
                    <div className="w-full h-1 bg-current rounded" />
                    <div className="w-full h-1 bg-current rounded" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {filteredAssets.length === 0 ? (
            <EmptyState
              variant={searchQuery ? "search" : selectedCategory !== "All" ? "marketplace" : "default"}
              title={searchQuery ? `No results for "${searchQuery}"` : selectedCategory !== "All" ? `No assets in ${selectedCategory}` : "Marketplace is empty"}
              description={searchQuery ? "Try adjusting your search terms or filters." : "Be the first to publish an asset!"}
              action={searchQuery ? { label: "Clear search", href: pathname } : undefined}
            />
          ) : (
            <div
              className={cn(
                viewMode === "grid" 
                  ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "space-y-4"
              )}
              role="list"
              aria-label="Marketplace assets"
            >
              {filteredAssets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          )}

          {filteredAssets.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Load more
              </Button>
            </div>
          )}
        </main>
      </div>

      {showSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSidebar(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-[var(--color-bg-surface)] border-l border-[var(--color-border)] overflow-y-auto">
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <h2 className="font-semibold">Filters</h2>
              <button onClick={() => setShowSidebar(false)} className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterSidebar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedKinds={selectedKinds}
              onKindsChange={setSelectedKinds}
              verifiedOnly={verifiedOnly}
              onVerifiedChange={setVerifiedOnly}
              compatibility={compatibility}
              onCompatibilityChange={setCompatibility}
              resultsCount={filteredAssets.length}
              onClearFilters={clearFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
}