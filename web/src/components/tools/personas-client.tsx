"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Copy,
  Download,
  Loader2,
  Zap,
  AlertCircle,
  Sparkles,
  Brain,
  Shield,
  Code,
  FileCode,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { BlueprintPreview } from "@/components/generate/blueprint-preview";
import { ApiKeyModal } from "@/components/generate/api-key-modal";
import type { Persona, PersonaAnswers, GenerationOutputKind } from "@/lib/engine";
import { renderPersonaBlueprint, PERSONA_BLUEPRINTS } from "@/lib/engine";
import { PERSONA_TRAITS, TRAIT_CATEGORIES } from "@/lib/engine/personas/constants";

interface PersonasClientProps {
  initialPersonas: readonly Persona[];
}

const BLUEPRINT_LABELS: Record<GenerationOutputKind, string> = {
  "system-prompt": "System Prompt",
  "instruction-file": "Instruction File",
  "prompt-template": "Prompt Template",
  "context-file": "Context File",
  memory: "Memory Block",
  workflow: "Workflow",
};

const BLUEPRINT_ICONS: Record<GenerationOutputKind, typeof Sparkles> = {
  "system-prompt": Sparkles,
  "instruction-file": FileCode,
  "prompt-template": FileText,
  "context-file": FileText,
  memory: Brain,
  workflow: Sparkles,
};

export function PersonasClient({ initialPersonas }: PersonasClientProps) {
  const [activePersona, setActivePersona] = useState<Persona | null>(initialPersonas[0] ?? null);
  const [activeBlueprintKind, setActiveBlueprintKind] = useState<GenerationOutputKind>("system-prompt");
  const [output, setOutput] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [aiProvider, setAiProvider] = useState<{ provider: string; apiKey: string; model?: string } | null>(null);

  const blueprint = activePersona ? PERSONA_BLUEPRINTS.find((b) => b.kind === activeBlueprintKind) : null;

  const generateLocal = useCallback(async () => {
    if (!blueprint || !activePersona) return;
    setIsGenerating(true);
    setError(null);
    try {
      // renderPersonaBlueprint only supports "system-prompt" | "instruction-file"
      if (activeBlueprintKind === "system-prompt" || activeBlueprintKind === "instruction-file") {
        const result = renderPersonaBlueprint(activeBlueprintKind, activePersona as unknown as PersonaAnswers);
        setOutput(result);
      } else {
        setOutput(`<!-- Blueprint kind "${activeBlueprintKind}" not yet supported for personas -->`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }, [activePersona, activeBlueprintKind, blueprint]);

  const handleGenerateWithAi = useCallback(async () => {
    if (!aiProvider) {
      setShowApiKeyModal(true);
      return;
    }
    setIsAiGenerating(true);
    setError(null);
    try {
      // AI enhancement not yet implemented for personas
      if (activeBlueprintKind === "system-prompt" || activeBlueprintKind === "instruction-file" && activePersona) {
        const result = renderPersonaBlueprint(activeBlueprintKind, activePersona as unknown as PersonaAnswers);
        if (result) {
          setOutput(`${result}\n\n<!-- AI enhancement requested but not yet implemented for personas. Showing local engine output. -->`);
        } else {
          setError("AI generation returned no result");
        }
      } else {
        setError("AI enhancement not available for this blueprint kind");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI generation failed");
    } finally {
      setIsAiGenerating(false);
    }
  }, [activePersona, activeBlueprintKind, aiProvider]);

  const handleDownload = useCallback(() => {
    if (!output || !activePersona) return;
    const filename = `${activePersona.id}-${activeBlueprintKind}.md`;
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [output, activePersona, activeBlueprintKind]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  }, [output]);

  const handleApiKeySubmit = useCallback((provider: { provider: string; apiKey: string; model?: string }) => {
    setAiProvider(provider);
    setShowApiKeyModal(false);
    handleGenerateWithAi();
  }, [handleGenerateWithAi]);

  const blueprintLabel = activeBlueprintKind ? BLUEPRINT_LABELS[activeBlueprintKind] || activeBlueprintKind : "System Prompt";
  const blueprintIcon = activeBlueprintKind ? BLUEPRINT_ICONS[activeBlueprintKind] : Sparkles;

  if (!activePersona) {
    return <div className="flex h-full items-center justify-center">No personas available</div>;
  }

  return (
    <div className="flex-1 container-app py-16 px-4">
      <div className="mb-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl" aria-hidden="true">{activePersona.avatar}</span>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
              {activePersona.name}
            </h1>
            <p className="text-[var(--color-text-secondary)]">{activePersona.title}</p>
          </div>
        </div>
        <p className="text-[var(--color-text-secondary)] max-w-2xl">{activePersona.description}</p>
        <Separator />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px] max-w-6xl">
        {/* Form Pane */}
        <div className="space-y-6">
          {/* Persona Selector */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Select Persona</h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {initialPersonas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => setActivePersona(persona)}
                  className={cn(
                    "relative p-4 rounded-xl border-2 transition-all text-left",
                    activePersona.id === persona.id
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                      : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-bg-secondary)]"
                  )}
                >
                  <span className="text-2xl mb-2 block">{persona.avatar}</span>
                  <span className="font-medium text-[var(--color-text-primary)]">{persona.name}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">{persona.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Blueprint Selector */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Output Format</h3>
            <Tabs value={activeBlueprintKind} onValueChange={(v: string) => setActiveBlueprintKind(v as GenerationOutputKind)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {PERSONA_BLUEPRINTS.map((bp) => (
                  <TabsTrigger key={bp.kind} value={bp.kind} className="data-[state=active]:bg-[var(--color-accent)] data-[state=active]:text-white">
                    {BLUEPRINT_LABELS[bp.kind] || bp.kind}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Traits Display */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Traits (0-10)</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {TRAIT_CATEGORIES.map((trait) => {
                const value = activePersona.traits[trait];
                const traitDef = PERSONA_TRAITS.find((t) => t.id === trait);
                return (
                  <div key={trait} className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                    <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase">{traitDef?.label || trait}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="range"
                        min={traitDef?.min || 0}
                        max={traitDef?.max || 10}
                        value={value}
                        readOnly
                        className="flex-1"
                      />
                      <span className="text-sm font-mono text-[var(--color-text-primary)] w-8 text-right">{value}/10</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expertise Tags */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {activePersona.expertise.map((exp) => (
                <Badge key={exp} variant="outline">{exp}</Badge>
              ))}
            </div>
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
            output={output ? { kind: activeBlueprintKind, title: `${activePersona.name} — ${blueprintLabel}`, filename: `${activePersona.id}-${activeBlueprintKind}.md`, content: output, consumedFields: [] } : null}
            isGenerating={isGenerating || isAiGenerating}
            onDownload={handleDownload}
            onCopy={handleCopy}
            filename={`${activePersona.id}-${activeBlueprintKind}.md`}
          />
        </div>
      </div>

      {/* Mobile Preview */}
      <div className="lg:hidden mt-6">
        <BlueprintPreview
          output={output ? { kind: activeBlueprintKind, title: `${activePersona.name} — ${blueprintLabel}`, filename: `${activePersona.id}-${activeBlueprintKind}.md`, content: output, consumedFields: [] } : null}
          isGenerating={isGenerating || isAiGenerating}
          onDownload={handleDownload}
          onCopy={handleCopy}
          filename={`${activePersona.id}-${activeBlueprintKind}.md`}
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
