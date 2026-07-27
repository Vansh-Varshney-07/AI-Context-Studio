/**
 * Safety Optimization Engine
 * Improves safety constraints and guardrails.
 */

import { BaseOptimizationEngine } from "./base";
import type { OptimizationInput, OptimizationType } from "@/features/optimizer/types";

export class SafetyOptimizationEngine extends BaseOptimizationEngine {
  readonly id = "safety-optimizer";
  readonly name = "Safety Optimizer";
  readonly description = "Improves safety constraints, guardrails, and ethical boundaries.";
  readonly supportedTypes: OptimizationType[] = ["safety"];

  protected async performOptimization(input: OptimizationInput): Promise<{
    optimizedPrompt: string;
    changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[];
    summary: { keyImprovements: string[]; remainingIssues: string[] };
  }> {
    const { content } = input;
    const changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[] = [];
    let optimizedPrompt = content;

    if (!/safety|harm|ethical|refuse|prohibited|illegal|dangerous/i.test(content)) {
      const safetySection = `
## Safety & Ethics

**Prohibited:**
- Illegal activities or instructions
- Harmful content generation
- PII exposure or privacy violations
- Medical/legal/financial advice
- Weapons or dangerous information

**Refusal Protocol:**
- Decline clearly and directly
- Explain refusal reason
- Offer safe alternatives
- Don't lecture or preach

**Monitoring:**
- Flag uncertain outputs
- Escalate ambiguous requests
- Log safety incidents
`;

      optimizedPrompt = content + safetySection;
      changes.push(this.createChange({
        type: "safety",
        severity: "major",
        originalText: "(no safety guidelines)",
        optimizedText: "Added Safety & Ethics section",
        explanation: "Added comprehensive safety constraints and refusal protocols",
        whyChanged: "Missing safety guards enable harmful outputs",
        expectedImprovement: "Robust protection against misuse and harm",
        estimatedReasoningImprovement: "medium",
        estimatedTokenSavings: "none",
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

