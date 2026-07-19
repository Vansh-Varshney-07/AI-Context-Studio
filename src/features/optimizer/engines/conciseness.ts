/**
 * Conciseness Optimization Engine
 * Reduces prompt length while preserving meaning.
 */

import { BaseOptimizationEngine } from "./base";
import type { OptimizationInput, OptimizationType } from "@/features/optimizer/types";

export class ConcisenessOptimizationEngine extends BaseOptimizationEngine {
  readonly id = "conciseness-optimizer";
  readonly name = "Conciseness Optimizer";
  readonly description = "Reduces prompt length while preserving meaning and intent.";
  readonly supportedTypes: OptimizationType[] = ["conciseness"];

  protected async performOptimization(input: OptimizationInput): Promise<{
    optimizedPrompt: string;
    changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[];
    summary: { keyImprovements: string[]; remainingIssues: string[] };
  }> {
    const { content } = input;
    const changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[] = [];
    let optimizedPrompt = content;

    const improvements = [
      this.removeRedundancy(optimizedPrompt),
      this.removeFillerWords(optimizedPrompt),
      this.condensePhrases(optimizedPrompt),
      this.removeRepetition(optimizedPrompt),
      this.combineSentences(optimizedPrompt),
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

  private removeRedundancy(text: string): { applied: boolean; result: string; change: Omit<import("@/features/optimizer/types").OptimizationChange, "id"> | null } {
    let result = text;
    const originalText = text;

    // Remove redundant phrases
    const redundantPatterns = [
      { pattern: /\bin order to\b/gi, replacement: "to" },
      { pattern: /\bdue to the fact that\b/gi, replacement: "because" },
      { pattern: /\bat this point in time\b/gi, replacement: "now" },
      { pattern: /\bfor the purpose of\b/gi, replacement: "to" },
      { pattern: /\bin the event that\b/gi, replacement: "if" },
      { pattern: /\bwith regard to\b/gi, replacement: "about" },
      { pattern: /\bwith respect to\b/gi, replacement: "about" },
      { pattern: /\bwith the exception of\b/gi, replacement: "except" },
      { pattern: /\bmake a decision\b/gi, replacement: "decide" },
      { pattern: /\bgive consideration to\b/gi, replacement: "consider" },
      { pattern: /\btake into account\b/gi, replacement: "consider" },
      { pattern: /\bprovide assistance\b/gi, replacement: "help" },
      { pattern: /\bperform an analysis\b/gi, replacement: "analyze" },
    ];

    for (const { pattern, replacement } of redundantPatterns) {
      result = result.replace(pattern, replacement);
    }

    const applied = result !== originalText;
    return {
      applied,
      result,
      change: applied ? this.createChange({
        type: "conciseness",
        severity: "moderate",
        originalText: originalText.slice(0, 200),
        optimizedText: result.slice(0, 200),
        explanation: "Removed redundant phrases and wordy expressions",
        whyChanged: "Redundant phrases waste tokens and reduce clarity",
        expectedImprovement: "More concise prompts with same meaning",
        estimatedReasoningImprovement: "low",
        estimatedTokenSavings: "medium",
        estimatedResponseQuality: "high",
      }) : null,
    };
  }

  private removeFillerWords(text: string): { applied: boolean; result: string; change: Omit<import("@/features/optimizer/types").OptimizationChange, "id"> | null } {
    let result = text;
    const originalText = text;

    const fillerWords = [
      "basically", "actually", "literally", "essentially", "virtually",
      "pretty much", "kind of", "sort of", "just", "really", "very",
      "quite", "rather", "somewhat", "fairly", "generally", "usually",
      "typically", "often", "usually", "in general", "on the whole",
    ];

    for (const word of fillerWords) {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      result = result.replace(regex, "");
    }

    // Clean up double spaces
    result = result.replace(/\s{2,}/g, " ").replace(/\s+([.,;:!?])/g, "$1");

    const applied = result !== originalText;
    return {
      applied,
      result,
      change: applied ? this.createChange({
        type: "conciseness",
        severity: "minor",
        originalText: originalText.slice(0, 200),
        optimizedText: result.slice(0, 200),
        explanation: "Removed filler words and hedging language",
        whyChanged: "Filler words add tokens without adding meaning",
        expectedImprovement: "More direct and token-efficient prompts",
        estimatedReasoningImprovement: "low",
        estimatedTokenSavings: "medium",
        estimatedResponseQuality: "medium",
      }) : null,
    };
  }

  private condensePhrases(text: string): { applied: boolean; result: string; change: Omit<import("@/features/optimizer/types").OptimizationChange, "id"> | null } {
    let result = text;
    const originalText = text;

    const condensations: Record<string, string> = {
      "a large number of": "many",
      "a small number of": "few",
      "is able to": "can",
      "has the ability to": "can",
      "is capable of": "can",
      "make use of": "use",
      "put to use": "use",
      "take into consideration": "consider",
      "come to the conclusion": "conclude",
      "reach a decision": "decide",
      "provide guidance": "guide",
      "offer suggestions": "suggest",
      "give instructions": "instruct",
      "make sure": "ensure",
      "it is important to": "must",
      "it is necessary to": "must",
      "it is recommended to": "should",
    };

    for (const [from, to] of Object.entries(condensations)) {
      const regex = new RegExp(from, "gi");
      result = result.replace(regex, to);
    }

    const applied = result !== originalText;
    return {
      applied,
      result,
      change: applied ? this.createChange({
        type: "conciseness",
        severity: "moderate",
        originalText: originalText.slice(0, 200),
        optimizedText: result.slice(0, 200),
        explanation: "Condensed verbose phrases to concise alternatives",
        whyChanged: "Verbose phrases use more tokens without adding value",
        expectedImprovement: "Significant token reduction with same meaning",
        estimatedReasoningImprovement: "low",
        estimatedTokenSavings: "high",
        estimatedResponseQuality: "high",
      }) : null,
    };
  }

  private removeRepetition(text: string): { applied: boolean; result: string; change: Omit<import("@/features/optimizer/types").OptimizationChange, "id"> | null } {
    let result = text;
    const originalText = text;

    // Remove duplicate consecutive words
    result = result.replace(/\b(\w+)\s+\1\b/gi, "$1");

    // Remove duplicate sentences
    const sentences = result.split(/([.!?]+)/);
    const seen = new Set<string>();
    const filtered: string[] = [];
    
    for (let i = 0; i < sentences.length; i += 2) {
      const sentence = (sentences[i] + (sentences[i + 1] || "")).trim();
      const normalized = sentence.toLowerCase();
      if (!seen.has(normalized) && sentence.length > 10) {
        seen.add(normalized);
        filtered.push(sentence);
      }
    }
    
    result = filtered.join(" ");

    const applied = result !== originalText;
    return {
      applied,
      result,
      change: applied ? this.createChange({
        type: "conciseness",
        severity: "minor",
        originalText: originalText.slice(0, 200),
        optimizedText: result.slice(0, 200),
        explanation: "Removed repetitive words and sentences",
        whyChanged: "Repetition wastes tokens and can confuse models",
        expectedImprovement: "Cleaner, more efficient prompts",
        estimatedReasoningImprovement: "low",
        estimatedTokenSavings: "medium",
        estimatedResponseQuality: "medium",
      }) : null,
    };
  }

  private combineSentences(text: string): { applied: boolean; result: string; change: Omit<import("@/features/optimizer/types").OptimizationChange, "id"> | null } {
    let result = text;
    const originalText = text;

    // Combine short related sentences
    result = result.replace(/(\w+)\. (\w+) (?:is|are|has|have|can|will|should|must) /gi, "$1. $2, which ");

    const applied = result !== originalText;
    return {
      applied,
      result,
      change: applied ? this.createChange({
        type: "conciseness",
        severity: "minor",
        originalText: originalText.slice(0, 200),
        optimizedText: result.slice(0, 200),
        explanation: "Combined short related sentences",
        whyChanged: "Short choppy sentences can be combined for better flow",
        expectedImprovement: "Smoother reading with fewer tokens",
        estimatedReasoningImprovement: "low",
        estimatedTokenSavings: "low",
        estimatedResponseQuality: "medium",
      }) : null,
    };
  }
}