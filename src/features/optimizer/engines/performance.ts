/**
 * Performance Optimization Engine
 * Optimizes for response speed and computational efficiency.
 */

import { BaseOptimizationEngine } from "./base";
import type { OptimizationInput, OptimizationType } from "@/features/optimizer/types";

export class PerformanceOptimizationEngine extends BaseOptimizationEngine {
  readonly id = "performance-optimizer";
  readonly name = "Performance Optimizer";
  readonly description = "Optimizes prompts for faster response times and efficient processing.";
  readonly supportedTypes: OptimizationType[] = ["performance-optimization"];

  protected async performOptimization(input: OptimizationInput): Promise<{
    optimizedPrompt: string;
    changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[];
    summary: { keyImprovements: string[]; remainingIssues: string[] };
  }> {
    const { content } = input;
    const changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[] = [];
    let optimizedPrompt = content;

    if (!/performance|speed|fast|efficient|latency|optimize/i.test(content)) {
      const perfSection = `
## Performance Optimization

**Speed Guidelines:**
- Limit context to essential information
- Use concise, direct instructions
- Avoid redundant examples
- Set appropriate max_tokens

**Efficiency:**
- Enable streaming for long responses
- Batch independent sub-tasks
- Cache deterministic computations
`;

      optimizedPrompt = content + perfSection;
      changes.push(this.createChange({
        type: "performance-optimization",
        severity: "moderate",
        originalText: "(no performance guidance)",
        optimizedText: "Added Performance Optimization section",
        explanation: "Added performance and latency optimization guidance",
        whyChanged: "Unoptimized prompts cause slow responses",
        expectedImprovement: "Faster response times with lower latency",
        estimatedReasoningImprovement: "low",
        estimatedTokenSavings: "high",
        estimatedResponseQuality: "medium",
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