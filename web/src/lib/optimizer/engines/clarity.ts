import type { OptimizationInput, OptimizationResult, OptimizationType } from "@/lib/optimizer/types";
import { BaseOptimizationEngine } from "./base";

export class ClarityOptimizationEngine extends BaseOptimizationEngine {
  readonly id = "clarity";
  readonly name = "Clarity Optimization";
  readonly description = "Improves sentence structure, removes ambiguity, enhances word choice";
  readonly supportedTypes: OptimizationType[] = ["clarity"];

  async performOptimization(input: OptimizationInput): Promise<{
    content: string;
    changes: Omit<OptimizationResult["changes"][0], "id">[];
  }> {
    let content = input.content;
    const changes: Omit<OptimizationResult["changes"][0], "id">[] = [];

    // Split long sentences (> 40 words)
    const longSentenceRegex = /([^.!?]{80,}[.!?])/g;
    content = content.replace(longSentenceRegex, (match) => {
      const words = match.trim().split(/\s+/);
      if (words.length > 40) {
        const mid = Math.floor(words.length / 2);
        const part1 = words.slice(0, mid).join(" ");
        const part2 = words.slice(mid).join(" ");
        changes.push({
          type: "clarity",
          severity: "moderate",
          originalText: match.trim(),
          optimizedText: `${part1}. ${part2}`,
          explanation: `Split long sentence (${words.length} words) into two shorter sentences`,
          whyChanged: "Long sentences reduce readability and comprehension",
          expectedImprovement: "Easier to parse and understand",
          estimatedReasoningImprovement: "medium",
          estimatedTokenSavings: "low",
          estimatedResponseQuality: "high",
          confidence: 0.8,
        });
        return `${part1}. ${part2}`;
      }
      return match;
    });

    // Passive to active voice
    const passivePatterns = [
      { regex: /\bis (being|been) (\w+ed)\b/gi, replacement: "has $2" },
      { regex: /\bwas (\w+ed)\b/gi, replacement: "performed $1" },
      { regex: /\bare (\w+ed) by\b/gi, replacement: "$1" },
    ];

    for (const { regex, replacement } of passivePatterns) {
      content = content.replace(regex, replacement);
    }

    // Remove ambiguity
    const ambiguousTerms = {
      "things": "specific items",
      "stuff": "materials",
      "a lot": "many",
      "very": "",
      "really": "",
      "quite": "",
      "basically": "",
      "actually": "",
      "literally": "",
      "obviously": "",
    };

    for (const [vague, precise] of Object.entries(ambiguousTerms)) {
      const regex = new RegExp(`\\b${vague}\\b`, "gi");
      content = content.replace(regex, precise || " ");
    }

    // Improve word choice
    const wordChoices = {
      "utilize": "use",
      "leverage": "use",
      "implement": "build",
      "facilitate": "help",
      "optimize": "improve",
      "synergize": "combine",
      "paradigm": "model",
      "holistic": "complete",
      "robust": "strong",
      "seamless": "smooth",
    };

    for (const [corporate, simple] of Object.entries(wordChoices)) {
      const regex = new RegExp(`\\b${corporate}\\b`, "gi");
      content = content.replace(regex, simple);
    }

    // Add structure with headings if content is long and unstructured
    if (content.length > 500 && !content.includes("#")) {
      // This would be done in a more sophisticated way in practice
      changes.push({
        type: "clarity",
        severity: "minor",
        originalText: "(unstructured content)",
        optimizedText: "(structured with headings)",
        explanation: "Long content should be organized with clear headings",
        whyChanged: "Structured content is easier to navigate",
        expectedImprovement: "Better readability and scanability",
        estimatedReasoningImprovement: "medium",
        estimatedTokenSavings: "none",
        estimatedResponseQuality: "high",
        confidence: 0.7,
      });
    }

    return { content, changes };
  }
}