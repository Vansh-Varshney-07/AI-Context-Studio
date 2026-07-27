/**
 * Reasoning Enhancement Engine
 * Improves reasoning quality and logical structure.
 */

import { BaseOptimizationEngine } from "./base";
import type { OptimizationInput, OptimizationType } from "@/features/optimizer/types";

export class ReasoningEngine extends BaseOptimizationEngine {
  readonly id = "reasoning-enhancement";
  readonly name = "Reasoning Enhancement Engine";
  readonly description = "Improves reasoning quality, depth, and logical structure.";
  readonly supportedTypes: OptimizationType[] = ["reasoning-enhancement"];

  protected async performOptimization(input: OptimizationInput): Promise<{
    optimizedPrompt: string;
    changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[];
    summary: { keyImprovements: string[]; remainingIssues: string[] };
  }> {
    const { content } = input;
    const changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[] = [];
    let optimizedPrompt = content;

    if (!/reason|logic|evidence|justify|conclude|infer|deduce/i.test(content)) {
      const reasonSection = `
## Reasoning Enhancement

**Logical Structure:**
- State premises explicitly
- Show intermediate conclusions
- Distinguish facts from assumptions
- Identify potential fallacies

**Evidence Requirements:**
- Cite sources for claims
- Quantify assertions
- Acknowledge uncertainty
- Provide confidence levels

**Verification:**
- Check logical consistency
- Validate against known facts
- Consider counterarguments
`;

      optimizedPrompt = content + reasonSection;
      changes.push(this.createChange({
        type: "reasoning-enhancement",
        severity: "major",
        originalText: "(no reasoning guidance)",
        optimizedText: "Added Reasoning Enhancement section",
        explanation: "Added structured reasoning and evidence requirements",
        whyChanged: "Unstructured reasoning leads to logical errors",
        expectedImprovement: "More rigorous and verifiable reasoning",
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

