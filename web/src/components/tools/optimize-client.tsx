"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wand2,
  Copy,
  Download,
  Loader2,
  Zap,
  AlertCircle,
  FileText,
  Code,
  Scissors,
  Brain,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BlueprintPreview } from "@/components/generate/blueprint-preview";
import { ApiKeyModal } from "@/components/generate/api-key-modal";
import { Optimizer } from "@/lib/optimizer";

const ENGINE_LABELS: Record<string, string> = {
  clarity: "Clarity",
  conciseness: "Conciseness",
  "role-definition": "Role Definition",
  "chain-of-thought": "Chain of Thought",
  "token-reduction": "Token Reduction",
};

export function OptimizeClient() {
  const [inputText, setInputText] = useState("");
  const [selectedEngines, setSelectedEngines] = useState<string[]>(["clarity"]);
  const [output, setOutput] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isAiOptimizing, setIsAiOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [aiProvider, setAiProvider] = useState<{ provider: string; apiKey: string; model?: string } | null>(null);

  const availableEngines = Optimizer.getEngines();

  const handleOptimize = useCallback(async () => {
    if (!inputText.trim()) return;
    setIsOptimizing(true);
    setError(null);
    try {
      const result = await Optimizer.optimize({
        content: inputText,
        promptType: "general-prompt",
        targetModel: "claude",
        optimizationTypes: selectedEngines as any,
        mode: "general",
      });
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Optimization failed");
    } finally {
      setIsOptimizing(false);
    }
  }, [inputText, selectedEngines]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output.optimizedPrompt], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized-prompt.md";
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output.optimizedPrompt);
  }, [output]);

  const handleApiKeySubmit = useCallback((provider: { provider: string; apiKey: string; model?: string }) => {
    setAiProvider(provider);
    setShowApiKeyModal(false);
  }, []);

  const diffClassName = (lineType: string) => cn(
    "px-2 py-0.5 font-mono text-sm",
    lineType === "added" && "bg-green-500/20 text-green-400",
    lineType === "removed" && "bg-red-500/20 text-red-400",
    lineType === "modified" && "bg-yellow-500/20 text-yellow-400",
  );

  const diffSymbol = (lineType: string) => {
    if (lineType === "added") return "+ ";
    if (lineType === "removed") return "- ";
    if (lineType === "modified") return "~ ";
    return "";
  };

  return (
    <div className="flex-1 container-app py-16 px-4">
      <div className="mb-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Prompt Optimizer</h1>
        <p className="text-[var(--color-text-secondary)]">Optimize prompts with 16 engines (clarity, conciseness, CoT, token reduction, safety, etc.) with diff view and stats.</p>
        <Separator />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px] max-w-6xl">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Prompt to Optimize</h3>
            <Textarea
              placeholder="Paste your prompt here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Optimization Engines</h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {availableEngines.map((engine) => (
                <label key={engine.id} className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-[var(--color-bg-secondary)] transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedEngines.includes(engine.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEngines([...selectedEngines, engine.id]);
                      } else {
                        setSelectedEngines(selectedEngines.filter((id) => id !== engine.id));
                      }
                    }}
                    className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                  />
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">{ENGINE_LABELS[engine.id] || engine.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{engine.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Options</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Target Model</Label>
                <Select defaultValue="claude">
                  <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claude">Claude</SelectItem>
                    <SelectItem value="gpt">GPT</SelectItem>
                    <SelectItem value="gemini">Gemini</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mode</Label>
                <Select defaultValue="general">
                  <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="coding">Coding</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button
              onClick={handleOptimize}
              disabled={isOptimizing || !inputText.trim() || selectedEngines.length === 0}
              className="flex-1"
              size="lg"
            >
              {isOptimizing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Optimizing…
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Optimize Prompt
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
          {output ? (
            <Card className="h-full flex flex-col overflow-hidden">
              <Tabs defaultValue="optimized" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="optimized">Optimized</TabsTrigger>
                  <TabsTrigger value="original">Original</TabsTrigger>
                  <TabsTrigger value="diff">Diff</TabsTrigger>
                </TabsList>
                <TabsContent value="optimized">
                  <div className="p-4 font-mono text-sm leading-relaxed text-[var(--color-text-primary)] bg-[var(--color-bg-tertiary)] h-[500px] overflow-auto whitespace-pre-wrap break-words">
                    {output.optimizedPrompt}
                  </div>
                </TabsContent>
                <TabsContent value="original">
                  <div className="p-4 font-mono text-sm leading-relaxed text-[var(--color-text-primary)] bg-[var(--color-bg-tertiary)] h-[500px] overflow-auto whitespace-pre-wrap break-words">
                    {output.originalPrompt}
                  </div>
                </TabsContent>
                <TabsContent value="diff">
                  <div className="p-4 font-mono text-sm leading-relaxed h-[500px] overflow-auto">
                    {output.comparison?.hunks?.map((hunk: any, i: number) => (
                      <div key={i} className="mb-4">
                        {hunk.lines?.map((line: any, j: number) => (
                          <div
                            key={j}
                            className={diffClassName(line.type)}
                          >
                            {diffSymbol(line.type)}{line.content}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          ) : (
            <Card className="h-full flex flex-col">
              <div className="flex items-center justify-center h-full p-8 text-center">
                <Wand2 className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[var(--color-text-secondary)]">No output yet</h3>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">Enter a prompt and select engines to optimize</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}