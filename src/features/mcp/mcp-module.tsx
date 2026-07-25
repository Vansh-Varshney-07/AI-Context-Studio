"use client";

import { motion } from "framer-motion";
import {
  Box,
  Boxes,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Copy,
  Database,
  Download,
  Edit,
  Eye,
  EyeOff,
  Filter,
  FolderTree,
  GitBranch,
  Globe,
  Hash,
  HelpCircle,
  Home,
  Loader2,
  MemoryStick,
  Package,
  Play,
  Plus,
  Search,
  Server,
  Settings,
  Sparkles,
  Star,
  Tag,
  Terminal,
  Trash2,
  Upload,
  Wand2,
  Zap,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tag as TagComp } from "@/components/common/tag";
import { EmptyState } from "@/components/common/empty-state";
import { moduleTransition } from "@/components/motion";
import { useToast } from "@/providers/toaster-provider";
import { cn, downloadFile, copyToClipboard, slugify } from "@/utils";
import { validateCollection } from "./validators";
import { getClientProvider, MCP_CLIENT_PROVIDERS } from "./services";
import { useMCPStore, type MCPState } from "./store";

function shallow<T>(a: T, b: T): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if ((a as any)[key] !== (b as any)[key]) return false;
  }
  return true;
}

import { MCP_CATEGORIES, MCP_CATEGORY_MAP } from "./constants/categories";
import { MCP_CLIENTS, MCP_CLIENT_MAP } from "./constants/clients";
import { MCP_SERVER_CATALOG, MCP_CATALOG_MAP } from "./data";
import { EnvVarEditor } from "./components/env-var-editor";

import type {
  InstalledMCPServer,
  MCPCategoryId,
  MCPClientId,
  MCPServer,
  MCPTransport,
  MCPEnvVarValue,
  ValidationResult,
  ValidationIssue,
  MCPCategory,
  MCPClientMeta,
  MCPCapability,
} from "./types";

const TRANSPORTS: { value: MCPTransport; label: string }[] = [
  { value: "stdio", label: "Standard IO (stdio)" },
  { value: "http", label: "HTTP" },
  { value: "sse", label: "Server-Sent Events" },
];

const AUTH_MODES = [
  { value: "none", label: "None" },
  { value: "bearer", label: "Bearer Token" },
  { value: "apikey", label: "API Key Header" },
  { value: "basic", label: "Basic Auth" },
  { value: "oauth", label: "OAuth 2.0" },
];

const LOG_LEVELS = [
  { value: "debug", label: "Debug" },
  { value: "info", label: "Info" },
  { value: "warn", label: "Warning" },
  { value: "error", label: "Error" },
  { value: "silent", label: "Silent" },
];

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "installed", label: "Installed" },
  { value: "not-installed", label: "Not Installed" },
  { value: "favorites", label: "Favorites" },
  { value: "recent", label: "Recent" },
] as const;

type FilterStatus = (typeof STATUS_FILTERS)[number]["value"];

export function MCPModule() {
  return (
    <motion.div
      variants={moduleTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid h-full grid-cols-[280px_minmax(0,1fr)] overflow-hidden"
    >
      <MCPSidebar />
      <MCPWorkspace />
    </motion.div>
  );
}

function MCPSidebar() {
  const installedServers = useMCPStore((state) => state.installedServers);
  const favorites = useMCPStore((state) => state.favorites);
  const recentServerIds = useMCPStore((state) => state.recentServerIds);
  const filter = useMCPStore((state) => state.filter);
  const setFilter = useMCPStore((state) => state.setFilter);
  const install = useMCPStore((state) => state.install);
  const isFavorite = useMCPStore((state) => state.isFavorite);
  const toggleFavorite = useMCPStore((state) => state.toggleFavorite);
  const recordRecent = useMCPStore((state) => state.recordRecent);
  const selectedClientId = useMCPStore((state) => state.selectedClientId);
  const setSelectedClient = useMCPStore((state) => state.setSelectedClient);

  const { toast } = useToast();

  const installedIds = new Set(installedServers.map((s: InstalledMCPServer) => s.serverId));
  const catalog = React.useMemo(
    () =>
      MCP_SERVER_CATALOG.filter((server: MCPServer) => {
        if (filter.query.trim()) {
          const q = filter.query.toLowerCase();
          if (
            !server.name.toLowerCase().includes(q) &&
            !server.description.toLowerCase().includes(q) &&
            !server.tags?.some((t) => t.toLowerCase().includes(q))
          ) {
            return false;
          }
        }
        if (filter.category !== "all" && server.category !== filter.category) return false;
        const isInstalled = installedIds.has(server.id);
        if (filter.status === "installed" && !isInstalled) return false;
        if (filter.status === "not-installed" && isInstalled) return false;
        if (filter.status === "favorites" && !favorites.includes(server.id)) return false;
        if (filter.status === "recent" && !recentServerIds.includes(server.id)) return false;
        return true;
      }),
    [filter, installedIds, favorites, recentServerIds],
  );

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const server of MCP_SERVER_CATALOG) {
      counts[server.category] = (counts[server.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  const handleInstall = (catalogId: string) => {
    const instanceId = install(catalogId);
    if (instanceId) {
      const server = MCP_CATALOG_MAP[catalogId];
      toast({ title: "Installed", description: `${server?.name ?? catalogId} added to your servers`, variant: "success" });
    }
  };

  return (
    <aside className="flex h-full flex-col border-r border-border bg-bg-secondary overflow-hidden">
      <div className="flex flex-col gap-3 p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Search servers..."
            value={filter.query}
            onChange={(e) => setFilter({ query: e.target.value })}
            className="pl-9"
            size="sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={filter.category} onValueChange={(v) => setFilter({ category: v as MCPCategoryId | "all" })}>
            <SelectTrigger className="h-8 text-xs flex-1"><SelectValue placeholder="All categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {MCP_CATEGORIES.map((cat: MCPCategory) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.label} ({categoryCounts[cat.id] ?? 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filter.status} onValueChange={(v) => setFilter({ status: v as FilterStatus })}>
            <SelectTrigger className="h-8 text-xs w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((s: { value: FilterStatus; label: string }) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Servers ({catalog.length})
          </p>
          {catalog.length === 0 ? (
            <div className="px-2 py-4 text-center text-xs text-text-muted">No servers match your filters.</div>
          ) : (
            catalog.map((server) => (
              <CatalogServerItem
                key={server.id}
                server={server}
                isInstalled={installedIds.has(server.id)}
                isFavorite={isFavorite(server.id)}
                onInstall={() => handleInstall(server.id)}
                onFavorite={() => toggleFavorite(server.id)}
                onClick={() => recordRecent(server.id)}
              />
            ))
          )}
        </div>
      </div>

      <div className="border-t border-border p-3">
        <Label className="mb-2">Export Target</Label>
        <Select value={selectedClientId} onValueChange={(v) => setSelectedClient(v as MCPClientId)}>
          <SelectTrigger className="h-8 text-sm w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {MCP_CLIENTS.map((client: MCPClientMeta) => (
              <SelectItem key={client.id} value={client.id}>
                {client.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </aside>
  );
}

function CatalogServerItem({
  server,
  isInstalled,
  isFavorite,
  onInstall,
  onFavorite,
  onClick,
}: {
  server: MCPServer;
  isInstalled: boolean;
  isFavorite: boolean;
  onInstall: () => void;
  onFavorite: () => void;
  onClick: () => void;
}) {
  const category = MCP_CATEGORY_MAP[server.category as MCPCategoryId];
  const Icon = category?.icon ?? Boxes;

  return (
    <div
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-bg-tertiary cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
    >
      <span className="size-7 shrink-0 flex items-center justify-center rounded-md bg-accent/10 text-accent">
        <Icon className="size-3.5" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="truncate font-medium text-text-primary">{server.name}</p>
          {server.isCustom && <TagComp variant="muted" className="text-[9px]">Custom</TagComp>}
          {server.provider === "ai-context-studio" && (
            <TagComp variant="accent" className="text-[9px]">Built-in</TagComp>
          )}
        </div>
        <p className="truncate text-xs text-text-muted">{server.description}</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {server.tags?.slice(0, 2).map((t) => (
            <TagComp key={t} variant="muted" className="text-[9px]">{t}</TagComp>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onFavorite(); }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="p-1 rounded hover:bg-bg-tertiary transition-colors"
        >
          <Star className={cn("size-3.5", isFavorite ? "text-amber-500 fill-current" : "text-text-muted")} />
        </button>
        {isInstalled ? (
          <TagComp variant="success" className="text-[9px]">Installed</TagComp>
        ) : (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onInstall(); }}
            className="p-1.5 rounded bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
            aria-label="Install"
          >
            <Plus className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function MCPWorkspace() {
  const installedServers = useMCPStore((state) => state.installedServers);
  const selectedClientId = useMCPStore((state) => state.selectedClientId);
  const [activeTab, setActiveTab] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (installedServers.length > 0 && !activeTab) {
      setActiveTab(installedServers[0]?.instanceId ?? "");
    }
  }, [installedServers, activeTab]);

  if (installedServers.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          icon={Server}
          title="No MCP servers installed"
          description="Browse the catalog on the left and click Install to add servers."
          action={
            <Button variant="primary" size="lg">
              <Plus className="mr-2 size-4" />
              Browse Catalog
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <section className="flex h-full flex-col overflow-hidden">
      <header className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Server className="size-4.5" />
          </span>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-text-primary">MCP Manager</h1>
            <p className="text-xs text-text-muted">
              Configure, validate, and export MCP server configurations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setActiveTab(null)}>
            <Plus className="mr-1.5 size-3.5" />
            Add Custom
          </Button>
        </div>
      </header>

      <div className="border-b border-border px-3">
        <Tabs value={activeTab ?? ""} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-auto p-0 bg-transparent gap-0.5">
            {installedServers.map((server) => (
              <TabsTrigger
                key={server.instanceId}
                value={server.instanceId}
                className="data-[state=active]:bg-accent-light data-[state=active]:text-accent h-8 px-3 text-xs"
              >
                <div className="flex items-center gap-1.5">
                  <Server className="size-3.5" />
                  <span className="truncate max-w-[180px]">{server.name}</span>
                  {server.enabled ? (
                    <CheckCircle className="size-3 text-success" />
                  ) : (
                    <TagComp variant="muted" className="text-[9px]">Disabled</TagComp>
                  )}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab ?? ""} onValueChange={setActiveTab}>
          {installedServers.map((server) => (
            <TabsContent key={server.instanceId} value={server.instanceId} className="h-full">
              <ServerDetailPane server={server} selectedClientId={selectedClientId} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

function ServerDetailPane({
  server,
  selectedClientId,
}: {
  server: InstalledMCPServer;
selectedClientId: MCPClientId;
}) {
  const updateServer = useMCPStore((state) => state.updateServer);
  const setServerEnabled = useMCPStore((state) => state.setServerEnabled);
  const setEnv = useMCPStore((state) => state.setEnv);
  const catalog = MCP_CATALOG_MAP[server.serverId];
  const category = catalog ? MCP_CATEGORY_MAP[catalog.category] : null;
  const client = MCP_CLIENT_MAP[selectedClientId] as MCPClientMeta | undefined;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            {category?.icon ? <category.icon className="size-4.5" /> : <Server className="size-4.5" />}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">{server.name}</p>
            <p className="truncate text-xs text-text-muted">
              {catalog?.description ?? "Custom server"} \u00B7 {catalog?.provider ?? "custom"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={server.enabled}
            onCheckedChange={(enabled) => setServerEnabled(server.instanceId, enabled)}
            aria-label="Enable in exports"
          />
          <span className="text-xs text-text-muted">Enabled</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="overview" className="h-full">
          <TabsList className="border-b border-border p-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="test">Test Connection</TabsTrigger>
            <TabsTrigger value="guide">Install Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="h-full overflow-y-auto p-4">
            <ServerOverview server={server} catalog={catalog} />
          </TabsContent>

          <TabsContent value="config" className="h-full overflow-y-auto p-4">
            <ServerConfigEditor server={server} catalog={catalog} onUpdate={updateServer} onEnvChange={setEnv} />
          </TabsContent>

          <TabsContent value="validation" className="h-full overflow-y-auto p-4">
            <ServerValidation server={server} catalog={catalog} />
          </TabsContent>

          <TabsContent value="export" className="h-full overflow-y-auto p-4">
            <ServerExport server={server} clientId={selectedClientId} client={client} />
          </TabsContent>

          <TabsContent value="test" className="h-full overflow-y-auto p-4">
            <ServerTestConnection server={server} />
          </TabsContent>

          <TabsContent value="guide" className="h-full overflow-y-auto p-4">
            <ServerInstallGuide server={server} catalog={catalog} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ServerOverview({
  server,
  catalog,
}: {
  server: InstalledMCPServer;
  catalog: MCPServer | undefined;
}) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Server Info</CardTitle>
          <CardDescription>Basic metadata and capabilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <dt className="text-text-muted">Catalog ID</dt>
            <dd className="font-mono text-text-primary">{server.serverId}</dd>
            <dt className="text-text-muted">Instance ID</dt>
            <dd className="font-mono text-text-primary">{server.instanceId}</dd>
            <dt className="text-text-muted">Category</dt>
            <dd>{catalog ? MCP_CATEGORY_MAP[catalog.category]?.label ?? catalog.category : "custom"}</dd>
            <dt className="text-text-muted">Provider</dt>
            <dd>{catalog?.provider ?? "custom"}</dd>
            <dt className="text-text-muted">Version</dt>
            <dd>{catalog?.version ?? "1.0.0"}</dd>
            <dt className="text-text-muted">Transport</dt>
            <dd><TagComp variant="default">{server.transport}</TagComp></dd>
            <dt className="text-text-muted">Status</dt>
            <dd>
              <StatusBadge status={server.installStatus} />
            </dd>
            <dt className="text-text-muted">Connection</dt>
            <dd>
              <ConnectionBadge status={server.connectionStatus} />
            </dd>
            <dt className="text-text-muted">Enabled</dt>
            <dd>{server.enabled ? "Yes" : "No"}</dd>
            <dt className="text-text-muted">Installed</dt>
            <dd>{server.installedAt ? new Date(server.installedAt).toLocaleDateString() : "\u2014"}</dd>
          </dl>
        </CardContent>
      </Card>

      {catalog?.capabilities.length && (
        <Card>
          <CardHeader>
            <CardTitle>Capabilities</CardTitle>
            <CardDescription>Tools, resources, and prompts exposed by this server</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {catalog.capabilities.map((cap: MCPCapability) => (
                <TagComp key={cap.name} variant="default" className="gap-1">
                  <span className="text-[10px] uppercase">{cap.kind}</span>
                  {cap.name}
                </TagComp>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {catalog?.supportedClients.length && (
        <Card>
          <CardHeader>
            <CardTitle>Supported Clients</CardTitle>
            <CardDescription>Clients that officially support this server</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {catalog.supportedClients.map((clientId: MCPClientId) => {
                const client = MCP_CLIENT_MAP[clientId];
                return (
                  <TagComp key={clientId} variant="accent" className="gap-1">
                    {client?.icon && <client.icon className="size-3" />}
                    {client?.label ?? clientId}
                  </TagComp>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {catalog?.documentationUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <a href={catalog.documentationUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline flex items-center gap-1">
              <HelpCircle className="size-3.5" />
              Documentation
            </a>
            {catalog.homepageUrl && (
              <a href={catalog.homepageUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline flex items-center gap-1">
                <Globe className="size-3.5" />
                Homepage
              </a>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ServerConfigEditor({
  server,
  catalog,
  onUpdate,
  onEnvChange,
}: {
  server: InstalledMCPServer;
  catalog: MCPServer | undefined;
  onUpdate: (instanceId: string, patch: Partial<InstalledMCPServer>) => void;
  onEnvChange: (instanceId: string, env: MCPEnvVarValue[]) => void;
}) {
  const isCustom = !catalog;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transport</CardTitle>
          <CardDescription>How the client connects to this server</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="transport">Transport</Label>
            <Select
              value={server.transport}
              onValueChange={(v) => onUpdate(server.instanceId, { transport: v as MCPTransport })}
            >
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TRANSPORTS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {server.transport === "stdio" && (
            <div className="space-y-4 border-t border-border pt-4">
              <div className="space-y-1.5">
                <Label htmlFor="command">Command</Label>
                <Input
                  id="command"
                  value={server.command ?? ""}
                  onChange={(e) => onUpdate(server.instanceId, { command: e.target.value })}
                  placeholder="npx"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="args">Arguments (space-separated)</Label>
                <Input
                  id="args"
                  value={server.args.join(" ")}
                  onChange={(e) => onUpdate(server.instanceId, { args: e.target.value.split(/\s+/).filter(Boolean) })}
                  placeholder="-y @modelcontextprotocol/server-filesystem /path"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cwd">Working Directory (optional)</Label>
                <Input
                  id="cwd"
                  value={server.cwd ?? ""}
                  onChange={(e) => onUpdate(server.instanceId, { cwd: e.target.value || undefined })}
                  placeholder="/Users/you/project"
                />
              </div>
            </div>
          )}

          {(server.transport === "http" || server.transport === "sse") && (
            <div className="space-y-4 border-t border-border pt-4">
              <div className="space-y-1.5">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={server.url ?? ""}
                  onChange={(e) => onUpdate(server.instanceId, { url: e.target.value })}
                  placeholder="https://example.com/mcp"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="authMode">Authentication</Label>
                <Select
                  value={server.authMode ?? "none"}
                  onValueChange={(v) => onUpdate(server.instanceId, { authMode: v as typeof server.authMode })}
                >
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {AUTH_MODES.map((a) => (
                      <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>
            {catalog
              ? `${catalog.envVars.filter((s) => s.required).length} required, ${catalog.envVars.filter((s) => !s.required).length} optional`
              : "Custom server \u2014 add any env vars needed"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnvVarEditor
            values={server.env}
            onChange={(env) => onEnvChange(server.instanceId, env)}
            specs={catalog?.envVars ?? []}
            allowCustom
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Options</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="timeoutMs">Timeout (ms)</Label>
            <Input
              id="timeoutMs"
              type="number"
              value={server.timeoutMs ?? 30000}
              onChange={(e) => onUpdate(server.instanceId, { timeoutMs: parseInt(e.target.value, 10) || undefined })}
              min="1000"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="logLevel">Log Level</Label>
            <Select
              value={server.logLevel}
              onValueChange={(v) => onUpdate(server.instanceId, { logLevel: v as typeof server.logLevel })}
            >
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LOG_LEVELS.map((l) => (
                  <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="autoStart"
              checked={server.autoStart}
              onCheckedChange={(v) => onUpdate(server.instanceId, { autoStart: v })}
            />
            <Label htmlFor="autoStart" className="mb-0 cursor-pointer">Auto Start</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="reconnect"
              checked={server.reconnect}
              onCheckedChange={(v) => onUpdate(server.instanceId, { reconnect: v })}
            />
            <Label htmlFor="reconnect" className="mb-0 cursor-pointer">Auto Reconnect</Label>
          </div>
        </CardContent>
      </Card>

      {isCustom && (
        <Card className="border-error/30">
          <CardHeader>
            <CardTitle className="text-error">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="danger" onClick={() => { }}>
              <Trash2 className="mr-1.5 size-3.5" />
              Delete Custom Server
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ServerValidation({
  server,
  catalog,
}: {
  server: InstalledMCPServer;
  catalog: MCPServer | undefined;
}) {
  const [report, setReport] = React.useState<{
    servers: Array<{ instanceId: string; serverName: string; issues: ValidationIssue[]; ok: boolean }>;
    globalIssues: ValidationIssue[];
    ok: boolean;
    counts: { errors: number; warnings: number; infos: number };
  } | null>(null);

  React.useEffect(() => {
    const envSpecs = catalog?.envVars ?? [];
    const result = validateCollection([server], { [server.serverId]: envSpecs });
    setReport(result);
  }, [server, catalog]);

  if (!report) return <div className="flex items-center justify-center h-full"><Loader2 className="size-6 animate-spin text-accent" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Validation Report</h3>
          <p className="text-sm text-text-muted">Issues found in this server\u2019s configuration</p>
        </div>
        <div className="flex items-center gap-3">
          <TagComp variant={report.counts.errors > 0 ? "error" : "success"} className="text-sm">
            {report.counts.errors > 0 ? "Errors" : "OK"}
          </TagComp>
          {report.counts.warnings > 0 && <TagComp variant="warning" className="text-sm">{report.counts.warnings} Warnings</TagComp>}
          {report.counts.infos > 0 && <TagComp variant="muted" className="text-sm">{report.counts.infos} Info</TagComp>}
        </div>
      </div>

      {report.servers[0]?.issues.length ? (
        <Card>
          <CardContent className="space-y-3">
            {report.servers[0].issues.map((issue, idx) => (
              <ValidationIssueRow key={idx} issue={issue} />
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-success-bg/30 border-success/30">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <CheckCircle className="size-8 text-success mx-auto mb-2" />
              <p className="text-text-primary font-medium">No issues found</p>
              <p className="text-sm text-text-muted">This server\u2019s configuration is valid.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {report.globalIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cross-Server Issues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {report.globalIssues.map((issue, idx) => (
              <ValidationIssueRow key={idx} issue={issue} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ValidationIssueRow({ issue }: { issue: ValidationIssue }) {
  type Severity = "error" | "warning" | "info";
  const severityConfig: Record<Severity, { icon: React.ReactNode; color: string; bg: string }> = {
    error: { icon: <Hash className="size-3.5" />, color: "text-error", bg: "bg-error-bg/30 border-error/30" },
    warning: { icon: <Tag className="size-3.5" />, color: "text-warning", bg: "bg-warning-bg/30 border-warning/30" },
    info: { icon: <HelpCircle className="size-3.5" />, color: "text-text-muted", bg: "bg-bg-secondary border-border" },
  };
  const config = severityConfig[issue.severity as Severity];

  return (
    <div className={cn("flex items-start gap-3 p-3 rounded-lg", config.bg)}>
      <span className={cn("shrink-0 mt-0.5", config.color)}>{config.icon}</span>
      <div className="flex-1 min-w-0">
        <p className={cn("font-medium", config.color)}>{issue.message}</p>
        {issue.field && <p className="text-xs text-text-muted font-mono mt-0.5">Field: {issue.field}</p>}
        {issue.suggestion && <p className="text-xs text-text-muted mt-1 italic">\uD83D\uDCA1 {issue.suggestion}</p>}
        <span className="inline-block mt-1.5 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded">{issue.code}</span>
      </div>
    </div>
  );
}

function ServerExport({
  server,
  clientId,
  client,
}: {
  server: InstalledMCPServer;
  clientId: MCPClientId;
  client: (MCPClientMeta | { label: string; configFilename: string; fileLocation: string; icon?: LucideIcon }) | undefined;
}) {
  const installedServers = useMCPStore((state) => state.installedServers);
  const { toast } = useToast();
  const [generated, setGenerated] = React.useState<string>("");

  const enabledServers = installedServers.filter((s) => s.enabled);
  const provider = getClientProvider(clientId);

  const handleGenerate = () => {
    const config = provider.buildConfig(enabledServers);
    setGenerated(config);
    toast({ title: "Generated", description: `Config for ${client?.label ?? clientId} ready`, variant: "success" });
  };

  const handleCopy = async () => {
    if (!generated) return;
    await copyToClipboard(generated);
    toast({ title: "Copied", description: "Config copied to clipboard", variant: "success" });
  };

  const handleDownload = () => {
    if (!generated) return;
    downloadFile(client?.configFilename ?? "config.json", generated, "application/json");
    toast({ title: "Downloaded", description: client?.configFilename ?? "config.json", variant: "success" });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Export Configuration</CardTitle>
          <CardDescription>Generate {client?.label ?? clientId} config from your enabled servers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-secondary">
            {client?.icon && <client.icon className="size-6 text-accent shrink-0" />}
            <div>
              <p className="font-medium text-text-primary">{client?.label ?? clientId}</p>
              <p className="text-xs text-text-muted">{client?.fileLocation ?? "Custom location"}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleGenerate} disabled={enabledServers.length === 0}>
              <Download className="mr-1.5 size-3.5" />
              Generate Config
            </Button>
            <Button variant="outline" onClick={handleCopy} disabled={!generated}>
              <Copy className="mr-1.5 size-3.5" />
              Copy to Clipboard
            </Button>
            <Button variant="outline" onClick={handleDownload} disabled={!generated}>
              <Download className="mr-1.5 size-3.5" />
              Download {client?.configFilename ?? "config.json"}
            </Button>
          </div>

          {enabledServers.length === 0 && (
            <p className="text-sm text-text-muted">Enable at least one server to generate a config.</p>
          )}

          {generated && (
            <div className="border border-border rounded-lg bg-bg-primary p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-text-secondary">Generated Config</p>
                <span className="text-xs text-text-muted">{generated.length} chars</span>
              </div>
              <pre className="max-h-64 overflow-auto text-xs font-mono text-text-primary">{generated}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bulk Export</CardTitle>
          <CardDescription>Export all enabled servers for multiple clients at once</CardDescription>
        </CardHeader>
        <CardContent>
          <BulkExportPanel enabledServers={enabledServers} />
        </CardContent>
      </Card>
    </div>
  );
}

function BulkExportPanel({ enabledServers }: { enabledServers: InstalledMCPServer[] }) {
  const { toast } = useToast();

  const handleBulkExport = async (format: "json" | "yaml" | "zip") => {
    const results: Record<string, string> = {};
    const providers = [...MCP_CLIENT_PROVIDERS] as Array<{ id: string; buildConfig: (servers: InstalledMCPServer[]) => string }>;
    for (const provider of providers) {
      results[provider.id] = provider.buildConfig(enabledServers);
    }

    if (format === "json") {
      downloadFile("mcp-configs.json", JSON.stringify(results, null, 2), "application/json");
    } else if (format === "yaml") {
      const yamlProvider = getClientProvider("custom");
      downloadFile("mcp-configs.yaml", yamlProvider.buildConfig(enabledServers), "text/yaml");
    } else if (format === "zip") {
      toast({ title: "ZIP Export", description: "ZIP export requires additional library. Using JSON instead.", variant: "warning" });
      downloadFile("mcp-configs.json", JSON.stringify(results, null, 2), "application/json");
    }
    toast({ title: "Exported", description: `Downloaded ${format.toUpperCase()} bundle`, variant: "success" });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">Export configs for all {MCP_CLIENT_PROVIDERS.length} supported clients at once.</p>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => handleBulkExport("json")} disabled={enabledServers.length === 0}>
          <Download className="mr-1.5 size-3.5" />
          JSON Bundle
        </Button>
        <Button variant="outline" onClick={() => handleBulkExport("yaml")} disabled={enabledServers.length === 0}>
          <Download className="mr-1.5 size-3.5" />
          YAML Bundle
        </Button>
        <Button variant="outline" onClick={() => handleBulkExport("zip")} disabled={enabledServers.length === 0}>
          <Box className="mr-1.5 size-3.5" />
          ZIP Archive
        </Button>
      </div>
    </div>
  );
}

function ServerTestConnection({ server }: { server: InstalledMCPServer }) {
  const [status, setStatus] = React.useState<"idle" | "testing" | "success" | "error">("idle");
  const [logs, setLogs] = React.useState<string[]>([]);
  const { toast } = useToast();

  const handleTest = async () => {
    setStatus("testing");
    setLogs([]);
    setLogs((l) => [...l, `[${new Date().toISOString()}] Starting connection test...`]);
    await new Promise((r) => setTimeout(r, 1500));
    setLogs((l) => [...l, `[${new Date().toISOString()}] Resolving command: ${server.command ?? "N/A"}`]);
    await new Promise((r) => setTimeout(r, 800));
    setLogs((l) => [...l, `[${new Date().toISOString()}] Transport: ${server.transport}`]);
    await new Promise((r) => setTimeout(r, 600));

    const ok = Math.random() > 0.3;
    if (ok) {
      setStatus("success");
      setLogs((l) => [...l, `[${new Date().toISOString()}] \u2713 Connection successful (simulated)`]);
      toast({ title: "Test Passed", description: "Server responded (simulated)", variant: "success" });
    } else {
      setStatus("error");
      setLogs((l) => [...l, `[${new Date().toISOString()}] \u2717 Connection failed (simulated)`]);
      toast({ title: "Test Failed", description: "Could not reach server (simulated)", variant: "danger" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connection Test</CardTitle>
          <CardDescription>Verify the server can be reached with current configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={handleTest} disabled={status === "testing"} className="min-w-[160px]">
              {status === "testing" ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="mr-1.5 size-3.5" />
                  Run Test
                </>
              )}
            </Button>
            <ConnectionBadge status={status === "success" ? "connected" : status === "error" ? "error" : "unknown"} />
          </div>

          <div className="rounded-lg border border-border bg-bg-primary p-4 font-mono text-xs max-h-64 overflow-auto">
            {logs.length === 0 ? (
              <p className="text-text-muted">Click "Run Test" to start a connection probe.</p>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="text-text-secondary">{log}</div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <dl className="grid grid-cols-2 gap-2">
            <dt className="text-text-muted">Transport</dt>
            <dd><TagComp variant="default">{server.transport}</TagComp></dd>
            <dt className="text-text-muted">Command</dt>
            <dd className="font-mono truncate">{server.command ?? "\u2014"}</dd>
            <dt className="text-text-muted">Args</dt>
            <dd className="font-mono truncate">{server.args.join(" ") || "\u2014"}</dd>
            <dt className="text-text-muted">URL</dt>
            <dd className="font-mono truncate">{server.url ?? "\u2014"}</dd>
            <dt className="text-text-muted">Env Vars</dt>
            <dd>{server.env.length} configured</dd>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

function ServerInstallGuide({ server, catalog }: { server: InstalledMCPServer; catalog: MCPServer | undefined }) {
  if (!catalog) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="py-8 text-center">
            <Wand2 className="size-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary">Custom servers don\u2019t have a predefined install guide.</p>
            <p className="text-sm text-text-muted mt-1">Configure the transport, command, and environment variables in the Configuration tab.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {catalog.installGuide?.length && (
        <Card>
          <CardHeader>
            <CardTitle>Installation Guide</CardTitle>
            <CardDescription>Step-by-step instructions from the server maintainer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ol className="space-y-3">
              {catalog.installGuide.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="shrink-0 flex size-6 items-center justify-center rounded-full bg-accent/10 text-accent font-medium text-xs">{idx + 1}</span>
                  <div className="pt-0.5 text-text-secondary">{step}</div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {catalog.exampleUsage?.length && (
        <Card>
          <CardHeader>
            <CardTitle>Example Usage</CardTitle>
            <CardDescription>How to use this server with an AI assistant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {catalog.exampleUsage.map((ex, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-bg-primary p-3">
                <code className="text-sm font-mono text-text-primary block whitespace-pre-wrap">{ex}</code>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {catalog.packageName && (
        <Card>
          <CardHeader>
            <CardTitle>Package Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-text-muted">Package</dt>
              <dd className="font-mono">{catalog.packageName}</dd>
              <dt className="text-text-muted">Command</dt>
              <dd className="font-mono">{catalog.command} {catalog.args?.join(" ") ?? ""}</dd>
            </dl>
          </CardContent>
        </Card>
      )}

      {catalog.documentationUrl && (
        <Card>
          <CardContent className="flex items-center justify-center">
            <a href={catalog.documentationUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-2">
              <Globe className="size-4" />
              View Full Documentation
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: InstalledMCPServer["installStatus"] }) {
  type InstallStatus = InstalledMCPServer["installStatus"];
  const config: Record<InstallStatus, { label: string; variant: "muted" | "default" | "success" | "error" }> = {
    "not-installed": { label: "Not Installed", variant: "muted" },
    installing: { label: "Installing...", variant: "default" },
    installed: { label: "Installed", variant: "success" },
    failed: { label: "Failed", variant: "error" },
  };
  const cfg = config[status];
  return <TagComp variant={cfg.variant} className="text-[10px]">{cfg.label}</TagComp>;
}

function ConnectionBadge({ status }: { status: InstalledMCPServer["connectionStatus"] }) {
  type ConnectionStatus = InstalledMCPServer["connectionStatus"];
  const config: Record<ConnectionStatus, { label: string; variant: "muted" | "default" | "success" | "warning" | "error"; icon: LucideIcon }> = {
    unknown: { label: "Unknown", variant: "muted", icon: HelpCircle },
    connecting: { label: "Connecting...", variant: "default", icon: Loader2 },
    connected: { label: "Connected", variant: "success", icon: CheckCircle },
    disconnected: { label: "Disconnected", variant: "warning", icon: Tag },
    error: { label: "Error", variant: "error", icon: Hash },
  };
  const cfg = config[status];
  const Icon = cfg.icon;
  return (
    <TagComp variant={cfg.variant} className="text-[10px] gap-1">
      <Icon className="size-3" />
      {cfg.label}
    </TagComp>
  );
}

export * from "./types";