"use client";

import { Copy, Download, Edit2, Star, Type } from "lucide-react";
import * as React from "react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PromptTemplate } from "./types";
import { copyToClipboard, downloadFile, slugify } from "@/utils";
import { useToast } from "@/providers/toaster-provider";
import { cn } from "@/utils/cn";

interface PromptEditorProps {
  prompt: PromptTemplate | null;
}

export function PromptEditor({ prompt }: PromptEditorProps) {
  const { toast } = useToast();
  const [customPrompt, setCustomPrompt] = useState("");
  const [variables, setVariables] = useState<Record<string, string>>({});

  if (!prompt) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <Type className="size-12 text-fg-muted" />
        <div>
          <p className="text-sm font-medium text-fg-primary">Select a prompt</p>
          <p className="text-xs text-fg-muted">
            Choose a prompt from the sidebar to view and customize.
          </p>
        </div>
      </div>
    );
  }

  const extractedVars = React.useMemo(() => {
    const matches = prompt.referencePrompt.match(/\{\{(\w+)\}\}/g) ?? [];
    return [...new Set(matches.map((m) => m.slice(2, -2)))];
  }, [prompt.referencePrompt]);

  const handleVariableChange = (name: string, value: string) => {
    setVariables((prev) => ({ ...prev, [name]: value }));
  };

  const renderedReference = React.useMemo(() => {
    let out = prompt.referencePrompt;
    for (const [k, v] of Object.entries(variables)) {
      out = out.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), v || `{{${k}}}`);
    }
    return out;
  }, [prompt.referencePrompt, variables]);

  const finalCustom = React.useMemo(() => {
    let out = customPrompt || prompt.referencePrompt;
    for (const [k, v] of Object.entries(variables)) {
      out = out.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), v || `{{${k}}}`);
    }
    return out;
  }, [customPrompt, prompt.referencePrompt, variables]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Reference Prompt */}
      <section className="flex flex-col flex-1 min-h-0 border-b border-border-subtle">
        <header className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-accent/10 text-[var(--accent-primary-hover)]">
              <Type className="size-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-fg-primary">Reference prompt</h3>
              <p className="text-xs text-fg-muted">
                Official template — edit variables below
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {prompt.favorite ? (
              <Star className="size-4 text-[var(--status-warning)]" />
            ) : null}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                copyToClipboard(prompt.referencePrompt);
                toast({ title: "Reference prompt copied", variant: "success" });
              }}
              aria-label="Copy reference prompt"
            >
              <Copy className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                downloadFile(
                  `${slugify(prompt.category)}-${slugify(prompt.title)}-reference.md`,
                  prompt.referencePrompt,
                  "text/markdown",
                )
              }
              aria-label="Download reference prompt"
            >
              <Download className="size-4" />
            </Button>
          </div>
        </header>

        {/* Variables */}
        {extractedVars.length > 0 && (
          <div className="border-b border-border-subtle px-4 py-3">
            <p className="mb-2 text-xs font-medium text-fg-secondary">
              Variables ({extractedVars.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {extractedVars.map((v) => (
                <div
                  key={v}
                  className="flex items-center gap-2 rounded-md border border-border-default bg-white/5 px-2 py-1 min-w-[140px]"
                >
                  <span className="text-[10px] font-mono text-fg-muted">
                    {"{{" + v + "}}"}
                  </span>
                  <input
                    type="text"
                    placeholder={v}
                    value={variables[v] ?? ""}
                    onChange={(e) => handleVariableChange(v, e.target.value)}
                    className="flex-1 bg-transparent text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <ScrollArea className="flex-1 p-4">
          <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-fg-secondary">
            {renderedReference}
          </pre>
        </ScrollArea>
      </section>

      <Separator />

      {/* Custom Prompt Builder */}
      <section className="flex flex-col flex-1 min-h-0">
        <header className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-accent/10 text-[var(--accent-primary-hover)]">
              <Edit2 className="size-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-fg-primary">Custom prompt builder</h3>
              <p className="text-xs text-fg-muted">
                Tailor the prompt — variables sync from above
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                copyToClipboard(finalCustom);
                toast({ title: "Custom prompt copied", variant: "success" });
              }}
              aria-label="Copy custom prompt"
            >
              <Copy className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                downloadFile(
                  `${slugify(prompt.category)}-${slugify(prompt.title)}-custom.md`,
                  finalCustom,
                  "text/markdown",
                )
              }
              aria-label="Download custom prompt"
            >
              <Download className="size-4" />
            </Button>
          </div>
        </header>

        <div className="flex-1 p-4">
          <Label htmlFor="custom-prompt" className="mb-2 block text-xs font-medium text-fg-secondary">
            Your customized prompt
          </Label>
          <textarea
            id="custom-prompt"
            value={customPrompt || prompt.referencePrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Start editing — variables from above will be substituted…"
            rows={12}
            className="w-full rounded-md border border-border-default bg-white/5 px-3 py-2 text-sm font-mono text-fg-primary placeholder:text-fg-muted focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none"
          />
          {customPrompt && (
            <p className="mt-2 text-xs text-fg-muted">
              Variables from the reference pane are auto-substituted on copy/download.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function copyToCliprompt(text: string) {
  copyToClipboard(text);
}