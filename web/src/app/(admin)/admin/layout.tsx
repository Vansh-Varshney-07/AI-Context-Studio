"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Package,
  Megaphone,
  Flag,
  BarChart,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  FileText,
  Bell,
  Zap,
  TrendingUp,
  BookOpen,
  Mail,
  Code2,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/assets", label: "Assets", icon: Package },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/templates", label: "Templates", icon: Code2 },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/feature-flags", label: "Feature Flags", icon: Flag },
  { href: "/admin/contacts", label: "Contacts", icon: Mail },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart },
];

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Mobile sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex h-full flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className={cn("flex h-16 items-center justify-between border-b border-[var(--color-border)] px-4", sidebarCollapsed && "justify-center")}>
          <Link href="/admin" className="flex items-center gap-2" aria-label="AI Context Studio Admin">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <span className="text-xl font-bold text-[var(--color-text-primary)]">Admin</span>
            )}
          </Link>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn("p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] transition-colors", sidebarCollapsed && "ml-auto")}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="h-5 w-5 text-[var(--color-text-muted)] rotate-180" /> : <ChevronRight className="h-5 w-5 text-[var(--color-text-muted)]" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1" aria-label="Admin navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]",
                  sidebarCollapsed && "justify-center"
                )}
                aria-current={isActive ? "page" : undefined}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--color-border)] p-4">
          <div className={cn("flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--color-text-muted)]", sidebarCollapsed && "justify-center")}>
            <Shield className="h-5 w-5 shrink-0" aria-hidden="true" />
            {!sidebarCollapsed && <span>Admin Panel</span>}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/80 backdrop-blur px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded hover:bg-[var(--color-bg-tertiary)] transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6 text-[var(--color-text-primary)]" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
              View Site
            </Link>
            <a
              href="https://github.com/Vansh-Varshney-07/AI-Context-Studio"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded hover:bg-[var(--color-bg-tertiary)] transition-colors"
              aria-label="GitHub"
            >
              <svg className="h-5 w-5 text-[var(--color-text-muted)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <div className="w-px h-6 bg-[var(--color-border)]" />
            <div className="flex items-center gap-3 pl-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs text-[var(--color-text-muted)]">Signed in as</p>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">Admin</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-[var(--color-accent)]" />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}// Next.js layout — pass-through (pages import AdminLayoutShell manually to wrap with the sidebar shell)
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
