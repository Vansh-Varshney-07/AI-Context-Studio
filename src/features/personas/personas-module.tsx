"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Sparkles,
  SlidersHorizontal,
  Target,
  MessageSquare,
  FileText,
  Zap,
  ChevronLeft,
  Plus,
  Search,
  Tag as TagIcon,
  Copy,
  Download,
  Eye,
  EyeOff,
  Settings,
  Star,
  X,
  Zap as ZapIcon,
} from "lucide-react";
import * as React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag } from "@/components/common/tag";
import { EmptyState } from "@/components/common/empty-state";
import { moduleTransition } from "@/components/motion";
import { useToast } from "@/providers/toaster-provider";
import { cn } from "@/utils/cn";
import { copyToClipboard, downloadFile } from "@/utils";

import {
  PERSONA_TRAITS,
  PERSONA_TRAITS_MAP,
  TRAIT_CATEGORIES,
  PERSONA_FIELDS,
  DEFAULT_TRAITS,
} from "./constants";
import { PERSONA_BLUEPRINTS, renderPersonaBlueprint, enhanceWithAI } from "./data";
import { useAIEngine } from "@/hooks";
import type { Persona, PersonaAnswers, TraitCategory } from "./types";

const PERSONA_BLUEPRINT_KINDS = ["system-prompt", "instruction-file"] as const;
type BlueprintKind = typeof PERSONA_BLUEPRINT_KINDS[number];

const SEED_PERSONAS: Persona[] = [];

export { SEED_PERSONAS, PERSONA_BLUEPRINTS, renderPersonaBlueprint, enhanceWithAI };

export function PersonasModule() {
  const [search, setSearch] = React.useState("");
  const [selectedPersona, setSelectedPersona] = React.useState<Persona | null>(null);
  const [selectedKind, setSelectedKind] = React.useState<BlueprintKind>("system-prompt");
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [answers, setAnswers] = React.useState<PersonaAnswers>(() => defaultAnswers());
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [streamingContent, setStreamingContent] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [output, setOutput] = React.useState<string | null>(null);
  const { toast } = useToast();

  const { clear } = useAIEngine();

  const filteredPersonas = React.useMemo(() => {
    return SEED_PERSONAS.filter((p) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const haystack = `${p.name} ${p.title} ${p.description} ${p.metadata.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [search]);

  function defaultAnswers(): PersonaAnswers {
    return {
      name: "",
      title: "",
      avatar: "🤖",
      description: "",
      systemPrompt: "",
      expertise: "",
      communicationStyle: "",
      exampleInteractions: "",
      tags: "",
      ...DEFAULT_TRAITS,
    };
  }

  function handleAnswer(id: string, value: string | number | string[] | boolean | undefined) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  const handleGenerate = React.useCallback(async (kind: BlueprintKind) => {
    if (isGenerating) return;
    setIsGenerating(true);
    setIsStreaming(true);
    setStreamingContent("");
    setError(null);

    try {
      const local = renderPersonaBlueprint(kind, answers);
      if (local) {
        setOutput(local);
      }

      // Try AI enhancement
      const enhanced = await enhanceWithAI(kind, answers);
      if (enhanced) {
        setOutput(enhanced);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed";
      setError(msg);
      if (!output) {
        const local = renderPersonaBlueprint(kind, answers);
        if (local) setOutput(local);
      }
    } finally {
      setIsGenerating(false);
      setIsStreaming(false);
    }
  }, [answers, output]);

  const handleGenerateLocal = React.useCallback((kind: BlueprintKind) => {
    const local = renderPersonaBlueprint(kind, answers);
    if (local) setOutput(local);
  }, [answers]);

  const handleCreate = React.useCallback(() => {
    setAnswers(defaultAnswers());
    setSelectedPersona(null);
    setCreating(true);
  }, []);

  const handleSelectPersona = React.useCallback((p: Persona) => {
    setSelectedPersona(p);
    setCreating(false);
    const personaAnswers: PersonaAnswers = {
      name: p.name,
      title: p.title,
      avatar: p.avatar,
      description: p.description,
      systemPrompt: p.systemPrompt,
      expertise: p.expertise.join(", "),
      communicationStyle: p.communicationStyle,
      exampleInteractions: p.exampleInteractions.map(e => `User: ${e.user} | Assistant: ${e.assistant}`).join("\n"),
      tags: p.metadata.tags.join(", "),
      ...p.traits,
    };
    setAnswers(personaAnswers);
    setOutput(null);
  }, []);

  const handleSave = React.useCallback(async () => {
    if (!output) return;
    try {
      const { saveAsset } = await import("@/services/storage");
      const kind = selectedKind;
      await saveAsset({
        id: `persona-${kind}-${Date.now()}`,
        kind: "persona",
        title: `${answers.name} — ${kind}`,
        description: `Persona: ${answers.name} (${selectedKind})`,
        category: "persona",
        tags: typeof answers.tags === "string" ? answers.tags.split(",").map(t => t.trim()) : [],
        favorite: false,
        pinned: false,
        content: output,
        metadata: {
          personaName: typeof answers.name === "string" ? answers.name : "",
          kind: selectedKind,
          traits: JSON.stringify(answers),
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast({ title: "Saved", description: `Persona saved to storage`, variant: "success" });
    } catch {
      toast({ title: "Save failed", variant: "danger" });
    }
  }, [output, answers, selectedKind]);

  const handleDownload = React.useCallback(() => {
    if (!output) return;
    const name = typeof answers.name === "string" ? answers.name : "";
    const filename = `persona-${name.toLowerCase().replace(/\s+/g, "-") || "custom"}-${selectedKind}-${Date.now()}.md`;
    downloadFile(filename, output, "text/markdown");
    toast({ title: "Downloaded", description: filename, variant: "success" });
  }, [output, answers, selectedKind]);

  const handleCopy = React.useCallback(() => {
    if (!output) return;
    copyToClipboard(output);
    toast({ title: "Copied to clipboard", variant: "success" });
  }, [output]);

  return (
    <motion.div
      variants={moduleTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid h-full grid-cols-[18rem_minmax(0,1fr)] overflow-hidden"
    >
      <aside className="flex h-full flex-col border-r border-border bg-bg-secondary overflow-hidden">
        <div className="flex flex-col gap-3 p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
            <Input
              placeholder="Search personas…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              size="sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Personas ({filteredPersonas.length})
            </p>
            {filteredPersonas.map((persona) => (
              <PersonaSidebarItem
                key={persona.id}
                persona={persona}
                active={selectedPersona?.id === persona.id}
                onClick={() => handleSelectPersona(persona)}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-border p-3">
          <Button onClick={handleCreate} className="w-full" size="sm">
            <Plus className="mr-1.5 size-3.5" />
            Create Persona
          </Button>
        </div>
      </aside>

      <section className="flex h-full flex-col overflow-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Bot className="size-4" />
            </span>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-text-primary">Personas</h1>
              <p className="text-xs text-text-muted">Define, customize, and export AI personas</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          {selectedPersona ? (
            <PersonaDetailPane
              persona={selectedPersona}
              onClose={() => setSelectedPersona(null)}
              onRun={() => toast({ title: "Running…", description: `${selectedPersona.name} executed (demo)` })}
            />
          ) : creating ? (
            <PersonaBuilderPane
              answers={answers}
              onAnswer={handleAnswer}
              onSubmit={(data) => {
                handleSelectPersona({
                  ...data,
                  id: `custom-${Date.now()}`,
                  name: data.name,
                  title: data.title,
                  avatar: data.avatar,
                  description: data.description,
                  systemPrompt: data.systemPrompt,
                  expertise: data.expertise.split(",").map((e: string) => e.trim()),
                  communicationStyle: data.communicationStyle,
                  exampleInteractions: data.exampleInteractions.split("\n").filter(Boolean).map((e: string) => {
                    const [user, assistant] = e.split("|").map((s: string) => s.trim());
                    return { user, assistant };
                  }),
                  metadata: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1, tags: data.tags.split(",").map((t: string) => t.trim()), isCustom: true },
                  traits: TRAIT_CATEGORIES.reduce((acc, k) => ({ ...acc, [k]: Number(data[k]) || DEFAULT_TRAITS[k] }), {}),
                } as any);
                setCreating(false);
              }}
              onClose={() => setCreating(false)}
            />
          ) : (
            <PersonasGrid personas={filteredPersonas} onSelect={handleSelectPersona} creating={creating} onCreateClose={() => setCreating(false)} />
          )}

<PersonaPreviewPane
            selectedKind={selectedKind}
            onKindChange={setSelectedKind}
            output={output}
            isGenerating={isGenerating}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            error={error}
            kinds={PERSONA_BLUEPRINT_KINDS}
            onGenerateLocal={() => handleGenerateLocal(selectedKind)}
            onGenerateAI={() => handleGenerate(selectedKind)}
            onSave={handleSave}
            onDownload={handleDownload}
            onCopy={handleCopy}
            onClear={clear}
            hasOutput={!!output}
          />
        </div>
      </section>
    </motion.div>
  );
}

function defaultAnswers(): PersonaAnswers {
  return {
    name: "",
    title: "",
    avatar: "🤖",
    description: "",
    systemPrompt: "",
    expertise: "",
    communicationStyle: "",
    exampleInteractions: "",
    tags: "",
    ...DEFAULT_TRAITS,
  };
}

function PersonaSidebarItem({ persona, active, onClick }: { persona: Persona; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
        active
          ? "bg-accent-light text-accent"
          : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
      }`}
    >
      <span className="size-7 shrink-0 flex items-center justify-center rounded-md bg-accent/10 text-accent">
        <span className="text-base">{persona.avatar}</span>
      </span>
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium">{persona.name}</p>
        <p className="truncate text-xs text-text-muted">{persona.title}</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {persona.metadata.tags.slice(0, 2).map((t) => (
            <Tag key={t} variant="muted" className="text-[9px]">{t}</Tag>
          ))}
          {persona.metadata.tags.length > 2 && <Tag variant="muted" className="text-[9px]">+{persona.metadata.tags.length - 2}</Tag>}
        </div>
      </div>
    </button>
  );
}

function PersonasGrid({
  personas,
  onSelect,
  creating,
  onCreateClose,
}: {
  personas: Persona[];
  onSelect: (s: Persona) => void;
  creating: boolean;
  onCreateClose: () => void;
}) {
  if (creating) {
    return <PersonaBuilderPane answers={defaultAnswers()} onAnswer={() => {}} onSubmit={() => {}} onClose={onCreateClose} />;
  }

  if (personas.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          icon={Search}
          title="No personas found"
          description="Adjust your search to see results."
        />
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 p-4 overflow-y-auto">
      {personas.map((persona) => (
        <motion.article
          key={persona.id}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="group flex h-full flex-col rounded-xl border border-border bg-bg-primary p-4 transition-all hover:border-border-strong hover:shadow-sm"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <span className="text-xl">{persona.avatar}</span>
            </span>
            <Tag variant="muted" className="text-[9px] capitalize">{persona.metadata.tags[0] || "general"}</Tag>
          </div>
          <h3 className="font-medium text-text-primary mb-1">{persona.name}</h3>
          <p className="text-sm text-text-muted mb-3 flex-1">{persona.description}</p>
          <div className="flex flex-wrap gap-1 mb-4">
            {persona.metadata.tags.map((t) => (
              <Tag key={t} variant="default" className="text-[9px]">{t}</Tag>
            ))}
          </div>
          <div className="mt-auto pt-3 border-t border-border">
            <Button variant="ghost" size="sm" className="w-full" onClick={() => onSelect(persona)}>
              View details →
            </Button>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

function PersonaDetailPane({
  persona,
  onClose,
  onRun,
}: {
  persona: Persona;
  onClose: () => void;
  onRun: () => void;
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
          <p className="truncate text-sm font-semibold text-text-primary">{persona.name}</p>
          <p className="truncate text-xs text-text-muted">{persona.title}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">Description</p>
            <p className="text-text-secondary">{persona.description}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">System Prompt</p>
            <pre className="rounded-lg border border-border bg-cream p-3 text-sm font-mono leading-relaxed text-text-secondary whitespace-pre-wrap break-words">
              {persona.systemPrompt}
            </pre>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">Traits (0-10)</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {TRAIT_CATEGORIES.map((trait) => (
                <div key={trait} className="rounded-lg border border-border bg-bg-tertiary p-3">
                  <p className="font-mono text-sm text-text-primary capitalize">{trait.replace("-", " ")}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider
                      value={[persona.traits[trait] || 0]}
                      onValueChange={(() => {})}
                      max={10}
                      step={1}
                      disabled
                      className="flex-1"
                    />
                    <span className="text-xs font-medium text-text-secondary w-6">{persona.traits[trait] || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">Expertise</p>
            <div className="flex flex-wrap gap-1">
              {persona.expertise.map((t) => (
                <Tag key={t} variant="default">{t}</Tag>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">Communication Style</p>
            <p className="text-text-secondary">{persona.communicationStyle}</p>
          </div>

          {persona.exampleInteractions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-text-secondary">Example Interactions</p>
              <div className="space-y-2">
                {persona.exampleInteractions.map((ex, i) => (
                  <div key={i} className="rounded-lg border border-border bg-bg-tertiary p-3 text-sm text-text-secondary">
                    <p className="text-xs text-text-muted mb-1">Example {i + 1}</p>
                    <p><strong>User:</strong> {ex.user}</p>
                    <p className="mt-1"><strong>Assistant:</strong> {ex.assistant}</p>
                    {ex.context && <p className="text-xs text-text-muted mt-1">Context: {ex.context}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">Parameters</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {persona.metadata.tags.map((t) => (
                <Tag key={t} variant="default">{t}</Tag>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border p-4 bg-bg-secondary/60">
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="primary" onClick={onRun}>
            <ZapIcon className="mr-1.5 size-3.5" />
            Run Persona
          </Button>
        </div>
      </div>
    </div>
  );
}

function PersonaBuilderPane({
  answers,
  onAnswer,
  onSubmit,
  onClose,
}: {
  answers: PersonaAnswers;
  onAnswer: (id: string, value: string | number | string[] | boolean | undefined) => void;
  onSubmit: (data: any) => void;
  onClose: () => void;
}) {
  const [name, setName] = React.useState<string>(typeof answers.name === "string" ? answers.name : "");
  const [title, setTitle] = React.useState<string>(typeof answers.title === "string" ? answers.title : "");
  const [avatar, setAvatar] = React.useState<string>(typeof answers.avatar === "string" ? answers.avatar : "🤖");
  const [description, setDescription] = React.useState<string>(typeof answers.description === "string" ? answers.description : "");
  const [systemPrompt, setSystemPrompt] = React.useState<string>(typeof answers.systemPrompt === "string" ? answers.systemPrompt : "");
  const [expertise, setExpertise] = React.useState<string>(typeof answers.expertise === "string" ? answers.expertise : "");
  const [communicationStyle, setCommunicationStyle] = React.useState<string>(typeof answers.communicationStyle === "string" ? answers.communicationStyle : "");
  const [exampleInteractions, setExampleInteractions] = React.useState<string>(typeof answers.exampleInteractions === "string" ? answers.exampleInteractions : "");
  const [tags, setTags] = React.useState<string>(typeof answers.tags === "string" ? answers.tags : "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, title, avatar, description, systemPrompt, expertise, communicationStyle, exampleInteractions, tags });
  };

  return (
    <div className="flex h-full items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl rounded-xl border border-border bg-bg-primary p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Create New Persona</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-bg-secondary transition-colors" aria-label="Close">
            <X className="size-4 text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-1.5">
            <Label htmlFor="persona-name">Name</Label>
            <Input
              id="persona-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="persona-title">Title / Role</Label>
            <Input
              id="persona-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer — Platform"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="persona-avatar">Avatar (emoji)</Label>
            <Input
              id="persona-avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="🤖"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="persona-category">Category</Label>
            <select
              value=""
              onChange={() => {}}
              className="flex w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <option value="engineering">Engineering</option>
              <option value="product">Product</option>
              <option value="design">Design</option>
              <option value="security">Security</option>
              <option value="devops">DevOps</option>
              <option value="data">Data Science</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="persona-description">Description</Label>
            <textarea
              id="persona-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="flex w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              placeholder="What does this persona do?"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="persona-expertise">Expertise (comma separated)</Label>
            <Input
              id="persona-expertise"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              placeholder="Distributed Systems, API Design, Go, Kubernetes"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="persona-style">Communication Style</Label>
            <textarea
              id="persona-style"
              value={communicationStyle}
              onChange={(e) => setCommunicationStyle(e.target.value)}
              rows={3}
              className="flex w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              placeholder="Direct, code-first, with architectural context"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="persona-system-prompt">System Prompt</Label>
            <textarea
              id="persona-system-prompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={6}
              className="flex w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm font-mono leading-relaxed text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus resize-none"
              placeholder="You are an expert at…"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="persona-examples">Example Interactions (one per line: User: ... | Assistant: ...)</Label>
            <textarea
              id="persona-examples"
              value={exampleInteractions}
              onChange={(e) => setExampleInteractions(e.target.value)}
              rows={4}
              className="flex w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm font-mono leading-relaxed text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus resize-none"
              placeholder="User: How do I design a rate limiter? | Assistant: Here's a token bucket implementation…"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="persona-tags">Tags (comma separated)</Label>
            <Input
              id="persona-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="backend, distributed-systems, mentoring"
            />
          </div>

          <div className="space-y-1.5 pt-2 border-t border-border">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Traits (0-10)</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {TRAIT_CATEGORIES.map((trait) => (
                <div key={trait} className="rounded-lg border border-border bg-bg-tertiary p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-mono text-sm text-text-primary capitalize">{trait.replace("-", " ")}</p>
                    <span className="text-xs font-medium text-text-secondary w-6" id={`trait-val-${trait}`}>
                      {DEFAULT_TRAITS[trait]}
                    </span>
                  </div>
                  <Slider
                    value={[(typeof answers[trait] === "number" ? answers[trait] : DEFAULT_TRAITS[trait]) as number]}
                    onValueChange={([v]) => onAnswer(trait, v)}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Sparkles className="mr-1.5 size-3.5" />
              Create Persona
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function PersonaPreviewPane({
  selectedKind,
  onKindChange,
  output,
  isGenerating,
  isStreaming,
  streamingContent,
  error,
  kinds,
  onGenerateLocal,
  onGenerateAI,
  onSave,
  onDownload,
  onCopy,
  onClear,
  hasOutput,
}: {
  selectedKind: BlueprintKind;
  onKindChange: (kind: BlueprintKind) => void;
  output: string | null;
  isGenerating: boolean;
  isStreaming: boolean;
  streamingContent: string | null;
  error: string | null;
  kinds: readonly BlueprintKind[];
  onGenerateLocal: () => void;
  onGenerateAI: () => void;
  onSave: () => void;
  onDownload: () => void;
  onCopy: () => void;
  onClear: () => void;
  hasOutput: boolean;
}) {
  const { toast } = useToast();

  return (
    <div className="flex h-full flex-col bg-bg-primary">
      <header className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <ZapIcon className="size-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Preview & Export</h2>
            <p className="text-xs text-text-muted">Generate and export persona artifacts</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onGenerateLocal} disabled={isGenerating}>
            <Sparkles className="mr-1.5 size-3.5" />
            Local
          </Button>
          <Button variant="primary" size="sm" onClick={onGenerateAI} disabled={isGenerating}>
            <ZapIcon className="mr-1.5 size-3.5" />
            {isGenerating ? "Enhancing…" : "Enhance with AI"}
          </Button>
        </div>
      </header>

      <div className="flex items-center gap-1 overflow-x-auto border-b border-border bg-bg-secondary/60 px-3 py-2">
        {kinds.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => onKindChange(k)}
            className={`whitespace-nowrap rounded-md px-3 py-1 text-xs transition-colors ${
              k === selectedKind
                ? "bg-accent/10 text-accent"
                : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
            }`}
            aria-pressed={k === selectedKind}
          >
            {k === "system-prompt" ? "System Prompt" : "Instruction File"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {isStreaming && streamingContent ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="flex h-full flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2 bg-bg-secondary/40">
              <span className="text-text-secondary font-mono text-xs">Streaming…</span>
            </div>
            <pre className="h-full overflow-auto whitespace-pre-wrap break-words px-4 py-3 font-mono text-xs leading-relaxed text-text-secondary">
              {streamingContent}
            </pre>
          </motion.div>
        ) : output ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="flex h-full flex-col overflow-hidden"
          >
            <div className="flex h-full flex-col overflow-hidden">
              <pre className="h-full overflow-auto whitespace-pre-wrap break-words px-4 py-3 font-mono text-xs leading-relaxed text-text-secondary">
                {output}
              </pre>
            </div>
          </motion.div>
        ) : (
          <div className="flex h-full items-center justify-center p-6">
            <EmptyState
              icon={FileText}
              title="No artifact yet"
              description="Fill fields on the left and click Local for instant preview, or Enhance with AI for polished output."
            />
          </div>
        )}
      </div>

      <footer className="flex items-center justify-between gap-2 border-t border-border px-4 py-3 bg-bg-secondary/60">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          {isGenerating ? (
            <>
              <span className="size-2 rounded-full bg-accent animate-pulse" />
              Streaming from AI…
            </>
          ) : error ? (
            <>
              <span className="size-2 rounded-full bg-error" />
              {error}
            </>
          ) : output ? (
            <>
              <span className="size-2 rounded-full bg-success" />
              Ready to export
            </>
          ) : (
            <>
              <span className="size-2 rounded-full bg-text-muted" />
              Fill form and click Local or Enhance with AI
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
                Download .md
              </Button>
              <Button variant="secondary" size="sm" onClick={onSave}>
                <ZapIcon className="mr-1.5 size-3.5" />
                Save
              </Button>
            </>
          )}
          {isGenerating && (
            <Button variant="ghost" size="sm" onClick={onClear} disabled={isStreaming}>
              Cancel
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}