"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronDown, Github, ExternalLink, FileText, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { docCategories, type DocCategory, type DocSidebarItem } from "@/data/docs";

interface DocLayoutProps {
  children: React.ReactNode;
  currentCategory: string;
  currentPage?: string;
}

export function DocLayout({ children, currentCategory, currentPage }: DocLayoutProps) {
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

  const isActive = (href: string) => pathname === href || (pathname.startsWith(href + "/") && href !== "/docs");

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-primary)]">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-[var(--color-bg-surface)] border-r border-[var(--color-border)] transform transition-transform duration-300 lg:static lg:translate-x-0",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Documentation sidebar"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--color-border)] lg:hidden">
            <h2 className="font-semibold text-[var(--color-text-primary)]">Documentation</h2>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
              aria-label="Close sidebar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4" aria-label="Documentation navigation">
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

          <div className="p-4 border-t border-[var(--color-border)] lg:hidden">
            <Link
              href="https://github.com/ai-context-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
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
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 rounded-full bg-[var(--color-accent)] text-white shadow-lg"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <FileText className="h-6 w-6" />
      </button>

      <div className="lg:pl-72 flex-1 min-w-0">
        <main className="max-w-4xl mx-auto px-6 py-12" role="main">
          <article className="prose prose-lg dark:prose-invert max-w-none">
            {children}
          </article>
        </main>

        <footer className="border-t border-[var(--color-border)] py-8">
          <div className="max-w-4xl mx-auto px-6">
            <Link
              href="https://github.com/ai-context-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
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
              "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "text-[var(--color-accent)] bg-[var(--color-accent-light)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
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
                "h-4 w-4 text-[var(--color-text-muted)] transition-transform",
                expanded && "rotate-180"
              )}
              aria-hidden="true"
            />
          </button>
          <ul
            id={`${item.href}-submenu`}
            role="list"
            className={cn(
              "mt-1 space-y-1 pl-6 border-l border-[var(--color-border)]",
              expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
            )}
            style={{ transition: "max-height 0.2s ease, opacity 0.2s ease" }}
          >
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
        </>
      ) : (
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
      )}
    </li>
  );
}