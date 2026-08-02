"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { EngineField } from "@/lib/engine";

type EngineAnswers = Record<string, string | string[] | boolean | undefined>;

// Minimal blueprint type that only requires what BlueprintForm needs
interface BlueprintFormBlueprint {
  sections: Array<{ id: string; heading: string; consumes: readonly string[] }>;
}

interface BlueprintFormProps {
  blueprint: BlueprintFormBlueprint;
  fields: readonly EngineField[];
  answers: EngineAnswers;
  onChange: (fieldId: string, value: string | string[] | boolean) => void;
  isGenerating: boolean;
}

export function BlueprintForm({ blueprint, fields, answers, onChange, isGenerating }: BlueprintFormProps) {
  const visibleFields = useMemo(() => {
    const consumedIds = new Set(blueprint.sections.flatMap((s) => s.consumes));
    return fields.filter((f) => consumedIds.has(f.id));
  }, [blueprint, fields]);

  if (visibleFields.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-[var(--color-text-secondary)]">No fields required for this blueprint.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {visibleFields.map((field) => {
        const value = answers[field.id];
        const isRequired = field.required;

        const renderInput = () => {
          switch (field.kind) {
            case "text":
              return (
                <Input
                  id={field.id}
                  placeholder={field.placeholder}
                  value={(value as string) || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(field.id, e.target.value)}
                  disabled={isGenerating}
                  required={isRequired}
                  aria-describedby={field.help ? `${field.id}-help` : undefined}
                />
              );
            case "textarea":
              return (
                <Textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  value={(value as string) || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(field.id, e.target.value)}
                  disabled={isGenerating}
                  required={isRequired}
                  rows={4}
                  aria-describedby={field.help ? `${field.id}-help` : undefined}
                />
              );
            case "select":
              return (
                <Select
                  value={(value as string) || ""}
                  onValueChange={(v: string) => onChange(field.id, v)}
                  disabled={isGenerating}
                  required={isRequired}
                >
                  <SelectTrigger aria-describedby={field.help ? `${field.id}-help` : undefined}>
                    <SelectValue placeholder={field.placeholder || "Select..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt) => (
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
                  {field.options?.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={Array.isArray(value) && value.includes(opt)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const arr = (Array.isArray(value) ? value : []);
                          onChange(
                            field.id,
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(field.id, e.target.checked)}
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
          <Card className="p-4" key={field.id}>
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <Label htmlFor={field.id} className="text-sm font-medium text-[var(--color-text-primary)]">
                  {field.label}
                  {isRequired && <span className="text-[var(--color-accent)] ml-1">*</span>}
                </Label>
              </div>
              {field.help && (
                <p id={`${field.id}-help`} className="text-xs text-[var(--color-text-muted)]">
                  {field.help}
                </p>
              )}
              <div>{renderInput()}</div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}