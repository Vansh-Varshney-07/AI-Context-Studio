import type { OptimizationInput, OptimizationResult, OptimizationType } from "@/lib/optimizer/types";
import { BaseOptimizationEngine } from "./base";

export class ChainOfThoughtEngine extends BaseOptimizationEngine {
  readonly id = "chain-of-thought";
  readonly name = "Chain of Thought Enhancement";
  readonly description = "Adds step-by-step reasoning structure to prompts";
  readonly supportedTypes: OptimizationType[] = ["chain-of-thought"];

  async performOptimization(input: OptimizationInput): Promise<{
    content: string;
    changes: Omit<OptimizationResult["changes"][0], "id">[];
  }> {
    let content = input.content;
    const changes: Omit<OptimizationResult["changes"][0], "id">[] = [];

    // Check if CoT is already present
    const cotPatterns = [
      /step.?by.?step/i,
      /think.?through/i,
      /reason.?through/i,
      /work.?through/i,
      /break.?down/i,
      /chain.?of.?thought/i,
    ];

    let hasCoT = false;
    for (const pattern of cotPatterns) {
      if (pattern.test(content)) {
        hasCoT = true;
        break;
      }
    }

    if (!hasCoT && content.length > 50) {
      const cotAddition = `

**Reasoning Process:**
Think through this step by step:
1. First, understand the core requirement
2. Identify key constraints and considerations
3. Break down the problem into manageable parts
4. Solve each part systematically
5. Verify the solution meets all requirements
6. Present the final answer clearly`;

      content = content + cotAddition;
      changes.push({
        type: "chain-of-thought",
        severity: "major",
        originalText: "(no reasoning structure)",
        optimizedText: "Added step-by-step reasoning framework",
        explanation: "Added structured chain-of-thought reasoning process",
        whyChanged: "Chain-of-thought prompting significantly improves reasoning accuracy",
        expectedImprovement: "More thorough and accurate solutions",
        estimatedReasoningImprovement: "high",
        estimatedTokenSavings: "none",
        estimatedResponseQuality: "high",
        confidence: 0.9,
      });
    }

    return { content, changes };
  }
}