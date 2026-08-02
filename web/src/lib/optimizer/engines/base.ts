import type {
  OptimizationInput,
  OptimizationResult,
  OptimizationChange,
  OptimizationSummary,
  ComparisonData,
  ComparisonLine,
  DiffHunk,
  IOptimizationEngine,
  OptimizationType,
} from "@/lib/optimizer/types";

/**
 * Abstract base class for all optimization engines.
 * Provides common infrastructure for result formatting, diff computation,
 * and summary generation.
 */
export abstract class BaseOptimizationEngine implements IOptimizationEngine {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly supportedTypes: OptimizationType[];

  abstract performOptimization(input: OptimizationInput): Promise<{
    content: string;
    changes: Omit<OptimizationChange, "id">[];
  }>;

  async optimize(input: OptimizationInput): Promise<OptimizationResult> {
    const { content, changes } = await this.performOptimization(input);
    return this.formatResult(input.content, content, changes);
  }

  canOptimize(input: OptimizationInput): boolean {
    return input.content.trim().length > 0;
  }

  protected generateId(): string {
    return `${this.id}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  protected createChange(
    params: Omit<OptimizationChange, "id">,
  ): OptimizationChange {
    return { ...params, id: this.generateId() };
  }

  /**
   * Formats the result with comparison data and summary.
   */
  protected formatResult(
    original: string,
    optimized: string,
    rawChanges: Omit<OptimizationChange, "id">[],
  ): OptimizationResult {
    const changes = rawChanges.map((c) => this.createChange(c));

    const comparison = this.computeDiff(original, optimized);
    const summary = this.computeSummary(changes, original, optimized);

    return {
      originalPrompt: original,
      optimizedPrompt: optimized,
      changes,
      summary,
      comparison,
      metadata: {
        originalLength: original.length,
        optimizedLength: optimized.length,
        tokenEstimate: Math.ceil(optimized.length / 4),
        changesCount: changes.length,
        majorChanges: changes.filter((c) => c.severity === "major").length,
        moderateChanges: changes.filter((c) => c.severity === "moderate").length,
        minorChanges: changes.filter((c) => c.severity === "minor").length,
      },
    };
  }

  /**
   * Computes line-by-line diff between original and optimized.
   */
  protected computeDiff(original: string, optimized: string): ComparisonData {
    const originalLines = original.split("\n");
    const optimizedLines = optimized.split("\n");

    const originalComparisonLines: ComparisonLine[] = originalLines.map((content, i) => ({
      number: i + 1,
      content,
      type: "unchanged" as const,
    }));

    const optimizedComparisonLines: ComparisonLine[] = optimizedLines.map((content, i) => ({
      number: i + 1,
      content,
      type: "unchanged" as const,
    }));

    // Simple LCS-based diff
    const hunks = this.computeDiffHunks(originalLines, optimizedLines);

    return {
      originalLines: originalComparisonLines,
      optimizedLines: optimizedComparisonLines,
      hunks,
    };
  }

  protected computeDiffHunks(
    originalLines: string[],
    optimizedLines: string[],
  ): DiffHunk[] {
    const hunks: DiffHunk[] = [];
    let originalIndex = 0;
    let optimizedIndex = 0;

    while (originalIndex < originalLines.length || optimizedIndex < optimizedLines.length) {
      if (originalIndex < originalLines.length &&
          optimizedIndex < optimizedLines.length &&
          originalLines[originalIndex] === optimizedLines[optimizedIndex]) {
        originalIndex++;
        optimizedIndex++;
        continue;
      }

      const hunkStart = originalIndex;
      const optStart = optimizedIndex;

      // Find matching lines ahead
      let matchFound = false;
      for (let lookahead = 1; lookahead <= 5; lookahead++) {
        if (originalIndex + lookahead < originalLines.length &&
            optimizedIndex + lookahead < optimizedLines.length &&
            originalLines[originalIndex + lookahead] === optimizedLines[optimizedIndex + lookahead]) {
          matchFound = true;
          break;
        }
      }

      const lines: ComparisonLine[] = [];
      const origStart = hunkStart;

      while (
        originalIndex < originalLines.length &&
        optimizedIndex < optimizedLines.length &&
        originalLines[originalIndex] !== optimizedLines[optimizedIndex]
      ) {
        const origLine = originalLines[originalIndex];
        const optLine = optimizedLines[optimizedIndex];
        if (origLine !== undefined) {
          lines.push({
            number: originalIndex + 1,
            content: origLine,
            type: "removed",
          });
        }
        if (optLine !== undefined) {
          lines.push({
            number: optimizedIndex + 1,
            content: optLine,
            type: "added",
          });
        }
        originalIndex++;
        optimizedIndex++;
      }

      if (lines.length > 0) {
        const hunkId = `hunk-${hunks.length + 1}`;
        hunks.push({
          id: hunkId,
          originalStart: origStart + 1,
          originalCount: originalIndex - origStart,
          optimizedStart: optStart + 1,
          optimizedCount: optimizedIndex - optStart,
          lines,
        });

        // Assign change IDs
        for (const line of lines) {
          line.changeId = hunkId;
        }
      }
    }

    return hunks;
  }

  /**
   * Computes optimization summary metrics.
   */
  protected computeSummary(
    changes: OptimizationChange[],
    original: string,
    optimized: string,
  ): OptimizationSummary {
    const majorChanges = changes.filter((c) => c.severity === "major").length;
    const moderateChanges = changes.filter((c) => c.severity === "moderate").length;
    const minorChanges = changes.filter((c) => c.severity === "minor").length;

    const tokenReduction = Math.ceil(original.length / 4) - Math.ceil(optimized.length / 4);
    const tokenReductionPercent = original.length > 0
      ? ((original.length - optimized.length) / original.length) * 100
      : 0;

    return {
      totalChanges: changes.length,
      majorChanges,
      moderateChanges,
      minorChanges,
      tokenReduction,
      tokenReductionPercent: Math.round(tokenReductionPercent * 100) / 100,
      estimatedQualityImprovement: Math.min(100, majorChanges * 15 + moderateChanges * 8 + minorChanges * 3),
      estimatedTokenSavings: Math.max(0, tokenReduction),
      estimatedCostSavings: (Math.max(0, tokenReduction) / 1000) * 0.01, // rough estimate
      keyImprovements: changes
        .filter((c) => c.severity === "major" || c.severity === "moderate")
        .map((c) => c.explanation)
        .slice(0, 5),
      remainingIssues: changes
        .filter((c) => c.severity === "minor")
        .map((c) => c.explanation)
        .slice(0, 3),
    };
  }
}