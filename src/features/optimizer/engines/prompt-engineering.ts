/**
 * Prompt Engineering Engine
 * Applies best practices from prompt engineering.
 */

import { BaseOptimizationEngine } from "./base";
import type { OptimizationInput, OptimizationType } from "@/features/optimizer/types";

export class PromptEngineeringEngine extends BaseOptimizationEngine {
  readonly id = "prompt-engineering";
  readonly name = "Prompt Engineering Engine";
  readonly description = "Applies prompt engineering best practices and patterns.";
  readonly supportedTypes: OptimizationType[] = ["prompt-engineering"];

  protected async performOptimization(input: OptimizationInput): Promise<{
    optimizedPrompt: string;
    changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[];
    summary: { keyImprovements: string[]; remainingIssues: string[] };
  }> {
    const { content } = input;
    const changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[] = [];
    let optimizedPrompt = content;

    if (!/few.shot|example|persona|role|template|pattern|zero.shot|chain.of.thought/i.test(content)) {
      const peSection = `
## Prompt Engineering Best Practices

**Role & Persona:**
- Define clear role/expertise
- Specify communication style
- Set authority boundaries

**Few-Shot Examples:**
- 3-5 diverse examples
- Show input→output pairs
- Include edge cases

**Structuring:**
- Separate instructions from data
- Use delimiters (---, ===, ###)
- Consistent formatting

**Techniques:**
- Chain of Thought for reasoning
- Self-consistency for reliability
- Tree of Thoughts for planning
`;

      optimizedPrompt = content + peSection;
      changes.push(this.createChange({
        type: "prompt-engineering",
        severity: "major",
        originalText: "(no prompt engineering patterns)",
        optimizedText: "Added Prompt Engineering Best Practices",
        explanation: "Applied prompt engineering patterns and best practices",
        whyChanged: "Well-engineered prompts dramatically improve quality",
        expectedImprovement: "Significantly better adherence and output quality",
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