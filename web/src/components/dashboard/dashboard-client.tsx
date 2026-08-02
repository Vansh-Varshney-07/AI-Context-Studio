"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, FileText, Download, Star, Zap, Loader2, Plus, Code2, TrendingUp, Bookmark } from "lucide-react";

const KIND_LABELS: Record<string, string> = {
  SYSTEM_PROMPT: "System Prompt",
  INSTRUCTION_FILE: "Instruction File",
  PERSONA: "Persona",
  WORKFLOW: "Workflow",
  MEMORY: "Memory",
  CONTEXT_FILE: "Context File",
  PROMPT_TEMPLATE: "Prompt Template",
  MCP_CONFIG: "MCP Config",
};

interface GeneratedFile {
  id: string;
  kind: string;
  title: string;
  content: string;
  isPublic: boolean;
  isFavorite: boolean;
  tokens: number | null;
  modelUsed: string | null;
  createdAt: string;
}

interface DashboardClientProps {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    email: string;
    avatar: string | null;
    bio: string | null;
    emailVerified: boolean;
  };
  stats: {
    totalAssets: number;
    publishedAssets: number;
    totalPosts: number;
    totalGenerated: number;
    favoriteGenerated: number;
    recentActive: number;
    followers: number;
    following: number;
  } | null;
  recentFiles: {
    files: GeneratedFile[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}

export function DashboardClient(props: DashboardClientProps) {
  const stats = props.stats;
  const recentFiles = props.recentFiles;
  const user = props.user;
  if (!user) return null;
  
  // Helper for initial
  const initial = (user.name ?? user.username ?? "U").charAt(0).toUpperCase();
  
  const statsCards = [
    { label: "Total Assets", value: stats?.totalAssets ?? 0, icon: Package, color: "text-blue-500" },
    { label: "Asset Entries", value: stats?.totalGenerated ?? 0, icon: Zap, color: "text-[var(--color-accent)]" },
    { label: "Published", value: stats?.publishedAssets ?? 0, icon: FileText, color: "text-green-500" },
    { label: "Favorites", value: stats?.favoriteGenerated ?? 0, icon: Star, color: "text-yellow-500" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-[var(--color-accent)]">
                {initial}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
              Welcome, {user.name || user.username || "User"}!
            </h1>
            <div className="text-sm text-[var(--color-text-muted)] flex items-center gap-2 mt-1">
              <span>@{user.username || "username"}</span>
              {user.emailVerified ? (
                <Badge className="bg-green-500/20 text-green-500 text-xs">Verified</Badge>
              ) : (
                <Badge className="bg-yellow-500/20 text-yellow-500 text-xs">Unverified</Badge>
              )}
            </div>
          </div>
        </div>
        <Link href="/generate">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Generate New File
          </Button>
        </Link>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <div key={stat.label} className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--color-text-secondary)]">{stat.label}</span>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <p className="text-3xl font-bold text-[var(--color-text-primary)]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Files */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Recent Generated Files</h2>
          <Link href="/dashboard/my-assets" className="text-sm text-[var(--color-accent)] hover:underline">
            View all →
          </Link>
        </div>

        {recentFiles.files.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-12 text-center">
            <Code2 className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-4 opacity-50" />
            <p className="text-[var(--color-text-secondary)] mb-2">No generated files yet</p>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">Start by generating your first AI instruction file</p>
            <Link href="/generate">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Generate File
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentFiles.files.map((file) => (
              <div key={file.id} className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-strong)] transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">{KIND_LABELS[file.kind] || file.kind}</Badge>
                  {file.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                </div>
                <p className="font-medium text-[var(--color-text-primary)] truncate" title={file.title}>{file.title}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-2">
                  {new Date(file.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
                {file.tokens && <p className="text-xs text-[var(--color-text-muted)] mt-1">{file.tokens} tokens</p>}
                {file.modelUsed && <Badge variant="secondary" className="text-xs mt-2">{file.modelUsed}</Badge>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick Links */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/generate" className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent)] transition-colors group">
          <Zap className="h-8 w-8 text-[var(--color-accent)] mb-3" />
          <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">Generate File</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Create AI instruction files</p>
        </Link>
        <Link href="/dashboard/my-assets" className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent)] transition-colors group">
          <Package className="h-8 w-8 text-blue-500 mb-3" />
          <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">My Assets</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">View all generated files</p>
        </Link>
        <Link href="/settings" className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent)] transition-colors group">
          <Bookmark className="h-8 w-8 text-yellow-500 mb-3" />
          <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">Settings</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Manage your profile</p>
        </Link>
      </section>
    </div>
  );
}
