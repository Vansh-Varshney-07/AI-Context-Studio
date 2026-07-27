/**
 * Scoring engine for computing quality scores from validation findings.
 */

import type { QualityScore, ScoreDimension, ValidationFinding, ValidationCategory } from "@/features/validator/types";

/**
 * Weights for each validation category in the overall score.
 * Categories not listed default to weight 1.
 */
export const CATEGORY_WEIGHTS: Record<ValidationCategory, number> = {
  "structure": 1.5,
  "formatting": 0.8,
  "required-sections": 2.0,
  "missing-sections": 1.5,
  "readability": 1.0,
  "prompt-quality": 1.8,
  "instruction-clarity": 1.8,
  "role-definition": 2.0,
  "tool-usage": 1.2,
  "context-quality": 1.5,
  "memory-strategy": 1.3,
  "workflow-completeness": 1.5,
  "architecture-description": 1.3,
  "testing-instructions": 1.2,
  "coding-standards": 1.2,
  "error-handling": 1.3,
  "performance-guidance": 1.0,
  "security-recommendations": 1.2,
  "maintainability": 1.2,
  "consistency": 1.0,
};

/**
 * Penalty points per finding severity.
 */
export const SEVERITY_PENALTIES = {
  error: 15,
  warning: 8,
  info: 3,
  success: 0,
} as const;

/**
 * Maximum penalty per category (to prevent one category from dominating).
 */
export const MAX_CATEGORY_PENALTY = 40;

/**
 * Score dimension definitions for the breakdown.
 */
export const SCORE_DIMENSIONS: Omit<ScoreDimension, "score">[] = [
  { category: "structure", maxScore: 100, label: "Structure", description: "Document organization, heading hierarchy, and formatting consistency" },
  { category: "clarity", maxScore: 100, label: "Clarity", description: "Readability, instruction clarity, and prompt quality" },
  { category: "completeness", maxScore: 100, label: "Completeness", description: "Required sections present, missing sections identified" },
  { category: "prompt-engineering", maxScore: 100, label: "Prompt Engineering", description: "Role definition, examples, constraints, output format" },
  { category: "maintainability", maxScore: 100, label: "Maintainability", description: "Coding standards, error handling, performance guidance, security" },
  { category: "best-practices", maxScore: 100, label: "Best Practices", description: "Tool usage, context quality, consistency, workflow completeness" },
];

/**
 * Map validation categories to score dimensions.
 */
const CATEGORY_TO_DIMENSION: Record<ValidationCategory, ScoreDimension["category"]> = {
  "structure": "structure",
  "formatting": "structure",
  "required-sections": "completeness",
  "missing-sections": "completeness",
  "readability": "clarity",
  "prompt-quality": "prompt-engineering",
  "instruction-clarity": "clarity",
  "role-definition": "prompt-engineering",
  "tool-usage": "best-practices",
  "context-quality": "clarity",
  "memory-strategy": "maintainability",
  "workflow-completeness": "best-practices",
  "architecture-description": "maintainability",
  "testing-instructions": "maintainability",
  "coding-standards": "maintainability",
  "error-handling": "maintainability",
  "performance-guidance": "maintainability",
  "security-recommendations": "maintainability",
  "maintainability": "maintainability",
  "consistency": "best-practices",
};

/**
 * Calculate quality score from validation findings.
 */
export function calculateQualityScore(findings: ValidationFinding[]): QualityScore {
  // Initialize dimension scores at 100
  const dimensionScores: Record<string, number> = {};
  for (const dim of SCORE_DIMENSIONS) {
    dimensionScores[dim.category] = 100;
  }
  
  // Apply penalties by category
  const categoryPenalties: Record<ValidationCategory, number> = {} as Record<ValidationCategory, number>;
  
  for (const finding of findings) {
    if (finding.severity === "success") continue;
    
    const penalty = SEVERITY_PENALTIES[finding.severity];
    const currentPenalty = categoryPenalties[finding.category] || 0;
    categoryPenalties[finding.category] = Math.min(currentPenalty + penalty, MAX_CATEGORY_PENALTY);
  }
  
  // Apply penalties to dimensions
  for (const [category, penalty] of Object.entries(categoryPenalties)) {
    const dimension = CATEGORY_TO_DIMENSION[category as ValidationCategory];
    if (dimension) {
      dimensionScores[dimension] = Math.max(0, (dimensionScores[dimension] ?? 100) - penalty);
    }
  }
  
  // Build breakdown
  const breakdown: ScoreDimension[] = SCORE_DIMENSIONS.map(dim => ({
    ...dim,
    score: dimensionScores[dim.category] ?? 100,
  }));
  
  // Calculate overall score (weighted average)
  const overall = calculateWeightedScore(
    breakdown.map(dim => ({ score: dim.score, weight: getDimensionWeight(dim.category) }))
  );
  
  return {
    overall,
    maxScore: 100,
    breakdown,
    grade: scoreToGrade(overall),
  };
}

/**
 * Get weight for a score dimension.
 */
function getDimensionWeight(category: string): number {
  const weights: Record<string, number> = {
    structure: 1.5,
    clarity: 1.5,
    completeness: 2.0,
    "prompt-engineering": 2.0,
    maintainability: 1.2,
    "best-practices": 1.3,
  };
  return weights[category] || 1.0;
}

/**
 * Calculate weighted average score.
 */
function calculateWeightedScore(scores: { score: number; weight: number }[]): number {
  const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
  if (totalWeight === 0) return 0;
  
  const weightedSum = scores.reduce((sum, s) => sum + s.score * s.weight, 0);
  return Math.round(weightedSum / totalWeight);
}

/**
 * Convert numeric score to letter grade.
 */
export function scoreToGrade(score: number): QualityScore["grade"] {
  if (score >= 97) return "A+";
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 65) return "D";
  return "F";
}

/**
 * Get score color for UI.
 */
export function getScoreColor(score: number): string {
  if (score >= 90) return "text-success";
  if (score >= 80) return "text-accent";
  if (score >= 70) return "text-warning";
  if (score >= 60) return "text-orange-500";
  return "text-error";
}

/**
 * Get score background color for UI.
 */
export function getScoreBg(score: number): string {
  if (score >= 90) return "bg-success-bg";
  if (score >= 80) return "bg-accent-bg";
  if (score >= 70) return "bg-warning-bg";
  if (score >= 60) return "bg-orange-50";
  return "bg-error-bg";
}

/**
 * Estimate AI performance based on score and findings.
 */
export function estimateAIPerformance(
  score: number,
  findings: ValidationFinding[]
): "excellent" | "good" | "fair" | "poor" {
  const criticalErrors = findings.filter(f => f.severity === "error" && 
    ["required-sections", "role-definition", "instruction-clarity"].includes(f.category)
  ).length;
  
  if (score >= 90 && criticalErrors === 0) return "excellent";
  if (score >= 75 && criticalErrors <= 1) return "good";
  if (score >= 60) return "fair";
  return "poor";
}

/**
 * Estimate token efficiency based on findings.
 */
export function estimateTokenEfficiency(
  findings: ValidationFinding[],
  contentLength: number
): "high" | "medium" | "low" {
  const verbosityIssues = findings.filter(f => 
    f.category === "readability" || 
    f.category === "instruction-clarity" ||
    (f.category === "formatting" && f.severity === "warning")
  ).length;
  
  const wordsPerToken = contentLength / 4; // rough estimate
  
  if (verbosityIssues === 0 && wordsPerToken > 100) return "high";
  if (verbosityIssues <= 2 && wordsPerToken > 50) return "medium";
  return "low";
}

/**
 * Get compatibility status color.
 */
export function getCompatibilityColor(status: "compatible" | "partially-compatible" | "needs-changes"): string {
  switch (status) {
    case "compatible": return "text-success";
    case "partially-compatible": return "text-warning";
    case "needs-changes": return "text-error";
  }
}

/**
 * Get compatibility badge variant.
 */
export function getCompatibilityVariant(status: "compatible" | "partially-compatible" | "needs-changes"): "success" | "warning" | "error" {
  switch (status) {
    case "compatible": return "success";
    case "partially-compatible": return "warning";
    case "needs-changes": return "error";
  }
}

