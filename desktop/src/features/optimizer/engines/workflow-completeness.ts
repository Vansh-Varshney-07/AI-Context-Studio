/**
 * Workflow Completeness Engine
 * Ensures multi-step workflows are complete.
 */

import { BaseOptimizationEngine } from "./base";
import type { OptimizationInput, OptimizationType } from "@/features/optimizer/types";

export class WorkflowCompletenessEngine extends BaseOptimizationEngine {
  readonly id = "workflow-completeness";
  readonly name = "Workflow Completeness Engine";
  readonly description = "Ensures multi-step workflows are complete, ordered, and well-defined.";
  readonly supportedTypes: OptimizationType[] = ["workflow-completeness"];

  protected async performOptimization(input: OptimizationInput): Promise<{
    optimizedPrompt: string;
    changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[];
    summary: { keyImprovements: string[]; remainingIssues: string[] };
  }> {
    const { content } = input;
    const changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[] = [];
    let optimizedPrompt = content;

    if (!/step|phase|stage|workflow|sequence|order|step\s*\d/i.test(content)) {
      const workflowSection = `
## Workflow Definition

**Steps:**
1. [First step - input, action, output]
2. [Second step - depends on step 1]
3. [Continue for all steps...]

**Dependencies:**
- Step N requires output from Step M
- Parallel: [steps that can run together]

**Validation:**
- Success criteria per step
- Error handling per step
- Rollback procedures
`;

      optimizedPrompt = content + workflowSection;
      changes.push(this.createChange({
        type: "workflow-completeness",
        severity: "major",
        originalText: "(no workflow structure)",
        optimizedText: "Added Workflow Definition section",
        explanation: "Added explicit multi-step workflow with dependencies",
        whyChanged: "Implicit workflows lead to missed steps and errors",
        expectedImprovement: "Complete, executable multi-step processes",
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

