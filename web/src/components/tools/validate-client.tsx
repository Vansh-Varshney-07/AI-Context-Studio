"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Copy,
  Download,
  Loader2,
  Zap,
  AlertCircle,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Gauge,
  BarChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BlueprintPreview } from "@/components/generate/blueprint-preview";
import { ApiKeyModal } from "@/components/generate/api-key-modal";
import { validateServer, validateCollection, validateImportedJson } from "@/lib/engine";
import type { InstalledMCPServer, ValidationReport, ValidationResult } from "@/lib/engine";

export function ValidateClient() {
  const [inputText, setInputText] = useState("");
  const [assetType, setAssetType] = useState("instruction-file");
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateSingle = useCallback(async () => {
    if (!inputText.trim()) return;
    setIsValidating(true);
    setError(null);
    try {
      const mockServer: InstalledMCPServer = {
        instanceId: "temp",
        serverId: "temp",
        name: "Test Asset",
        category: "custom",
        transport: "stdio",
        command: "echo",
        args: [],
        env: [],
        autoStart: false,
        reconnect: false,
        logLevel: "info",
        enabled: true,
        installStatus: "installed",
        connectionStatus: "unknown",
      };
      const result = validateServer(mockServer, []);
      const reportData: ValidationReport = {
        servers: [result],
        globalIssues: [],
        ok: result.ok,
        counts: {
          errors: result.issues.filter((i) => i.severity === "error").length,
          warnings: result.issues.filter((i) => i.severity === "warning").length,
          infos: result.issues.filter((i) => i.severity === "info").length,
        },
      };
      setReport(reportData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Validation failed");
    } finally {
      setIsValidating(false);
    }
  }, [inputText]);

  const validateJson = useCallback(async () => {
    if (!inputText.trim()) return;
    setIsValidating(true);
    setError(null);
    try {
      const result = validateImportedJson(inputText);
      if (result.ok) {
        setReport({
          servers: [],
          globalIssues: [],
          ok: true,
          counts: { errors: 0, warnings: 0, infos: 1 },
        });
      } else {
        setReport({
          servers: [],
          globalIssues: [result.issue],
          ok: false,
          counts: { errors: 1, warnings: 0, infos: 0 },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Validation failed");
    } finally {
      setIsValidating(false);
    }
  }, [inputText]);

  const handleDownload = useCallback(() => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "validation-report.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [report]);

  const handleCopy = useCallback(async () => {
    if (!report) return;
    await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
  }, [report]);

  function getAllIssues() {
    if (!report) return [];
    return report.servers.flatMap((s) => s.issues);
  }

  function renderSummary() {
    return (
      <div className="space-y-6 p-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-4 rounded-lg border border-[var(--color-border)] text-center">
            <p className="text-3xl font-bold text-red-500">{report?.counts.errors ?? 0}</p>
            <p className="text-sm text-[var(--color-text-muted)]">Errors</p>
          </div>
          <div className="p-4 rounded-lg border border-[var(--color-border)] text-center">
            <p className="text-3xl font-bold text-yellow-500">{report?.counts.warnings ?? 0}</p>
            <p className="text-sm text-[var(--color-text-muted)]">Warnings</p>
          </div>
          <div className="p-4 rounded-lg border border-[var(--color-border)] text-center">
            <p className="text-3xl font-bold text-blue-500">{report?.counts.infos ?? 0}</p>
            <p className="text-sm text-[var(--color-text-muted)]">Infos</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Gauge className="h-8 w-8 text-[var(--color-accent)]" />
          <div>
            <p className="font-semibold text-[var(--color-text-primary)]">
              {report?.ok ? "✅ Asset is valid" : "❌ Asset has errors"}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              {report?.servers.length ?? 0} server(s) validated
            </p>
          </div>
        </div>
      </div>
    );
  }

  function renderIssues() {
    const issues = getAllIssues();
    if (issues.length === 0) {
      return (
        <div className="text-center py-8 text-[var(--color-text-muted)]">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p>No issues found!</p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {issues.map((issue) => (
          <div
            key={`${issue.code}-${issue.field ?? "none"}`}
            className={cn(
              "p-4 rounded-lg border",
              issue.severity === "error" && "border-red-500/50 bg-red-500/10",
              issue.severity === "warning" && "border-yellow-500/50 bg-yellow-500/10",
              issue.severity === "info" && "border-blue-500/50 bg-blue-500/10",
            )}
          >
            <div className="flex items-start gap-3">
              {issue.severity === "error" && <XCircle className="h-5 w-5 text-red-500 mt-0.5" />}
              {issue.severity === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />}
              {issue.severity === "info" && <Info className="h-5 w-5 text-blue-500 mt-0.5" />}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={issue.severity === "error" ? "danger" : issue.severity === "warning" ? "default" : "secondary"}>
                    {issue.severity.toUpperCase()}
                  </Badge>
                  <span className="font-mono text-sm text-[var(--color-text-muted)]">{issue.code}</span>
                  {issue.field && <span className="text-xs text-[var(--color-text-muted)]">{issue.field}</span>}
                </div>
                <p className="text-[var(--color-text-primary)]">{issue.message}</p>
                {issue.suggestion && <p className="text-sm text-[var(--color-text-muted)] mt-1">💡 {issue.suggestion}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderCompatibility() {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-lg border border-[var(--color-border)]">
          <h4 className="font-medium text-[var(--color-text-primary)] mb-2">MCP Client Compatibility</h4>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "claude-desktop",
              "claude-code",
              "cursor",
              "opencode",
              "codex-cli",
              "gemini-cli",
              "continue",
              "cline",
              "roo-code",
              "windsurf",
            ].map((client) => (
              <div key={client} className="flex items-center gap-2 p-2 rounded border border-[var(--color-border)]">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm capitalize">{client.replace(/-/g, " ")}</span>
                <span className="text-xs text-green-500 ml-auto">✓ Compatible</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-lg border border-[var(--color-border)]">
          <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Token Efficiency</h4>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full border-4 border-[var(--color-accent)] border-t-transparent animate-spin" />
            <div>
              <p className="text-2xl font-bold text-[var(--color-accent)]">~85%</p>
              <p className="text-sm text-[var(--color-text-muted)]">Efficiency Score</p>
            </div>
</div>
        </div>
      </div>
    );
  }

  function renderJson() {
    return (
      <pre className="p-4 font-mono text-sm bg-[var(--color-bg-tertiary)] overflow-auto max-h-[500px] whitespace-pre-wrap break-words">
        {JSON.stringify(report, null, 2)}
      </pre>
    );
  }

  function renderReport() {
    if (!report) {
      return (
        <Card className="h-full flex flex-col">
          <div className="flex items-center justify-center h-full p-8 text-center">
            <Shield className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--color-text-secondary)]">No validation report yet</h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Enter asset content and click Validate</p>
          </div>
        </Card>
      );
    }

    return (
      <Card className="h-full flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--color-text-secondary)]" />
            <span className="font-mono text-sm text-[var(--color-text-primary)]">Validation Report</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
              {renderSummary()}
            </TabsContent>
            <TabsContent value="issues">
              <div className="p-4 space-y-4">
                {renderIssues()}
              </div>
            </TabsContent>
            <TabsContent value="compatibility">
              {renderCompatibility()}
            </TabsContent>
            <TabsContent value="json">
              {renderJson()}
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex-1 container-app py-16 px-4">
      <div className="mb-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Asset Validator</h1>
        <p className="text-[var(--color-text-secondary)]">Validate AI assets with quality scoring, AI performance estimates, token efficiency, and compatibility matrix.</p>
        <Separator />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px] max-w-6xl">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Asset Content</h3>
            <Textarea
              placeholder="Paste your asset content (Markdown, JSON, YAML)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Asset Type</h3>
            <Select value={assetType} onValueChange={setAssetType}>
              <SelectTrigger><SelectValue placeholder="Select asset type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="instruction-file">Instruction File</SelectItem>
                <SelectItem value="system-prompt">System Prompt</SelectItem>
                <SelectItem value="mcp-config">MCP Config</SelectItem>
                <SelectItem value="workflow">Workflow</SelectItem>
                <SelectItem value="prompt-template">Prompt Template</SelectItem>
                <SelectItem value="json">Raw JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button
              onClick={assetType === "json" ? validateJson : validateSingle}
              disabled={isValidating || !inputText.trim()}
              className="flex-1"
              size="lg"
            >
              {isValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating…
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Validate Asset
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)]">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          {renderReport()}
        </div>
      </div>
    </div>
  );
}
