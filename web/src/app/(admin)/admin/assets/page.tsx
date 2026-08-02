"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";
import { Search, Loader2, CheckCircle, XCircle, Clock, Eye, MoreVertical, Download, Trash2 } from "lucide-react";
import { AdminLayoutShell as AdminLayout } from "../layout";

type AssetStatus = "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "PUBLISHED" | "ARCHIVED";
type AssetKind = "SKILL" | "PERSONA" | "TEMPLATE" | "PROMPT_PACK" | "INSTRUCTION_FILE" | "WORKFLOW" | "MCP_SERVER" | "COLLECTION" | "BUNDLE";

interface Asset {
  id: string;
  slug: string;
  name: string;
  description: string;
  kind: AssetKind;
  status: AssetStatus;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    email: string;
    avatar: string | null;
  };
  category: {
    id: string;
    slug: string;
    name: string;
  } | null;
  downloads: number;
  createdAt: string;
  publishedAt: string | null;
  deprecationReason: string | null;
}

interface AssetsResponse {
  assets: Asset[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

const STATUS_COLORS: Record<AssetStatus, string> = {
  DRAFT: "bg-gray-500/20 text-gray-500",
  PENDING_REVIEW: "bg-yellow-500/20 text-yellow-500",
  APPROVED: "bg-blue-500/20 text-blue-500",
  REJECTED: "bg-red-500/20 text-red-500",
  PUBLISHED: "bg-green-500/20 text-green-500",
  ARCHIVED: "bg-gray-500/20 text-gray-500",
};

const KIND_LABELS: Record<AssetKind, string> = {
  SKILL: "Skill",
  PERSONA: "Persona",
  TEMPLATE: "Template",
  PROMPT_PACK: "Prompt Pack",
  INSTRUCTION_FILE: "Instruction File",
  WORKFLOW: "Workflow",
  MCP_SERVER: "MCP Server",
  COLLECTION: "Collection",
  BUNDLE: "Bundle",
};

export default function AdminAssetsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        action: activeTab === "pending" ? "pending" : "all",
        page: page.toString(),
        limit: activeTab === "pending" ? "20" : "50",
      });
      if (search) params.set("search", search);
      if (activeTab === "all" && statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/assets?${params}`);
      if (res.ok) {
        const data: AssetsResponse = await res.json();
        setAssets(data.assets);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
      }
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, search, statusFilter]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleApprove = async (assetId: string) => {
    setActionLoading(assetId);
    try {
      const res = await fetch(`/api/admin/assets?action=approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId }),
      });
      if (res.ok) {
        fetchAssets();
      }
    } catch (error) {
      console.error("Failed to approve asset:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (assetId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    setActionLoading(assetId);
    try {
      const res = await fetch(`/api/admin/assets?action=reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId, reason }),
      });
      if (res.ok) {
        fetchAssets();
      }
    } catch (error) {
      console.error("Failed to reject asset:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Assets</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Manage marketplace assets</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--color-text-muted)]">{totalCount} assets</span>
          </div>
        </header>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "pending" | "all")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">
              <Clock className="h-4 w-4 mr-2" />
              Pending Review
              {activeTab === "pending" && totalCount > 0 && (
                <Badge variant="secondary" className="ml-2">{totalCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">
              <Download className="h-4 w-4 mr-2" />
              All Assets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden">
              <div className="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="pl-9"
                  />
                </div>
              </div>
              {loading ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)] mx-auto mb-4" />
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-40">Asset</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead className="hidden md:table-cell">Kind</TableHead>
                        <TableHead className="hidden lg:table-cell">Category</TableHead>
                        <TableHead className="hidden lg:table-cell">Created</TableHead>
                        <TableHead className="w-48 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assets.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-[var(--color-text-muted)]">
                            No pending assets
                          </TableCell>
                        </TableRow>
                      ) : (
                        assets.map((asset) => (
                          <TableRow key={asset.id} className="hover:bg-[var(--color-bg-tertiary)]/50">
                            <TableCell>
                              <p className="font-medium text-[var(--color-text-primary)] truncate max-w-xs">{asset.name}</p>
                              <p className="text-xs text-[var(--color-text-muted)] truncate max-w-xs">{asset.description.slice(0, 60)}...</p>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center">
                                  <MoreVertical className="h-4 w-4 text-[var(--color-accent)]" />
                                </div>
                                <span className="text-sm font-medium">{asset.author.name || asset.author.username || "Unknown"}</span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge variant="outline">{KIND_LABELS[asset.kind]}</Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {asset.category ? <Badge variant="secondary">{asset.category.name}</Badge> : "—"}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">{formatDate(asset.createdAt)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleApprove(asset.id)}
                                  disabled={actionLoading === asset.id}
                                  className="text-green-500 hover:bg-green-500/10"
                                >
                                  {actionLoading === asset.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleReject(asset.id)}
                                  disabled={actionLoading === asset.id}
                                  className="text-red-500 hover:bg-red-500/10"
                                >
                                  {actionLoading === asset.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </>
                                  )}
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
          </TabsContent>

          <TabsContent value="all" className="mt-4">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden">
              <div className="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as AssetStatus | "all"); setPage(1); }}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {(["DRAFT", "PENDING_REVIEW", "APPROVED", "REJECTED", "PUBLISHED", "ARCHIVED"] as AssetStatus[]).map((status) => (
                      <SelectItem key={status} value={status}>{status.replace("_", " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {loading ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)] mx-auto mb-4" />
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-40">Asset</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead className="hidden md:table-cell">Kind</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden lg:table-cell">Category</TableHead>
                        <TableHead className="hidden lg:table-cell">Downloads</TableHead>
                        <TableHead className="hidden lg:table-cell">Created</TableHead>
                        <TableHead className="hidden lg:table-cell">Published</TableHead>
                        <TableHead className="w-32 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assets.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-[var(--color-text-muted)]">
                            No assets found
                          </TableCell>
                        </TableRow>
                      ) : (
                        assets.map((asset) => (
                          <TableRow key={asset.id} className="hover:bg-[var(--color-bg-tertiary)]/50">
                            <TableCell>
                              <p className="font-medium text-[var(--color-text-primary)] truncate max-w-xs">{asset.name}</p>
                              <p className="text-xs text-[var(--color-text-muted)] truncate max-w-xs">{asset.description.slice(0, 60)}...</p>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center">
                                  <MoreVertical className="h-4 w-4 text-[var(--color-accent)]" />
                                </div>
                                <span className="text-sm font-medium">{asset.author.name || asset.author.username || "Unknown"}</span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge variant="outline">{KIND_LABELS[asset.kind]}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={STATUS_COLORS[asset.status]} variant="outline">
                                {asset.status.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {asset.category ? <Badge variant="secondary">{asset.category.name}</Badge> : "—"}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">{asset.downloads}</TableCell>
                            <TableCell className="hidden lg:table-cell">{formatDate(asset.createdAt)}</TableCell>
                            <TableCell className="hidden lg:table-cell">{formatDate(asset.publishedAt)}</TableCell>
                            <TableCell className="text-right">
                              <a href={`/marketplace/${asset.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded hover:bg-[var(--color-bg-tertiary)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]" aria-label="View asset">
                                <Eye className="h-4 w-4" />
                              </a>
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
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}