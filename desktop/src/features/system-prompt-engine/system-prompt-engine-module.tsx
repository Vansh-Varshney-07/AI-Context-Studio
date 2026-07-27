"use client";

import { motion } from "framer-motion";
import {
  Boxes,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  EyeOff,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import * as React from "react";
import { useState } from "react";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Tag } from "@components/common/tag";
import { EmptyState } from "@components/common/empty-state";
import { moduleTransition } from "@components/motion";
import { useToast } from "@providers/toaster-provider";
import type { GenerationOutputKind } from "@/shared/types/provider";
import { copyToClipboard, downloadFile, slugify } from "@utils";
import { cn } from "@utils/cn";

import { consumedFieldsForKind, listBlueprints, renderBlueprint } from "./engine";
import {
  DEFAULT_VISIBLE_FIELDS,
  ENGINE_FIELDS,
  ENGINE_FIELDS_MAP,
  isFieldVisible,
} from "./fields";
import { useAIEngine, useLocalEngine } from "@hooks";
import type {
  EngineAnswers,
  EngineBlueprint,
  EngineField,
  EngineFieldId,
  EngineOutput,
} from "./types";

/**
 * System Prompt Engine module renderer.
 *
 * Layout:
 *   [Left: Structured form] | [Right: Live preview + OutputKind picker + AI Enhance]
 *
 * Adding a new output kind = add a new blueprint in `blueprints/`. Adding
 * a new field = add a new entry in `fields.ts`. Zero UI churn.
 */
export function SystemPromptEngineModule() {
  const blueprints = React.useMemo(() => listBlueprints(), []);
  const initialKind = blueprints[0]?.kind ?? "system-prompt";
  const [activeKind, setActiveKind] = React.useState<GenerationOutputKind>(initialKind);
  const [answers, setAnswers] = React.useState<EngineAnswers>(() => defaultAnswers());
  const [showAllFields, setShowAllFields] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const blueprint = blueprints.find((b) => b.kind === activeKind) ?? blueprints[0]!;
  const consumed = React.useMemo(
    () => consumedFieldsForKind(activeKind),
    [activeKind],
  );

  // Local engine for instant preview
  const { generate: generateLocal } = useLocalEngine();
  const localOutput = React.useMemo(
    () => generateLocal(activeKind, answers),
    [activeKind, answers, generateLocal],
  );

  // AI engine for enhanced generation
  const { generate: generateAI, isGenerating, isStreaming: aiStreaming, lastOutput: aiOutput, error, hasProvider, activeProviderId, clear } = useAIEngine();

  // Use AI output if available, otherwise local output
  const displayOutput = aiOutput ?? localOutput;
  const showStreaming = isStreaming && streamingContent !== null;

  function handleAnswer(id: EngineFieldId, value: string | string[] | boolean | undefined) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  const handleGenerateLocal = React.useCallback(async () => {
    clear();
    await generateLocal(activeKind, answers);
  }, [activeKind, answers, generateLocal, clear]);

  const handleGenerateAI = React.useCallback(async () => {
    if (isGenerating) return;
    clear();
    setStreamingContent("");
    setIsStreaming(true);

    await generateAI(activeKind, answers, {
      stream: true,
      onStream: (chunk) => setStreamingContent((prev) => (prev ?? "") + chunk),
    });

    setIsStreaming(false);
  }, [activeKind, answers, generateAI, isGenerating, clear]);

  return (
    <motion.div
      variants={moduleTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid h-full grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] overflow-hidden"
    >
      <FormPane
        blueprint={blueprint}
        answers={answers}
        consumed={consumed}
        showAllFields={showAllFields}
        onToggleVisibleAll={() => setShowAllFields((v) => !v)}
        onAnswer={handleAnswer}
      />
      <PreviewPane
        blueprints={blueprints}
        activeKind={activeKind}
        onKindChange={setActiveKind}
        blueprint={blueprint}
        output={displayOutput}
        streamingContent={streamingContent}
        isStreaming={showStreaming}
        isGenerating={isGenerating || isStreaming}
        answers={answers}
        onGenerateLocal={handleGenerateLocal}
        onGenerateAI={handleGenerateAI}
        hasProvider={hasProvider}
        activeProviderId={activeProviderId}
        error={error}
        onClear={clear}
      />
    </motion.div>
  );
}

function defaultAnswers(): EngineAnswers {
  const answers: EngineAnswers = {} as EngineAnswers;
  for (const field of ENGINE_FIELDS) {
    if (field.defaultValue !== undefined) {
      answers[field.id] = field.defaultValue;
    }
  }
  return answers;
}

/* -------------------------------------------------------------------------
   Form pane (left)
   ------------------------------------------------------------------------- */

interface FormPaneProps {
  blueprint: EngineBlueprint;
  answers: EngineAnswers;
  consumed: EngineFieldId[];
  showAllFields: boolean;
  onToggleVisibleAll: () => void;
  onAnswer: (id: EngineFieldId, value: string | string[] | boolean | undefined) => void;
}

function FormPane({
  blueprint,
  answers,
  consumed,
  showAllFields,
  onToggleVisibleAll,
  onAnswer,
}: FormPaneProps) {
  const ordered = React.useMemo(() => orderFieldsForBlueprint(blueprint, consumed), [blueprint, consumed]);
  const visible = ordered.filter((field) => isFieldVisible(field, showAllFields));

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden border-r border-border">
      <header className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Boxes className="size-4" />
          </span>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-text-primary">
              System Prompt Engine
            </h1>
            <p className="text-xs text-text-muted">
              Structured-data-driven generation â€” composition over hardcoded text.
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleVisibleAll}
          aria-pressed={showAllFields}
        >
          {showAllFields ? <EyeOff /> : <Eye />}
          {showAllFields ? "Hide advanced fields" : "Show advanced fields"}
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-6 py-3 bg-bg-secondary/40">
          <span className="text-xs font-medium text-text-secondary">Active blueprint:</span>
          <Tag variant="accent">{blueprint.label}</Tag>
          <span className="text-xs text-text-muted">{blueprint.description}</span>
        </div>

        <form className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
          {visible.map((field) => (
            <FieldRow
              key={field.id}
              field={field}
              value={answers[field.id]}
              onChange={(value) => onAnswer(field.id, value)}
              highlight={consumed.includes(field.id)}
            />
          ))}
        </form>
      </div>
    </section>
  );
}

function orderFieldsForBlueprint(
  blueprint: EngineBlueprint,
  consumed: EngineFieldId[],
): EngineField[] {
  const consumedSet = new Set(consumed);
  const list = [...ENGINE_FIELDS];
  return list.sort((a, b) => {
    const aConsumed = consumedSet.has(a.id);
    const bConsumed = consumedSet.has(b.id);
    if (aConsumed && !bConsumed) return -1;
    if (!aConsumed && bConsumed) return 1;
    return 0;
  });
}

function FieldRow({
  field,
  value,
  onChange,
  highlight,
}: {
  field: EngineField;
  value: string | string[] | boolean | undefined;
  onChange: (value: string | string[] | boolean | undefined) => void;
  highlight: boolean;
}) {
  return (
    <div
      className={cn(
        "space-y-1.5 rounded-lg p-3 transition-colors",
        highlight ? "bg-accent/5 border border-accent/10" : "border border-transparent",
      )}
    >
      <div className="flex items-center justify-between">
        <Label htmlFor={field.id} className="text-xs font-medium">
          {field.label}
          {field.required && <span className="ml-1 text-error">*</span>}
        </Label>
        {highlight ? (
          <span className="text-[10px] font-medium uppercase tracking-wider text-accent">
            used
          </span>
        ) : (
          <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
            context
          </span>
        )}
      </div>
      {field.help ? (
        <p className="text-[11px] text-text-muted">{field.help}</p>
      ) : null}
      <FieldInput field={field} value={value} onChange={onChange} />
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: EngineField;
  value: string | string[] | boolean | undefined;
  onChange: (value: string | string[] | boolean | undefined) => void;
}) {
  switch (field.kind) {
    case "text":
      return (
        <Input
          id={field.id}
          size="sm"
          value={typeof value === "string" ? value : Array.isArray(value) ? value.join(", ") : ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "textarea":
      return (
        <textarea
          id={field.id}
          rows={4}
          value={typeof value === "string" ? value : ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "flex w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
            "placeholder:text-text-muted",
          )}
        />
      );
    case "select":
      return (
        <div className="flex flex-wrap gap-1.5">
          {field.options?.map((option) => {
            const active = value === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onChange(active ? undefined : option)}
                aria-pressed={active}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                  active
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-border bg-bg-secondary text-text-muted hover:text-text-primary",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      );
    case "multiselect": {
      const selected = Array.isArray(value) ? value : [];
      return (
        <div className="flex flex-wrap gap-1.5">
          {field.options?.map((option) => {
            const active = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  onChange(
                    active
                      ? selected.filter((v) => v !== option)
                      : [...selected, option],
                  )
                }
                aria-pressed={active}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                  active
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-border bg-bg-secondary text-text-muted hover:text-text-primary",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      );
    }
    case "toggle": {
      const checked = Boolean(value);
      return (
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={cn(
            "relative h-6 w-11 rounded-full border transition-colors",
            checked ? "border-accent bg-accent/30" : "border-border bg-bg-secondary",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 size-5 rounded-full transition-all",
              checked ? "left-[1.4rem] bg-accent" : "left-0.5 bg-text-muted",
            )}
          />
        </button>
      );
    }
  }
}

/* -------------------------------------------------------------------------
   Preview pane (right)
   ------------------------------------------------------------------------- */

interface PreviewPaneProps {
  blueprints: readonly EngineBlueprint[];
  activeKind: GenerationOutputKind;
  onKindChange: (kind: GenerationOutputKind) => void;
  blueprint: EngineBlueprint;
  output: EngineOutput | null;
  streamingContent: string | null;
  isStreaming: boolean;
  isGenerating: boolean;
  answers: EngineAnswers;
  onGenerateLocal: () => void;
  onGenerateAI: () => void;
  hasProvider: boolean;
  activeProviderId: string;
  error: string | null;
  onClear: () => void;
}

function PreviewPane({
  blueprints,
  activeKind,
  onKindChange,
  blueprint,
  output,
  streamingContent,
  isStreaming,
  isGenerating,
  answers,
  onGenerateLocal,
  onGenerateAI,
  hasProvider,
  activeProviderId,
  error,
  onClear,
}: PreviewPaneProps) {
  const { toast } = useToast();

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden bg-bg-primary">
      <header className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Sparkles className="size-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Live preview</h2>
            <p className="text-xs text-text-muted">Generated from structured answers â€” enhance with AI.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onGenerateLocal} disabled={isGenerating}>
            <Wand2 className="mr-1.5 size-3.5" />
            Local
          </Button>
          <Button
            variant={hasProvider ? "primary" : "outline"}
            size="sm"
            onClick={onGenerateAI}
            disabled={isGenerating || !hasProvider}
          >
            <Zap className="mr-1.5 size-3.5" />
            {isGenerating ? "Enhancingâ€¦" : "Enhance with AI"}
          </Button>
        </div>
      </header>

      <div className="flex items-center gap-1 overflow-x-auto border-b border-border bg-bg-secondary/60 px-3 py-2">
        {blueprints.map((bp) => (
          <BlueprintTab
            key={bp.kind}
            label={bp.label}
            active={bp.kind === activeKind}
            onClick={() => onKindChange(bp.kind)}
          />
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto]">
        <PreviewContent
          blueprint={blueprint}
          output={output}
          streamingContent={streamingContent}
          isStreaming={isStreaming}
          answers={answers}
        />

        <PreviewFooter
          blueprint={blueprint}
          output={output}
          streamingContent={streamingContent}
          isStreaming={isStreaming}
          isGenerating={isGenerating}
          hasProvider={hasProvider}
          activeProviderId={activeProviderId}
          error={error}
          onCopy={() => {
            const content = streamingContent ?? output?.content;
            if (content) {
              copyToClipboard(content);
              toast({ title: "Copied to clipboard", variant: "success" });
            } else {
              toast({ title: "Nothing to copy yet", variant: "warning" });
            }
          }}
          onDownload={() => {
            const content = streamingContent ?? output?.content;
            if (content && output) {
              downloadFile(output.filename, content, "text/plain");
              toast({ title: `Downloaded ${output.filename}`, variant: "success" });
            } else {
              toast({ title: "Nothing to download yet", variant: "warning" });
            }
          }}
          onClear={onClear}
        />
      </div>
    </section>
  );
}

function BlueprintTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-md px-3 py-1 text-xs transition-colors",
        active
          ? "bg-accent/10 text-accent"
          : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary",
      )}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function PreviewContent({
  blueprint,
  output,
  streamingContent,
  isStreaming,
  answers,
}: {
  blueprint: EngineBlueprint;
  output: EngineOutput | null;
  streamingContent: string | null;
  isStreaming: boolean;
  answers: EngineAnswers;
}) {
  const filledAnswers = ENGINE_FIELDS.filter((field) => {
    const v = answers[field.id];
    if (v === undefined) return false;
    if (typeof v === "string") return v.trim() !== "";
    if (Array.isArray(v)) return v.length > 0;
    return v === true;
  });

  if (!output && !streamingContent) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center p-6">
        <EmptyState
          icon={Wand2}
          title="No artifact yet"
          description="Fill fields on the left and click Local for instant preview, or Enhance with AI for polished output. Sections without answers are omitted â€” no fabricated content."
        />
      </div>
    );
  }

  const content = isStreaming && streamingContent ? streamingContent : output?.content ?? "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)]">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2 bg-bg-secondary/40">
          <div className="flex items-center gap-2 text-xs">
            {output ? (
              <>
                <span className="font-mono text-text-secondary">{output.filename}</span>
                <span className="text-text-muted">{content.length} chars</span>
              </>
            ) : (
              <span className="text-text-secondary">Streamingâ€¦</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {(output?.consumedFields ?? []).map((id) => (
              <Tag key={id} variant="accent" className="text-[10px]">
                {ENGINE_FIELDS_MAP[id]?.label ?? id}
              </Tag>
            ))}
          </div>
        </div>
        <pre className="h-full min-h-0 overflow-auto whitespace-pre-wrap break-words px-4 py-3 font-mono text-xs leading-relaxed text-text-secondary">
          {content}
        </pre>
      </div>
    </motion.div>
  );
}

function PreviewFooter({
  blueprint,
  output,
  streamingContent,
  isStreaming,
  isGenerating,
  hasProvider,
  activeProviderId,
  error,
  onCopy,
  onDownload,
  onClear,
}: {
  blueprint: EngineBlueprint;
  output: EngineOutput | null;
  streamingContent: string | null;
  isStreaming: boolean;
  isGenerating: boolean;
  hasProvider: boolean;
  activeProviderId: string;
  error: string | null;
  onCopy: () => void;
  onDownload: () => void;
  onClear: () => void;
}) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSave = async () => {
    if (!output) return;
    setIsSaving(true);
    try {
      const { saveAsset } = await import("@services/storage");
      await saveAsset({
        id: output.filename.replace(/\.[^.]+$/, ""),
        kind: output.kind,
        title: output.title,
        description: `Generated from ${blueprint.label} blueprint`,
        category: blueprint.kind,
        tags: output.consumedFields.map((id) => ENGINE_FIELDS_MAP[id]?.label ?? id),
        favorite: false,
        pinned: false,
        content: output.content,
        metadata: {
          blueprint: blueprint.kind,
          fieldsConsumed: output.consumedFields.join(","),
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast({ title: "Saved", description: `${output.title} saved to storage`, variant: "success" });
    } catch {
      toast({ title: "Save failed", variant: "danger" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = async () => {
    setIsLoading(true);
    try {
      const { getAssetsByKind } = await import("@services/storage");
      const assets = await getAssetsByKind(blueprint.kind);
      if (assets.length === 0) {
        toast({ title: "No saved artifacts", variant: "warning" });
        return;
      }
      const sorted = assets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      const latest = sorted[0]!;
      toast({ title: "Loaded", description: `${latest.title} loaded (picker UI coming soon)`, variant: "success" });
    } catch {
      toast({ title: "Load failed", variant: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="flex items-center justify-between gap-2 border-t border-border px-4 py-3 bg-bg-secondary/60">
      <div className="flex items-center gap-2 text-xs text-text-muted">
        {isStreaming ? (
          <>
            <span className="size-2 rounded-full bg-accent animate-pulse" />
            Streaming from {activeProviderId}â€¦
          </>
        ) : error ? (
          <>
            <span className="size-2 rounded-full bg-error" />
            {error}
          </>
        ) : output ? (
          <>
            <CheckCircle2 className="size-3.5 text-success" />
            {output.consumedFields.length} field{output.consumedFields.length === 1 ? "" : "s"} consumed by {blueprint.kind}
          </>
        ) : (
          <>
            <span className="size-2 rounded-full bg-text-muted" />
            No fields consumed â€” fill form and click Local or Enhance with AI.
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        {!isGenerating && output && (
          <>
            <Button variant="ghost" size="sm" onClick={onCopy}>
              <Copy />
              Copy
            </Button>
            <Button variant="primary" size="sm" onClick={onDownload}>
              <Download />
              Download .{blueprint.extension}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleSave} disabled={isSaving}>
              <Zap className="mr-1" />
              {isSaving ? "Savingâ€¦" : "Save"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLoad} disabled={isLoading}>
              Load
            </Button>
          </>
        )}
        {isGenerating && (
          <Button variant="ghost" size="sm" onClick={onClear} disabled={isStreaming}>
            Cancel
          </Button>
        )}
        {!hasProvider && !isGenerating && (
          <Button variant="ghost" size="sm" disabled>
            <Zap className="mr-1" />
            Add API key in topbar
          </Button>
        )}
      </div>
    </footer>
  );
}

