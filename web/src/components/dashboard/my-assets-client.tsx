"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Loader2, Star, Trash2, Eye, Copy, Download, Plus, Code2, Lock, Globe, Filter } from "lucide-react";
import Link from "next/link";
import { downloadFile, copyToClipboard } from "@/lib/utils";

const KINDS = [
  { value: "all", label: "All Types" },
  { value: "SYSTEM_PROMPT", label: "System Prompts" },
  { value: "INSTRUCTION_FILE", label: "Instruction Files" },
  { value: "PERSONA", label: "Personas" },
  { value: "WORKFLOW", label: "Workflows" },
  { value: "MEMORY", label: "Memories" },
  { value: "CONTEXT_FILE", label: "Context Files" },
  { value: "PROMPT_TEMPLATE", label: "Prompt Templates" },
  { value: "MCP_CONFIG", label: "MCP Configs" },
];

const KIND_LABELS: Record<string, string> = Object.fromEntries(
  KINDS.filter((k) => k.value !== "all").map((k) => [k.value, k.label.slice(0, -1)])
);

const FILTERS = [
  { value: "all", label: "All" },
  { value: "favorite", label: "Favorites" },
  { value: "public", label: "Public" },
];

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

interface GeneratedFilesResponse {
  files: GeneratedFile[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export function MyAssetsClient({ userName }: { userName: string }) {
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "24" });
      if (kindFilter !== "all") params.set("kind", kindFilter);
      if (filterType === "favorite") params.set("favoriteFilter", "true");

      const res = await fetch(`/api/user/generated-files?${params}`);
      if (res.ok) {
        const data: GeneratedFilesResponse = await res.json();
        setFiles(data.files);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
      }
    } catch (error) {
      console.error("Failed to fetch files:", error);
    } finally {
      setLoading(false);
    }
  }, [page, kindFilter, filterType]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleToggleFavorite = async (id: string) => {
    setActionLoading(id);
    try {
      const file = files.find((f) => f.id === id);
      await fetch(`/api/user/generated-files?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !file?.isFavorite }),
      });
      fetchFiles();
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this generated file? This cannot be undone.")) return;
    setActionLoading(id);
    try {
      await fetch(`/api/user/generated-files?id=${id}`, { method: "DELETE" });
      fetchFiles();
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleView = (file: GeneratedFile) => {
    setSelectedFile(file);
    setDialogOpen(true);
  };

  const handleCopy = async () => {
    if (!selectedFile) return;
    const success = await copyToClipboard(selectedFile.content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!selectedFile) return;
    const filename = selectedFile.title.toLowerCase().replace(/\s+/g, "-") + ".md";
    downloadFile(selectedFile.content, filename, "text/markdown");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">My Assets</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Your generated AI instruction files</p>
        </div>
        <Link href="/generate">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Generate New
          </Button>
        </Link>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <Input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Select value={kindFilter} onValueChange={(v) => { setKindFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All types" /></SelectTrigger>
          <SelectContent>
            {KINDS.map((kind) => (
              <SelectItem key={kind.value} value={kind.value}>{kind.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All" /></SelectTrigger>
          <SelectContent>
            {FILTERS.map((f) => (
              <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Files Grid */}
      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)] mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)]">Loading files...</p>
        </div>
      ) : files.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-12 text-center">
          <Code2 className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-4 opacity-50" />
          <p className="text-[var(--color-text-secondary)] mb-2">No generated files yet</p>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">Start by generating your first AI instruction file</p>
          <Link href="/generate">
            <Button><Plus className="h-4 w-4 mr-2" />Generate File</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {files
            .filter((f) => !search || f.title.toLowerCase().includes(search.toLowerCase()))
            .filter((f) => filterType !== "public" || f.isPublic)
            .map((file) => (
            <div key={file.id} className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-strong)] transition-colors">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">{KIND_LABELS[file.kind] || file.kind}</Badge>
                  {file.isPublic ? (
                    <Badge className="bg-blue-500/20 text-blue-500 text-xs gap-1">
                      <Globe className="h-3 w-3" /> Public
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-500/20 text-gray-500 text-xs gap-1">
                      <Lock className="h-3 w-3" /> Private
                    </Badge>
                  )}
                </div>
                <button
                  onClick={() => handleToggleFavorite(file.id)}
                  disabled={actionLoading === file.id}
                  className="p-1 rounded hover:bg-[var(--color-bg-tertiary)] transition-colors"
                  aria-label="Toggle favorite"
                >
                  {file.isFavorite ? (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <Star className="h-4 w-4 text-[var(--color-text-muted)]" />
                  )}
                </button>
              </div>
              <p className="font-medium text-[var(--color-text-primary)] truncate mb-1" title={file.title}>{file.title}</p>
              <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-3">
                {file.content.slice(0, 100)}...
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-muted)]">{formatDate(file.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-[var(--color-border)]">
                <Button variant="ghost" size="sm" onClick={() => handleView(file)} aria-label="View">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(file.id)}
                  disabled={actionLoading === file.id}
                  className="text-red-500 hover:bg-red-500/10"
                  aria-label="Delete"
                >
                  {actionLoading === file.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} showFirstLast />
        </div>
      )}

      {/* View File Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedFile && (
                <>
                  <Badge variant="outline">{KIND_LABELS[selectedFile.kind] || selectedFile.kind}</Badge>
                  {selectedFile.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedFile && (
            <div className="space-y-4 py-2">
              <div className="flex flex-wrap gap-3 text-xs text-[var(--color-text-muted)]">
                <span>{formatDate(selectedFile.createdAt)}</span>
                {selectedFile.tokens && <span>{selectedFile.tokens} tokens</span>}
                {selectedFile.modelUsed && <Badge variant="secondary">{selectedFile.modelUsed}</Badge>}
              </div>
              <pre className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-sm text-[var(--color-text-primary)] overflow-x-auto whitespace-pre-wrap font-mono max-h-[400px]">
                {selectedFile.content}
              </pre>
              <DialogFooter>
                <Button variant="outline" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
