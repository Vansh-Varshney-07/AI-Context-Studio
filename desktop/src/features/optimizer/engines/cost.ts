/**
 * Cost Optimization Engine
 * Optimizes for cost efficiency and token usage.
 */

import { BaseOptimizationEngine } from "./base";
import type { OptimizationInput, OptimizationType } from "@/features/optimizer/types";

export class CostOptimizationEngine extends BaseOptimizationEngine {
  readonly id = "cost-optimizer";
  readonly name = "Cost Optimizer";
  readonly description = "Optimizes prompts for cost efficiency and token usage.";
  readonly supportedTypes: OptimizationType[] = ["cost-optimization"];

  protected async performOptimization(input: OptimizationInput): Promise<{
    optimizedPrompt: string;
    changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[];
    summary: { keyImprovements: string[]; remainingIssues: string[] };
  }> {
    const { content } = input;
    const changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[] = [];
    let optimizedPrompt = content;

    if (!/model|token|cost|budget|pricing/i.test(content)) {
      const costSection = `
## Cost Optimization

**Model Selection:**
- Simple tasks: gpt-4o-mini, claude-3-haiku
- Complex reasoning: gpt-4o, claude-3-opus
- Code: deepseek-coder, gpt-4o

**Token Management:**
- Set max_output_tokens explicitly
- Use stop sequences
- Avoid unnecessary verbosity

**Caching:**
- Cache deterministic results
- Hash prompts for cache keys
- Set appropriate TTL

**Batching:**
- Group similar requests
- Use parallel execution
`;

      optimizedPrompt = content + costSection;
      changes.push(this.createChange({
        type: "cost-optimization",
        severity: "moderate",
        originalText: "(no cost guidance)",
        optimizedText: "Added Cost Optimization section",
        explanation: "Added cost-aware model selection and token management",
        whyChanged: "Unoptimized prompts can cost 100x more",
        expectedImprovement: "Significant cost reduction with maintained quality",
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

