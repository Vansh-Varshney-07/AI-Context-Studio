import type { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";
import { docCategories } from "@/data/docs";
import Link from "next/link";
import { FileText, Terminal, Code, Shield, Plug, Cpu, BookText, Key, Globe, LayoutDashboard, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = generateMetadata({
  title: "Documentation",
  description: "Complete documentation for AI Context Studio. Learn installation, desktop app usage, marketplace, registry, MCP, skills, prompt files, API keys, security, and developer guides.",
});

const categoryIcons: Record<string, typeof LayoutDashboard> = {
  "getting-started": LayoutDashboard,
  installation: Terminal,
  desktop: Code,
  marketplace: Package,
  registry: Shield,
  mcp: Plug,
  skills: Cpu,
  "prompt-files": BookText,
  "api-keys": Key,
  security: Shield,
  "developer-guide": Globe,
  architecture: LayoutDashboard,
};

export default function DocsPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] tracking-tight">
          Documentation
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] max-w-3xl">
          Complete documentation for AI Context Studio. Learn installation, desktop app usage, marketplace, registry, MCP, skills, prompt files, API keys, security, and developer guides.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {docCategories.map((category) => {
          const Icon = categoryIcons[category.id] || FileText;
          return (
            <Link key={category.id} href={`/docs/${category.id}`} className="group">
              <Card className="card-hover h-full p-6 flex flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)] group-hover:scale-110 transition-transform duration-200">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                  {category.title}
                </h3>
                <p className="text-[var(--color-text-secondary)] mb-4 flex-1">
                  {category.description}
                </p>
                <Link href={`/docs/${category.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors mt-auto">
                  Browse {category.title.split(" ")[0]} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-16 p-8 bg-[var(--color-bg-secondary)] rounded-2xl text-center">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
          Can't find what you're looking for?
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-6 max-w-xl mx-auto">
          Search the full documentation or ask the community for help.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/docs/search" className="inline-flex items-center gap-2">
            <Button size="lg">Search Documentation</Button>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link href="https://discord.gg/ai-context-studio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
            <Button size="lg" variant="outline">Ask on Discord</Button>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}