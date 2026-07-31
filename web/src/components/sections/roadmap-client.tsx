'use client';

import { Header, Footer } from '@/components/layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CTA } from '@/components/sections/cta';
import {
  Calendar,
  CheckCircle,
  Zap,
  Star,
  Lightbulb,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
import type { RoadmapItem } from '@prisma/client';

const phaseIcons = {
  COMPLETED: CheckCircle,
  IN_PROGRESS: Zap,
  PLANNED: Star,
  FUTURE: Lightbulb,
};

const phaseColors = {
  COMPLETED: 'success',
  IN_PROGRESS: 'accent',
  PLANNED: 'violet',
  FUTURE: 'cyan',
};

const statusLabels = {
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In Progress',
  PLANNED: 'Planned',
  FUTURE: 'Future',
  CANCELLED: 'Cancelled',
};

interface RoadmapClientProps {
  initialItems?: RoadmapItem[];
}

export function RoadmapClient({ initialItems = [] }: RoadmapClientProps) {
  const [filter, setFilter] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Fetch items on mount if not provided
  // Note: In a real app, you'd use React Query or SWR for this

  const allItems = initialItems;

  const filteredItems =
    filter === 'all' ? allItems : allItems.filter((item) => item.status === filter);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <section className="flex flex-1 flex-col">
        <section id="roadmap" className="section" aria-labelledby="roadmap-heading">
          <div className="container-app">
            <div className="animate-slide-up mb-12 text-center">
              <h2
                id="roadmap-heading"
                className="mb-4 text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl"
              >
                Product Roadmap
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--color-text-secondary)]">
                Transparent development. See what we've shipped, what we're building, and where
                we're headed.
              </p>

              <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                  }`}
                >
                  All Phases
                </button>
                {Object.keys(statusLabels).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      filter === status
                        ? `bg-[var(--color-${phaseColors[status as keyof typeof phaseColors]}])] text-white`
                        : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                    }`}
                  >
                    {statusLabels[status as keyof typeof statusLabels]}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div
                className="absolute top-0 bottom-0 left-1/2 w-px bg-[var(--color-border)]"
                aria-hidden="true"
              />

              <div className="space-y-8">
                {filteredItems.map((item, index) => {
                  const isExpanded = expandedItems.has(item.id);
                  const Icon = phaseIcons[item.status as keyof typeof phaseIcons];
                  const badgeVariant = phaseColors[item.status as keyof typeof phaseColors] as
                    'success' | 'accent' | 'violet' | 'cyan';

                  return (
                    <div
                      key={item.id}
                      className="animate-slide-up relative flex"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div
                        className={`w-1/2 pr-8 lg:w-1/2 ${index % 2 === 0 ? '' : 'ml-auto pl-8 lg:pl-0'}`}
                      >
                        <Card className={`card-hover relative p-6 ${index % 2 === 0 ? '' : ''}`}>
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-${badgeVariant}-light)] text-[var(--color-${badgeVariant})] flex-shrink-0`}
                            >
                              <Icon className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="mb-2 flex items-center gap-2">
                                <h3 className="font-semibold text-[var(--color-text-primary)]">
                                  {item.title}
                                </h3>
                                <Badge variant={badgeVariant}>
                                  {statusLabels[item.status as keyof typeof statusLabels]}
                                </Badge>
                              </div>
                              <p className="mb-3 text-[var(--color-text-secondary)]">
                                {item.description}
                              </p>
                              <div className="mb-3 flex flex-wrap items-center gap-2">
                                {item.tags.map((tag, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {item.quarter && (
                                  <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                                    <Calendar className="h-3 w-3" />
                                    {item.quarter}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => toggleExpand(item.id)}
                                className="flex items-center gap-1 text-sm font-medium text-[var(--color-accent)] hover:underline"
                              >
                                {isExpanded ? 'Show less' : 'Show details'}{' '}
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                />
                              </button>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="animate-slide-down mt-4 border-t border-[var(--color-border)] pt-4">
                              <div className="space-y-3">
                                <div>
                                  <h4 className="mb-2 font-medium text-[var(--color-text-primary)]">
                                    Implementation Details
                                  </h4>
                                  <p className="text-sm text-[var(--color-text-secondary)]">
                                    {item.details}
                                  </p>
                                </div>
                                {item.links && Array.isArray(item.links) && item.links.length > 0 && (
                                  <div>
                                    <h4 className="mb-2 font-medium text-[var(--color-text-primary)]">
                                      Related Links
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {(item.links as Array<{ label: string; href: string }>).map((link, i) => (
                                        <a
                                          key={i}
                                          href={link.href}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)] hover:underline"
                                        >
                                          {link.label}
                                          <ExternalLink className="h-3 w-3" />
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Card>
                      </div>

                      <div
                        className={`absolute top-10 left-1/2 h-3 w-3 rounded-full border-2 border-[var(--color-border)] bg-[var(--color-bg-primary)] ${index % 2 === 0 ? '-translate-x-1/2' : '-translate-x-1/2'}`}
                        aria-hidden="true"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="animate-slide-up mt-16 text-center" style={{ animationDelay: '0.4s' }}>
              <h3 className="mb-4 text-xl font-semibold text-[var(--color-text-primary)]">
                Want to influence the roadmap?
              </h3>
              <p className="mx-auto mb-6 max-w-xl text-[var(--color-text-secondary)]">
                Join the discussion on GitHub. Vote on issues, propose features, and help prioritize
                what we build next.
              </p>
              <a
                href="https://github.com/ai-context-studio/roadmap"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Button size="lg">View Roadmap Discussions</Button>
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
        </section>
        <CTA />
      </section>
      <Footer />
    </main>
  );
}