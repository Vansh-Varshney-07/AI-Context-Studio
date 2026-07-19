/**
 * Context Expansion Engine
 * Expands prompt context with relevant information.
 */

import { BaseOptimizationEngine } from "./base";
import type { OptimizationInput, OptimizationType } from "@/features/optimizer/types";

export class ContextExpansionEngine extends BaseOptimizationEngine {
  readonly id = "context-expansion";
  readonly name = "Context Expansion Engine";
  readonly description = "Expands prompts with relevant context, background information, and supporting details.";
  readonly supportedTypes: OptimizationType[] = ["context-expansion"];

  protected async performOptimization(input: OptimizationInput): Promise<{
    optimizedPrompt: string;
    changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[];
    summary: { keyImprovements: string[]; remainingIssues: string[] };
  }> {
    const { content } = input;
    const changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[] = [];
    let optimizedPrompt = content;

    if (!/context|background|relevant|related/i.test(content)) {
      const contextSection = `
## Context & Background

**Relevant Background:**
- This prompt relates to [specific domain/task]
- Key concepts: [list key terms]
- Prerequisites: [any required knowledge]
- Related topics: [cross-references]

**Assumptions:**
- User has basic familiarity with [topic]
- Standard tools available: [list]
- No special access required
`;

      optimizedPrompt = content + contextSection;
      changes.push(this.createChange({
        type: "context-expansion",
        severity: "moderate",
        originalText: "(no context provided)",
        optimizedText: "Added Context & Background section",
        explanation: "Added contextual background information",
        whyChanged: "Missing context leads to assumptions and errors",
        expectedImprovement: "Better grounded and accurate responses",
        estimatedReasoningImprovement: "high",
        estimatedTokenSavings: "low",
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