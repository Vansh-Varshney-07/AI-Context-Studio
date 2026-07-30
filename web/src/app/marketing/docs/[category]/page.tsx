import type { Metadata } from 'next';
import { docCategories, getCategory } from '@/data/docs';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
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

export async function generateStaticParams() {
  return docCategories.map((cat) => ({
    category: cat.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  return generatePageMetadata({
    title: cat?.title || 'Documentation',
    description: cat?.description || 'Documentation for AI Context Studio',
  });
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'getting-started': () => <LayoutDashboard className="h-5 w-5" />,
  installation: () => <Terminal className="h-5 w-5" />,
  desktop: () => <Code className="h-5 w-5" />,
  marketplace: () => <Package className="h-5 w-5" />,
  registry: () => <Shield className="h-5 w-5" />,
  mcp: () => <Plug className="h-5 w-5" />,
  skills: () => <Cpu className="h-5 w-5" />,
  'prompt-files': () => <BookText className="h-5 w-5" />,
  'api-keys': () => <Key className="h-5 w-5" />,
  security: () => <Shield className="h-5 w-5" />,
  'developer-guide': () => <Globe className="h-5 w-5" />,
  architecture: () => <LayoutDashboard className="h-5 w-5" />,
};

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = getCategory(category);

  if (!cat) {
    return (
      <div className="container-app py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold text-[var(--color-text-primary)]">
          Category not found
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          The documentation category you're looking for doesn't exist.
        </p>
        <Link href="/docs" className="mt-4 inline-block text-[var(--color-accent)] hover:underline">
          <span>&larr;</span> Back to Documentation
        </Link>
      </div>
    );
  }

  const Icon = categoryIcons[category] || (() => <FileText className="h-5 w-5" />);

  return (
    <div className="container-app space-y-8 py-16">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent-light)] text-[var(--color-accent)]">
            <Icon />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{cat.title}</h1>
            <p className="text-[var(--color-text-secondary)]">{cat.description}</p>
          </div>
        </div>
      </header>

      <div className="space-y-4">
        {cat.items.map((item, index) => (
          <div
            key={item.href}
            className="group rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 transition-colors hover:border-[var(--color-border-strong)]"
          >
            <Link
              href={item.href}
              className="flex items-center gap-3 text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent)]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-light)] text-[var(--color-accent)] transition-transform duration-200 group-hover:scale-110">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-[var(--color-text-primary)]">{item.title}</h3>
                {item.badge && (
                  <span className="rounded-full bg-[var(--color-accent-light)] px-2 py-0.5 text-xs text-[var(--color-accent)]">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
            <p className="mt-2 ml-11 max-w-2xl text-sm text-[var(--color-text-muted)]">
              Learn about {item.title.toLowerCase()} in AI Context Studio.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
