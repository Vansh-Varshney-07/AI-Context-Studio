"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Server,
  Copy,
  Download,
  Loader2,
  Zap,
  AlertCircle,
  FileText,
  Plus,
  Trash2,
  Edit2,
  Terminal,
  Globe,
  Database,
  Cloud,
  Sparkles,
  Wind,
  Braces,
  Code2,
  MousePointer2,
  Bot,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BlueprintPreview } from "@/components/generate/blueprint-preview";
import { ApiKeyModal } from "@/components/generate/api-key-modal";
import { getClientProvider, getRegisteredClientIds } from "@/lib/engine";
import type { InstalledMCPServer, MCPClientMeta, MCPClientId, MCPCategoryId, MCPTransport } from "@/lib/engine";

const SAMPLE_SERVERS: InstalledMCPServer[] = [
  {
    instanceId: "github-1",
    serverId: "github",
    name: "GitHub MCP",
    category: "git",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-github"],
    env: [{ key: "GITHUB_PERSONAL_ACCESS_TOKEN", value: "ghp_****" }],
    enabled: true,
    autoStart: true,
    reconnect: true,
    logLevel: "info",
    installStatus: "installed",
    connectionStatus: "connected",
    installedAt: new Date().toISOString(),
  },
  {
    instanceId: "filesystem-1",
    serverId: "filesystem",
    name: "Filesystem MCP",
    category: "filesystem",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/Users/username/projects"],
    env: [],
    enabled: true,
    autoStart: true,
    reconnect: true,
    logLevel: "info",
    installStatus: "installed",
    connectionStatus: "connected",
    installedAt: new Date().toISOString(),
  },
  {
    instanceId: "postgres-1",
    serverId: "postgres",
    name: "PostgreSQL MCP",
    category: "database",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:pass@localhost:5432/db"],
    env: [],
    enabled: true,
    autoStart: false,
    reconnect: true,
    logLevel: "info",
    installStatus: "installed",
    connectionStatus: "disconnected",
    installedAt: new Date().toISOString(),
  },
];

interface MCPConfigClientProps {
  initialClients: readonly MCPClientMeta[];
}

export function MCPConfigClient({ initialClients }: MCPConfigClientProps) {
  const [servers, setServers] = useState<InstalledMCPServer[]>(SAMPLE_SERVERS);
  const [selectedClient, setSelectedClient] = useState<string>(initialClients[0]?.id ?? "");
  const [output, setOutput] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [aiProvider, setAiProvider] = useState<{ provider: string; apiKey: string; model?: string } | null>(null);
  const [editingServer, setEditingServer] = useState<InstalledMCPServer | null>(null);
  const [newServerForm, setNewServerForm] = useState<Partial<InstalledMCPServer>>({
    name: "",
    category: "custom",
    transport: "stdio",
    command: "npx",
    args: [],
    env: [],
    enabled: true,
  });

  const clientIds = getRegisteredClientIds();
  const provider = selectedClient ? getClientProvider(selectedClient as MCPClientId) : null;

  const generateLocal = useCallback(async () => {
    if (!provider) return;
    setIsGenerating(true);
    setError(null);
    try {
      const config = provider.buildConfig(servers.filter((s) => s.enabled));
      setOutput(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }, [selectedClient, servers]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = provider?.configFilename || "mcp.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [output, provider]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  }, [output]);

  const handleApiKeySubmit = useCallback((provider: { provider: string; apiKey: string; model?: string }) => {
    setAiProvider(provider);
    setShowApiKeyModal(false);
  }, []);

  const handleAddServer = useCallback(() => {
    if (!newServerForm.name || !newServerForm.command) return;
    const newServer: InstalledMCPServer = {
      instanceId: `custom-${Date.now()}`,
      serverId: newServerForm.name.toLowerCase().replace(/\s+/g, "-"),
      name: newServerForm.name,
      category: (newServerForm.category ?? "custom") as MCPCategoryId,
      transport: newServerForm.transport ?? "stdio",
      command: newServerForm.command,
      args: newServerForm.args ?? [],
      env: newServerForm.env ?? [],
      enabled: newServerForm.enabled ?? true,
      autoStart: newServerForm.autoStart ?? true,
      reconnect: true,
      logLevel: "info",
      installStatus: "installed",
      connectionStatus: "unknown",
      installedAt: new Date().toISOString(),
    };
    setServers((prev) => [...prev, newServer]);
    setNewServerForm({ name: "", category: "custom", transport: "stdio", command: "npx", args: [], env: [], enabled: true });
  }, [newServerForm]);

  const handleDeleteServer = useCallback((id: string) => {
    setServers((prev) => prev.filter((s) => s.instanceId !== id));
  }, []);

  const renderServerList = () => {
    if (servers.length === 0) {
      return (
        <div className="text-center py-8 text-[var(--color-text-muted)]">
          No servers configured yet.
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {servers.map((server) => (
          <Card key={server.instanceId} className="p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={server.enabled}
                  onChange={(e) => setServers((prev) => prev.map((s) => s.instanceId === server.instanceId ? { ...s, enabled: e.target.checked } : s))}
                  className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--color-text-primary)] truncate">{server.name}</span>
                    <Badge variant="outline" className="text-xs capitalize">{server.category}</Badge>
                    <Badge variant={server.enabled ? "default" : "secondary"} className="text-xs">
                      {server.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)] font-mono">
                    {server.transport === "stdio" ? (
                      <>
                        <Terminal className="inline h-3 w-3 mr-1" />
                        {server.command} {server.args.join(" ")}
                      </>
                    ) : (
                      <>
                        <Globe className="inline h-3 w-3 mr-1" />
                        {server.url}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => setEditingServer(server)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteServer(server.instanceId)} className="text-red-500 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderPreviewPane = () => {
    if (output) {
      return (
        <Card className="h-full flex flex-col overflow-hidden">
          <Tabs defaultValue="json" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="json">JSON</TabsTrigger>
              <TabsTrigger value="yaml">YAML</TabsTrigger>
            </TabsList>
            <TabsContent value="json">
              <div className="p-4 font-mono text-sm leading-relaxed text-[var(--color-text-primary)] bg-[var(--color-bg-tertiary)] h-[500px] overflow-auto whitespace-pre-wrap break-words">
                {output}
              </div>
            </TabsContent>
            <TabsContent value="yaml">
              <div className="p-4 font-mono text-sm leading-relaxed text-[var(--color-text-primary)] bg-[var(--color-bg-tertiary)] h-[500px] overflow-auto whitespace-pre-wrap break-words">
                {output}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      );
    }

    return (
      <Card className="h-full flex flex-col">
        <div className="flex items-center justify-center h-full p-8 text-center">
          <Server className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[var(--color-text-secondary)]">No config generated yet</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Add servers and select a client to generate config</p>
        </div>
      </Card>
    );
  };

  const renderEditModal = () => {
    if (!editingServer) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setEditingServer(null)}>
        <Card className="w-full max-w-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {editingServer.instanceId ? "Edit Server" : "Add Server"}
            </h2>
            <button onClick={() => setEditingServer(null)} className="p-1 rounded hover:bg-[var(--color-bg-secondary)] transition-colors">
              <X className="h-5 w-5 text-[var(--color-text-muted)]" />
            </button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleAddServer(); }} className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="server-name">Name</Label>
              <Input id="server-name" value={newServerForm.name || ""} onChange={(e) => setNewServerForm({ ...newServerForm, name: e.target.value })} placeholder="My MCP Server" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="server-category">Category</Label>
              <Select value={newServerForm.category ?? "custom"} onValueChange={(v) => setNewServerForm({ ...newServerForm, category: v as MCPCategoryId })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="filesystem">Filesystem</SelectItem>
                  <SelectItem value="git">Git</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="cloud">Cloud</SelectItem>
                  <SelectItem value="terminal">Terminal</SelectItem>
                  <SelectItem value="browser">Browser</SelectItem>
                  <SelectItem value="search">Search</SelectItem>
                  <SelectItem value="docs">Documentation</SelectItem>
                  <SelectItem value="memory">Memory</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="server-transport">Transport</Label>
              <Select value={newServerForm.transport ?? "stdio"} onValueChange={(v) => setNewServerForm({ ...newServerForm, transport: v as MCPTransport })}>
                <SelectTrigger><SelectValue placeholder="Select transport" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="stdio">Standard IO</SelectItem>
                  <SelectItem value="http">HTTP</SelectItem>
                  <SelectItem value="sse">Server-Sent Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="server-command">Command</Label>
              <Input id="server-command" value={newServerForm.command || ""} onChange={(e) => setNewServerForm({ ...newServerForm, command: e.target.value })} placeholder="npx" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="server-args">Args (comma separated)</Label>
              <Input id="server-args" value={newServerForm.args?.join(", ") || ""} onChange={(e) => setNewServerForm({ ...newServerForm, args: e.target.value.split(",").map((a) => a.trim()).filter(Boolean) })} placeholder="-y, @modelcontextprotocol/server-github" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="server-env">Env Vars (KEY=value, one per line)</Label>
              <Textarea id="server-env" value={newServerForm.env?.map((e) => `${e.key}=${e.value}`).join("\n") || ""} onChange={(e) => setNewServerForm({ ...newServerForm, env: e.target.value.split("\n").map((l) => { const [k, ...v] = l.split("="); return { key: (k ?? "").trim(), value: v.join("=").trim() }; }).filter(Boolean) })} rows={4} placeholder="GITHUB_TOKEN=ghp_xxx" />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={newServerForm.enabled ?? true}
                onChange={(e) => setNewServerForm({ ...newServerForm, enabled: e.target.checked })}
                id="server-enabled"
              />
              <Label htmlFor="server-enabled" className="text-sm">Enabled</Label>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => setEditingServer(null)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {editingServer.instanceId ? "Save Changes" : "Add Server"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex-1 container-app py-16 px-4">
      <div className="mb-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">MCP Config Generator</h1>
        <p className="text-[var(--color-text-secondary)]">Build MCP server configurations for 11 AI clients (Claude Desktop, Cursor, OpenCode, Continue, etc.) with validation.</p>
        <Separator />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px] max-w-6xl">
        {/* Form Pane */}
        <div className="space-y-6">
          {/* Client Selector */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Target Client</h3>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {initialClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-[var(--color-text-muted)]">
              Config file: <code className="font-mono bg-[var(--color-bg-tertiary)] px-1 rounded">{provider?.configFilename}</code>
              {provider?.supportsRemoteTransport && <span className="ml-2 text-green-500">✓ Supports HTTP/SSE</span>}
            </p>
          </div>

          {/* Server List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">MCP Servers ({servers.length})</h3>
              <Button variant="outline" size="sm" onClick={() => setEditingServer({ instanceId: "", serverId: "", name: "", category: "custom", transport: "stdio", command: "npx", args: [], env: [], enabled: true, autoStart: true, reconnect: true, logLevel: "info", installStatus: "installed", connectionStatus: "unknown", installedAt: new Date().toISOString() })}>
                <Plus className="h-4 w-4 mr-1" />
                Add Server
              </Button>
            </div>
            {renderServerList()}

            {/* Generate Button */}
            <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border)]">
              <Button
                onClick={generateLocal}
                disabled={isGenerating}
                className="flex-1"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Config
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Pane */}
        <div className="hidden lg:block">
          {renderPreviewPane()}
        </div>
      </div>

      {/* Edit/New Server Modal */}
      {renderEditModal()}
    </div>
  );
}
