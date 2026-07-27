"use client";

import * as React from "react";
import { 
  Download, 
  Copy, 
  RefreshCw, 
  Zap, 
  Brain, 
  Target, 
  Shield,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Star,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@utils";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { ScrollArea } from "@components/ui/scroll-area";
import { Tag } from "@components/common/tag";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui/tooltip";
import { useToast } from "@providers/toaster-provider";
import { downloadFile, copyToClipboard } from "@utils";
import type { OptimizationResult, OptimizationChange } from "@/features/optimizer/types";
import { DiffView, ExplanationPanel } from "./DiffView";

interface OptimizedViewProps {
  result: OptimizationResult;
  onExport: (format: "json" | "md") => void;
  onCopy: () => void;
  onRegenerate: () => void;
  onViewOriginal: () => void;
  onViewOptimized: () => void;
}

const IconComponents = {
  FileText,
  Zap,
  Brain,
  Target,
  Shield,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Star,
} as const;

type IconKey = keyof typeof IconComponents;

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: IconKey }) {
  const Icon = IconComponents[icon];
  return (
    <div className="rounded-lg border border-border bg-bg-secondary p-3">
      <div className="flex items-center gap-2 text-text-muted mb-1">
        <Icon className="size-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-lg font-bold text-text-primary">{value}</div>
    </div>
  );
}

export function OptimizedView({
  result,
  onExport,
  onCopy,
  onRegenerate,
  onViewOriginal,
  onViewOptimized,
}: OptimizedViewProps) {
  const [activeTab, setActiveTab] = React.useState("comparison");
  const { toast } = useToast();

  const generateMarkdownReport = (data: OptimizationResult): string => {
    let md = `# Prompt Optimization Report\n\n`;
    md += `**Original Length:** ${data.metadata.originalLength} chars\n`;
    md += `**Optimized Length:** ${data.metadata.optimizedLength} chars\n`;
    md += `**Token Reduction:** ${data.summary.tokenReduction} (${data.summary.tokenReductionPercent.toFixed(1)}%)\n`;
    md += `**Changes:** ${data.summary.totalChanges} (${data.summary.majorChanges} major, ${data.summary.moderateChanges} moderate, ${data.summary.minorChanges} minor)\n\n`;
    md += `## Changes Applied\n\n`;
    for (const change of data.changes) {
      md += `### ${change.severity.toUpperCase()}: ${change.type}\n`;
      md += `**Explanation:** ${change.explanation}\n`;
      md += `**Why Changed:** ${change.whyChanged}\n`;
      md += `**Expected Improvement:** ${change.expectedImprovement}\n`;
      md += `**Reasoning Improvement:** ${change.estimatedReasoningImprovement}\n`;
      md += `**Token Savings:** ${change.estimatedTokenSavings}\n`;
      md += `**Response Quality:** ${change.estimatedResponseQuality}\n`;
      md += `**Confidence:** ${Math.round(change.confidence * 100)}%\n\n`;
      md += `**Original:**\n\`\`\`\n${change.originalText}\n\`\`\`\n\n`;
      md += `**Optimized:**\n\`\`\`\n${change.optimizedText}\n\`\`\`\n\n`;
    }
    md += `## Summary\n\n`;
    md += `${data.summary.keyImprovements.map(k => `- ${k}`).join("\n")}\n`;
    if (data.summary.remainingIssues.length > 0) {
      md += `\n## Remaining Issues\n\n`;
      md += `${data.summary.remainingIssues.map(r => `- ${r}`).join("\n")}\n`;
    }
    return md;
  };

  const handleExport = React.useCallback(async (format: "json" | "md") => {
    if (format === "json") {
      downloadFile(`optimization-report-${Date.now()}.json`, JSON.stringify(result, null, 2), "application/json");
    } else {
      downloadFile(`optimization-report-${Date.now()}.md`, generateMarkdownReport(result), "text/markdown");
    }
    toast({ title: "Exported", description: `Report saved as ${format.toUpperCase()}`, variant: "success" });
  }, [result, toast]);

  const handleCopy = React.useCallback(async () => {
    await copyToClipboard(JSON.stringify(result, null, 2));
    toast({ title: "Copied", description: "Optimization result copied to clipboard", variant: "success" });
  }, [result, toast]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-bg-secondary">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex size-12 items-center justify-center rounded-xl font-bold text-xl",
            result.metadata.optimizedLength <= result.metadata.originalLength 
              ? "bg-success-bg text-success" 
              : "bg-warning-bg text-warning"
          )}>
            {result.summary.tokenReduction >= 0 ? `-${result.summary.tokenReductionPercent.toFixed(0)}%` : `+${Math.abs(result.summary.tokenReductionPercent).toFixed(0)}%`}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-text-primary">
                {result.metadata.originalLength} → {result.metadata.optimizedLength} chars
              </span>
              <span className={cn(
                "px-1.5 py-0.5 rounded-full text-[10px] font-medium",
                result.summary.tokenReduction >= 0 ? "bg-success-bg text-success" : "bg-warning-bg text-warning"
              )}>
                {result.summary.tokenReduction >= 0 ? "Tokens Reduced" : "Tokens Added"}
              </span>
            </div>
            <p className="text-xs text-text-muted">
              {result.changes.length} changes · {result.summary.majorChanges} major · {result.summary.moderateChanges} moderate · {result.summary.minorChanges} minor
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <Zap className="size-3" />
            <span className="font-mono">{result.summary.estimatedQualityImprovement.toFixed(0)}%</span>
            <span>Quality</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <Brain className="size-3" />
            <span className="font-mono">{result.summary.estimatedTokenSavings > 0 ? '+' : ''}{result.summary.estimatedTokenSavings}%</span>
            <span>Tokens</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <Shield className="size-3" />
            <span className="font-mono">{result.summary.estimatedCostSavings > 0 ? '+' : ''}{result.summary.estimatedCostSavings}%</span>
            <span>Cost</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => onExport("json")}>
            <Download className="size-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onExport("md")}>
            <Download className="size-3.5" />
            <span className="hidden sm:inline">MD</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onCopy}>
            <Copy className="size-3.5" />
          </Button>
          <Button variant="primary" size="sm" onClick={onRegenerate} disabled={!result}>
            <RefreshCw className="mr-1.5 size-3.5" />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Results Tabs */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="bg-bg-secondary border-b border-border">
            <TabsTrigger value="comparison">
              <Zap className="mr-1.5 size-3.5" />
              Comparison
            </TabsTrigger>
            <TabsTrigger value="explanation">
              <Brain className="mr-1.5 size-3.5" />
              Explanation
            </TabsTrigger>
            <TabsTrigger value="optimized">
              <CheckCircle className="mr-1.5 size-3.5" />
              Optimized
            </TabsTrigger>
            <TabsTrigger value="original">
              <FileText className="mr-1.5 size-3.5" />
              Original
            </TabsTrigger>
            <TabsTrigger value="summary">
              <Target className="mr-1.5 size-3.5" />
              Summary
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="flex-1 overflow-hidden">
            <DiffView 
              comparison={result.comparison} 
              viewMode="side-by-side"
              onViewModeChange={() => {}}
            />
          </TabsContent>

          <TabsContent value="explanation" className="flex-1 overflow-hidden">
            <ExplanationPanel 
              changes={result.changes}
              onSelectChange={() => {}}
            />
          </TabsContent>

          <TabsContent value="optimized" className="flex-1 overflow-hidden">
            <div className="h-full p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Optimized Prompt</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={onCopy}>
                    <Copy className="size-3.5" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={onViewOriginal}>
                    <ChevronLeft className="size-3.5" />
                    Original
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[calc(100%-80px)]">
                <pre className="whitespace-pre-wrap font-mono text-sm text-text-primary bg-bg-secondary p-4 rounded-lg border border-border">
                  {result.optimizedPrompt}
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="original" className="flex-1 overflow-hidden">
            <div className="h-full p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Original Prompt</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={onCopy}>
                    <Copy className="size-3.5" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={onViewOptimized}>
                    Optimized
                    <ChevronRight className="size-3.5 ml-1" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[calc(100%-80px)]">
                <pre className="whitespace-pre-wrap font-mono text-sm text-text-muted bg-bg-secondary p-4 rounded-lg border border-border">
                  {result.originalPrompt}
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="summary" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-6 max-w-3xl">
                {/* Key Improvements */}
                {result.summary.keyImprovements.length > 0 && (
                  <section>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
                      <Star className="size-4 text-amber-500" />
                      Key Improvements
                    </h3>
                    <div className="space-y-2">
                      {result.summary.keyImprovements.map((improvement, i) => (
                        <Tag key={i} variant="success" className="gap-1 w-full justify-start">
                          <CheckCircle className="size-3" />
                          {improvement}
                        </Tag>
                      ))}
                    </div>
                  </section>
                )}

                {/* Remaining Issues */}
                {result.summary.remainingIssues.length > 0 && (
                  <section>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
                      <AlertTriangle className="size-4 text-warning" />
                      Remaining Issues
                    </h3>
                    <div className="space-y-2">
                      {result.summary.remainingIssues.map((issue, i) => (
                        <Tag key={i} variant="warning" className="gap-1 w-full justify-start">
                          <AlertTriangle className="size-3" />
                          {issue}
                        </Tag>
                      ))}
                    </div>
                  </section>
                )}

                {/* Statistics */}
                <section>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">Optimization Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard label="Original Length" value={result.metadata.originalLength.toLocaleString()} icon="FileText" />
                    <StatCard label="Optimized Length" value={result.metadata.optimizedLength.toLocaleString()} icon="Zap" />
                    <StatCard label="Token Reduction" value={`${result.summary.tokenReduction >= 0 ? '-' : '+'}${Math.abs(result.summary.tokenReduction).toLocaleString()} (${result.summary.tokenReductionPercent.toFixed(1)}%)`} icon="Target" />
                    <StatCard label="Total Changes" value={result.summary.totalChanges} icon="Zap" />
                    <StatCard label="Major Changes" value={result.summary.majorChanges} icon="AlertCircle" />
                    <StatCard label="Moderate Changes" value={result.summary.moderateChanges} icon="AlertTriangle" />
                    <StatCard label="Minor Changes" value={result.summary.minorChanges} icon="Info" />
                    <StatCard label="Est. Quality Δ" value={`${result.summary.estimatedQualityImprovement > 0 ? '+' : ''}${result.summary.estimatedQualityImprovement.toFixed(0)}%`} icon="Star" />
                  </div>
                </section>

                {/* Changes Breakdown */}
                {result.changes.length > 0 && (
                  <section>
                    <h3 className="text-sm font-semibold text-text-primary mb-3">Changes Breakdown</h3>
                    <div className="space-y-2">
                      {result.changes.map((change, idx) => (
                        <div 
                          key={idx} 
                          className={cn(
                            "p-3 rounded-lg border bg-bg-secondary",
                            change.severity === "major" && "border-error/30 bg-error/5",
                            change.severity === "moderate" && "border-warning/30 bg-warning/5",
                            change.severity === "minor" && "border-accent/30 bg-accent/5"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-medium text-text-primary">{change.type}</span>
                            <span className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-medium uppercase",
                              change.severity === "major" && "bg-error/20 text-error",
                              change.severity === "moderate" && "bg-warning/20 text-warning",
                              change.severity === "minor" && "bg-accent/20 text-accent"
                            )}>
                              {change.severity}
                            </span>
                            <span className="text-[10px] text-text-muted font-mono">
                              {Math.round(change.confidence * 100)}%
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary mb-2">{change.explanation}</p>
                          <div className="flex flex-wrap gap-1.5 text-[10px] text-text-muted">
                            <span><strong>Why:</strong> {change.whyChanged}</span>
                            <span><strong>Improvement:</strong> {change.expectedImprovement}</span>
                            <span><strong>Reasoning:</strong> {change.estimatedReasoningImprovement}</span>
                            <span><strong>Tokens:</strong> {change.estimatedTokenSavings}</span>
                            <span><strong>Quality:</strong> {change.estimatedResponseQuality}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {result.summary.remainingIssues.length === 0 && result.summary.keyImprovements.length === 0 && (
                  <div className="text-center py-8 text-text-muted">
                    <CheckCircle className="size-8 mx-auto text-success mb-2" />
                    <p>No specific issues found - prompt is well-optimized!</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

