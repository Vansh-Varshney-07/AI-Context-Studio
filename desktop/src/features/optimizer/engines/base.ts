/**
 * Base optimization engine interface and utilities.
 */

import type { 
  IOptimizationEngine, 
  OptimizationInput, 
  OptimizationResult, 
  OptimizationChange,
  OptimizationType,
  EngineConfig,
  OptimizationSummary,
  ComparisonData,
  ComparisonLine,
  DiffHunk
} from "@/features/optimizer/types";

export type { IOptimizationEngine, EngineConfig } from "@/features/optimizer/types";

/**
 * Minimal summary for performOptimization return
 */
export interface EngineOptimizationSummary {
  keyImprovements: string[];
  remainingIssues: string[];
  [key: string]: any;
}

/**
 * Result returned by performOptimization
 */
export interface EngineOptimizationResult {
  optimizedPrompt: string;
  changes: Omit<OptimizationChange, "id">[];
  summary: EngineOptimizationSummary;
}

/**
 * Base class for optimization engines providing common functionality.
 */
export abstract class BaseOptimizationEngine implements IOptimizationEngine {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly supportedTypes: OptimizationType[];
  
  protected config: EngineConfig = { enabled: true, priority: 1 };
  
  configure(config: EngineConfig): void {
    this.config = { ...this.config, ...config };
  }
  
  canOptimize(input: OptimizationInput): boolean {
    if (!this.config.enabled) return false;
    return this.supportedTypes.some(type => 
      input.options.optimizationTypes.includes(type)
    );
  }
  
  async optimize(input: OptimizationInput): Promise<OptimizationResult> {
    const result = await this.performOptimization(input);
    return this.formatResult(input, result);
  }
  
  /**
   * Subclasses implement this to do the actual optimization.
   */
  protected abstract performOptimization(input: OptimizationInput): Promise<EngineOptimizationResult>;
  
  /**
   * Format the result into the standard format.
   */
  protected formatResult(input: OptimizationInput, result: EngineOptimizationResult): OptimizationResult {
    const originalLines = input.content.split("\n");
    const optimizedLines = result.optimizedPrompt.split("\n");
    
    // Generate comparison lines
    const originalLinesComp: ComparisonLine[] = originalLines.map((content: string, i: number) => ({
      number: i + 1,
      content,
      type: "unchanged",
    }));
    
    const optimizedLinesComp: ComparisonLine[] = result.optimizedPrompt.split("\n").map((content: string, i: number) => ({
      number: i + 1,
      content,
      type: "unchanged",
    }));
    
    // Mark changed lines
    const changesWithIds = result.changes.map(change => ({
      ...change,
      id: this.generateId(),
    })) as OptimizationChange[];
    
    for (const change of changesWithIds) {
      const origIdx = originalLinesComp.findIndex(l => l.content === change.originalText);
      if (origIdx >= 0 && originalLinesComp[origIdx]) {
        originalLinesComp[origIdx].type = "modified";
        originalLinesComp[origIdx].changeId = change.id;
      }
      
      const optIdx = optimizedLinesComp.findIndex(l => l.content === change.optimizedText);
      if (optIdx >= 0 && optimizedLinesComp[optIdx]) {
        optimizedLinesComp[optIdx].type = "modified";
        optimizedLinesComp[optIdx].changeId = change.id;
      }
    }
    
    // Create hunks
    const hunks: DiffHunk[] = changesWithIds.map(change => ({
      id: change.id,
      originalStart: 1,
      originalCount: 1,
      optimizedStart: 1,
      optimizedCount: 1,
      lines: [
        { number: 1, content: change.originalText, type: "removed", changeId: change.id },
        { number: 1, content: change.optimizedText, type: "added", changeId: change.id },
      ],
    }));
    
    return {
      originalPrompt: input.content,
      optimizedPrompt: result.optimizedPrompt,
      changes: changesWithIds,
      summary: {
        totalChanges: changesWithIds.length,
        majorChanges: changesWithIds.filter(c => c.severity === "major").length,
        moderateChanges: changesWithIds.filter(c => c.severity === "moderate").length,
        minorChanges: changesWithIds.filter(c => c.severity === "minor").length,
        tokenReduction: input.content.length - result.optimizedPrompt.length,
        tokenReductionPercent: input.content.length > 0 ? ((input.content.length - result.optimizedPrompt.length) / input.content.length) * 100 : 0,
        estimatedQualityImprovement: 0,
        estimatedTokenSavings: 0,
        estimatedCostSavings: 0,
        keyImprovements: result.summary.keyImprovements,
        remainingIssues: result.summary.remainingIssues,
      },
      comparison: {
        originalLines: originalLinesComp,
        optimizedLines: optimizedLinesComp,
        hunks,
      },
      metadata: {
        originalLength: input.content.length,
        optimizedLength: result.optimizedPrompt.length,
        tokenEstimate: Math.ceil(input.content.length / 4),
        changesCount: changesWithIds.length,
        majorChanges: changesWithIds.filter(c => c.severity === "major").length,
        moderateChanges: changesWithIds.filter(c => c.severity === "moderate").length,
        minorChanges: changesWithIds.filter(c => c.severity === "minor").length,
      },
    };
  }
  
  /**
   * Generate a unique ID for changes.
   */
  protected generateId(): string {
    return `${this.id}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  
  /**
   * Create a standardized change object (without ID - gets added in formatResult).
   */
  protected createChange(params: {
    type: OptimizationType;
    severity: "major" | "moderate" | "minor";
    originalText: string;
    optimizedText: string;
    explanation: string;
    whyChanged: string;
    expectedImprovement: string;
    estimatedReasoningImprovement: "high" | "medium" | "low";
    estimatedTokenSavings: "high" | "medium" | "low" | "none";
    estimatedResponseQuality: "high" | "medium" | "low";
    confidence?: number;
  }): Omit<OptimizationChange, "id"> {
    return {
      type: params.type,
      severity: params.severity,
      originalText: params.originalText,
      optimizedText: params.optimizedText,
      explanation: params.explanation,
      whyChanged: params.whyChanged,
      expectedImprovement: params.expectedImprovement,
      estimatedReasoningImprovement: params.estimatedReasoningImprovement,
      estimatedTokenSavings: params.estimatedTokenSavings,
      estimatedResponseQuality: params.estimatedResponseQuality,
      confidence: params.confidence ?? 0.8,
    };
  }
}

