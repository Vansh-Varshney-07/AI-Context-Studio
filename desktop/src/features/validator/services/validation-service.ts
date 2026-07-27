/**
 * Main validation service that orchestrates multiple validators.
 */

import type { ValidationInput, ValidationResult, AssetType, ValidationProfile, ValidationOptions, ClientCompatibility, AIClient } from "@/features/validator/types";
import { validatorRegistry } from "@/features/validator/validators/base";
import type { IAssetValidator } from "@/features/validator/validators/base";
import { MarkdownValidator } from "../validators/markdown";
import { calculateQualityScore, estimateAIPerformance, estimateTokenEfficiency } from "./scoring-engine";

/**
 * Register all built-in validators.
 */
function registerBuiltinValidators(): void {
  validatorRegistry.register(new MarkdownValidator());
}

/**
 * Get the best validator for an asset type.
 */
function getValidatorForAsset(assetType: AssetType): IAssetValidator {
  const validator = validatorRegistry.getBestForAssetType(assetType);
  if (!validator) {
    throw new Error(`No validator found for asset type: ${assetType}`);
  }
  return validator;
}

/**
 * Detect asset type from content.
 */
export function detectAssetType(content: string, filename?: string): AssetType {
  const lowerContent = content.toLowerCase();
  const lowerFilename = filename?.toLowerCase() || "";
  
  // Check filename patterns
  if (lowerFilename.includes("claude") || lowerFilename.includes("agents") || 
      lowerFilename.includes("gemini") || lowerFilename.includes("copilot") ||
      lowerFilename.includes("cursor") || lowerFilename.includes("readme") ||
      lowerFilename.includes("context") || lowerFilename.includes("memory") ||
      lowerFilename.includes("persona") || lowerFilename.includes("workflow") ||
      lowerFilename.includes("styleguide") || lowerFilename.includes("system")) {
    return "instruction-file";
  }
  
  // Check content patterns
  if (lowerContent.includes("mcp") && (lowerContent.includes("server") || lowerContent.includes("transport"))) {
    return "mcp-configuration";
  }
  
  if (lowerContent.includes("steps:") && (lowerContent.includes("type:") || lowerContent.includes("kind:"))) {
    return "workflow";
  }
  
  if (lowerContent.includes("role:") || lowerContent.includes("persona:") || 
      lowerContent.includes("identity:") || lowerContent.includes("traits:")) {
    return "persona";
  }
  
  if (lowerContent.includes("skill:") || lowerContent.includes("capability:") ||
      lowerContent.includes("when to use:")) {
    return "skill";
  }
  
  if (lowerContent.includes("system prompt") || lowerContent.includes("system:") ||
      (lowerContent.includes("you are") && lowerContent.length < 5000)) {
    return "system-prompt";
  }
  
  // Default to markdown for text content
  return "instruction-file";
}

/**
 * Main validation function.
 */
export async function validateAsset(input: ValidationInput, options?: ValidationOptions): Promise<ValidationResult> {
  // Register validators on first call
  if (validatorRegistry.getAll().length === 0) {
    registerBuiltinValidators();
  }
  
  // Auto-detect asset type if not specified
  const assetType = input.assetType || detectAssetType(input.content, input.filename);
  const enrichedInput: ValidationInput = { ...input, assetType };
  
  // Get appropriate validator
  const validator = getValidatorForAsset(assetType);
  
  // Run validation
  const result = await validator.validate(enrichedInput);
  
  // Enhance with AI performance and token efficiency estimates
  const enhancedResult: ValidationResult = {
    ...result,
    metadata: {
      ...result.metadata,
      estimatedAIPerformance: estimateAIPerformance(result.score.overall, result.findings),
      estimatedTokenEfficiency: estimateTokenEfficiency(result.findings, input.content.length),
    },
  };
  
  // Add compatibility analysis if requested
  if (options?.includeCompatibility !== false) {
    enhancedResult.compatibility = await analyzeCompatibility(enrichedInput, result);
  }
  
  // Add recommendations
  enhancedResult.recommendations = generateRecommendations(enhancedResult);
  
  return enhancedResult;
}

/**
 * Validate multiple assets at once.
 */
export async function validateAssets(inputs: ValidationInput[]): Promise<ValidationResult[]> {
  if (validatorRegistry.getAll().length === 0) {
    registerBuiltinValidators();
  }
  
  return Promise.all(inputs.map(input => validateAsset(input)));
}

/**
 * Quick validation for real-time feedback.
 */
export async function quickValidate(content: string, assetType?: AssetType): Promise<{
  score: number;
  grade: string;
  criticalIssues: number;
  topFinding?: string;
}> {
  const result = await validateAsset({ content, assetType: assetType || "instruction-file" });
  const criticalIssues = result.findings.filter(f => f.severity === "error").length;
  return {
    score: result.score.overall,
    grade: result.score.grade,
    criticalIssues,
    topFinding: result.findings[0]?.title,
  };
}

/**
 * Analyze compatibility with various AI clients.
 */
async function analyzeCompatibility(input: ValidationInput, result: ValidationResult): Promise<ClientCompatibility[]> {

  const clients = [
    "claude-code", "cursor", "opencode", "codex", 
    "gemini-cli", "continue", "roo-code", "cline"
  ] as const;
  
  const compatibility: ClientCompatibility[] = [];
  
  for (const client of clients) {
    const issues: string[] = [];
    const requiredChanges: string[] = [];
    
    // Client-specific checks
    switch (client) {
      case "claude-code":
        if (input.assetType === "instruction-file" && !input.content.toLowerCase().includes("tool")) {
          issues.push("No tool usage instructions found");
          requiredChanges.push("Add tool usage guidelines");
        }
        break;
      case "cursor":
        if (input.assetType === "instruction-file" && !input.content.includes(".cursor")) {
          issues.push("No Cursor-specific configuration");
        }
        break;
      case "codex":
        if (!input.content.toLowerCase().includes("example")) {
          issues.push("Codex benefits from examples");
          requiredChanges.push("Add concrete examples");
        }
        break;
    }
    
    // General compatibility based on score
    const score = result.score.overall;
    let status: "compatible" | "partially-compatible" | "needs-changes";
    if (score >= 85) status = "compatible";
    else if (score >= 65) status = "partially-compatible";
    else status = "needs-changes";
    
    compatibility.push({ 
      client: client as "claude-code" | "cursor" | "opencode" | "codex" | "gemini-cli" | "continue" | "roo-code" | "cline", 
      status, 
      issues, 
      requiredChanges 
    });
  }
  
  return compatibility;
}

/**
 * Generate prioritized recommendations.
 */
export function generateRecommendations(result: ValidationResult): string[] {
  const recommendations: string[] = [];
  
  // Priority 1: Errors
  const errors = result.findings.filter(f => f.severity === "error");
  for (const error of errors.slice(0, 3)) {
    if (error.suggestion) recommendations.push(`🔴 ${error.suggestion}`);
  }
  
  // Priority 2: Warnings
  const warnings = result.findings.filter(f => f.severity === "warning");
  for (const warning of warnings.slice(0, 3)) {
    if (warning.suggestion) recommendations.push(`🟡 ${warning.suggestion}`);
  }
  
  // Priority 3: Missing sections
  if (result.missingSections.length > 0) {
    for (const section of result.missingSections.slice(0, 3)) {
      recommendations.push(`📋 Add missing section: ${section}`);
    }
  }
  
  // Priority 4: Improvements
  for (const suggestion of result.improvementSuggestions.slice(0, 2)) {
    recommendations.push(`💡 ${suggestion}`);
  }
  
  return recommendations.slice(0, 8);
}

/**
 * Get validation profile configuration.
 */
export function getValidationProfile(profile: ValidationProfile) {
  const profiles: Record<ValidationProfile, { name: string; description: string }> = {
    comprehensive: {
      name: "Comprehensive",
      description: "Full analysis across all categories",
    },
    quick: {
      name: "Quick Check",
      description: "Essential checks only",
    },
    compatibility: {
      name: "Compatibility Focus",
      description: "Focus on client compatibility",
    },
    "prompt-engineering": {
      name: "Prompt Engineering",
      description: "Optimize for prompt quality",
    },
    "instruction-files": {
      name: "Instruction Files",
      description: "Specialized for CLAUDE.md, AGENTS.md, etc.",
    },
  };
  
  return profiles[profile] || profiles.comprehensive;
}

