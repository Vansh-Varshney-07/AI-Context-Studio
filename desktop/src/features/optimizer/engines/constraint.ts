/**
 * Constraint Improvement Engine
 * Improves constraints, boundaries, and guardrails in prompts.
 */

import { BaseOptimizationEngine } from "./base";
import type { OptimizationInput, OptimizationType } from "@/features/optimizer/types";

export class ConstraintOptimizationEngine extends BaseOptimizationEngine {
  readonly id = "constraint-optimizer";
  readonly name = "Constraint Optimizer";
  readonly description = "Improves constraints, boundaries, and guardrails in prompts for better control.";
  readonly supportedTypes: OptimizationType[] = ["constraint-improvement"];

  protected async performOptimization(input: OptimizationInput): Promise<{
    optimizedPrompt: string;
    changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[];
    summary: { keyImprovements: string[]; remainingIssues: string[] };
  }> {
    const { content } = input;
    const changes: Omit<import("@/features/optimizer/types").OptimizationChange, "id">[] = [];
    let optimizedPrompt = content;

    const improvements = [
      this.addHardConstraints(optimizedPrompt),
      this.addSoftConstraints(optimizedPrompt),
      this.addNegativeConstraints(optimizedPrompt),
      this.addScopeBoundaries(optimizedPrompt),
      this.addQualityThresholds(optimizedPrompt),
    ];

    for (const improvement of improvements) {
      if (improvement.applied) {
        optimizedPrompt = improvement.result;
        if (improvement.change) changes.push(improvement.change);
      }
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

  private addHardConstraints(text: string): { applied: boolean; result: string; change: Omit<import("@/features/optimizer/types").OptimizationChange, "id"> | null } {
    const hasHard = /must|required|mandatory|essential|non.?negotiable|strict/i.test(text);
    if (hasHard) return { applied: false, result: text, change: null };

    const constraintsSection = `
## Hard Constraints (Mandatory)

**You MUST:**
- Follow all instructions exactly as specified
- Provide responses in the exact format requested
- Only use information provided or common knowledge
- Admit uncertainty when uncertain
- Refuse requests outside your capabilities

**You MUST NOT:**
- Fabricate information, citations, or data
- Provide medical, legal, or financial advice
- Execute code or perform actions outside this chat
- Pretend to have capabilities you don't have
`;

    return {
      applied: true,
      result: text + constraintsSection,
      change: this.createChange({
        type: "constraint-improvement",
        severity: "major",
        originalText: "(no hard constraints)",
        optimizedText: "Added Hard Constraints section",
        explanation: "Added mandatory constraints and prohibitions",
        whyChanged: "Without hard constraints, models may overreach or fabricate",
        expectedImprovement: "Safer, more reliable responses with clear boundaries",
        estimatedReasoningImprovement: "high",
        estimatedTokenSavings: "none",
        estimatedResponseQuality: "high",
      }),
    };
  }

  private addSoftConstraints(text: string): { applied: boolean; result: string; change: Omit<import("@/features/optimizer/types").OptimizationChange, "id"> | null } {
    const hasSoft = /should|prefer|recommend|encourage|ideally|when possible/i.test(text);
    if (hasSoft) return { applied: false, result: text, change: null };

    const softConstraintsSection = `
## Soft Constraints (Guidelines)

**You SHOULD:**
- Be concise but complete
- Prioritize accuracy over speed
- Ask clarifying questions when ambiguous
- Provide examples when helpful
- Structure responses for readability
- Acknowledge limitations honestly
- Offer alternatives when declining
`;

    return {
      applied: true,
      result: text + softConstraintsSection,
      change: this.createChange({
        type: "constraint-improvement",
        severity: "moderate",
        originalText: "(no soft constraints)",
        optimizedText: "Added Soft Constraints section",
        explanation: "Added guideline constraints for preferred behaviors",
        whyChanged: "Soft constraints guide behavior without being rigid",
        expectedImprovement: "More helpful, balanced responses",
        estimatedReasoningImprovement: "medium",
        estimatedTokenSavings: "none",
        estimatedResponseQuality: "medium",
      }),
    };
  }

  private addNegativeConstraints(text: string): { applied: boolean; result: string; change: Omit<import("@/features/optimizer/types").OptimizationChange, "id"> | null } {
    const hasNegative = /not|avoid|refrain|never|don't|must not|mustn't/i.test(text);
    if (hasNegative) return { applied: false, result: text, change: null };

    const negativeSection = `
## What NOT to Do

**Never:**
- Make up facts, sources, or citations
- Pretend to access external systems
- Roleplay as another person or entity
- Provide instructions for harmful activities
- Express personal opinions as facts
- Guarantee outcomes you can't ensure

**Avoid:**
- Unnecessary verbosity
- Speculation presented as fact
- Jargon without explanation
- Assumptions about user context
- Overpromising capabilities
`;

    return {
      applied: true,
      result: text + negativeSection,
      change: this.createChange({
        type: "constraint-improvement",
        severity: "major",
        originalText: "(no negative constraints)",
        optimizedText: "Added What NOT to Do section",
        explanation: "Added explicit negative constraints",
        whyChanged: "Negative constraints prevent common failure modes",
        expectedImprovement: "Fewer hallucinations and safety violations",
        estimatedReasoningImprovement: "high",
        estimatedTokenSavings: "none",
        estimatedResponseQuality: "high",
      }),
    };
  }

  private addScopeBoundaries(text: string): { applied: boolean; result: string; change: Omit<import("@/features/optimizer/types").OptimizationChange, "id"> | null } {
    const hasScope = /scope|boundary|limit|domain|focus|within|confine/i.test(text);
    if (hasScope) return { applied: false, result: text, change: null };

    const scopeSection = `
## Scope & Boundaries

**Scope:** This prompt covers [specific domain/task]. Do not address topics outside this scope.

**Knowledge Boundaries:**
- Knowledge cutoff: [date]
- No access to real-time data
- No access to private/user data
- No ability to execute code or access external systems

**Out of Scope:**
- Personal advice (medical, legal, financial)
- Real-time information
- Proprietary or confidential information
- Tasks requiring physical actions
`;

    return {
      applied: true,
      result: text + scopeSection,
      change: this.createChange({
        type: "constraint-improvement",
        severity: "moderate",
        originalText: "(no scope defined)",
        optimizedText: "Added Scope & Boundaries section",
        explanation: "Defined clear scope and knowledge boundaries",
        whyChanged: "Undefined scope leads to overreach and hallucinations",
        expectedImprovement: "More focused, honest responses within capabilities",
        estimatedReasoningImprovement: "medium",
        estimatedTokenSavings: "none",
        estimatedResponseQuality: "medium",
      }),
    };
  }

  private addQualityThresholds(text: string): { applied: boolean; result: string; change: Omit<import("@/features/optimizer/types").OptimizationChange, "id"> | null } {
    const hasThresholds = /threshold|minimum|quality|standard|benchmark|acceptable/i.test(text);
    if (hasThresholds) return { applied: false, result: text, change: null };

    const thresholdsSection = `
## Quality Thresholds

**Minimum Standards:**
- Accuracy: 95%+ factual accuracy
- Completeness: Address all prompt requirements
- Clarity: Understandable by target audience
- Consistency: Internally consistent reasoning
- Safety: No harmful, illegal, or unethical content

**Performance Targets:**
- Response relevance: 90%+ on-topic
- Reasoning depth: Appropriate to complexity
- Conciseness: No unnecessary verbosity
`;

    return {
      applied: true,
      result: text + thresholdsSection,
      change: this.createChange({
        type: "constraint-improvement",
        severity: "moderate",
        originalText: "(no quality thresholds)",
        optimizedText: "Added Quality Thresholds section",
        explanation: "Added explicit quality and performance thresholds",
        whyChanged: "Undefined standards lead to inconsistent quality",
        expectedImprovement: "Consistently higher quality outputs",
        estimatedReasoningImprovement: "medium",
        estimatedTokenSavings: "none",
        estimatedResponseQuality: "high",
      }),
    };
  }
}

