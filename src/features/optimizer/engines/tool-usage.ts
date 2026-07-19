/**
 * Tool Usage Engine
 * Optimizes tool calling patterns.
 */

import { BaseOptimizationEngine } from "./base";
import type { OptimizationInput, OptimizationType } from "@/features/optimizer/types";

export class ToolUsageEngine extends BaseOptimizationEngine {
  readonly id = "tool-usage";
  readonly name = "Tool Usage Engine";
  readonly description = "Optimizes prompts for effective tool and function calling.";
  readonly supportedTypes: OptimizationType[] = ["tool-usage"];

  protected async performOptimization(input: OptimizationInput): Promise<{
    optimizedPrompt: string;
    changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[];
    summary: { keyImprovements: string[]; remainingIssues: string[] };
  }> {
    const { content } = input;
    const changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[] = [];
    let optimizedPrompt = content;

    if (!/tool|function|api|call|invoke|parameter|schema/i.test(content)) {
      const toolSection = `
## Tool Usage

**Available Tools:**
- Define each tool with: name, description, parameters, return type

**Calling Pattern:**
1. Identify needed tool
2. Validate required parameters
3. Execute with structured call
4. Parse and validate response
5. Handle errors gracefully

**Best Practices:**
- Batch independent calls
- Cache deterministic results
- Use streaming for long operations
- Validate outputs before use
`;

      optimizedPrompt = content + toolSection;
      changes.push(this.createChange({
        type: "tool-usage",
        severity: "moderate",
        originalText: "(no tool guidance)",
        optimizedText: "Added Tool Usage section",
        explanation: "Added tool calling conventions and best practices",
        whyChanged: "Unstructured tool usage causes errors and inefficiency",
        expectedImprovement: "Reliable, efficient tool orchestration",
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