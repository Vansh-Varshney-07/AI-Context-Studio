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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileCode,
  Copy,
  Download,
  Loader2,
  Zap,
  AlertCircle,
  Sparkles,
  Zap as ZapIcon,
  FileText,
  Search,
  Filter,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BlueprintPreview } from "@/components/generate/blueprint-preview";
import { ApiKeyModal } from "@/components/generate/api-key-modal";
import type { Skill } from "@/lib/engine";
import { SEED_SKILLS, SKILL_CATEGORIES } from "@/lib/engine";

interface SkillsClientProps {
  initialSkills: readonly Skill[];
}

export function SkillsClient({ initialSkills }: SkillsClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(initialSkills[0] ?? null);
  const [output, setOutput] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [aiProvider, setAiProvider] = useState<{ provider: string; apiKey: string; model?: string } | null>(null);

  const filteredSkills = initialSkills.filter((s) => {
    if (selectedCategory !== "all" && s.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q));
    }
    return true;
  });

  const generateLocal = useCallback(async () => {
    if (!selectedSkill) return;
    setIsGenerating(true);
    setError(null);
    try {
      setOutput(selectedSkill.systemPrompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }, [selectedSkill]);

  const handleDownload = useCallback(() => {
    if (!output || !selectedSkill) return;
    const filename = `${selectedSkill.id}.md`;
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [output, selectedSkill]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  }, [output]);

  const handleApiKeySubmit = useCallback((provider: { provider: string; apiKey: string; model?: string }) => {
    setAiProvider(provider);
    setShowApiKeyModal(false);
  }, []);

  return (
    <div className="flex-1 container-app py-16 px-4">
      <div className="mb-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Skills Explorer</h1>
        <p className="text-[var(--color-text-secondary)]">Browse 12 atomic AI skills across programming, writing, analysis, devops categories with full prompts and parameters.</p>
        <Separator />
      </div>

      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] max-w-6xl">
        {/* Sidebar */}
        <aside className="flex h-full flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <div className="flex flex-col gap-3 p-3 border-b border-[var(--color-border)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <Input
                placeholder="Search skills…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                size="sm"
              />
            </div>
            <div className="space-y-1">
              <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Categories</p>
              {["all", ...SKILL_CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                    selectedCategory === cat
                      ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
                  )}
                >
                  {cat === "all" ? (
                    <Sparkles className="size-3.5 shrink-0 text-[var(--color-accent)]" />
                  ) : (
                    <span className="size-2 rounded-full bg-[var(--color-border)]" />
                  )}
                  <span className="truncate flex-1 capitalize">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-1">
              <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Skills ({filteredSkills.length})
              </p>
              {filteredSkills.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => setSelectedSkill(skill)}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                    selectedSkill?.id === skill.id
                      ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
                  )}
                >
                  <span className="size-7 shrink-0 flex items-center justify-center rounded-md bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    <FileCode className="size-3.5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{skill.name}</p>
                    <p className="truncate text-xs text-[var(--color-text-muted)]">{skill.description}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {skill.tags.slice(0, 2).map((t) => (
                        <Badge key={t} variant="secondary" className="text-[9px]">{t}</Badge>
                      ))}
                      {skill.tags.length > 2 && <Badge variant="secondary" className="text-[9px]">+{skill.tags.length - 2}</Badge>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex h-full flex-col overflow-hidden">
          <header className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <FileCode className="size-4" />
              </span>
              <div>
                <h1 className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">Skills</h1>
                <p className="text-xs text-[var(--color-text-muted)]">Atomic, composable AI skills for workflows</p>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-hidden">
            {selectedSkill ? (
              <div className="flex h-full flex-col overflow-hidden">
                <div className="flex h-14 items-center justify-between border-b border-[var(--color-border)] px-4">
                  <button
                    type="button"
                    onClick={() => setSelectedSkill(null)}
                    className="p-1 rounded hover:bg-[var(--color-bg-secondary)] transition-colors"
                    aria-label="Back"
                  >
                    <ChevronLeft className="size-4 rotate-180 text-[var(--color-text-muted)]" />
                  </button>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">{selectedSkill.name}</p>
                    <p className="truncate text-xs text-[var(--color-text-muted)]">{selectedSkill.category}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[var(--color-text-secondary)]">Description</p>
                      <p className="text-[var(--color-text-secondary)]">{selectedSkill.description}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[var(--color-text-secondary)]">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedSkill.tags.map((t) => (
                          <Badge key={t} variant="default">{t}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[var(--color-text-secondary)]">Parameters</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {selectedSkill.parameters.map((p) => (
                          <div key={p.name} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] p-3">
                            <p className="font-mono text-sm text-[var(--color-text-primary)]">{p.name}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">{p.type} — {p.required ? "Required" : "Optional"}</p>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-1">{p.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[var(--color-text-secondary)]">System Prompt</p>
                      <pre className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] p-3 text-sm font-mono leading-relaxed text-[var(--color-text-secondary)] whitespace-pre-wrap break-words">
                        {selectedSkill.systemPrompt}
                      </pre>
                    </div>

                    {selectedSkill.examples.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-[var(--color-text-secondary)]">Examples</p>
                        <div className="space-y-2">
                          {selectedSkill.examples.map((ex, i) => (
                            <div key={i} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] p-3 text-sm text-[var(--color-text-secondary)]">
                              <p className="text-xs text-[var(--color-text-muted)] mb-1">Example {i + 1}</p>
                              <p>{ex}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 pt-4 border-t border-[var(--color-border)]">
                      <Button
                        onClick={() => setOutput(selectedSkill.systemPrompt)}
                        disabled={isGenerating}
                        className="w-full"
                        size="lg"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading…
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
                            Use This Skill
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-6">
                  <div className="text-center">
                    <Sparkles className="h-16 w-16 text-[var(--color-text-muted)] mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[var(--color-text-secondary)]">Select a skill to view details</h3>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Choose from the sidebar to see the full prompt and parameters</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Mobile Preview */}
          <div className="lg:hidden mt-6">
            {output && (
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
                  <FileCode className="h-5 w-5 text-[var(--color-text-secondary)]" />
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
                <pre className="whitespace-pre-wrap break-words p-4 font-mono text-sm leading-relaxed text-[var(--color-text-primary)] bg-[var(--color-bg-tertiary)] rounded">
                  {output}
                </pre>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}