import type { OptimizationInput, OptimizationResult, OptimizationType } from "@/lib/optimizer/types";
import { BaseOptimizationEngine } from "./base";

export class TokenReductionEngine extends BaseOptimizationEngine {
  readonly id = "token-reduction";
  readonly name = "Token Reduction";
  readonly description = "Compresses prompts while preserving meaning to reduce token usage";
  readonly supportedTypes: OptimizationType[] = ["token-reduction"];

  async performOptimization(input: OptimizationInput): Promise<{
    content: string;
    changes: Omit<OptimizationResult["changes"][0], "id">[];
  }> {
    let content = input.content;
    const changes: Omit<OptimizationResult["changes"][0], "id">[] = [];

    // Remove excessive politeness
    const politenessPatterns = [
      /\bplease\s+/gi,
      /\bkindly\s+/gi,
      /\bwould you (please\s+)?/gi,
      /\bcould you (please\s+)?/gi,
      /\bthank you\s*[,!]?\s*/gi,
      /\bthanks\s*[,!]?\s*/gi,
    ];

    for (const pattern of politenessPatterns) {
      content = content.replace(pattern, "");
    }

    // Compress verbose transitions
    const transitions = [
      { from: /\badditionally\b/gi, to: "also" },
      { from: /\bfurthermore\b/gi, to: "also" },
      { from: /\bmoreover\b/gi, to: "also" },
      { from: /\bconsequently\b/gi, to: "so" },
      { from: /\bnevertheless\b/gi, to: "but" },
      { from: /\baccordingly\b/gi, to: "so" },
      { from: /\bsubsequently\b/gi, to: "then" },
    ];

    for (const { from, to } of transitions) {
      content = content.replace(from, to);
    }

    // Remove redundant "the" before proper nouns
    content = content.replace(/\bthe\s+(React|TypeScript|Python|JavaScript|Node|API|UI|UX|CSS|HTML|SQL|JSON|YAML)\b/gi, "$1");

    // Compress "make sure to" / "ensure that"
    content = content.replace(/\b(make sure to|ensure that)\s+/gi, "");

    // Shorten "in order to" -> "to"
    content = content.replace(/\bin order to\b/gi, "to");

    // Remove "I want you to" / "I need you to"
    content = content.replace(/\b(i want you to|i need you to|i would like you to)\s+/gi, "");

    return { content, changes };
  }
}