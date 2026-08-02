"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Search, Loader2, Eye, Edit2, Trash2, Plus, BookOpen } from "lucide-react";
import Link from "next/link";
import { AdminLayoutShell as AdminLayout } from "../layout";

type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  status: BlogStatus;
  featured: boolean;
  publishedAt: string | null;
  viewCount: number;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    avatar: string | null;
  };
  categories: Array<{ category: { id: string; slug: string; name: string } }>;
  createdAt: string;
}

interface BlogResponse {
  posts: BlogPost[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

const STATUS_COLORS: Record<BlogStatus, string> = {
  DRAFT: "bg-gray-500/20 text-gray-500",
  PUBLISHED: "bg-green-500/20 text-green-500",
  ARCHIVED: "bg-gray-500/20 text-gray-500",
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BlogStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "50" });
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/blog?${params}`);
      if (res.ok) {
        const data: BlogResponse = await res.json();
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
      }
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    setDeleteLoading(id);
    try {
      await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
      fetchPosts();
    } catch (error) {
      console.error("Failed to delete post:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Blog Posts</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Manage blog content and articles</p>
          </div>
          <Link href="/admin/blog/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </header>

        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <Input
              placeholder="Search title, excerpt..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
              onKeyDown={(e) => e.key === "Enter" && fetchPosts()}
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as BlogStatus | "all"); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)] mx-auto mb-4" />
              <p className="text-[var(--color-text-muted)]">Loading posts...</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-64">Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Categories</TableHead>
                    <TableHead className="hidden lg:table-cell">Views</TableHead>
                    <TableHead className="hidden lg:table-cell">Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-[var(--color-text-muted)]">
                        <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p>No blog posts found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    posts.map((post) => (
                      <TableRow key={post.id} className="hover:bg-[var(--color-bg-tertiary)]/50">
                        <TableCell>
                          <p className="font-medium text-[var(--color-text-primary)] truncate max-w-xs">{post.title}</p>
                          <p className="text-xs text-[var(--color-text-muted)] truncate max-w-xs">/{post.slug}</p>
                          {post.featured && <Badge className="mt-1 bg-purple-500/20 text-purple-500">Featured</Badge>}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{post.author.name || post.author.username || "Unknown"}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={STATUS_COLORS[post.status]} variant="outline">
                            {post.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {post.categories.length > 0 ? (
                              post.categories.map(({ category }) => (
                                <Badge key={category.id} variant="secondary" className="text-xs">{category.name}</Badge>
                              ))
                            ) : (
                              <span className="text-[var(--color-text-muted)]">—</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{post.viewCount}</TableCell>
                        <TableCell className="hidden lg:table-cell">{formatDate(post.publishedAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <Button variant="ghost" size="sm" aria-label="View post">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/blog/${post.id}`}>
                              <Button variant="ghost" size="sm" aria-label="Edit post">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(post.id)}
                              disabled={deleteLoading === post.id}
                              className="text-red-500 hover:bg-red-500/10"
                              aria-label="Delete post"
                            >
                              {deleteLoading === post.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="border-t border-[var(--color-border)] p-4">
                  <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} showFirstLast />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
