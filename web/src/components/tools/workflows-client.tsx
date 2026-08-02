"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  GitBranch,
  Copy,
  Download,
  Loader2,
  Zap,
  AlertCircle,
  FileCode,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap as ZapIcon,
  Server,
  Code2,
  MousePointer2,
  Bot,
  Braces,
  Wind,
  Settings,
  Terminal,
  Cpu,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BlueprintPreview } from "@/components/generate/blueprint-preview";
import { ApiKeyModal } from "@/components/generate/api-key-modal";
import type { Workflow } from "@/lib/engine";
import { SEED_WORKFLOWS } from "@/lib/engine";

const STEP_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  skill: Cpu,
  prompt: FileText,
  approval: ZapIcon,
  condition: GitBranch,
  parallel: Server,
  loop: ZapIcon,
};

interface WorkflowsClientProps {
  initialWorkflows: readonly Workflow[];
}

export function WorkflowsClient({ initialWorkflows }: WorkflowsClientProps) {
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(initialWorkflows[0] ?? null);
  const [output, setOutput] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const generateLocal = useCallback(async () => {
    if (!activeWorkflow) return;
    setIsGenerating(true);
    setError(null);
    try {
      // Render workflow to YAML
      const lines = [
        `name: ${activeWorkflow.name}`,
        `description: ${activeWorkflow.description}`,
        `version: ${activeWorkflow.version}`,
        "steps:",
      ];

      for (const step of activeWorkflow.steps) {
        lines.push(`  - id: ${step.id}`);
        lines.push(`    type: ${step.type}`);
        lines.push(`    name: ${step.name}`);
        if (step.description) lines.push(`    description: ${step.description}`);
        if (step.skillId) lines.push(`    skillId: ${step.skillId}`);
        if (step.promptTemplate) lines.push(`    promptTemplate: "${step.promptTemplate}"`);
        if (step.dependsOn?.length) lines.push(`    dependsOn: [${step.dependsOn.join(", ")}]`);
      }

      const result = lines.join("\n");
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }, [activeWorkflow]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const filename = `${activeWorkflow?.id}.yml`;
    const blob = new Blob([output], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [output, activeWorkflow]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  }, [output]);

  return (
    <div className="flex-1 container-app py-16 px-4">
      <div className="mb-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Workflows Generator</h1>
        <p className="text-[var(--color-text-secondary)]">Browse 7 built-in workflow pipelines (feature development, bug fix, code review, refactoring, etc.) and render to YAML.</p>
        <Separator />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px] max-w-6xl">
        {/* Form Pane */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Select Workflow</h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {SEED_WORKFLOWS.map((workflow) => (
                <button
                  key={workflow.id}
                  onClick={() => setActiveWorkflow(workflow)}
                  className={cn(
                    "relative p-4 rounded-xl border-2 transition-all text-left",
                    activeWorkflow?.id === workflow.id
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                      : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-bg-secondary)]"
                  )}
                >
                  <span className="font-medium text-[var(--color-text-primary)]">{workflow.name}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">{workflow.steps.length} steps</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Steps</h3>
            <div className="space-y-3">
              {activeWorkflow?.steps.map((step, index) => {
                const StepIcon = STEP_TYPE_ICONS[step.type] || FileCode;
                return (
                  <Card key={step.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <StepIcon className="h-6 w-6 text-[var(--color-accent)] mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[var(--color-text-primary)]">{index + 1}. {step.name}</span>
                          <Badge variant="outline" className="text-xs capitalize">{step.type}</Badge>
                        </div>
                        {step.description && <p className="text-sm text-[var(--color-text-secondary)] mt-1">{step.description}</p>}
                        {step.dependsOn?.length && (
                          <p className="text-xs text-[var(--color-text-muted)] mt-1">
                            Depends on: {step.dependsOn.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button
              onClick={generateLocal}
              disabled={isGenerating || !activeWorkflow}
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
                  Generate YAML
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Preview Pane */}
        <div className="hidden lg:block">
          {output ? (
            <Card className="h-full flex flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
                <div className="flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-[var(--color-text-secondary)]" />
                  <span className="font-mono text-sm text-[var(--color-text-primary)]">
                    {activeWorkflow?.id}.yml
                  </span>
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
              <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed text-[var(--color-text-primary)] bg-[var(--color-bg-tertiary)] rounded-b-none">
                <pre className="whitespace-pre-wrap break-words">{output}</pre>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex flex-col">
              <div className="flex items-center justify-center h-full p-8 text-center">
                <GitBranch className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[var(--color-text-secondary)]">No output yet</h3>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">Select a workflow and click Generate to see YAML output</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function handleCopy() {}