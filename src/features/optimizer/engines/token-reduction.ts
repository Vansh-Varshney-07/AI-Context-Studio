/**
 * Token Reduction Engine
 * Reduces token usage while preserving meaning.
 */

import { BaseOptimizationEngine } from "./base";
import type { OptimizationInput, OptimizationType } from "@/features/optimizer/types";

export class TokenReductionEngine extends BaseOptimizationEngine {
  readonly id = "token-reduction";
  readonly name = "Token Reduction Engine";
  readonly description = "Reduces prompt token count while preserving essential meaning.";
  readonly supportedTypes: OptimizationType[] = ["token-reduction"];

  protected async performOptimization(input: OptimizationInput): Promise<{
    optimizedPrompt: string;
    changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[];
    summary: { keyImprovements: string[]; remainingIssues: string[] };
  }> {
    const { content } = input;
    const changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[] = [];
    let optimizedPrompt = content;

    const originalLength = content.length;
    let result = content;

    // Remove excessive whitespace
    result = result.replace(/\n{3,}/g, "\n\n");
    result = result.replace(/[ \t]+/g, " ");

    // Compress common phrases
    const compressions: Record<string, string> = {
      "in order to": "to",
      "due to the fact that": "because",
      "at this point in time": "now",
      "for the purpose of": "to",
      "with regard to": "about",
      "with respect to": "about",
      "in the event that": "if",
      "it is important to note that": "",
      "please note that": "",
      "it should be noted that": "",
    };

    for (const [from, to] of Object.entries(compressions)) {
      const regex = new RegExp(from, "gi");
      result = result.replace(regex, to);
    }

    // Remove redundant modifiers
    result = result.replace(/\b(very|really|quite|rather|fairly|somewhat|pretty)\s+/gi, "");

    const reduction = ((originalLength - result.length) / originalLength * 100).toFixed(1);

    if (reduction !== "0.0") {
      optimizedPrompt = result;
      changes.push(this.createChange({
        type: "token-reduction",
        severity: "moderate",
        originalText: `${originalLength} chars`,
        optimizedText: `${result.length} chars (${reduction}% reduction)`,
        explanation: `Compressed prompt by ${reduction}% through phrase compression and whitespace normalization`,
        whyChanged: "Token reduction directly reduces cost and latency",
        expectedImprovement: "Lower costs, faster responses, same meaning",
        estimatedReasoningImprovement: "low",
        estimatedTokenSavings: "high",
        estimatedResponseQuality: "high",
      }));
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
}