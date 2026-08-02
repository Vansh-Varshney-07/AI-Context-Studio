import type { OptimizationInput, OptimizationResult, OptimizationType } from "@/lib/optimizer/types";
import { BaseOptimizationEngine } from "./base";

export class ConcisenessOptimizationEngine extends BaseOptimizationEngine {
  readonly id = "conciseness";
  readonly name = "Conciseness Optimization";
  readonly description = "Reduces verbosity, removes filler words, compresses redundant phrases";
  readonly supportedTypes: OptimizationType[] = ["conciseness"];

  async performOptimization(input: OptimizationInput): Promise<{
    content: string;
    changes: Omit<OptimizationResult["changes"][0], "id">[];
  }> {
    let content = input.content;
    const changes: Omit<OptimizationResult["changes"][0], "id">[] = [];

    // Remove filler phrases
    const fillerPhrases = [
      { pattern: /\bin order to\b/gi, replacement: "to" },
      { pattern: /\bdue to the fact that\b/gi, replacement: "because" },
      { pattern: /\bat this point in time\b/gi, replacement: "now" },
      { pattern: /\bfor the purpose of\b/gi, replacement: "to" },
      { pattern: /\bin the event that\b/gi, replacement: "if" },
      { pattern: /\bwith the exception of\b/gi, replacement: "except" },
      { pattern: /\bit is important to note that\b/gi, replacement: "" },
      { pattern: /\bplease note that\b/gi, replacement: "" },
      { pattern: /\bit should be noted that\b/gi, replacement: "" },
      { pattern: /\bas a matter of fact\b/gi, replacement: "" },
    ];

    for (const { pattern, replacement } of fillerPhrases) {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        changes.push({
          type: "conciseness",
          severity: "minor",
          originalText: matches[0],
          optimizedText: replacement || "(removed)",
          explanation: `Removed filler phrase: "${matches[0]}"`,
          whyChanged: "Filler phrases add words without meaning",
          expectedImprovement: "More direct and concise",
          estimatedReasoningImprovement: "low",
          estimatedTokenSavings: "low",
          estimatedResponseQuality: "medium",
          confidence: 0.9,
        });
      }
    }

    // Remove redundant pairs
    const redundantPairs = [
      "each and every",
      "first and foremost",
      "full and complete",
      "true and accurate",
      "basic and fundamental",
      "final and ultimate",
      "past history",
      "future plans",
      "end result",
      "free gift",
    ];

    for (const pair of redundantPairs) {
      const words = pair.split(" ");
      if (words.length < 2) continue;
      const firstWord = words[0] ?? pair;
      const regex = new RegExp(`\\b${words[0]}\\s+and\\s+${words[1]}\\b`, "gi");
      if (regex.test(content)) {
        content = content.replace(regex, firstWord);
        changes.push({
          type: "conciseness",
          severity: "minor",
          originalText: pair,
          optimizedText: firstWord,
          explanation: `Reduced redundant pair: "${pair}" → "${firstWord}"`,
          whyChanged: "Redundant pairs use two words where one suffices",
          expectedImprovement: "More concise",
          estimatedReasoningImprovement: "low",
          estimatedTokenSavings: "low",
          estimatedResponseQuality: "medium",
          confidence: 0.85,
        });
      }
    }

    // Compress "there is/are" constructions
    content = content.replace(/\bthere (is|are|was|were)\s+([^.!?]+?)\s+that\b/gi, "$2");
    content = content.replace(/\bit is\s+([^.!?]+?)\s+that\b/gi, "$1");

    // Remove excessive hedging
    const hedgingPatterns = [
      /\b(i think|i believe|in my opinion|it seems|perhaps|maybe)\s*,?\s*/gi,
      /\b(probably|likely|possibly|potentially|presumably)\s+/gi,
    ];

    for (const pattern of hedgingPatterns) {
      content = content.replace(pattern, "");
    }

    // Tighten spacing
    content = content.replace(/\s{2,}/g, " ");
    content = content.replace(/\n{3,}/g, "\n\n");

    return { content, changes };
  }
}