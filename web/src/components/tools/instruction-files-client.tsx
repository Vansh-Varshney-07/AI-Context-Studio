"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FileCode,
  Copy,
  Download,
  Loader2,
  Sparkles,
  Zap,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BlueprintPreview } from "@/components/generate/blueprint-preview";
import { ApiKeyModal } from "@/components/generate/api-key-modal";
import type { AgentInstructionTarget, GeneratorQuestion, GeneratorAnswers } from "@/lib/engine";
import { generateInstructionFile, questionsForTarget } from "@/lib/engine";
import { AGENT_INSTRUCTION_TARGET_MAP } from "@/lib/engine/instruction-targets";

interface InstructionFilesClientProps {
  initialTargets: readonly { id: AgentInstructionTarget; label: string; filename: string; description: string }[];
  initialQuestions: readonly GeneratorQuestion[];
}

const TARGET_ICONS: Record<AgentInstructionTarget, string> = {
  claude: "🤖",
  cursor: "🎯",
  copilot: "🐙",
  gemini: "✨",
  codex: "🤖",
  opencode: "⚡",
  continue: "▶️",
  roo: "🦘",
  general: "📋",
};

export function InstructionFilesClient({ initialTargets, initialQuestions }: InstructionFilesClientProps) {
  const [activeTarget, setActiveTarget] = useState<AgentInstructionTarget>("claude");
  const [answers, setAnswers] = useState<GeneratorAnswers>({});
  const [output, setOutput] = useState<{ filename: string; content: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [aiProvider, setAiProvider] = useState<{ provider: string; apiKey: string; model?: string } | null>(null);

  const targetInfo = AGENT_INSTRUCTION_TARGET_MAP[activeTarget];
  const questions = questionsForTarget(activeTarget);

  // Generate locally when answers change
  useEffect(() => {
    const hasRequired = questions.some((q) => {
      const val = answers[q.id];
      if (!q.required) return false;
      if (val === undefined) return false;
      if (typeof val === "string") return val !== "";
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === "boolean") return val === true;
      return false;
    });
    if (hasRequired) {
      generateLocal();
    }
  }, [answers, activeTarget, questions]);

  const generateLocal = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = generateInstructionFile(activeTarget, answers, initialQuestions);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }, [activeTarget, answers]);

  const handleGenerateWithAi = useCallback(async () => {
    if (!aiProvider) {
      setShowApiKeyModal(true);
      return;
    }
    setIsAiGenerating(true);
    setError(null);
    try {
      // For now, just use local output with a note since AI enhancement for instruction files isn't implemented yet
      const result = generateInstructionFile(activeTarget, answers, initialQuestions);
      if (result) {
        setOutput({
          ...result,
          content: `${result.content}\n\n<!-- AI enhancement requested but not yet implemented for instruction files. Showing local engine output. -->`,
        });
      } else {
        setError("AI generation returned no result");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI generation failed");
    } finally {
      setIsAiGenerating(false);
    }
  }, [activeTarget, answers, aiProvider]);

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

  return (
    <div className="flex-1 container-app py-16 px-4">
      <div className="mb-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl" aria-hidden="true">{TARGET_ICONS[activeTarget]}</span>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
              {targetInfo?.label} Instruction File
            </h1>
            <p className="text-[var(--color-text-secondary)]">{targetInfo?.description}</p>
          </div>
        </div>
        <Separator />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px] max-w-6xl">
        {/* Form Pane */}
        <div className="space-y-6">
          {/* Target Selector */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Select Target</h3>
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {initialTargets.map((target) => (
                <button
                  key={target.id}
                  onClick={() => setActiveTarget(target.id)}
                  className={cn(
                    "relative p-4 rounded-xl border-2 transition-all text-left",
                    activeTarget === target.id
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                      : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-bg-secondary)]"
                  )}
                >
                  <span className="text-2xl mb-2 block">{TARGET_ICONS[target.id]}</span>
                  <span className="font-medium text-[var(--color-text-primary)]">{target.label}</span>
                  <span className="text-xs text-[var(--color-text-muted)] font-mono">{target.filename}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Questions Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Configuration</h3>
            {questions.map((q) => {
              const value = answers[q.id];
              const isRequired = q.required;

              const renderInput = () => {
                switch (q.kind) {
                  case "text":
                    return (
                      <Input
                        id={q.id}
                        placeholder={q.placeholder}
                        value={(value as string) || ""}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        disabled={isGenerating}
                        required={isRequired}
                        aria-describedby={q.help ? `${q.id}-help` : undefined}
                      />
                    );
                  case "textarea":
                    return (
                      <Textarea
                        id={q.id}
                        placeholder={q.placeholder}
                        value={(value as string) || ""}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        disabled={isGenerating}
                        required={isRequired}
                        rows={4}
                        aria-describedby={q.help ? `${q.id}-help` : undefined}
                      />
                    );
                  case "select":
                    return (
                      <Select
                        value={(value as string) || ""}
                        onValueChange={(v) => handleAnswerChange(q.id, v)}
                        disabled={isGenerating}
                        required={isRequired}
                      >
                        <SelectTrigger aria-describedby={q.help ? `${q.id}-help` : undefined}>
                          <SelectValue placeholder={q.placeholder || "Select..."} />
                        </SelectTrigger>
                        <SelectContent>
                          {q.options?.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  case "multiselect":
                    return (
                      <div className="space-y-2">
                        {q.options?.map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={Array.isArray(value) && value.includes(opt)}
                              onChange={(e) => {
                                const arr = (Array.isArray(value) ? value : []);
                                handleAnswerChange(
                                  q.id,
                                  e.target.checked ? [...arr, opt] : arr.filter((v) => v !== opt)
                                );
                              }}
                              disabled={isGenerating}
                            />
                            <span className="text-sm text-[var(--color-text-primary)]">{opt}</span>
                          </label>
                        ))}
                      </div>
                    );
                  case "toggle":
                    return (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={value === true}
                          onChange={(e) => handleAnswerChange(q.id, e.target.checked)}
                          disabled={isGenerating}
                        />
                        <span className="text-sm text-[var(--color-text-primary)]">Enabled</span>
                      </label>
                    );
                  default:
                    return null;
                }
              };

              return (
                <Card className="p-4" key={q.id}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Label htmlFor={q.id} className="text-sm font-medium text-[var(--color-text-primary)]">
                        {q.label}
                        {isRequired && <span className="text-[var(--color-accent)] ml-1">*</span>}
                      </Label>
                    </div>
                    {q.help && (
                      <p id={`${q.id}-help`} className="text-xs text-[var(--color-text-muted)]">
                        {q.help}
                      </p>
                    )}
                    <div>{renderInput()}</div>
                  </div>
                </Card>
              );
            })}
          </div>

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
            output={output ? { ...output, kind: "instruction-file" as const, title: targetInfo?.label || activeTarget, consumedFields: [] } : null}
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
          output={output ? { ...output, kind: "instruction-file" as const, title: targetInfo?.label || activeTarget, consumedFields: [] } : null}
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