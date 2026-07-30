import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';
import { docCategories } from '@/data/docs';
import Link from 'next/link';
import {
  FileText,
  Terminal,
  Code,
  Shield,
  Plug,
  Cpu,
  BookText,
  Key,
  Globe,
  LayoutDashboard,
  Package,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = generateMetadata({
  title: 'Documentation',
  description:
    'Complete documentation for AI Context Studio. Learn installation, desktop app usage, marketplace, registry, MCP, skills, prompt files, API keys, security, and developer guides.',
});

const categoryIcons: Record<string, typeof LayoutDashboard> = {
  'getting-started': LayoutDashboard,
  installation: Terminal,
  desktop: Code,
  marketplace: Package,
  registry: Shield,
  mcp: Plug,
  skills: Cpu,
  'prompt-files': BookText,
  'api-keys': Key,
  security: Shield,
  'developer-guide': Globe,
  architecture: LayoutDashboard,
};

export default function DocsPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Documentation
        </h1>
        <p className="max-w-3xl text-lg text-[var(--color-text-secondary)]">
          Complete documentation for AI Context Studio. Learn installation, desktop app usage,
          marketplace, registry, MCP, skills, prompt files, API keys, security, and developer
          guides.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {docCategories.map((category) => {
          const Icon = categoryIcons[category.id] || FileText;
          return (
            <Link key={category.id} href={`/docs/${category.id}`} className="group">
              <Card className="card-hover flex h-full flex-col p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)] transition-transform duration-200 group-hover:scale-110">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">
                  {category.title}
                </h3>
                <p className="mb-4 flex-1 text-[var(--color-text-secondary)]">
                  {category.description}
                </p>
                <Link
                  href={`/docs/${category.id}`}
                  className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
                >
                  Browse {category.title.split(' ')[0]}{' '}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-16 rounded-2xl bg-[var(--color-bg-secondary)] p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
          Can't find what you're looking for?
        </h2>
        <p className="mx-auto mb-6 max-w-xl text-[var(--color-text-secondary)]">
          Search the full documentation or ask the community for help.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/docs/search" className="inline-flex items-center gap-2">
            <Button size="lg">Search Documentation</Button>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="https://discord.gg/ai-context-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <Button size="lg" variant="outline">
              Ask on Discord
            </Button>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
