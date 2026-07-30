"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronDown, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { docCategories, type DocCategory, type DocSidebarItem } from "@/data/docs";

interface DocSidebarProps {
  currentCategory: string;
  className?: string;
}

export function DocSidebar({ currentCategory, className }: DocSidebarProps) {
  const pathname = usePathname();
  const category = docCategories.find((c) => c.id === currentCategory);

  const isActive = (href: string) => pathname === href || (pathname.startsWith(href + "/") && href !== "/docs");

  return (
    <aside className={cn("w-72 flex-shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-surface)] hidden lg:block", className)}>
      <nav className="h-full flex flex-col" aria-label="Documentation navigation">
        <div className="p-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Documentation</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-6" role="list">
            {docCategories.map((cat) => (
              <li key={cat.id} className="space-y-2">
                <h3 className="px-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
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
        <div className="p-4 border-t border-[var(--color-border)]">
          <Link
            href="https://github.com/ai-context-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
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
        <span className={cn(
          "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-medium text-[var(--color-text-secondary)]",
          isActive ? "text-[var(--color-accent)]" : ""
        )}>
          <span className="truncate">{item.title}</span>
          {item.badge && (
            <Badge variant="accent" className="ml-auto text-xs">
              {item.badge}
            </Badge>
          )}
          <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" aria-hidden="true" />
        </span>
        <ul className="mt-1 space-y-1 pl-6 border-l border-[var(--color-border)]" role="list">
          {item.items?.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                className={cn(
                  "block px-2 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === child.href
                    ? "text-[var(--color-accent)] bg-[var(--color-accent-light)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
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
          "block px-2 py-1.5 rounded-lg text-sm font-medium transition-colors",
          isActive
            ? "text-[var(--color-accent)] bg-[var(--color-accent-light)]"
            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
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