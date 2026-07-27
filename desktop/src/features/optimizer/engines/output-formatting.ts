/**
 * Output Formatting Engine
 * Improves output structure and formatting specifications.
 */

import { BaseOptimizationEngine } from "./base";
import type { OptimizationInput, OptimizationType } from "@/features/optimizer/types";

export class OutputFormattingEngine extends BaseOptimizationEngine {
  readonly id = "output-formatting";
  readonly name = "Output Formatting Engine";
  readonly description = "Improves output format specifications and structure.";
  readonly supportedTypes: OptimizationType[] = ["output-formatting"];

  protected async performOptimization(input: OptimizationInput): Promise<{
    optimizedPrompt: string;
    changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[];
    summary: { keyImprovements: string[]; remainingIssues: string[] };
  }> {
    const { content } = input;
    const changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[] = [];
    let optimizedPrompt = content;

    if (!/format|structure|output|json|markdown|table|list/i.test(content)) {
      const formatSection = `
## Output Format

**Required Format:** [JSON / Markdown / Plain Text / YAML / Custom]

**Structure:**
- Field 1: [type, description, required?]
- Field 2: [type, description, required?]

**Example:**
\`\`\`json
{
  "field1": "value",
  "field2": ["array", "of", "values"]
}
\`\`\`

**Constraints:**
- No extra commentary
- Exact field names required
- Valid syntax mandatory
`;

      optimizedPrompt = content + formatSection;
      changes.push(this.createChange({
        type: "output-formatting",
        severity: "moderate",
        originalText: "(no output format specified)",
        optimizedText: "Added Output Format section",
        explanation: "Defined explicit output format and structure",
        whyChanged: "Unspecified formats lead to inconsistent outputs",
        expectedImprovement: "Consistent, parseable, and predictable outputs",
        estimatedReasoningImprovement: "medium",
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

