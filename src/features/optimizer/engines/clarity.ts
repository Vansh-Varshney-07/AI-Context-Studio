/**
 * Clarity Optimization Engine
 * Improves prompt clarity, readability, and understandability.
 */

import { BaseOptimizationEngine } from "./base";
import type { OptimizationInput, OptimizationType } from "@/features/optimizer/types";

export class ClarityOptimizationEngine extends BaseOptimizationEngine {
  readonly id = "clarity-optimizer";
  readonly name = "Clarity Optimizer";
  readonly description = "Improves prompt clarity, readability, and understandability by removing ambiguity and improving structure.";
  readonly supportedTypes: OptimizationType[] = ["clarity"];

  protected async performOptimization(input: OptimizationInput): Promise<{
    optimizedPrompt: string;
    changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[];
    summary: { keyImprovements: string[]; remainingIssues: string[] };
  }> {
    const { content, options } = input;
    const changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[] = [];
    let optimizedPrompt = content;

    const improvements = [
      this.improveSentenceStructure(optimizedPrompt),
      this.removeAmbiguity(optimizedPrompt),
      this.improveWordChoice(optimizedPrompt),
      this.addStructure(optimizedPrompt),
      this.removeJargon(optimizedPrompt),
    ];

    for (const improvement of improvements) {
      if (improvement.applied) {
        optimizedPrompt = improvement.result;
        if (improvement.change) changes.push(improvement.change);
      }
    }

    return {
      optimizedPrompt,
      changes,
      summary: {
        keyImprovements: changes.map(c => c.explanation),
        remainingIssues: [],
      },
    };
  }

  private improveSentenceStructure(text: string): { applied: boolean; result: string; change: Omit<import("@/features/optimizer/types").OptimizationChange, "id"> | null } {
    let result = text;
    const originalText = text;

    const longSentences = result.match(/[^.!?]{100,}[.!?]/g);
    if (longSentences && longSentences.length > 0) {
      for (const sentence of longSentences) {
        const words = sentence.split(" ");
        if (words.length > 25) {
          const midpoint = Math.floor(words.length / 2);
          const newSentence = words.slice(0, midpoint).join(" ") + ". " + words.slice(midpoint).join(" ");
          result = result.replace(sentence, newSentence);
        }
      }
    }

    const passivePatterns = [
      /(\w+) (?:is|are|was|were|been) (\w+ed) (?:by|from) (\w+)/gi,
      /it (?:is|was) (\w+ed) (?:by|that) (\w+)/gi,
    ];

    for (const pattern of passivePatterns) {
      const matches = [...result.matchAll(pattern)];
      for (const match of matches) {
        if (match[3] && match[1]) {
          const active = `${match[3]} ${match[2]} ${match[1]}`;
          result = result.replace(match[0], active);
        }
      }
    }

    const applied = result !== originalText;
    return {
      applied,
      result,
      change: applied ? this.createChange({
        type: "clarity",
        severity: "moderate",
        originalText: originalText.slice(0, 200),
        optimizedText: result.slice(0, 200),
        explanation: "Improved sentence structure for better readability",
        whyChanged: "Long sentences and passive voice make prompts harder to understand",
        expectedImprovement: "Easier to read and follow instructions",
        estimatedReasoningImprovement: "medium",
        estimatedTokenSavings: "low",
        estimatedResponseQuality: "high",
      }) : null,
    };
  }

  private removeAmbiguity(text: string): { applied: boolean; result: string; change: Omit<import("@/features/optimizer/types").OptimizationChange, "id"> | null } {
    let result = text;
    const originalText = text;

    const ambiguousTerms: Record<string, string> = {
      "appropriate": "suitable",
      "relevant": "pertinent",
      "suitable": "appropriate",
      "as needed": "when necessary",
      "as appropriate": "where suitable",
      "etc.": "and so on",
      "and so on": "and other similar items",
      "various": "multiple",
      "several": "multiple",
      "many": "numerous",
      "few": "a small number of",
      "some": "certain",
      "certain": "specific",
    };

    for (const [term, replacement] of Object.entries(ambiguousTerms)) {
      const regex = new RegExp(`\\b${term}\\b`, "gi");
      if (regex.test(result)) {
        result = result.replace(regex, replacement);
      }
    }

    const vagueQuantifiers = [
      { pattern: /\ba lot of\b/gi, replacement: "many" },
      { pattern: /\bplenty of\b/gi, replacement: "many" },
      { pattern: /\bheaps of\b/gi, replacement: "many" },
    ];

    for (const { pattern, replacement } of vagueQuantifiers) {
      result = result.replace(pattern, replacement);
    }

    const applied = result !== originalText;
    return {
      applied,
      result,
      change: applied ? this.createChange({
        type: "clarity",
        severity: "moderate",
        originalText: originalText.slice(0, 200),
        optimizedText: result.slice(0, 200),
        explanation: "Replaced ambiguous terms with precise alternatives",
        whyChanged: "Ambiguous language leads to inconsistent interpretations",
        expectedImprovement: "More predictable and consistent AI responses",
        estimatedReasoningImprovement: "high",
        estimatedTokenSavings: "low",
        estimatedResponseQuality: "high",
      }) : null,
    };
  }

  private improveWordChoice(text: string): { applied: boolean; result: string; change: Omit<import("@/features/optimizer/types").OptimizationChange, "id"> | null } {
    let result = text;
    const originalText = text;

    const wordReplacements: Record<string, string> = {
      "utilize": "use",
      "facilitate": "help",
      "implement": "build",
      "leverage": "use",
      "optimize": "improve",
      "enhance": "improve",
      "furthermore": "also",
      "additionally": "also",
      "consequently": "so",
      "subsequently": "then",
      "prior to": "before",
      "subsequent to": "after",
      "in order to": "to",
      "with the exception of": "except",
      "in the event that": "if",
      "at this point in time": "now",
    };

    for (const [from, to] of Object.entries(wordReplacements)) {
      const regex = new RegExp(`\\b${from}\\b`, "gi");
      result = result.replace(regex, to);
    }

    const applied = result !== originalText;
    return {
      applied,
      result,
      change: applied ? this.createChange({
        type: "clarity",
        severity: "minor",
        originalText: originalText.slice(0, 200),
        optimizedText: result.slice(0, 200),
        explanation: "Simplified complex words for better readability",
        whyChanged: "Simple words are universally understood",
        expectedImprovement: "Clearer instructions for all model capabilities",
        estimatedReasoningImprovement: "low",
        estimatedTokenSavings: "low",
        estimatedResponseQuality: "medium",
      }) : null,
    };
  }

  private addStructure(text: string): { applied: boolean; result: string; change: Omit<import("@/features/optimizer/types").OptimizationChange, "id"> | null } {
    let result = text;
    const originalText = text;

    if (!/^#+\s/.test(result.trim()) && result.length > 100) {
      result = "# Instructions\n\n" + result;
    }

    if (!/\n\n##\s/.test(result) && result.includes("\n\n")) {
      result = result.replace(/\n\n([A-Z][a-z]+:)/g, "\n\n## $1");
    }

    const applied = result !== originalText;
    return {
      applied,
      result,
      change: applied ? this.createChange({
        type: "clarity",
        severity: "moderate",
        originalText: originalText.slice(0, 200),
        optimizedText: result.slice(0, 200),
        explanation: "Added document structure with headings",
        whyChanged: "Structured prompts are easier for models to parse",
        expectedImprovement: "Better instruction following through clear hierarchy",
        estimatedReasoningImprovement: "high",
        estimatedTokenSavings: "low",
        estimatedResponseQuality: "high",
      }) : null,
    };
  }

  private removeJargon(text: string): { applied: boolean; result: string; change: Omit<import("@/features/optimizer/types").OptimizationChange, "id"> | null } {
    let result = text;
    const originalText = text;

    const jargonTerms = [
      "paradigm", "synergy", "holistic", "granular", "scalable", 
      "robust", "seamless", "actionable", "bandwidth", "low-hanging fruit",
      "move the needle", "drill down", "circle back", "touch base",
    ];

    for (const term of jargonTerms) {
      const regex = new RegExp(`\\b${term}\\b`, "gi");
      if (regex.test(result)) {
        result = result.replace(regex, "");
      }
    }

    const applied = result !== originalText;
    return {
      applied,
      result,
      change: applied ? this.createChange({
        type: "clarity",
        severity: "minor",
        originalText: originalText.slice(0, 200),
        optimizedText: result.slice(0, 200),
        explanation: "Removed corporate jargon and buzzwords",
        whyChanged: "Jargon can confuse models and reduce clarity",
        expectedImprovement: "More direct and actionable instructions",
        estimatedReasoningImprovement: "low",
        estimatedTokenSavings: "low",
        estimatedResponseQuality: "medium",
      }) : null,
    };
  }
}