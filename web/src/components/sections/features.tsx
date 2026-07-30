"use client";

import { listStagger, slideUp } from "@/lib/animations";
import { features } from "@/data/constants";
import { Card } from "@/components/ui/card";
import { 
  FileText, 
  FileCode, 
  Database, 
  Plug, 
  GitBranch, 
  Package,
  Bot, 
  Cpu, 
  BookText, 
  Search, 
  Settings 
} from "lucide-react";

const featureIcons = {
  "System Prompts": FileText,
  "Instruction Files": FileCode,
  "Memories & Context": Database,
  "MCP Servers": Plug,
  "Workflows": GitBranch,
  "Export Anywhere": Package,
  "Personas": Bot,
  "Skills": Cpu,
  "Prompt Library": BookText,
  "Search": Search,
  "Settings": Settings,
};

export function Features() {
  return (
    <section id="features" className="section bg-[var(--color-bg-secondary)]">
      <div className="container-app">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            Everything you need for prompt engineering
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            A complete toolkit for building, managing, and exporting AI instruction assets across all major coding assistants.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" style={{ opacity: 0, transform: 'translateY(20px)', animation: 'slideUp 0.5s ease-out 0.2s forwards' }}>
          {features.map((feature, index) => {
            const Icon = featureIcons[feature.title as keyof typeof featureIcons] || FileText;
            return (
              <div key={feature.title} style={{ opacity: 0, transform: 'translateY(20px)', animation: `slideUp 0.5s ease-out ${0.2 + index * 0.08}s forwards` }}>
                <Card className="card-hover h-full p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)] group-hover:scale-110 transition-transform duration-200">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">
                    {feature.desc}
                  </p>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}