'use client';

import Link from "next/link";
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState } from 'react';
import {
  Search,
  Filter,
  Zap,
  Bot,
  FileText,
  Package,
  GitBranch,
  Server,
  Check,
  ArrowRight,
  Keyboard,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MotionDiv, MotionUl, MotionLi } from '@/components/ui/motion';

const mockSuggestions = [
  { label: 'code review assistant', type: 'skill', category: 'Skills' },
  { label: 'senior engineer persona', type: 'persona', category: 'Personas' },
  { label: 'react component template', type: 'template', category: 'Templates' },
  { label: 'python data science pack', type: 'promptPack', category: 'Prompt Packs' },
  { label: 'claude.md instructions', type: 'instructionFile', category: 'Instruction Files' },
  { label: 'ci/cd pipeline workflow', type: 'workflow', category: 'Workflows' },
  { label: 'postgres mcp server', type: 'mcpConfig', category: 'MCP Servers' },
];

function TypeIcon({ type }: { type: string }) {
  const icons: Record<string, typeof Search> = {
    skill: Zap,
    persona: Bot,
    template: FileText,
    promptPack: Package,
    workflow: GitBranch,
    mcpConfig: Server,
    instructionFile: FileText,
  };
  const Icon = icons[type] || Search;
  return <Icon className="h-4 w-4" />;
}

export function SearchPreview() {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(springY, [-100, 100], [5, -5]);
  const rotateY = useTransform(springX, [-100, 100], [-5, 5]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, mockSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      // Navigate to asset
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const filteredSuggestions = mockSuggestions.filter(
    (s) =>
      s.label.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section id="search" className="section" aria-labelledby="search-heading">
      <div className="container-app">
        <MotionDiv
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2
            id="search-heading"
            className="mb-4 text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl"
          >
            Intelligent Search — Find Anything Instantly
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--color-text-secondary)]">
            Fuzzy search across all assets, prompts, memories, and workflows. Keyboard-first with
            rich previews.
          </p>
        </MotionDiv>

        <MotionDiv
          className="mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            mouseX.set(e.clientX - rect.left - rect.width / 2);
            mouseY.set(e.clientY - rect.top - rect.height / 2);
          }}
          onMouseLeave={() => {
            mouseX.set(0);
            mouseY.set(0);
          }}
        >
          <div className="relative">
            <div className="relative">
              <Search
                className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Search assets, prompts, workflows…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                  setSelectedIndex(-1);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={handleKeyDown}
                className="h-14 bg-[var(--color-bg-surface)] pr-16 pl-12 text-lg shadow-lg"
                autoComplete="off"
                aria-label="Search marketplace"
                aria-expanded={showSuggestions && filteredSuggestions.length > 0}
                aria-controls="search-suggestions"
                aria-autocomplete="list"
              />
              <div className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center gap-2">
                <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-2 py-1 font-mono text-xs text-[var(--color-text-muted)]">
                  ⌘K
                </kbd>
                <Filter className="h-5 w-5 text-[var(--color-text-muted)]" />
              </div>
            </div>

            {showSuggestions && filteredSuggestions.length > 0 && (
              <MotionUl
                id="search-suggestions"
                role="listbox"
                className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-xl"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <MotionLi
                    key={suggestion.label}
                    role="option"
                    aria-selected={index === selectedIndex}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors',
                      index === selectedIndex
                        ? 'bg-[var(--color-accent-light)]'
                        : 'hover:bg-[var(--color-bg-secondary)]'
                    )}
                    onClick={() => setQuery(suggestion.label)}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-light)] text-[var(--color-accent)]">
                      <TypeIcon type={suggestion.type} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[var(--color-text-primary)]">
                        {suggestion.label}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.category}
                      </Badge>
                    </div>
                    <Check className="h-5 w-5 text-[var(--color-success)]" />
                  </MotionLi>
                ))}
                <MotionLi className="border-t border-[var(--color-border)] px-4 py-3">
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <ArrowRight className="h-4 w-4" />
                    View all results for "{query}"
                  </Button>
                </MotionLi>
              </MotionUl>
            )}

            {showSuggestions && filteredSuggestions.length === 0 && query && (
              <MotionDiv
                className="absolute top-full right-0 left-0 z-50 mt-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 shadow-xl"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-center text-[var(--color-text-muted)]">
                  No results for "{query}"
                </p>
                <p className="mt-1 text-center text-sm text-[var(--color-text-muted)]">
                  Try a different keyword or{' '}
                  <Link href="/marketplace" className="text-[var(--color-accent)] hover:underline">
                    browse all assets
                  </Link>
                </p>
              </MotionDiv>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-[var(--color-text-muted)]">
            <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-2 py-1 font-mono">
              ⌘K
            </kbd>
            <span>to open search anywhere</span>
            <span className="flex items-center gap-1">
              <Keyboard className="h-3 w-3" />
              <span>↑↓</span> to navigate
            </span>
            <span className="flex items-center gap-1">
              <Keyboard className="h-3 w-3" />
              <span>Enter</span> to select
            </span>
          </div>
        </MotionDiv>

        <MotionDiv
          className="mt-16 grid gap-6 md:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="card-hover p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)]">
              <Zap className="h-6 w-6" />
            </div>
            <h4 className="mb-2 font-semibold text-[var(--color-text-primary)]">Instant Results</h4>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Sub-100ms fuzzy search across all asset metadata, content, and tags. Powered by
              client-side index.
            </p>
          </Card>
          <Card className="card-hover p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-violet-light)] text-[var(--color-violet)]">
              <Filter className="h-6 w-6" />
            </div>
            <h4 className="mb-2 font-semibold text-[var(--color-text-primary)]">Smart Filters</h4>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Filter by type, category, compatibility, verified status, rating, and date. URL-synced
              for sharing.
            </p>
          </Card>
          <Card className="card-hover p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-cyan-light)] text-[var(--color-cyan)]">
              <ArrowRight className="h-6 w-6" />
            </div>
            <h4 className="mb-2 font-semibold text-[var(--color-text-primary)]">Keyboard-First</h4>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Full keyboard navigation. Open with ⌘K, navigate with arrows, select with Enter. No
              mouse required.
            </p>
          </Card>
        </MotionDiv>
      </div>
    </section>
  );
}
