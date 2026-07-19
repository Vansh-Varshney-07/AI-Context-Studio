/**
 * Memory Strategy Engine
 * Optimizes memory usage patterns in prompts.
 */

import { BaseOptimizationEngine } from "./base";
import type { OptimizationInput, OptimizationType } from "@/features/optimizer/types";

export class MemoryStrategyEngine extends BaseOptimizationEngine {
  readonly id = "memory-strategy";
  readonly name = "Memory Strategy Engine";
  readonly description = "Optimizes prompts for effective memory and context management.";
  readonly supportedTypes: OptimizationType[] = ["memory-usage"];

  protected async performOptimization(input: OptimizationInput): Promise<{
    optimizedPrompt: string;
    changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[];
    summary: { keyImprovements: string[]; remainingIssues: string[] };
  }> {
    const { content } = input;
    const changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[] = [];
    let optimizedPrompt = content;

    if (!/memory|context|recall|remember|forget|retention/i.test(content)) {
      const memorySection = `
## Memory Strategy

**Context Management:**
- Define what to remember across turns
- Set retention policies
- Specify forget triggers

**Memory Types:**
- Short-term: current conversation
- Long-term: persistent facts/preferences
- Working memory: active task state

**Operations:**
- Store: [what, when, how]
- Retrieve: [query, relevance, limit]
- Forget: [conditions, schedule]
`;

      optimizedPrompt = content + memorySection;
      changes.push(this.createChange({
        type: "memory-usage",
        severity: "moderate",
        originalText: "(no memory strategy)",
        optimizedText: "Added Memory Strategy section",
        explanation: "Defined memory management and context retention",
        whyChanged: "Poor memory management loses context",
        expectedImprovement: "Consistent context across long conversations",
        estimatedReasoningImprovement: "medium",
        estimatedTokenSavings: "medium",
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