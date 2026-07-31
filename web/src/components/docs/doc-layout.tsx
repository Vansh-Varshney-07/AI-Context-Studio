'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { docCategories, type DocSidebarItem } from '@/data/docs';
import { Github, FileText, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DocLayoutProps {
  children: React.ReactNode;
  currentCategory: string;
  _currentPage?: string;
}

export function DocLayout({ children, currentCategory, _currentPage }: DocLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const pathname = usePathname();

  const category = docCategories.find((c) => c.id === currentCategory);

  useEffect(() => {
    const current = category?.items.find((item) => item.href === pathname);
    if (current && current.items) {
      setExpandedSections((prev) => [...new Set([...prev, current.href])]);
    }
  }, [pathname, category]);

  const toggleSection = (href: string) => {
    setExpandedSections((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const isActive = (href: string) =>
    pathname === href || (pathname.startsWith(href + '/') && href !== '/docs');

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-primary)]">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 transform border-r border-[var(--color-border)] bg-[var(--color-bg-surface)] transition-transform duration-300 lg:static lg:translate-x-0',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Documentation sidebar"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-[var(--color-border)] px-4 lg:hidden">
            <h2 className="font-semibold text-[var(--color-text-primary)]">Documentation</h2>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
              aria-label="Close sidebar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4" aria-label="Documentation navigation">
            <ul className="space-y-6" role="list">
              {docCategories.map((cat) => (
                <li key={cat.id} className="space-y-2">
                  <h3 className="px-2 text-xs font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">
                    {cat.title}
                  </h3>
                  <ul className="space-y-1" role="list">
                    {cat.items.map((item) => (
                      <SidebarItem
                        key={item.href}
                        item={item}
                        isActive={isActive(item.href)}
                        expanded={expandedSections.includes(item.href)}
                        onToggle={() => item.items && toggleSection(item.href)}
                        pathname={pathname}
                      />
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-[var(--color-border)] p-4 lg:hidden">
            <Link
              href="https://github.com/ai-context-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              <Github className="h-4 w-4" />
              Edit on GitHub
            </Link>
          </div>
        </div>
      </aside>

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <button
        className="fixed right-4 bottom-4 z-50 rounded-full bg-[var(--color-accent)] p-3 text-white shadow-lg lg:hidden"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <FileText className="h-6 w-6" />
      </button>

      <div className="min-w-0 flex-1 lg:pl-72">
        <main className="mx-auto max-w-4xl px-6 py-12" role="main">
          <article className="prose prose-lg dark:prose-invert max-w-none">{children}</article>
        </main>

        <footer className="border-t border-[var(--color-border)] py-8">
          <div className="mx-auto max-w-4xl px-6">
            <Link
              href="https://github.com/ai-context-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              <Github className="h-4 w-4" />
              Edit this page on GitHub
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  item: DocSidebarItem;
  isActive: boolean;
  expanded: boolean;
  onToggle: () => void;
  pathname: string;
}

function SidebarItem({ item, isActive, expanded, onToggle, pathname }: SidebarItemProps) {
  const hasChildren = item.items && item.items.length > 0;

  return (
    <li>
      {hasChildren ? (
        <>
          <button
            onClick={onToggle}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]'
            )}
            aria-expanded={expanded}
            aria-controls={`${item.href}-submenu`}
          >
            <span className="truncate">{item.title}</span>
            {item.badge && (
              <Badge variant="accent" className="ml-auto text-xs">
                {item.badge}
              </Badge>
            )}
            <ChevronDown
              className={cn(
                'h-4 w-4 text-[var(--color-text-muted)] transition-transform',
                expanded && 'rotate-180'
              )}
              aria-hidden="true"
            />
          </button>
          <ul
            id={`${item.href}-submenu`}
            role="list"
            className={cn(
              'mt-1 space-y-1 border-l border-[var(--color-border)] pl-6',
              expanded ? 'max-h-96 opacity-100' : 'max-h-0 overflow-hidden opacity-0'
            )}
            style={{ transition: 'max-height 0.2s ease, opacity 0.2s ease' }}
          >
            {item.items?.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className={cn(
                    'block rounded-lg px-2 py-1.5 text-sm font-medium transition-colors',
                    pathname === child.href
                      ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]'
                  )}
                >
                  {child.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Link
          href={item.href}
          className={cn(
            'block rounded-lg px-2 py-1.5 text-sm font-medium transition-colors',
            isActive
              ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]'
          )}
        >
          {item.title}
          {item.badge && (
            <Badge variant="accent" className="ml-2 text-xs">
              {item.badge}
            </Badge>
          )}
        </Link>
      )}
    </li>
  );
}
