"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Copy, Download, Wand2 } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/common/empty-state";
import { Tag } from "@/components/common";
import { useToast } from "@/providers/toaster-provider";
import type { AgentInstructionTarget } from "@/types/domain";
import { copyToClipboard, downloadFile, slugify } from "@/utils";
import {
  generateInstructionFile,
  type GeneratorAnswers,
} from "./generator";
import { questionsForTarget } from "./generator-questions";
import type { GeneratorQuestion } from "./types";
import { cn } from "@/utils/cn";

/**
 * Lower pane: Custom Generator.
 *
 * Renders a dynamic question form for the active target, then runs the
 * dummy generator to preview the resulting instruction file content.
 * NO AI integration — this is purely the architectural shell per spec.
 */
interface CustomGeneratorProps {
  target: AgentInstructionTarget;
}

export function CustomGenerator({ target }: CustomGeneratorProps) {
  const questions = React.useMemo(() => questionsForTarget(target), [target]);
  const resolver = React.useMemo(() => buildResolver(questions), [questions]);
  const [output, setOutput] = useState<{ filename: string; content: string } | null>(
    null,
  );

  const form = useForm<Record<string, unknown>>({
    resolver: zodResolver(resolver) as Resolver<Record<string, unknown>>,
    mode: "onBlur",
    defaultValues: {},
  });

  /**
   * When the target changes we reset the form. We re-seed defaults from
   * each question then re-run the generator with empty answers to give
   * immediate feedback.
   */
  useEffect(() => {
    const defaults: GeneratorAnswers = {};
    for (const q of questions) {
      if (q.defaultValue !== undefined) defaults[q.id] = q.defaultValue;
    }
    form.reset(defaults);
    setOutput(null);
  }, [questions, form]);

  const onSubmit = (values: Record<string, unknown>) => {
    setOutput(
      generateInstructionFile(target, values as GeneratorAnswers, questions),
    );
  };

  return (
    <section className="flex h-full flex-col overflow-hidden p-4">
      <header className="mb-2 space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold tracking-tight text-text-primary">
            Custom generator
          </h3>
          <Tag variant="muted">Dummy engine</Tag>
        </div>
        <p className="text-xs leading-relaxed text-text-muted">
          Answer the dynamic questions for{" "}
          <span className="font-medium text-text-secondary">{target}</span>. The
          generator stitches a starter instruction file locally — no AI yet.
        </p>
      </header>

      <div className="flex min-h-0 flex-1 gap-4 overflow-hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex min-h-0 flex-col gap-3 overflow-y-auto pr-1"
        >
          {questions.length === 0 ? (
            <EmptyState
              icon={Wand2}
              title="No questions defined for this target"
              description="Add questions in generator-questions.ts to power the form."
            />
          ) : (
            questions.map((question) => (
              <Field
                key={question.id}
                question={question}
                control={form.control}
              />
            ))
          )}
          <div className="sticky bottom-0 mt-2 flex justify-end gap-2 bg-gradient-to-t from-bg-surface to-transparent pt-2">
            <Button type="submit" size="sm">
              <Wand2 />
              Generate
            </Button>
          </div>
        </form>

        <ResultPreview target={target} output={output} />
      </div>
    </section>
  );
}

const ResultPreview: React.FC<{
  target: AgentInstructionTarget;
  output: { filename: string; content: string } | null;
}> = function ResultPreview({ target, output }) {
  const { toast } = useToast();

  if (!output) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border bg-bg-secondary/50">
        <EmptyState
          icon={Wand2}
          title="Fill the form and click Generate"
          description={`Your preview ${target} instruction file appears here.`}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-bg-secondary/40"
    >
      <header className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className="font-mono">{output.filename}</span>
          <span className="text-text-subtle">{output.content.length} chars</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              copyToClipboard(output.content);
              toast({ title: "Copied", variant: "success" });
            }}
            aria-label="Copy generated file"
          >
            <Copy />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() =>
              downloadFile(
                `${slugify(target)}-instructions-${Date.now()}.md`,
                output.content,
                "text/markdown",
              )
            }
            aria-label="Download generated file"
          >
            <Download />
          </Button>
        </div>
      </header>
      <pre className="h-full overflow-auto whitespace-pre-wrap break-words px-4 py-3 font-mono text-xs leading-relaxed text-text-secondary">
        {output.content}
      </pre>
    </motion.div>
  );
};

/**
 * Single field renderer. Switches on the question `kind`. Each kind maps
 * to a dedicated input component for accessibility + reuse.
 */
const Field: React.FC<{
  question: GeneratorQuestion;
  control: ReturnType<typeof useForm<Record<string, unknown>>>["control"];
}> = function Field({ question, control }) {
  return (
    <Controller
      name={question.id}
      control={control}
      render={({ field }) => (
        <div className="space-y-1.5">
          <Label htmlFor={question.id}>{question.label}</Label>
          {question.help ? (
            <p className="text-[11px] text-fg-subtle">{question.help}</p>
          ) : null}
          <FieldControl question={question} field={field} />
        </div>
      )}
    />
  );
};

/**
 * Concrete input switch. Kept simple — Phase 8 will polish interactions.
 */
const FieldControl: React.FC<{
  question: GeneratorQuestion;
  field: {
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    name: string;
    ref?: React.Ref<HTMLInputElement>;
  };
}> = function FieldControl({ question, field }) {
  const id = question.id;
  const value = (Array.isArray(field.value)
    ? field.value
    : typeof field.value === "boolean"
      ? field.value
      : typeof field.value === "string"
        ? field.value
        : "") as string | string[] | boolean | undefined;

  switch (question.kind) {
    case "text":
      return (
        <Input
          id={id}
          ref={field.ref as React.Ref<HTMLInputElement>}
          value={(value as string) ?? ""}
          placeholder={question.placeholder}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
        />
      );

    case "textarea":
      return (
        <textarea
          id={id}
          value={(value as string) ?? ""}
          placeholder={question.placeholder}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          rows={4}
          className={cn(
            "flex w-full rounded-md border border-border-default bg-white/5 px-3 py-2 text-sm text-fg-primary",
            "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:outline-none",
            "placeholder:text-fg-muted",
          )}
        />
      );

    case "select":
      return (
        <select
          id={id}
          value={(value as string) ?? ""}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          className="h-9 w-full rounded-md border border-border-default bg-white/5 px-2 text-sm text-fg-primary"
        >
          {question.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case "multiselect": {
      const selected = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="flex flex-wrap gap-1.5">
          {question.options?.map((option) => {
            const active = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  field.onChange(
                    active
                      ? selected.filter((v) => v !== option)
                      : [...selected, option],
                  )
                }
                aria-pressed={active}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs transition-colors",
                  active
                    ? "border-accent/40 bg-accent/10 text-[var(--accent-primary-hover)]"
                    : "border-border-default bg-white/5 text-fg-muted hover:text-fg-primary",
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
          onClick={() => field.onChange(!checked)}
          className={cn(
            "relative h-6 w-11 rounded-full border transition-colors",
            checked
              ? "border-accent bg-accent/30"
              : "border-border-default bg-white/5",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 size-5 rounded-full bg-white transition-all",
              checked ? "left-[1.4rem]" : "left-0.5",
              checked ? "bg-[var(--accent-primary-hover)]" : "bg-fg-muted",
            )}
          />
        </button>
      );
    }
  }
};

/**
 * Build a Zod schema from a question bank. Allows the form to fully
 * validate required text/string answers while non-required fields are
 * optional. Returns a raw `z.object` so react-hook-form can infer its
 * generic Resolver freely; type assertion lives at the call site.
 */
function buildResolver(questions: readonly GeneratorQuestion[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const q of questions) {
    const base: z.ZodTypeAny =
      q.kind === "multiselect"
        ? z.array(z.string())
        : q.kind === "toggle"
          ? z.boolean()
          : z.string();
    shape[q.id] = q.required ? base : base.optional();
  }
  return z.object(shape);
}
