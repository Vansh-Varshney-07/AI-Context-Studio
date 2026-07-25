"use client";

import { motion } from "framer-motion";
import {
  GitBranch,
  Play,
  Plus,
  Search,
  Settings,
  Zap,
  Layers,
  MessageSquare,
  CheckCircle,
  GitBranch as GitBranchIcon,
  Repeat,
  Cpu,
  FileText,
  ArrowRight,
  ChevronLeft,
  X,
  Copy,
  Download,
  Zap as ZapIcon,
  Star,
  Tag as TagIcon,
} from "lucide-react";
import { useState, useCallback, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/common/tag";
import { EmptyState } from "@/components/common/empty-state";
import { moduleTransition } from "@/components/motion";
import { useToast } from "@/providers/toaster-provider";
import { cn } from "@/utils/cn";
import { copyToClipboard, downloadFile } from "@/utils";
import { useAIEngine } from "@/hooks";

import {
  STEP_TYPES,
  STEP_TEMPLATES,
  WORKFLOW_FIELDS,
} from "./constants";
import { SEED_WORKFLOWS } from "./data";
import type { Workflow, WorkflowStep, StepType, WorkflowAnswers, WorkflowId } from "./types";

const STEP_TYPE_KINDS: StepType[] = ["skill", "prompt", "approval", "condition", "parallel", "loop"];

export function WorkflowsModule() {
  const [search, setSearch] = useState("");
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [creating, setCreating] = useState(false);
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);
  const [answers, setAnswers] = useState<WorkflowAnswers>(() => defaultAnswers());
  const [previewOutput, setPreviewOutput] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { generate, isGenerating: aiGenerating, lastOutput, clear } = useAIEngine();

  const filteredWorkflows = useMemo(() => {
    return SEED_WORKFLOWS.filter((w) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          w.name.toLowerCase().includes(q) ||
          w.description.toLowerCase().includes(q) ||
          w.metadata.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [search]);

  function defaultAnswers(): WorkflowAnswers {
    return {
      name: "",
      description: "",
      tags: "",
    };
  }

  function handleAnswer(id: string, value: string | number | string[] | boolean | undefined) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  const handleGenerate = useCallback(async (kind: StepType) => {
    setIsGenerating(true);
    setIsStreaming(true);
    setStreamingContent("");
    setError(null);

    try {
      // For now, generate local preview
      const workflow = buildWorkflowFromAnswers();
      const yaml = workflowToYaml(workflow);
      setPreviewOutput(yaml);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed";
      setError(msg);
    } finally {
      setIsGenerating(false);
      setIsStreaming(false);
    }
  }, [answers]);

  function buildWorkflowFromAnswers(): Workflow {
    return {
      id: `custom-${Date.now()}` as WorkflowId,
      name: (answers.name as string) || "Unnamed Workflow",
      description: (answers.description as string) || "",
      version: 1,
      steps: [], // Would be built from step editor
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        tags: (answers.tags as string) ? (answers.tags as string).split(",").map((t) => t.trim()) : [],
        isCustom: true,
      },
    };
  }

  function workflowToYaml(workflow: Workflow): string {
    const lines = [
      `name: "${workflow.name}"`,
      `description: "${workflow.description}"`,
      `version: ${workflow.version}`,
      "steps:",
    ];

    // This is a simplified YAML generation
    // In a full implementation, this would serialize steps properly
    for (const step of workflow.steps) {
      lines.push(`  - id: ${step.id}`);
      lines.push(`    type: ${step.type}`);
      lines.push(`    name: "${step.name}"`);
      if (step.description) lines.push(`    description: "${step.description}"`);
      if (step.dependsOn?.length) lines.push(`    dependsOn: [${step.dependsOn.map(d => `"${d}"`).join(", ")}]`);
      if (step.skillId) lines.push(`    skillId: ${step.skillId}`);
      if (step.skillConfig) lines.push(`    skillConfig: ${JSON.stringify(step.skillConfig)}`);
    }

    return lines.join("\n");
  }

  const handleDownload = useCallback(() => {
    if (!previewOutput) return;
    const name = (answers.name as string) || "";
    const filename = `workflow-${name.toLowerCase().replace(/\s+/g, "-") || "custom"}-${Date.now()}.yaml`;
    downloadFile(filename, previewOutput, "text/yaml");
    toast({ title: "Downloaded", description: filename, variant: "success" });
  }, [previewOutput, answers]);

  const handleCopy = useCallback(() => {
    if (!previewOutput) return;
    copyToClipboard(previewOutput);
    toast({ title: "Copied to clipboard", variant: "success" });
  }, [previewOutput]);

  const handleSave = useCallback(async () => {
    if (!previewOutput) return;
    try {
      const { saveAsset } = await import("@/services/storage");
      await saveAsset({
        id: `workflow-${Date.now()}`,
        kind: "workflow",
        title: (answers.name as string) || "Custom Workflow",
        description: (answers.description as string) || "",
        category: "workflow",
        tags: (answers.tags as string) ? (answers.tags as string).split(",").map(t => t.trim()) : [],
        favorite: false,
        pinned: false,
        content: previewOutput,
        metadata: {
          workflowName: (answers.name as string) || "",
          workflowType: "yaml",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast({ title: "Saved", description: "Workflow saved to storage", variant: "success" });
    } catch {
      toast({ title: "Save failed", variant: "danger" });
    }
  }, [previewOutput, answers]);

  return (
    <motion.div
      variants={moduleTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid h-full grid-cols-[18rem_minmax(0,1fr)] overflow-hidden"
    >
      <WorkflowSidebar
        search={search}
        onSearchChange={setSearch}
        workflows={SEED_WORKFLOWS}
        filteredWorkflows={SEED_WORKFLOWS.filter(w => {
          if (!search.trim()) return true;
          const q = search.toLowerCase();
          return w.name.toLowerCase().includes(q) || w.description.toLowerCase().includes(q) || w.metadata.tags.some(t => t.toLowerCase().includes(q));
        })}
        selectedWorkflow={selectedWorkflow}
        onSelectWorkflow={setSelectedWorkflow}
      />
      <section className="flex h-full flex-col overflow-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <GitBranchIcon className="size-4" />
            </span>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-text-primary">Workflows</h1>
              <p className="text-xs text-text-muted">Orchestrate skills into repeatable pipelines</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          {selectedWorkflow ? (
            <WorkflowDetailPane
              workflow={selectedWorkflow}
              onClose={() => setSelectedWorkflow(null)}
              onRun={() => toast({ title: "Running…", description: `${selectedWorkflow.name} executed (demo)` })}
              onEdit={() => setEditingStep(selectedWorkflow.steps[0] ?? null)}
            />
          ) : creating ? (
            <WorkflowBuilderPane
              answers={answers}
              onAnswer={handleAnswer}
              onSubmit={(data) => {
                const workflow = buildWorkflowFromAnswers();
                setSelectedWorkflow(workflow);
                setCreating(false);
              }}
              onClose={() => setCreating(false)}
            />
          ) : (
            <WorkflowsGrid
              workflows={SEED_WORKFLOWS.filter(w => {
                if (!search.trim()) return true;
                const q = search.toLowerCase();
                return w.name.toLowerCase().includes(q) || w.description.toLowerCase().includes(q) || w.metadata.tags.some(t => t.toLowerCase().includes(q));
              })}
              onSelect={setSelectedWorkflow}
              creating={creating}
              onCreate={() => { setAnswers(defaultAnswers()); setCreating(true); }}
            />
          )}
        </div>
      </section>
    </motion.div>
  );
}

function WorkflowSidebar({
  search,
  onSearchChange,
  workflows,
  filteredWorkflows,
  selectedWorkflow,
  onSelectWorkflow,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  workflows: Workflow[];
  filteredWorkflows: Workflow[];
  selectedWorkflow: Workflow | null;
  onSelectWorkflow: (w: Workflow) => void;
}) {
  return (
    <aside className="flex h-full flex-col border-r border-border bg-bg-secondary overflow-hidden">
      <div className="flex flex-col gap-3 p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Search workflows…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
            size="sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Workflows ({filteredWorkflows.length})
          </p>
          {filteredWorkflows.map((workflow) => (
            <WorkflowSidebarItem
              key={workflow.id}
              workflow={workflow}
              active={selectedWorkflow?.id === workflow.id}
              onClick={() => onSelectWorkflow(workflow)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

function WorkflowSidebarItem({
  workflow,
  active,
  onClick,
}: { workflow: Workflow; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
        active
          ? "bg-accent-light text-accent font-semibold"
          : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
      }`}
    >
      <span className="size-7 shrink-0 flex items-center justify-center rounded-md bg-accent/10 text-accent">
        <GitBranchIcon className="size-3.5" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium">{workflow.name}</p>
        <p className="truncate text-xs text-text-muted">{workflow.description}</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {workflow.metadata.tags.slice(0, 2).map((t) => (
            <Tag key={t} variant="muted" className="text-[9px]">{t}</Tag>
          ))}
          {workflow.metadata.tags.length > 2 && (
            <Tag variant="muted" className="text-[9px]">+{workflow.metadata.tags.length - 2}</Tag>
          )}
        </div>
      </div>
    </button>
  );
}

function WorkflowsGrid({
  workflows,
  onSelect,
  creating,
  onCreate,
}: {
  workflows: Workflow[];
  onSelect: (w: Workflow) => void;
  creating: boolean;
  onCreate: () => void;
}) {
  if (workflows.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          icon={Search}
          title="No workflows found"
          description="Adjust your search or create a new workflow"
        />
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 p-4 overflow-y-auto">
      {workflows.map((workflow) => (
        <motion.article
          key={workflow.id}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="group flex h-full flex-col rounded-xl border border-border bg-bg-primary p-4 transition-all hover:border-border-strong hover:shadow-sm"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <GitBranchIcon className="size-4.5" />
            </span>
            <Tag variant="muted" className="text-[9px] capitalize">{workflow.metadata.tags[0] || "general"}</Tag>
          </div>
          <h3 className="font-medium text-text-primary mb-1">{workflow.name}</h3>
          <p className="text-sm text-text-muted mb-3 flex-1">{workflow.description}</p>
          <div className="flex flex-wrap gap-1 mb-4">
            {workflow.metadata.tags.slice(0, 3).map((t) => (
              <Tag key={t} variant="muted" className="text-[9px]">{t}</Tag>
            ))}
            {workflow.metadata.tags.length > 3 && (
              <Tag variant="muted" className="text-[9px]">+{workflow.metadata.tags.length - 3}</Tag>
            )}
          </div>
          <div className="mt-auto pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>{workflow.steps.length} steps</span>
              <span>{workflow.metadata.version} v</span>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="ghost" size="sm" className="flex-1" onClick={() => {}}>
              View
            </Button>
            <Button size="sm" className="flex-1" onClick={() => {}}>
              Run
            </Button>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

function WorkflowDetailPane({
  workflow,
  onClose,
  onRun,
  onEdit,
}: {
  workflow: Workflow;
  onClose: () => void;
  onRun: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded hover:bg-bg-secondary transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="size-4 rotate-180 text-text-muted" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-primary">{workflow.name}</p>
          <p className="truncate text-xs text-text-muted">{workflow.description}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">Description</p>
            <p className="text-text-secondary">{workflow.description}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">Steps ({workflow.steps.length})</p>
            <div className="space-y-2">
              {workflow.steps.map((step, index) => (
                <WorkflowStepCard key={step.id} step={step} index={index} />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">Tags</p>
            <div className="flex flex-wrap gap-1">
              {workflow.metadata.tags.map((t) => (
                <Tag key={t} variant="default">{t}</Tag>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border p-4 bg-bg-secondary/60">
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="ghost" onClick={onEdit}>
            <Zap className="mr-1.5 size-3.5" />
            Edit Steps
          </Button>
          <Button variant="primary" onClick={onRun}>
            <Zap className="mr-1.5 size-3.5" />
            Run Workflow
          </Button>
        </div>
      </div>
    </div>
  );
}

function WorkflowStepCard({ step, index }: { step: WorkflowStep; index: number }) {
  const stepType = STEP_TYPES.find(t => t.type === step.type);
  return (
    <div className="group flex items-start gap-3 rounded-lg border border-border bg-bg-primary p-3 transition-colors hover:border-border-strong">
      <span className="flex size-6 shrink-0 items-center justify-center rounded text-[10px] font-mono font-medium text-text-muted">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-text-primary">{step.name}</span>
          {step.type && (
            <Tag variant="accent" className="text-[9px] capitalize">{step.type}</Tag>
          )}
        </div>
        {step.description && <p className="mt-1 text-xs text-text-muted">{step.description}</p>}
        {step.dependsOn?.length && (
          <p className="mt-1 text-[10px] text-text-muted">
            Depends on: {step.dependsOn.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}

function WorkflowBuilderPane({
  answers,
  onAnswer,
  onSubmit,
  onClose,
}: {
  answers: WorkflowAnswers;
  onAnswer: (id: string, value: string | number | string[] | boolean | undefined) => void;
  onSubmit: (data: any) => void;
  onClose: () => void;
}) {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl rounded-xl border border-border bg-bg-primary p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Create New Workflow</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-bg-secondary transition-colors" aria-label="Close">
            <X className="size-4 text-text-muted" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({});
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="workflow-name">Name</Label>
            <Input
              id="workflow-name"
              value=""
              onChange={(e) => {}}
              placeholder="e.g. Feature Development Pipeline"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="workflow-description">Description</Label>
            <textarea
              id="workflow-description"
              value=""
              onChange={(e) => {}}
              rows={3}
              className="flex w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              placeholder="What does this workflow accomplish?"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="workflow-tags">Tags (comma separated)</Label>
            <Input
              id="workflow-tags"
              value=""
              onChange={(e) => {}}
              placeholder="ci/cd, development, automation"
            />
          </div>

          <div className="space-y-1.5 pt-2 border-t border-border">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Step Builder (Coming Soon)</p>
            <p className="text-xs text-text-muted">Visual step builder with drag-and-drop will be available in the next phase.</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Zap className="mr-1.5 size-3.5" />
              Create Workflow
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}