"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, TrendingUp, TrendingDown, Minus, Users, Download, FileText, Eye, Clock, Calendar, ExternalLink, RefreshCw, Mail, UserPlus, Monitor, Trophy, Package, FolderOpen, Shield } from "lucide-react";
import { AdminLayoutShell as AdminLayout } from "../layout";

interface OverviewStats {
  totalUsers: number;
  newUsers: number;
  totalAssets: number;
  newAssets: number;
  totalDownloads: number;
  totalPageViews: number;
  activeUsers: number;
  periodDays: number;
  totalNewsletterSubscribers?: number;
}

interface DownloadsData {
  downloads: Array<{ createdAt: string; _count: { id: number } }>;
  byPlatform: Array<{ platform: string; _count: { id: number } }>;
  topAssets: Array<{ asset: { id: string; name: string; slug: string } | null; downloads: number }>;
}

interface PageViewsData {
  pageViews: Array<{ url: string; _count: { id: number } }>;
  dailyViews: Array<{ createdAt: string; _count: { id: number } }>;
}

interface UsersData {
  newUsers: Array<{ createdAt: string; _count: { id: number } }>;
  byRole: Array<{ role: string; _count: { id: number } }>;
  activeUsers: number;
  verifiedUsers: number;
}

interface AssetsData {
  newAssets: Array<{ createdAt: string; _count: { id: number } }>;
  byKind: Array<{ kind: string; _count: { id: number } }>;
  topCategories: Array<{ category: { id: string; name: string; slug: string } | null; count: number }>;
}

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });

function StatCard({ title, value, change, icon, iconColor, trend = "neutral" }: {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ReactNode;
  iconColor: string;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-[var(--color-text-muted)]">{title}</CardTitle>
        <div className={cn("p-3 rounded-lg", iconColor)}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-[var(--color-text-primary)]">{value}</div>
        {change !== undefined && (
          <div className={cn("flex items-center gap-1 mt-2 text-sm", trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-[var(--color-text-muted)]")}>
            {trend === "up" ? <TrendingUp className="h-4 w-4" /> : trend === "down" ? <TrendingDown className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
            <span>{change >= 0 ? "+" : ""}{change}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LoadingCard() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="h-4 w-1/4 bg-[var(--color-bg-tertiary)] rounded" />
        <div className="h-8 w-8 bg-[var(--color-bg-tertiary)] rounded-lg" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-1/2 bg-[var(--color-bg-tertiary)] rounded mb-2" />
        <div className="h-4 w-1/3 bg-[var(--color-bg-tertiary)] rounded" />
      </CardContent>
    </Card>
  );
}

function DownloadsChart({ data }: { data: DownloadsData["downloads"] }) {
  if (!data.length) return <div className="text-center py-8 text-[var(--color-text-muted)]">No download data</div>;
  const maxCount = Math.max(...data.map((d) => d._count.id));
  return (
    <div className="space-y-2">
      {data.slice(-30).map((item) => (
        <div key={item.createdAt} className="flex items-center gap-3">
          <span className="text-xs text-[var(--color-text-muted)] w-20">{formatDate(item.createdAt)}</span>
          <div className="flex-1 h-3 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent)] rounded-full transition-all"
              style={{ width: `${maxCount > 0 ? (item._count.id / maxCount) * 100 : 0}%` }}
            />
          </div>
          <span className="text-sm font-mono text-[var(--color-text-primary)] w-12 text-right">{item._count.id}</span>
        </div>
      ))}
    </div>
  );
}

function PlatformChart({ data }: { data: DownloadsData["byPlatform"] }) {
  if (!data.length) return <div className="text-center py-8 text-[var(--color-text-muted)]">No platform data</div>;
  const total = data.reduce((sum, d) => sum + d._count.id, 0);
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.platform} className="flex items-center gap-3">
          <span className="text-sm text-[var(--color-text-secondary)] w-24 capitalize">{item.platform || "Unknown"}</span>
          <div className="flex-1 h-4 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent)] rounded-full transition-all"
              style={{ width: `${total > 0 ? (item._count.id / total) * 100 : 0}%` }}
            />
          </div>
          <span className="text-sm font-mono text-[var(--color-text-primary)] w-16 text-right">{item._count.id} ({(total > 0 ? (item._count.id / total) * 100 : 0).toFixed(1)}%)</span>
        </div>
      ))}
    </div>
  );
}

function TopAssetsTable({ data }: { data: DownloadsData["topAssets"] }) {
  if (!data.length) return <div className="text-center py-8 text-[var(--color-text-muted)]">No top assets</div>;
  return (
    <div className="space-y-2">
      {data.slice(0, 10).map((item, i) => (
        <div key={item.asset?.id || i} className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--color-text-muted)] w-6">{i + 1}</span>
            <a href={item.asset ? `/marketplace/${item.asset.slug}` : "#"} target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)]">
              {item.asset?.name || "Unknown"}
            </a>
          </div>
          <span className="text-sm font-mono text-[var(--color-accent)]">{item.downloads}</span>
        </div>
      ))}
    </div>
  );
}

function PageViewsTable({ data }: { data: PageViewsData["pageViews"] }) {
  if (!data.length) return <div className="text-center py-8 text-[var(--color-text-muted)]">No page view data</div>;
  return (
    <div className="space-y-2">
      {data.slice(0, 15).map((item, i) => (
        <div key={item.url} className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--color-text-muted)] w-6">{i + 1}</span>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] truncate max-w-md">
              {item.url}
            </a>
          </div>
          <span className="text-sm font-mono text-[var(--color-accent)]">{item._count.id}</span>
        </div>
      ))}
    </div>
  );
}

function RoleChart({ data }: { data: UsersData["byRole"] }) {
  if (!data.length) return <div className="text-center py-8 text-[var(--color-text-muted)]">No role data</div>;
  const total = data.reduce((sum, d) => sum + d._count.id, 0);
  const roleColors: Record<string, string> = {
    OWNER: "bg-purple-500",
    ADMIN: "bg-red-500",
    MODERATOR: "bg-blue-500",
    USER: "bg-gray-500",
  };
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.role} className="flex items-center gap-3">
          <span className="text-sm text-[var(--color-text-secondary)] w-24 capitalize">{item.role.toLowerCase()}</span>
          <div className="flex-1 h-4 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${total > 0 ? (item._count.id / total) * 100 : 0}%`, backgroundColor: roleColors[item.role] || "var(--color-accent)" }}
            />
          </div>
          <span className="text-sm font-mono text-[var(--color-text-primary)] w-16 text-right">{item._count.id} ({(total > 0 ? (item._count.id / total) * 100 : 0).toFixed(1)}%)</span>
        </div>
      ))}
    </div>
  );
}

function KindChart({ data }: { data: AssetsData["byKind"] }) {
  if (!data.length) return <div className="text-center py-8 text-[var(--color-text-muted)]">No asset kind data</div>;
  const total = data.reduce((sum, d) => sum + d._count.id, 0);
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.kind} className="flex items-center gap-3">
          <span className="text-sm text-[var(--color-text-secondary)] w-24">{item.kind.replace("_", " ")}</span>
          <div className="flex-1 h-4 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent)] rounded-full transition-all"
              style={{ width: `${total > 0 ? (item._count.id / total) * 100 : 0}%` }}
            />
          </div>
          <span className="text-sm font-mono text-[var(--color-text-primary)] w-16 text-right">{item._count.id} ({(total > 0 ? (item._count.id / total) * 100 : 0).toFixed(1)}%)</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<"7" | "30" | "90">("30");
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [downloads, setDownloads] = useState<DownloadsData | null>(null);
  const [pageViews, setPageViews] = useState<PageViewsData | null>(null);
  const [users, setUsers] = useState<UsersData | null>(null);
  const [assets, setAssets] = useState<AssetsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [overviewRes, downloadsRes, pageViewsRes, usersRes, assetsRes] = await Promise.all([
        fetch(`/api/admin/analytics?action=overview&days=${period}`),
        fetch(`/api/admin/analytics?action=downloads&days=${period}`),
        fetch(`/api/admin/analytics?action=pageviews&days=${period}`),
        fetch(`/api/admin/analytics?action=users&days=${period}`),
        fetch(`/api/admin/analytics?action=assets&days=${period}`),
      ]);

      if (overviewRes.ok) setOverview(await overviewRes.json());
      if (downloadsRes.ok) setDownloads(await downloadsRes.json());
      if (pageViewsRes.ok) setPageViews(await pageViewsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (assetsRes.ok) setAssets(await assetsRes.json());
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  const change = overview ? Math.round(((overview.newUsers / Math.max(1, overview.totalUsers - overview.newUsers)) * 100)) : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Analytics</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Platform insights and metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={(v) => setPeriod(v as "7" | "30" | "90")}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchData} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </header>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <LoadingCard key={i} />)}
          </div>
        ) : overview ? (
          <>
            {/* Overview Stats */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Users"
                value={formatNumber(overview.totalUsers)}
                change={change}
                trend={change >= 0 ? "up" : "down"}
                icon={<Users className="h-6 w-6" />}
                iconColor="bg-blue-500/20 text-blue-500"
              />
              <StatCard
                title="New Users"
                value={formatNumber(overview.newUsers)}
                icon={<UserPlus className="h-6 w-6" />}
                iconColor="bg-green-500/20 text-green-500"
              />
              <StatCard
                title="Active Users"
                value={formatNumber(overview.activeUsers)}
                icon={<Users className="h-6 w-6" />}
                iconColor="bg-purple-500/20 text-purple-500"
              />
              <StatCard
                title="Total Assets"
                value={formatNumber(overview.totalAssets)}
                icon={<FileText className="h-6 w-6" />}
                iconColor="bg-orange-500/20 text-orange-500"
              />
              <StatCard
                title="New Assets"
                value={formatNumber(overview.newAssets)}
                icon={<FileText className="h-6 w-6" />}
                iconColor="bg-cyan-500/20 text-cyan-500"
              />
              <StatCard
                title="Total Downloads"
                value={formatNumber(overview.totalDownloads)}
                icon={<Download className="h-6 w-6" />}
                iconColor="bg-emerald-500/20 text-emerald-500"
              />
              <StatCard
                title="Page Views"
                value={formatNumber(overview.totalPageViews)}
                icon={<Eye className="h-6 w-6" />}
                iconColor="bg-indigo-500/20 text-indigo-500"
              />
              <StatCard
                title="Newsletter"
                value={formatNumber(overview.totalNewsletterSubscribers || 0)}
                icon={<Mail className="h-6 w-6" />}
                iconColor="bg-pink-500/20 text-pink-500"
              />
            </div>

            {/* Tabs for detailed analytics */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="downloads">Downloads</TabsTrigger>
                <TabsTrigger value="pageviews">Page Views</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="assets">Assets</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> New Users (Last {period} Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {users?.newUsers.slice(-14).map((item) => (
                          <div key={item.createdAt} className="flex items-center justify-between text-sm">
                            <span className="text-[var(--color-text-secondary)]">{formatDate(item.createdAt)}</span>
                            <span className="font-mono text-[var(--color-text-primary)]">{item._count.id}</span>
                          </div>
                        ))}
                        {!users?.newUsers.length && <p className="text-center text-[var(--color-text-muted)] py-4">No data</p>}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Users by Role</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RoleChart data={users?.byRole || []} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="downloads" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Download className="h-5 w-5" /> Daily Downloads</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DownloadsChart data={downloads?.downloads || []} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Monitor className="h-5 w-5" /> By Platform</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PlatformChart data={downloads?.byPlatform || []} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5" /> Top Assets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TopAssetsTable data={downloads?.topAssets || []} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="pageviews" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5" /> Daily Page Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DownloadsChart data={pageViews?.dailyViews || []} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Top Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PageViewsTable data={pageViews?.pageViews || []} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> New Users (Last {period} Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {users?.newUsers.slice(-30).map((item) => (
                          <div key={item.createdAt} className="flex items-center gap-3">
                            <span className="text-xs text-[var(--color-text-muted)] w-20">{formatDate(item.createdAt)}</span>
                            <div className="flex-1 h-3 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                              <div className="h-full bg-[var(--color-accent)] rounded-full" style={{ width: `${Math.min(100, (item._count.id / 10) * 100)}%` }} />
                            </div>
                            <span className="text-sm font-mono text-[var(--color-text-primary)] w-12 text-right">{item._count.id}</span>
                          </div>
                        ))}
                        {!users?.newUsers.length && <p className="text-center text-[var(--color-text-muted)] py-4">No data</p>}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Verification</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--color-text-secondary)]">Verified Users</span>
                        <span className="font-bold text-[var(--color-text-primary)]">{users?.verifiedUsers || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--color-text-secondary)]">Active (Last {period} Days)</span>
                        <span className="font-bold text-[var(--color-text-primary)]">{users?.activeUsers || 0}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="assets" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> Assets by Kind</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <KindChart data={assets?.byKind || []} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><FolderOpen className="h-5 w-5" /> Top Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {assets?.topCategories.slice(0, 10).map((item, i) => (
                          <div key={item.category?.id || i} className="flex items-center justify-between p-2 rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                            <a href={item.category ? `/marketplace?category=${item.category.slug}` : "#"} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)]">
                              {item.category?.name || "Unknown"}
                            </a>
                            <span className="text-sm font-mono text-[var(--color-accent)]">{item.count}</span>
                          </div>
                        ))}
                        {!assets?.topCategories.length && <p className="text-center text-[var(--color-text-muted)] py-4">No data</p>}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> New Assets (Last {period} Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {assets?.newAssets.slice(-30).map((item) => (
                          <div key={item.createdAt} className="flex items-center gap-3">
                            <span className="text-xs text-[var(--color-text-muted)] w-20">{formatDate(item.createdAt)}</span>
                            <div className="flex-1 h-3 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                              <div className="h-full bg-[var(--color-accent)] rounded-full" style={{ width: `${Math.min(100, (item._count.id / 5) * 100)}%` }} />
                            </div>
                            <span className="text-sm font-mono text-[var(--color-text-primary)] w-12 text-right">{item._count.id}</span>
                          </div>
                        ))}
                        {!assets?.newAssets.length && <p className="text-center text-[var(--color-text-muted)] py-4">No data</p>}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
}