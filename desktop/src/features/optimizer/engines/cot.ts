/**
 * Chain of Thought Engine
 * Improves reasoning through structured thinking.
 */

import { BaseOptimizationEngine } from "./base";
import type { OptimizationInput, OptimizationType } from "@/features/optimizer/types";

export class ChainOfThoughtEngine extends BaseOptimizationEngine {
  readonly id = "cot-engine";
  readonly name = "Chain of Thought Engine";
  readonly description = "Improves reasoning quality by adding structured step-by-step thinking.";
  readonly supportedTypes: OptimizationType[] = ["chain-of-thought"];

  protected async performOptimization(input: OptimizationInput): Promise<{
    optimizedPrompt: string;
    changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[];
    summary: { keyImprovements: string[]; remainingIssues: string[] };
  }> {
    const { content } = input;
    const changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[] = [];
    let optimizedPrompt = content;

    if (!/step.by.step|think|reason|chain.of.thought/i.test(content)) {
      const cotSection = `
## Chain of Thought Instructions

**Think step by step:**
1. Break down the problem into smaller parts
2. Show your reasoning for each step
3. Verify each step before proceeding
4. Provide the final answer clearly

**Format your response:**
- Start with "Let me think through this..."
- Show intermediate reasoning
- End with "Final answer: ..."
`;

      optimizedPrompt = content + cotSection;
      changes.push(this.createChange({
        type: "chain-of-thought",
        severity: "major",
        originalText: "(no CoT guidance)",
        optimizedText: "Added Chain of Thought instructions",
        explanation: "Added structured step-by-step reasoning guidance",
        whyChanged: "Models perform better with explicit reasoning structure",
        expectedImprovement: "Significantly better reasoning on complex tasks",
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

