'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  X,
  Star,
  Download,
  Package,
  User,
  Tag,
  Clock,
  CheckCircle,
  SlidersHorizontal,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Skeleton, EmptyState } from '@/components/common';
import type { AssetWithRelations } from '@/actions/marketplace';

interface MarketplaceCategoryPageClientProps {
  initialAssets: AssetWithRelations[];
  initialTotalCount: number;
  initialTotalPages: number;
  categories: Array<{ id: string; slug: string; name: string; icon: string | null; _count: { assets: number } }>;
  kinds: string[];
}

const CATEGORIES = ['All', 'Skills', 'Personas', 'Templates', 'Prompt Packs', 'Instruction Files', 'Workflows', 'MCP Servers', 'Collections', 'Bundles'];
const SORT_OPTIONS = [
  { value: 'trending', label: 'Trending' },
  { value: 'recent', label: 'Most Recent' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'downloads', label: 'Most Downloads' },
  { value: 'alphabetical', label: 'A-Z' },
];

function SortDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 w-full justify-between gap-2 px-3">
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

function RatingStars({
  rating,
  count,
  size = 'sm',
}: {
  rating: number;
  count?: number;
  size?: 'sm' | 'md';
}) {
  const starSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            starSize,
            n <= Math.round(rating) ? 'fill-current text-yellow-400' : 'text-[var(--color-border)]'
          )}
          fill={n <= Math.round(rating) ? 'currentColor' : 'none'}
        />
      ))}
      {count && (
        <span className="ml-1 text-xs text-[var(--color-text-muted)]">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}

function CompatibilityBadge({ targets }: { targets: Array<{ target: string; minVersion?: string | null; maxVersion?: string | null; verified: boolean }> }) {
  const targetIcons: Record<string, React.ReactNode> = {
    Cursor: <Package className="h-3 w-3" />,
    'Claude Code': <User className="h-3 w-3" />,
    Windsurf: <Tag className="h-3 w-3" />,
    'VS Code': <Package className="h-3 w-3" />,
    Custom: <Package className="h-3 w-3" />,
  };
  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Compatible targets">
      {targets.slice(0, 4).map((t) => (
        <span
          key={t.target}
          className="inline-flex items-center gap-1 rounded border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-2 py-0.5 text-xs font-medium text-[var(--color-text-secondary)]"
        >
          {targetIcons[t.target] || <Package className="h-3 w-3" />}
          <span>{t.target}</span>
        </span>
      ))}
      {targets.length > 4 && (
        <span className="inline-flex items-center rounded border border-[var(--color-accent)] bg-[var(--color-accent-light)] px-2 py-0.5 text-xs font-medium text-[var(--color-accent)]">
          +{targets.length - 4}
        </span>
      )}
    </div>
  );
}

function VersionBadge({ version }: { version: string }) {
  return (
    <span className="inline-flex items-center rounded border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
      v{version}
    </span>
  );
}

function AssetCard({ asset }: { asset: AssetWithRelations }) {
  const currentVersion = asset.versions[0];
  const tags = asset.tags.map((t) => t.tag);
  return (
    <div className="group">
      <Card className="card-hover flex h-full flex-col overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-surface)]">
        <div className="relative aspect-video overflow-hidden bg-[var(--color-bg-tertiary)]">
          {asset.screenshots[0] ? (
            <img
              src={asset.screenshots[0].url}
              alt={asset.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[var(--color-text-muted)]">
              <Package className="h-12 w-12" />
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-1.5">
            <Badge variant="outline" className="text-xs">
              {asset.kind}
            </Badge>
            {asset.verified && (
              <Badge variant="accent" className="gap-1 text-xs">
                <CheckCircle className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col space-y-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-[var(--color-text-primary)]">
                {asset.name}
              </h3>
              <p className="truncate text-sm text-[var(--color-text-muted)]">by {asset.author.name || asset.author.username}</p>
            </div>
            {currentVersion && <VersionBadge version={currentVersion.version} />}
          </div>

          <p className="line-clamp-2 text-sm text-[var(--color-text-secondary)]">
            {asset.shortDesc || asset.description.slice(0, 200)}
          </p>

          <div className="flex items-center justify-between">
            <RatingStars rating={asset.rating} count={asset.reviewCount} size="sm" />
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1">
                {asset.downloads.toLocaleString()} downloads
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {currentVersion ? new Date(currentVersion.createdAt).toLocaleDateString() : '—'}
              </span>
            </div>
          </div>

          <CompatibilityBadge targets={asset.compatibilities} />

          <div className="flex flex-wrap gap-1.5 border-t border-[var(--color-border)] pt-2">
            {tags.slice(0, 4).map((tag) => (
              <Badge key={tag.id} variant="outline" className="h-5 px-2 text-xs">
                {tag.name}
              </Badge>
            ))}
            {tags.length > 4 && (
              <Badge variant="outline" className="h-5 px-2 text-xs">
                +{tags.length - 4}
              </Badge>
            )}
          </div>

          <div className="mt-auto flex items-center gap-2 border-t border-[var(--color-border)] pt-3">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-1 items-center justify-center gap-1.5"
            >
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
  onClearFilters,
  categories,
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
  categories: Array<{ id: string; slug: string; name: string; icon: string | null; _count: { assets: number } }>;
}) {
  const [openSections, setOpenSections] = useState<string[]>(['Category', 'Type', 'Compatibility']);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const categoryOptions = ['All', ...categories.map((c) => c.name)];

  return (
    <aside className="hidden w-72 flex-shrink-0 lg:block">
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-6 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[var(--color-text-primary)]">Filters</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              <X className="mr-1 h-4 w-4" />
              Clear all
            </Button>
          </div>

          <Separator />

          <FilterSection
            title="Category"
            open={openSections.includes('Category')}
            onToggle={() => toggleSection('Category')}
          >
            <div className="space-y-2">
              {categoryOptions.map((cat) => (
                <label key={cat} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => onCategoryChange(cat)}
                    className="h-4 w-4 border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                  />
                  <span className="text-sm text-[var(--color-text-secondary)]">{cat}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title="Type"
            open={openSections.includes('Type')}
            onToggle={() => toggleSection('Type')}
          >
            <div className="space-y-2">
              {['Skill', 'Persona', 'Template', 'Prompt Pack', 'Instruction File', 'Workflow', 'MCP Server', 'Collection', 'Bundle'].map((kind) => (
                <label key={kind} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedKinds.includes(kind)}
                    onChange={(e) =>
                      onKindsChange(
                        e.target.checked
                          ? [...selectedKinds, kind]
                          : selectedKinds.filter((k) => k !== kind)
                      )
                    }
                    className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                  />
                  <span className="text-sm text-[var(--color-text-secondary)]">{kind}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title="Compatibility"
            open={openSections.includes('Compatibility')}
            onToggle={() => toggleSection('Compatibility')}
          >
            <div className="space-y-2">
              {['Cursor', 'Claude Code', 'Windsurf', 'VS Code', 'Custom'].map((target) => (
                <label key={target} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={compatibility.includes(target)}
                    onChange={(e) =>
                      onCompatibilityChange(
                        e.target.checked
                          ? [...compatibility, target]
                          : compatibility.filter((t) => t !== target)
                      )
                    }
                    className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                  />
                  <span className="text-sm text-[var(--color-text-secondary)]">{target}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title="Verified Only"
            open={openSections.includes('Verified')}
            onToggle={() => toggleSection('Verified')}
          >
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => onVerifiedChange(e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                />
                <span className="text-sm text-[var(--color-text-secondary)]">
                  Verified publishers only
                </span>
              </label>
            </div>
          </FilterSection>
        </div>
      </ScrollArea>
    </aside>
  );
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)]"
        aria-expanded={open}
      >
        <span>{title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-[var(--color-text-muted)]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <div className="overflow-hidden">
            <div className="pt-2">{children}</div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchBar({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="relative max-w-xl flex-1">
      <Search
        className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]"
        aria-hidden="true"
      />
      <Input
        type="search"
        placeholder="Search assets..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 pr-10 pl-10"
        aria-label="Search marketplace"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          aria-label="Clear search"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

function ResultsHeader({
  count,
  selectedCategory,
  searchQuery,
  hasActiveFilters,
}: {
  count: number;
  selectedCategory: string;
  searchQuery: string;
  hasActiveFilters: boolean;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Showing <span className="font-semibold text-[var(--color-text-primary)]">{count}</span>{' '}
          asset{count !== 1 ? 's' : ''}
          {selectedCategory !== 'All' && (
            <span className="ml-2">
              in <span className="font-medium">{selectedCategory}</span>
            </span>
          )}
          {searchQuery && (
            <span className="ml-2">
              for <span className="font-medium">"{searchQuery}"</span>
            </span>
          )}
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

export function MarketplaceCategoryPageClient({
  initialAssets,
  initialTotalCount,
  initialTotalPages,
  categories,
  kinds,
}: MarketplaceCategoryPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [assets, setAssets] = useState<AssetWithRelations[]>(initialAssets);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedKinds, setSelectedKinds] = useState<string[]>(
    searchParams.get('kind')?.split(',').filter(Boolean) || []
  );
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verified') === 'true');
  const [compatibility, setCompatibility] = useState<string[]>(
    searchParams.get('compat')?.split(',').filter(Boolean) || []
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'trending');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSidebar, setShowSidebar] = useState(false);

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
      if (selectedKinds.length > 0) params.set('kind', selectedKinds.join(','));
      if (verifiedOnly) params.set('verified', 'true');
      if (compatibility.length > 0) params.set('compat', compatibility.join(','));
      if (sortBy !== 'trending') params.set('sort', sortBy);
      params.set('page', currentPage.toString());
      params.set('limit', '20');

      const response = await fetch(`/api/marketplace?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setAssets(data.assets);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedKinds, verifiedOnly, compatibility, sortBy, currentPage]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
    if (selectedKinds.length > 0) params.set('kind', selectedKinds.join(','));
    if (verifiedOnly) params.set('verified', 'true');
    if (compatibility.length > 0) params.set('compat', compatibility.join(','));
    if (sortBy !== 'trending') params.set('sort', sortBy);
    router.replace(`${pathname}?${params.toString()}`);
  }, [
    searchQuery,
    selectedCategory,
    selectedKinds,
    verifiedOnly,
    compatibility,
    sortBy,
    router,
    pathname,
  ]);

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedKinds.length > 0 ||
    verifiedOnly ||
    compatibility.length > 0;

  const clearFilters = useCallback(() => {
    setSelectedCategory('All');
    setSelectedKinds([]);
    setVerifiedOnly(false);
    setCompatibility([]);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]">
        <div className="container-app px-4 py-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Marketplace</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Discover, install, and publish community AI assets
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSidebar(true)}
                className="lg:hidden"
              >
                <Filter className="mr-2 h-4 w-4" />
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
          resultsCount={totalCount}
          onClearFilters={clearFilters}
          categories={categories}
        />

        <main className="min-w-0 flex-1 p-4 lg:ml-0 lg:p-6">
          <ResultsHeader
            count={totalCount}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            hasActiveFilters={hasActiveFilters}
          />

          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--color-text-muted)]">Sort by:</span>
              <SortDropdown value={sortBy} onChange={setSortBy} />
              <div className="flex overflow-hidden rounded-lg border border-[var(--color-border)]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'grid'
                      ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                  )}
                  aria-label="Grid view"
                >
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded bg-current" />
                    <div className="h-2 w-2 rounded bg-current" />
                  </div>
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded bg-current" />
                    <div className="h-2 w-2 rounded bg-current" />
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'list'
                      ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                  )}
                  aria-label="List view"
                >
                  <div className="flex flex-col gap-1">
                    <div className="h-1 w-full rounded bg-current" />
                    <div className="h-1 w-full rounded bg-current" />
                    <div className="h-1 w-full rounded bg-current" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div
              className={cn(
                viewMode === 'grid'
                  ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'space-y-4'
              )}
              role="list"
              aria-label="Marketplace assets"
            >
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : assets.length === 0 ? (
            <EmptyState
              variant={
                searchQuery ? 'search' : selectedCategory !== 'All' ? 'marketplace' : 'default'
              }
              title={
                searchQuery
                  ? `No results for "${searchQuery}"`
                  : selectedCategory !== 'All'
                    ? `No assets in ${selectedCategory}`
                    : 'Marketplace is empty'
              }
              description={
                searchQuery
                  ? 'Try adjusting your search terms or filters.'
                  : 'Be the first to publish an asset!'
              }
              action={searchQuery ? { label: 'Clear search', href: pathname } : undefined}
            />
          ) : (
            <div
              className={cn(
                viewMode === 'grid'
                  ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'space-y-4'
              )}
              role="list"
              aria-label="Marketplace assets"
            >
              {assets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3 && currentPage < totalPages - 1) {
                    pageNum = currentPage - 2 + i;
                  } else if (currentPage >= totalPages - 1) {
                    pageNum = totalPages - 4 + i;
                  }
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isLoading}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <Button variant="outline" size="sm" disabled>
                  ...
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </main>
      </div>

      {showSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSidebar(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-96 overflow-y-auto border-l border-[var(--color-border)] bg-[var(--color-bg-surface)]">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
              <h2 className="font-semibold">Filters</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
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
              resultsCount={totalCount}
              onClearFilters={clearFilters}
              categories={categories}
            />
          </div>
        </div>
      )}
    </div>
  );
}