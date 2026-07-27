import type { EngineAnswers, EngineFieldId } from "../types";

/**
 * Pure formatting helpers shared by all blueprints. The engine RULE:
 * builders format values structured by the user — they never substitute
 * hardcoded sample content. Empty values mean missing sections, not
 * fabricated boilerplate.
 *
 * Each builder returns `null` when the consumed answers are empty, which
 * collapses the section out of the generated output cleanly.
 */

export function asString(
  answers: EngineAnswers,
  id: EngineFieldId,
): string | undefined {
  const value = answers[id];
  if (typeof value === "string") return value.trim() ? value.trim() : undefined;
  return undefined;
}

export function asStringArray(
  answers: EngineAnswers,
  id: EngineFieldId,
): string[] | undefined {
  const value = answers[id];
  if (Array.isArray(value)) {
    const cleaned = value.map((v) => v.trim()).filter(Boolean);
    return cleaned.length ? cleaned : undefined;
  }
  if (typeof value === "string") {
    const lines = value
      .split(/\r?\n/)
      .map((l) => l.replace(/^\s*[-*]\s*/, "").trim())
      .filter(Boolean);
    return lines.length ? lines : undefined;
  }
  return undefined;
}

export function asToggle(
  answers: EngineAnswers,
  id: EngineFieldId,
): boolean | undefined {
  const value = answers[id];
  return typeof value === "boolean" ? value : undefined;
}

/**
 * Format a section as "## Heading\n\n bodyLines\n\n".
 * Returns null if body is nullish or empty.
 */
export function section(heading: string, body: string | null): string | null {
  if (!body || !body.trim()) return null;
  return `## ${heading}\n\n${body.trim()}\n`;
}

/**
 * Format a list as bullet points.
 */
export function bullets(values: readonly string[]): string {
  return values.map((v) => `- ${v}`).join("\n");
}

/**
 * Format a labeled line — used for compact "Label: value" rows.
 */
export function labeled(label: string, value: string): string {
  return `**${label}:** ${value}`;
}

/**
 * Format a labeled bullet list — "Label:\n- a\n- b".
 */
export function labeledBullets(label: string, values: readonly string[]): string {
  if (!values.length) return "";
  return `**${label}:**\n${bullets(values)}`;
}

/** True if every id has a non-empty answer. */
export function everyPresent(
  answers: EngineAnswers,
  ids: readonly EngineFieldId[],
): boolean {
  return ids.every((id) => {
    const v = answers[id];
    return v !== undefined && !(typeof v === "string" && v.trim() === "")
      && !(Array.isArray(v) && v.length === 0);
  });
}

/** True if at least one of the ids has a non-empty answer. */
export function anyPresent(
  answers: EngineAnswers,
  ids: readonly EngineFieldId[],
): boolean {
  return ids.some((id) => {
    const v = answers[id];
    if (v === undefined) return false;
    if (typeof v === "string") return v.trim() !== "";
    if (Array.isArray(v)) return v.length > 0;
    return true;
  });
}

