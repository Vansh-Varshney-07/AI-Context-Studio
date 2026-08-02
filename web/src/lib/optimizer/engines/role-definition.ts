import type { OptimizationInput, OptimizationResult, OptimizationType } from "@/lib/optimizer/types";
import { BaseOptimizationEngine } from "./base";

export class RoleDefinitionEngine extends BaseOptimizationEngine {
  readonly id = "role-definition";
  readonly name = "Role Definition Optimization";
  readonly description = "Clarifies and strengthens role definitions, adds missing role context";
  readonly supportedTypes: OptimizationType[] = ["role-definition"];

  async performOptimization(input: OptimizationInput): Promise<{
    content: string;
    changes: Omit<OptimizationResult["changes"][0], "id">[];
  }> {
    let content = input.content;
    const changes: Omit<OptimizationResult["changes"][0], "id">[] = [];

    // Check if there's a clear role definition
    const rolePatterns = [
      /you are an? (\w+)/i,
      /act as an? (\w+)/i,
      /role:\s*(\w+)/i,
      /persona:\s*(\w+)/i,
    ];

    let hasRole = false;
    for (const pattern of rolePatterns) {
      if (pattern.test(content)) {
        hasRole = true;
        break;
      }
    }

    if (!hasRole && content.length > 100) {
      // Prepend a default role based on content
      let role = "expert assistant";
      if (/\bcode|program|develop|function|class\b/i.test(content)) {
        role = "senior software engineer";
      } else if (/\bwrite|draft|compose|create\b/i.test(content)) {
        role = "professional writer";
      } else if (/\banalyze|evaluate|assess|review\b/i.test(content)) {
        role = "expert analyst";
      }

      const roleStatement = `You are a ${role}. `;
      content = roleStatement + content;
      changes.push({
        type: "role-definition",
        severity: "major",
        originalText: "(no explicit role)",
        optimizedText: roleStatement.trim(),
        explanation: `Added explicit role definition: "${role}"`,
        whyChanged: "Clear role definitions improve response quality and consistency",
        expectedImprovement: "More targeted, expert-level responses",
        estimatedReasoningImprovement: "high",
        estimatedTokenSavings: "none",
        estimatedResponseQuality: "high",
        confidence: 0.85,
      });
    }

    // Strengthen weak role statements
    const weakRoles = [
      { pattern: /\byou are helpful\b/i, replacement: "You are an expert assistant" },
      { pattern: /\byou are an ai\b/i, replacement: "You are an expert AI assistant" },
      { pattern: /\bas an assistant\b/i, replacement: "As an expert assistant" },
    ];

    for (const { pattern, replacement } of weakRoles) {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        changes.push({
          type: "role-definition",
          severity: "moderate",
          originalText: pattern.source,
          optimizedText: replacement,
          explanation: "Strengthened weak role statement",
          whyChanged: "Specific roles produce better results than generic ones",
          expectedImprovement: "More authoritative and focused responses",
          estimatedReasoningImprovement: "medium",
          estimatedTokenSavings: "none",
          estimatedResponseQuality: "high",
          confidence: 0.8,
        });
      }
    }

    return { content, changes };
  }
}