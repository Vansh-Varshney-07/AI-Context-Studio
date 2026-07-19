/**
 * Role Definition Engine
 * Improves role and persona specifications.
 */

import { BaseOptimizationEngine } from "./base";
import type { OptimizationInput, OptimizationType } from "@/features/optimizer/types";

export class RoleDefinitionEngine extends BaseOptimizationEngine {
  readonly id = "role-definition";
  readonly name = "Role Definition Engine";
  readonly description = "Improves role definitions, personas, and identity specifications.";
  readonly supportedTypes: OptimizationType[] = ["role-definition"];

  protected async performOptimization(input: OptimizationInput): Promise<{
    optimizedPrompt: string;
    changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[];
    summary: { keyImprovements: string[]; remainingIssues: string[] };
  }> {
    const { content } = input;
    const changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[] = [];
    let optimizedPrompt = content;

    if (!/role|persona|identity|expert|specialist|character|act as/i.test(content)) {
      const roleSection = `
## Role Definition

**Identity:**
- Role: [specific title/position]
- Expertise: [domain, level, specializations]
- Experience: [years, notable work]

**Behavior:**
- Communication style: [formal, casual, technical, accessible]
- Decision framework: [how you reason]
- Boundaries: [what you won't do]

**Authority:**
- Can make decisions on: [scope]
- Must escalate: [conditions]
- Default stance: [conservative, innovative, balanced]
`;

      optimizedPrompt = content + roleSection;
      changes.push(this.createChange({
        type: "role-definition",
        severity: "major",
        originalText: "(no role defined)",
        optimizedText: "Added Role Definition section",
        explanation: "Defined explicit role, persona, and behavioral boundaries",
        whyChanged: "Undefined roles lead to inconsistent behavior",
        expectedImprovement: "Consistent, appropriate, and bounded responses",
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