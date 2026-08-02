"use client";

import { useState, useCallback, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  FileText,
  FileCode,
  Copy,
  Download,
  Zap,
  Loader2,
  AlertCircle,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BlueprintForm } from "./blueprint-form";
import { BlueprintPreview } from "./blueprint-preview";
import { ApiKeyModal } from "./api-key-modal";
import type { EngineField, EngineOutput, GenerationOutputKind, EngineAnswers } from "@/lib/engine";

interface SerializableBlueprint {
  kind: GenerationOutputKind;
  label: string;
  description: string;
  filenameHint: string;
  extension: string;
  sections: Array<{ id: string; heading: string; consumes: readonly string[] }>;
}

interface GenerateClientProps {
  initialBlueprints: readonly SerializableBlueprint[];
  initialFields: readonly EngineField[];
}

const KIND_LABELS: Record<GenerationOutputKind, string> = {
  "system-prompt": "System Prompt",
  "instruction-file": "Instruction File",
  "prompt-template": "Prompt Template",
  "context-file": "Context File",
  memory: "Memory Block",
  workflow: "Workflow",
};

const KIND_ICONS: Record<GenerationOutputKind, React.ComponentType<{ className?: string }>> = {
  "system-prompt": Sparkles,
  "instruction-file": FileCode,
  "prompt-template": FileText,
  "context-file": FileText,
  memory: Sparkles,
  workflow: FileCode,
};

const KIND_DESCRIPTIONS: Record<GenerationOutputKind, string> = {
  "system-prompt": "Role / context / constraints preamble for an AI assistant.",
  "instruction-file": "Agent instructions like AGENTS.md / CLAUDE.md / .cursorrules.",
  "prompt-template": "Reusable prompt template with {{VARIABLE}} placeholders.",
  "context-file": "Repo-attached context file consumable by AI assistants.",
  memory: "Persistent memory block for long-running AI sessions.",
  workflow: "Sequential pipeline of steps over the structured context.",
};

export function GenerateClient({ initialBlueprints, initialFields }: GenerateClientProps) {
  const [activeKind, setActiveKind] = useState<GenerationOutputKind>("system-prompt");
  const [answers, setAnswers] = useState<Record<string, string | string[] | boolean | undefined>>({});
  const [output, setOutput] = useState<EngineOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [aiProvider, setAiProvider] = useState<{ provider: string; apiKey: string; model?: string } | null>(null);

  const blueprint = initialBlueprints.find((b) => b.kind === activeKind);
  const consumedFields = blueprint
    ? initialFields.filter((f) => blueprint.sections.some((s) => s.consumes.includes(f.id)))
    : [];

  // Generate locally when answers change
  useEffect(() => {
    if (!blueprint) return;
    const hasRequired = blueprint.sections.some((s) =>
      s.consumes.some((id) => {
        const val = answers[id];
        return val !== undefined && val !== "" && !(Array.isArray(val) && val.length === 0);
      })
    );
    if (hasRequired) {
      generateLocal();
    }
  }, [answers, activeKind, blueprint]);

  const generateLocal = useCallback(async () => {
    if (!blueprint) return;
    setIsGenerating(true);
    setError(null);
    try {
      const { renderBlueprint } = await import("@/lib/engine");
      const result = renderBlueprint(activeKind, answers as EngineAnswers);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }, [activeKind, answers, blueprint]);

  const handleGenerateWithAi = useCallback(async () => {
    if (!aiProvider) {
      setShowApiKeyModal(true);
      return;
    }
    setIsAiGenerating(true);
    setError(null);
    try {
      const { generateWithAI } = await import("@/actions/generate");
      const result = await generateWithAI(activeKind, answers as EngineAnswers, aiProvider);
      if (result) {
        setOutput(result);
      } else {
        setError("AI generation returned no result");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI generation failed");
    } finally {
      setIsAiGenerating(false);
    }
  }, [activeKind, answers, aiProvider]);

  const handleAnswerChange = useCallback((fieldId: string, value: string | string[] | boolean) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = output.filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output.content);
  }, [output]);

  const handleApiKeySubmit = useCallback((provider: { provider: string; apiKey: string; model?: string }) => {
    setAiProvider(provider);
    setShowApiKeyModal(false);
    handleGenerateWithAi();
  }, [handleGenerateWithAi]);

  if (!blueprint) {
    return <div className="flex h-full items-center justify-center">Select a generation kind</div>;
  }

  const KindIcon = KIND_ICONS[activeKind];

  return (
    <div className="flex-1 container-app py-16 px-4">
      <div className="mb-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <KindIcon className="h-10 w-10 text-[var(--color-accent)]" aria-hidden="true" />
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
              {KIND_LABELS[activeKind]}
            </h1>
            <p className="text-[var(--color-text-secondary)]">{KIND_DESCRIPTIONS[activeKind]}</p>
          </div>
        </div>
        <Separator />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px] max-w-6xl">
        {/* Form Pane */}
        <div className="space-y-6">
          <Tabs value={activeKind} onValueChange={(v: string) => setActiveKind(v as GenerationOutputKind)} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              {initialBlueprints.map((bp) => (
                <TabsTrigger key={bp.kind} value={bp.kind} className="data-[state=active]:bg-[var(--color-accent)] data-[state=active]:text-white">
                  {bp.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <BlueprintForm
            blueprint={blueprint}
            fields={consumedFields}
            answers={answers}
            onChange={handleAnswerChange}
            isGenerating={isGenerating}
          />

          <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button
              onClick={handleGenerateWithAi}
              disabled={isGenerating || isAiGenerating}
              className="flex-1"
              size="lg"
            >
              {isAiGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating with AI…
                </>
              ) : aiProvider ? (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Regenerate with AI
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate with AI
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowApiKeyModal(true)}
              disabled={isGenerating || isAiGenerating}
              size="lg"
            >
              <Zap className="mr-2 h-4 w-4" />
              API Key
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)]">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Preview Pane */}
        <div className="hidden lg:block">
          <BlueprintPreview
            output={output}
            isGenerating={isGenerating || isAiGenerating}
            onDownload={handleDownload}
            onCopy={handleCopy}
            filename={output?.filename}
          />
        </div>
      </div>

      {/* Mobile Preview */}
      <div className="lg:hidden mt-6">
        <BlueprintPreview
          output={output}
          isGenerating={isGenerating || isAiGenerating}
          onDownload={handleDownload}
          onCopy={handleCopy}
          filename={output?.filename}
        />
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        open={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSubmit={handleApiKeySubmit}
        currentProvider={aiProvider?.provider}
      />
    </div>
  );
}