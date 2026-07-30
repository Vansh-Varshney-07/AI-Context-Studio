"use client";

import { Header, Footer } from "@/components/layout";
import { roadmapPhases } from "@/data/roadmap";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CTA } from "@/components/sections/cta";
import { Calendar, CheckCircle, Clock, Zap, Star, Rocket, Bug, Lightbulb, ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";

const phaseIcons = {
  completed: CheckCircle,
  "in-progress": Zap,
  planned: Star,
  future: Lightbulb,
};

const phaseColors = {
  completed: "success",
  "in-progress": "accent",
  planned: "violet",
  future: "cyan",
};

const statusLabels = {
  completed: "Completed",
  "in-progress": "In Progress",
  planned: "Planned",
  future: "Future",
};

export function RoadmapClient() {
  const [filter, setFilter] = useState<string>("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const allItems = roadmapPhases.flatMap(phase => 
    phase.items.map(item => ({ ...item, phase: phase.phase, phaseColor: phase.status }))
  );

  const filteredItems = filter === "all" 
    ? allItems 
    : allItems.filter(item => item.status === filter);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 flex flex-col">
        <section id="roadmap" className="section" aria-labelledby="roadmap-heading">
          <div className="container-app">
            <div className="text-center mb-12 animate-slide-up">
              <h2 id="roadmap-heading" className="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
                Product Roadmap
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8">
                Transparent development. See what we've shipped, what we're building, and where we're headed.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                <button 
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "all"
                      ? "bg-[var(--color-accent)] text-white"
                      : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]"
                  }`}
                >
                  All Phases
                </button>
                {Object.keys(statusLabels).map(status => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === status
                        ? `bg-[var(--color-${phaseColors[status as keyof typeof phaseColors]}])] text-white`
                        : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]"
                    }`}
                  >
                    {statusLabels[status as keyof typeof statusLabels]}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--color-border)]" aria-hidden="true" />
              
              <div className="space-y-8">
                {filteredItems.map((item, index) => {
                  const isExpanded = expandedItems.has(item.id);
                  const Icon = phaseIcons[item.status as keyof typeof phaseIcons];
                  const badgeVariant = phaseColors[item.status as keyof typeof phaseColors] as "success" | "accent" | "violet" | "cyan";
                  
                  return (
                    <div key={item.id} className="relative flex animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                      <div className={`w-1/2 pr-8 lg:w-1/2 ${index % 2 === 0 ? '' : 'ml-auto pl-8 lg:pl-0'}`}>
                        <Card className={`card-hover p-6 relative ${index % 2 === 0 ? '' : ''}`}>
                          <div className="flex items-start gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-${badgeVariant}-light)] text-[var(--color-${badgeVariant})] flex-shrink-0`}>
                              <Icon className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
                                <Badge variant={badgeVariant}>{statusLabels[item.status as keyof typeof statusLabels]}</Badge>
                              </div>
                              <p className="text-[var(--color-text-secondary)] mb-3">{item.description}</p>
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                {item.tags.map((tag, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                                ))}
                                <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {item.quarter}
                                </span>
                              </div>
                              <button
                                onClick={() => toggleExpand(item.id)}
                                className="text-sm font-medium text-[var(--color-accent)] hover:underline flex items-center gap-1"
                              >
                                {isExpanded ? 'Show less' : 'Show details'} <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-[var(--color-border)] animate-slide-down">
                              <div className="space-y-3">
                                <div>
                                  <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Implementation Details</h4>
                                  <p className="text-sm text-[var(--color-text-secondary)]">{item.details}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </Card>
                      </div>

                      <div className={`absolute left-1/2 top-10 w-3 h-3 rounded-full border-2 border-[var(--color-border)] bg-[var(--color-bg-primary)] ${index % 2 === 0 ? '-translate-x-1/2' : '-translate-x-1/2'}`} aria-hidden="true" />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-16 text-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Want to influence the roadmap?</h3>
              <p className="text-[var(--color-text-secondary)] mb-6 max-w-xl mx-auto">
                Join the discussion on GitHub. Vote on issues, propose features, and help prioritize what we build next.
              </p>
              <a href="https://github.com/ai-context-studio/roadmap" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
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