"use client";

import { motion } from "framer-motion";
import {
  Palette,
  Key,
  Database,
  Shield,
  Globe,
  Bell,
  Keyboard,
  Eye,
  Moon,
  Sun,
  Monitor,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Info,
  ChevronRight,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import * as React from "react";
import { useState } from "react";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Switch } from "@components/ui/switch";
import { Separator } from "@components/ui/separator";
import { ScrollArea } from "@components/ui/scroll-area";
import { Tag } from "@components/common/tag";
import { EmptyState } from "@components/common/empty-state";
import { moduleTransition } from "@components/motion";
import { useToast } from "@providers/toaster-provider";
import { cn } from "@utils/cn";
import { downloadFile, copyToClipboard } from "@utils";
import { uuid } from "@utils/uuid";

import type { ModuleParams } from "@/shared/types/navigation";

interface SettingsModuleProps {
  params: ModuleParams;
}

export function SettingsModule({ params }: SettingsModuleProps) {
  const [activeTab, setActiveTab] = React.useState("general");
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("system");
  const [compactMode, setCompactMode] = React.useState(false);
  const [animationsEnabled, setAnimationsEnabled] = React.useState(true);
  const [autoSave, setAutoSave] = React.useState(true);
  const [telemetryEnabled, setTelemetryEnabled] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [apiKeys, setApiKeys] = React.useState<Record<string, string>>({});
  const [providers] = React.useState([
    { id: "openai", label: "OpenAI", envVar: "OPENAI_API_KEY", placeholder: "sk-..." },
    { id: "anthropic", label: "Anthropic", envVar: "ANTHROPIC_API_KEY", placeholder: "sk-ant-..." },
    { id: "gemini", label: "Google Gemini", envVar: "GEMINI_API_KEY", placeholder: "..." },
    { id: "deepseek", label: "DeepSeek", envVar: "DEEPSEEK_API_KEY", placeholder: "..." },
    { id: "nvidia", label: "NVIDIA", envVar: "NVIDIA_API_KEY", placeholder: "..." },
    { id: "openrouter", label: "OpenRouter", envVar: "OPENROUTER_API_KEY", placeholder: "sk-or-..." },
  ]);
  const [showExportModal, setShowExportModal] = React.useState(false);
  const [exportFormat, setExportFormat] = React.useState<"json" | "markdown">("json");
  const [showImportModal, setShowImportModal] = React.useState(false);
  const [importFile, setImportFile] = React.useState<File | null>(null);
  const [storageStats, setStorageStats] = React.useState<{ assets: number; size: string }>({ assets: 0, size: "0 KB" });
  const { toast } = useToast();

  // Load settings from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("ai-context-studio-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTheme(parsed.theme || "system");
        setCompactMode(parsed.compactMode || false);
        setAnimationsEnabled(parsed.animationsEnabled !== false);
        setAutoSave(parsed.autoSave !== false);
        setTelemetryEnabled(parsed.telemetryEnabled || false);
        setNotificationsEnabled(parsed.notificationsEnabled !== false);
        setApiKeys(parsed.apiKeys || {});
      } catch {}
    }
    loadStorageStats();
  }, []);

  // Save settings to localStorage
  React.useEffect(() => {
    const settings = {
      theme,
      compactMode,
      animationsEnabled,
      autoSave,
      telemetryEnabled,
      notificationsEnabled,
      apiKeys,
    };
    localStorage.setItem("ai-context-studio-settings", JSON.stringify(settings));
    applyTheme(theme);
  }, [theme, compactMode, animationsEnabled, autoSave, telemetryEnabled, notificationsEnabled, apiKeys]);

  const applyTheme = (t: "light" | "dark" | "system") => {
    const root = document.documentElement;
    if (t === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    } else {
      root.classList.toggle("dark", t === "dark");
    }
  };

  const loadStorageStats = async () => {
    try {
      const { getAllAssets } = await import("@services/storage");
      const assets = await getAllAssets();
      const totalSize = assets.reduce((sum, a) => sum + JSON.stringify(a).length, 0);
      setStorageStats({ assets: assets.length, size: formatBytes(totalSize) });
    } catch {
      setStorageStats({ assets: 0, size: "0 KB" });
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleApiKeyChange = (providerId: string, value: string) => {
    setApiKeys((prev) => ({ ...prev, [providerId]: value }));
  };

  const handleExport = async () => {
    try {
      const { getAllAssets } = await import("@services/storage");
      const assets = await getAllAssets();
      const exportData = {
        version: "1.0.0",
        exportedAt: new Date().toISOString(),
        assets,
        settings: {
          theme,
          compactMode,
          animationsEnabled,
          autoSave,
          notificationsEnabled,
        },
      };

      if (exportFormat === "json") {
        downloadFile(`ai-context-studio-export-${Date.now()}.json`, JSON.stringify(exportData, null, 2), "application/json");
      } else {
        let md = `# AI Context Studio Export\n\n`;
        md += `**Exported:** ${new Date().toISOString()}\n`;
        md += `**Assets:** ${assets.length}\n\n`;
        for (const asset of assets) {
          md += `## ${asset.title}\n`;
          md += `**Type:** ${asset.kind}  \n`;
          md += `**Created:** ${asset.createdAt}  \n`;
          md += `**Updated:** ${asset.updatedAt}  \n`;
          md += `**Tags:** ${asset.tags.join(", ") || "â€”"}  \n\n`;
          md += `### Content\n\n\`\`\`json\n${JSON.stringify(asset.content, null, 2)}\n\`\`\`\n\n---\n\n`;
        }
        downloadFile(`ai-context-studio-export-${Date.now()}.md`, md, "text/markdown");
      }
      toast({ title: "Exported", description: `Data exported as ${exportFormat.toUpperCase()}`, variant: "success" });
      setShowExportModal(false);
    } catch (e) {
      toast({ title: "Export failed", description: e instanceof Error ? e.message : "Unknown error", variant: "danger" });
    }
  };

  const handleImport = async () => {
    if (!importFile) return;
    try {
      const text = await importFile.text();
      const data = JSON.parse(text);
      const { saveAsset } = await import("@services/storage");
      
      let imported = 0;
      if (data.assets && Array.isArray(data.assets)) {
        for (const asset of data.assets) {
          await saveAsset({
            ...asset,
            id: uuid(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          imported++;
        }
      }
      loadStorageStats();
      toast({ title: "Imported", description: `${imported} assets imported`, variant: "success" });
      setShowImportModal(false);
      setImportFile(null);
    } catch (e) {
      toast({ title: "Import failed", description: e instanceof Error ? e.message : "Invalid file format", variant: "danger" });
    }
  };

  const handleClearAllData = async () => {
    if (!window.confirm("This will delete ALL assets and settings. This cannot be undone. Continue?")) return;
    if (!window.confirm("Are you absolutely sure? Type 'DELETE' to confirm.")) return;
    
    try {
      const { getAllAssets, deleteAsset } = await import("@services/storage");
      const assets = await getAllAssets();
      for (const asset of assets) {
        await deleteAsset(asset.id);
      }
      localStorage.removeItem("ai-context-studio-settings");
      loadStorageStats();
      toast({ title: "All data cleared", variant: "success" });
      window.location.reload();
    } catch (e) {
      toast({ title: "Clear failed", description: e instanceof Error ? e.message : "Unknown error", variant: "danger" });
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Palette },
    { id: "appearance", label: "Appearance", icon: Eye },
    { id: "ai-providers", label: "AI Providers", icon: Key },
    { id: "data", label: "Data & Storage", icon: Database },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "about", label: "About", icon: Info },
  ];

  return (
    <motion.div
      variants={moduleTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex h-full flex-col overflow-hidden"
    >
      <div className="flex h-14 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Palette className="size-4" />
          </span>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-text-primary">Settings</h1>
            <p className="text-xs text-text-muted">Configure AI Context Studio</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          <aside className="w-48 flex-shrink-0 border-r border-border bg-bg-secondary/50">
            <nav className="p-3 space-y-1" role="tablist" aria-label="Settings categories">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                    activeTab
                      ? "bg-accent-light text-accent"
                      : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                  )}
                >
                  <tab.icon className="size-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 overflow-y-auto p-6">
            <ScrollArea className="h-full">
              <div className="max-w-3xl space-y-8">
                {activeTab === "general" && (
                  <GeneralSettings
                    compactMode={compactMode}
                    setCompactMode={setCompactMode}
                    animationsEnabled={animationsEnabled}
                    setAnimationsEnabled={setAnimationsEnabled}
                    autoSave={autoSave}
                    setAutoSave={setAutoSave}
                    notificationsEnabled={notificationsEnabled}
                    setNotificationsEnabled={setNotificationsEnabled}
                  />
                )}
                {activeTab === "appearance" && (
                  <AppearanceSettings theme={theme} setTheme={setTheme} />
                )}
                {activeTab === "ai-providers" && (
                  <AIProvidersSettings providers={providers} apiKeys={apiKeys} onApiKeyChange={handleApiKeyChange} />
                )}
                {activeTab === "data" && (
                  <DataSettings
                    storageStats={storageStats}
                    exportFormat={exportFormat}
                    setExportFormat={setExportFormat}
                    showExportModal={showExportModal}
                    setShowExportModal={setShowExportModal}
                    showImportModal={showImportModal}
                    setShowImportModal={setShowImportModal}
                    importFile={importFile}
                    setImportFile={setImportFile}
                    handleExport={handleExport}
                    handleImport={handleImport}
                    handleClearAllData={handleClearAllData}
                  />
                )}
                {activeTab === "privacy" && (
                  <PrivacySettings telemetryEnabled={telemetryEnabled} setTelemetryEnabled={setTelemetryEnabled} />
                )}
                {activeTab === "about" && <AboutSettings />}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function GeneralSettings({
  compactMode,
  setCompactMode,
  animationsEnabled,
  setAnimationsEnabled,
  autoSave,
  setAutoSave,
  notificationsEnabled,
  setNotificationsEnabled,
}: {
  compactMode: boolean;
  setCompactMode: (v: boolean) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (v: boolean) => void;
  autoSave: boolean;
  setAutoSave: (v: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (v: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-text-primary mb-4">General</h2>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <SettingRow
              label="Auto-save changes"
              description="Automatically save drafts and changes"
              action={
                <Switch
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                  aria-label="Auto-save changes"
                />
              }
            />
            <Separator />
            <SettingRow
              label="Animations"
              description="Enable UI animations and transitions"
              action={
                <Switch
                  checked={animationsEnabled}
                  onCheckedChange={setAnimationsEnabled}
                  aria-label="Enable animations"
                />
              }
            />
            <Separator />
            <SettingRow
              label="Compact mode"
              description="Reduce spacing for denser UI"
              action={
                <Switch
                  checked={compactMode}
                  onCheckedChange={setCompactMode}
                  aria-label="Compact mode"
                />
              }
            />
            <Separator />
            <SettingRow
              label="Notifications"
              description="Show toast notifications for actions"
              action={
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                  aria-label="Enable notifications"
                />
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AppearanceSettings({
  theme,
  setTheme,
}: {
  theme: "light" | "dark" | "system";
  setTheme: (t: "light" | "dark" | "system") => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-text-primary mb-4">Appearance</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-text-primary mb-2">Theme</Label>
                <Select value={theme} onValueChange={setTheme as (v: "light" | "dark" | "system") => void}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="size-4" />
                        System
                      </div>
                    </SelectItem>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="size-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="size-4" />
                        Dark
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AIProvidersSettings({
  providers,
  apiKeys,
  onApiKeyChange,
}: {
  providers: { id: string; label: string; envVar: string; placeholder: string }[];
  apiKeys: Record<string, string>;
  onApiKeyChange: (id: string, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-text-primary mb-4">AI Provider API Keys</h2>
        <p className="text-xs text-text-muted mb-4">
          Enter your API keys to enable AI generation. Keys are stored locally in your browser.
        </p>
        <Card>
          <CardContent className="space-y-4 pt-6">
            {providers.map((provider) => (
              <div key={provider.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-text-primary">{provider.label}</span>
                    <span className="text-xs text-text-muted px-2 py-0.5 rounded bg-bg-tertiary">
                      {provider.envVar}
                    </span>
                  </div>
                </div>
                <Input
                  type="password"
                  placeholder={provider.placeholder}
                  value={apiKeys[provider.id] || ""}
                  onChange={(e) => onApiKeyChange(provider.id, e.target.value)}
                  className="font-mono text-sm"
                  autoComplete="off"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DataSettings({
  storageStats,
  exportFormat,
  setExportFormat,
  showExportModal,
  setShowExportModal,
  showImportModal,
  setShowImportModal,
  importFile,
  setImportFile,
  handleExport,
  handleImport,
  handleClearAllData,
}: {
  storageStats: { assets: number; size: string };
  exportFormat: "json" | "markdown";
  setExportFormat: (f: "json" | "markdown") => void;
  showExportModal: boolean;
  setShowExportModal: (v: boolean) => void;
  showImportModal: boolean;
  setShowImportModal: (v: boolean) => void;
  importFile: File | null;
  setImportFile: (f: File | null) => void;
  handleExport: () => void;
  handleImport: () => void;
  handleClearAllData: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-text-primary mb-4">Data & Storage</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Storage Statistics</CardTitle>
              <CardDescription className="text-xs">Local IndexedDB usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <StatRow label="Total Assets" value={storageStats.assets.toString()} />
              <StatRow label="Storage Used" value={storageStats.size} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
              <CardDescription className="text-xs">Data management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" onClick={() => setShowExportModal(true)} className="w-full justify-start gap-2">
                <Download className="size-4" />
                Export Data
              </Button>
              <Button variant="outline" onClick={() => setShowImportModal(true)} className="w-full justify-start gap-2">
                <Upload className="size-4" />
                Import Data
              </Button>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-text-primary">Danger Zone</h3>
            <p className="text-xs text-text-muted">Irreversible actions</p>
          </div>
          <Button variant="danger" onClick={handleClearAllData} className="gap-2">
            <Trash2 className="size-4" />
            Clear All Data
          </Button>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <Modal isOpen={showExportModal} onClose={() => setShowExportModal(false)} title="Export Data">
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">Choose export format</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-bg-secondary cursor-pointer">
                <input
                  type="radio"
                  name="exportFormat"
                  value="json"
                  checked={exportFormat === "json"}
                  onChange={() => setExportFormat("json")}
                  className="sr-only"
                />
                <span className="flex items-center gap-2">
                  <Tag variant="default">JSON</Tag>
                  <span className="text-sm text-text-secondary">Full data with metadata (recommended)</span>
                </span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-bg-secondary cursor-pointer">
                <input
                  type="radio"
                  name="exportFormat"
                  value="markdown"
                  checked={exportFormat === "markdown"}
                  onChange={() => setExportFormat("markdown")}
                  className="sr-only"
                />
                <span className="flex items-center gap-2">
                  <Tag variant="default">Markdown</Tag>
                  <span className="text-sm text-text-secondary">Human-readable documentation</span>
                </span>
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setShowExportModal(false)}>Cancel</Button>
              <Button onClick={handleExport}>Export</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <Modal isOpen={showImportModal} onClose={() => setShowImportModal(false)} title="Import Data">
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">Select a JSON export file to import</p>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="sr-only"
                id="import-file"
              />
              <label htmlFor="import-file" className="cursor-pointer">
                <Upload className="size-12 text-text-muted mx-auto mb-2" />
                <p className="text-sm text-text-secondary">Click to select or drag & drop</p>
                <p className="text-xs text-text-muted">.json files only</p>
              </label>
              {importFile && (
                <p className="text-sm text-text-primary mt-2">Selected: {importFile.name}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => { setShowImportModal(false); setImportFile(null); }}>Cancel</Button>
              <Button onClick={handleImport} disabled={!importFile}>Import</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function PrivacySettings({
  telemetryEnabled,
  setTelemetryEnabled,
}: {
  telemetryEnabled: boolean;
  setTelemetryEnabled: (v: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-text-primary mb-4">Privacy & Security</h2>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <SettingRow
              label="Anonymous usage analytics"
              description="Help improve the product by sending anonymous usage data"
              action={
                <Switch
                  checked={telemetryEnabled}
                  onCheckedChange={setTelemetryEnabled}
                  aria-label="Enable telemetry"
                />
              }
            />
            <Separator />
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Data Principles</h4>
              <ul className="space-y-1 text-xs text-text-secondary">
                <li>â€¢ All data stored locally in your browser (IndexedDB)</li>
                <li>â€¢ No data sent to external servers without explicit action</li>
                <li>â€¢ API keys never leave your device</li>
                <li>â€¢ Encrypted storage with AES-GCM</li>
                <li>â€¢ No user accounts, no tracking, no cookies</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AboutSettings() {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <div className="flex size-16 items-center justify-center rounded-xl bg-accent/10 text-accent mx-auto mb-4">
          <Palette className="size-8" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary">AI Context Studio</h2>
        <p className="text-sm text-text-muted mt-1">Version 1.0.0</p>
        <p className="text-xs text-text-muted mt-2">Local-first AI prompt engineering studio</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <LinkRow label="GitHub Repository" href="https://github.com/Vansh-Varshney-07/AI-Context-Studio" />
          <LinkRow label="Issues & Feedback" href="https://github.com/Vansh-Varshney-07/AI-Context-Studio/issues" />
          <LinkRow label="Documentation" href="https://github.com/Vansh-Varshney-07/AI-Context-Studio/tree/main/docs" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">License</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-text-secondary">MIT License â€” Free for personal and commercial use</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tech Stack</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1">
          {["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Tauri v2", "Rust", "Zustand", "Framer Motion", "Radix UI", "IndexedDB"].map((tech) => (
            <Tag key={tech} variant="muted" className="text-[10px]">{tech}</Tag>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SettingRow({ label, description, action }: { label: string; description: string; action: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <Label className="text-sm font-medium text-text-primary">{label}</Label>
        <p className="text-xs text-text-muted mt-0.5">{description}</p>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-text-muted">{label}</span>
      <span className="text-sm font-mono font-medium text-text-primary">{value}</span>
    </div>
  );
}

function LinkRow({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm text-text-secondary hover:text-text-primary transition-colors">
      <span>{label}</span>
      <ChevronRight className="size-3.5 text-text-muted" />
    </a>
  );
}

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl border border-border bg-bg-primary p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-bg-secondary transition-colors" aria-label="Close">
            <X className="size-4 text-text-muted" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

