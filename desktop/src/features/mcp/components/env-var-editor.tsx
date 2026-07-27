"use client";

import * as React from "react";
import { Check, Eye, EyeOff, Plus, Trash2, X } from "lucide-react";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { cn } from "@utils/cn";

import type { MCPEnvVarSpec, MCPEnvVarValue } from "../types";

export interface EnvVarEditorProps {
  values: MCPEnvVarValue[];
  onChange: (values: MCPEnvVarValue[]) => void;
  specs?: MCPEnvVarSpec[];
  allowCustom?: boolean;
  className?: string;
}

export function EnvVarEditor({
  values,
  onChange,
  specs = [],
  allowCustom = true,
  className,
}: EnvVarEditorProps) {
  const [revealed, setRevealed] = React.useState<Record<string, boolean>>({});

  const knownKeys = new Set(specs.map((spec) => spec.key));
  const customEntries = values.filter((entry) => !knownKeys.has(entry.key));

  function updateValue(key: string, value: string) {
    const idx = values.findIndex((entry) => entry.key === key);
    if (idx === -1) {
      onChange([...values, { key, value }]);
      return;
    }
    onChange(values.map((entry, i) => (i === idx ? { ...entry, value } : entry)));
  }

  function updateKey(oldKey: string, newKey: string) {
    onChange(values.map((entry) => (entry.key === oldKey ? { ...entry, key: newKey } : entry)));
  }

  function deleteEntry(key: string) {
    onChange(values.filter((entry) => entry.key !== key));
  }

  function addCustom() {
    let candidate = "NEW_VAR";
    let i = 1;
    while (values.some((entry) => entry.key === candidate)) {
      candidate = `NEW_VAR_${i}`;
      i += 1;
    }
    onChange([...values, { key: candidate, value: "" }]);
  }

  return (
    <div className={cn("space-y-2", className)}>
      {specs.map((spec) => {
        const value = values.find((entry) => entry.key === spec.key)?.value ?? "";
        const isSecret = spec.secret ?? false;
        const reveal = revealed[spec.key] ?? !isSecret;
        return (
          <div key={spec.key} className="grid grid-cols-[1fr_2fr] gap-2 items-start">
            <div className="min-w-0 pt-2.5">
              <Label className="text-text-primary font-mono break-all">
                {spec.key}
                {spec.required ? <span className="text-error ml-1">*</span> : null}
              </Label>
              {spec.description ? (
                <p className="mt-0.5 text-[11px] text-text-muted">{spec.description}</p>
              ) : null}
              {spec.hint ? (
                <p className="mt-0.5 text-[10px] text-text-muted italic">↳ {spec.hint}</p>
              ) : null}
            </div>
            <div className="relative">
              <Input
                type={isSecret && !reveal ? "password" : "text"}
                value={value}
                onChange={(e) => updateValue(spec.key, e.target.value)}
                placeholder={spec.required ? "required" : "optional"}
                className={cn(spec.required && !value && "border-error/50")}
              />
              {isSecret ? (
                <button
                  type="button"
                  aria-label={reveal ? "Hide value" : "Show value"}
                  onClick={() => setRevealed((s) => ({ ...s, [spec.key]: !s[spec.key] }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors"
                >
                  {reveal ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              ) : null}
            </div>
          </div>
        );
      })}

      {customEntries.length > 0 && (
        <div className="pt-2 border-t border-border-subtle">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted px-1 pb-1">
            Custom
          </p>
          {customEntries.map((entry) => (
            <div key={entry.key} className="flex items-start gap-2 py-1.5">
              <Input
                value={entry.key}
                onChange={(e) => updateKey(entry.key, e.target.value)}
                placeholder="KEY"
                className="flex-1 font-mono"
              />
              <Input
                value={entry.value}
                onChange={(e) => updateValue(entry.key, e.target.value)}
                placeholder="value"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Remove env var"
                onClick={() => deleteEntry(entry.key)}
              >
                <Trash2 className="size-4 text-text-muted" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {allowCustom ? (
        <Button variant="ghost" size="sm" onClick={addCustom} className="text-text-muted">
          <Plus className="size-3.5" /> Add env var
        </Button>
      ) : null}
    </div>
  );
}

export function EnvVarSatisfied({ ok }: { ok: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex size-4 items-center justify-center rounded-full",
        ok ? "bg-success-bg text-success" : "bg-error-bg text-error",
      )}
    >
      {ok ? <Check className="size-2.5" /> : <X className="size-2.5" />}
    </span>
  );
}

