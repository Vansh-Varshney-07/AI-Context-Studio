'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { docCategories, type DocSidebarItem } from '@/data/docs';
import { FileText, ChevronRight, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DocSidebarProps {
  currentCategory: string;
  className?: string;
}

export function DocSidebar({ currentCategory, className }: DocSidebarProps) {
  const pathname = usePathname();
  docCategories.find((c) => c.id === currentCategory);

  const isActive = (href: string) =>
    pathname === href || (pathname.startsWith(href + '/') && href !== '/docs');

  return (
    <aside
      className={cn(
        'hidden w-72 flex-shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-surface)] lg:block',
        className
      )}
    >
      <nav className="flex h-full flex-col" aria-label="Documentation navigation">
        <div className="border-b border-[var(--color-border)] p-4">
          <h2 className="text-sm font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">
            Documentation
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
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
                      pathname={pathname}
                    />
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-[var(--color-border)] p-4">
          <Link
            href="https://github.com/ai-context-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            <FileText className="h-4 w-4" />
            Edit on GitHub
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>
    </aside>
  );
}

interface SidebarItemProps {
  item: DocSidebarItem;
  isActive: boolean;
  pathname: string;
}

function SidebarItem({ item, isActive, pathname }: SidebarItemProps) {
  const hasChildren = item.items && item.items.length > 0;

  if (hasChildren) {
    return (
      <li>
        <span
          className={cn(
            'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-[var(--color-text-secondary)]',
            isActive ? 'text-[var(--color-accent)]' : ''
          )}
        >
          <span className="truncate">{item.title}</span>
          {item.badge && (
            <Badge variant="accent" className="ml-auto text-xs">
              {item.badge}
            </Badge>
          )}
          <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" aria-hidden="true" />
        </span>
        <ul className="mt-1 space-y-1 border-l border-[var(--color-border)] pl-6" role="list">
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
      </li>
    );
  }

  return (
    <li>
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
    </li>
  );
}
