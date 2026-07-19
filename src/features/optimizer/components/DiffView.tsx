"use client";

import * as React from "react";
import { cn } from "@/utils";
import type { ComparisonLine, DiffHunk, ComparisonData } from "@/features/optimizer/types";

interface DiffViewProps {
  comparison: ComparisonData;
  viewMode?: "side-by-side" | "inline" | "unified";
  onViewModeChange?: (mode: "side-by-side" | "inline" | "unified") => void;
}

/**
 * Side-by-side diff view component.
 */
export function DiffView({ comparison, viewMode = "side-by-side", onViewModeChange }: DiffViewProps) {
  const [hoveredLine, setHoveredLine] = React.useState<{ type: "original" | "optimized"; number: number } | null>(null);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-bg-secondary">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text-muted">Comparison View</span>
          <div className="flex border border-border rounded-md overflow-hidden">
            <button
              onClick={() => onViewModeChange?.("side-by-side")}
              className={cn(
                "px-2 py-1 text-xs transition-colors",
                viewMode === "side-by-side"
                  ? "bg-accent text-accent-fg"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              Side-by-side
            </button>
            <button
              onClick={() => onViewModeChange?.("inline")}
              className={cn(
                "px-2 py-1 text-xs transition-colors border-l border-border",
                viewMode === "inline"
                  ? "bg-accent text-accent-fg"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              Inline
            </button>
            <button
              onClick={() => onViewModeChange?.("unified")}
              className={cn(
                "px-2 py-1 text-xs transition-colors border-l border-border",
                viewMode === "unified"
                  ? "bg-accent text-accent-fg"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              Unified
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-success" />
            Added: {comparison.hunks.filter(h => h.lines.some(l => l.type === "added")).length}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-error" />
            Removed: {comparison.hunks.filter(h => h.lines.some(l => l.type === "removed")).length}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-warning" />
            Modified: {comparison.hunks.filter(h => h.lines.some(l => l.type === "modified")).length}
          </span>
        </div>
      </div>

      {/* Diff Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "side-by-side" && (
          <div className="flex h-full overflow-hidden">
            {/* Original Panel */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-border bg-bg-secondary">
              <div className="p-2 border-b border-border bg-bg-tertiary text-xs font-medium text-text-secondary">
                Original Prompt
              </div>
              <div className="flex-1 overflow-auto p-3 font-mono text-sm leading-relaxed">
                <LineNumbers lines={comparison.originalLines} onLineHover={(num) => setHoveredLine({ type: "original", number: num })} />
                <DiffLines 
                  lines={comparison.originalLines} 
                  hoveredLine={hoveredLine?.type === "original" ? hoveredLine.number : null}
                  isOriginal={true}
                />
              </div>
            </div>

            {/* Optimized Panel */}
            <div className="flex-1 flex flex-col min-w-0 bg-bg-primary">
              <div className="p-2 border-b border-border bg-bg-tertiary text-xs font-medium text-text-secondary">
                Optimized Prompt
              </div>
              <div className="flex-1 overflow-auto p-3 font-mono text-sm leading-relaxed">
                <LineNumbers lines={comparison.optimizedLines} onLineHover={(num) => setHoveredLine({ type: "optimized", number: num })} />
                <DiffLines 
                  lines={comparison.optimizedLines} 
                  hoveredLine={hoveredLine?.type === "optimized" ? hoveredLine.number : null}
                  isOriginal={false}
                />
              </div>
            </div>
          </div>
        )}

        {viewMode === "inline" && (
          <div className="h-full overflow-auto p-3 font-mono text-sm leading-relaxed">
            <InlineDiffLines lines={comparison.originalLines} optimizedLines={comparison.optimizedLines} />
          </div>
        )}

        {viewMode === "unified" && (
          <div className="h-full overflow-auto p-3 font-mono text-sm leading-relaxed">
            <UnifiedDiffLines hunks={comparison.hunks} />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Line numbers gutter.
 */
function LineNumbers({ lines, onLineHover }: { lines: ComparisonLine[]; onLineHover: (num: number) => void }) {
  return (
    <div className="absolute left-0 top-0 w-12 h-full border-r border-border bg-bg-secondary flex flex-col">
      {lines.map((line) => (
        <div
          key={line.number}
          className={cn(
            "h-5 px-1 text-right text-[10px] text-text-muted select-none",
            line.changeId && "font-medium text-accent"
          )}
          onMouseEnter={() => onLineHover(line.number)}
        >
          {line.number}
        </div>
      ))}
    </div>
  );
}

/**
 * Diff lines with highlighting.
 */
function DiffLines({ 
  lines, 
  hoveredLine, 
  isOriginal 
}: { 
  lines: ComparisonLine[]; 
  hoveredLine: number | null;
  isOriginal: boolean;
}) {
  return (
    <div className="relative ml-12 flex flex-col">
      {lines.map((line) => (
        <div
          key={line.number}
          className={cn(
            "h-5 px-2 flex items-start gap-2 whitespace-pre-wrap break-words",
            line.type === "added" && "bg-success/10 border-l-2 border-success",
            line.type === "removed" && "bg-error/10 border-l-2 border-error line-through",
            line.type === "modified" && "bg-warning/10 border-l-2 border-warning",
            line.changeId && "ring-1 ring-accent",
            hoveredLine === line.number && "bg-accent/5"
          )}
        >
          <span className="flex-1 min-w-0">{line.content || " "}</span>
          {line.changeId && (
            <span className="text-[10px] text-accent/70 px-1 rounded">#{line.changeId.slice(-6)}</span>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Inline diff view (single panel).
 */
function InlineDiffLines({ 
  lines, 
  optimizedLines 
}: { 
  lines: ComparisonLine[]; 
  optimizedLines: ComparisonLine[]; 
}) {
  return (
    <div className="space-y-1">
      {lines.map((line) => (
        <div
          key={line.number}
          className={cn(
            "px-2 py-0.5 rounded font-mono text-sm whitespace-pre-wrap break-words",
            line.type === "added" && "bg-success/10 border-l-2 border-success",
            line.type === "removed" && "bg-error/10 border-l-2 border-error line-through",
            line.type === "modified" && "bg-warning/10 border-l-2 border-warning",
            line.type === "unchanged" && "text-text-muted"
          )}
        >
          <span className="text-[10px] text-text-muted mr-2">{line.number}</span>
          {line.content}
        </div>
      ))}
      {optimizedLines.filter(l => l.type === "added" && !lines.find(ol => ol.content === l.content)).map((line) => (
        <div
          key={`added-${line.number}`}
          className="px-2 py-0.5 rounded font-mono text-sm bg-success/10 border-l-2 border-success whitespace-pre-wrap break-words"
        >
          <span className="text-[10px] text-success mr-2">+</span>
          {line.content}
        </div>
      ))}
    </div>
  );
}

/**
 * Unified diff view.
 */
function UnifiedDiffLines({ hunks }: { hunks: DiffHunk[] }) {
  return (
    <div className="space-y-4">
      {hunks.map((hunk) => (
        <div key={hunk.id} className="border border-border rounded-lg overflow-hidden bg-bg-secondary">
          <div className="px-3 py-1.5 bg-bg-tertiary border-b border-border text-xs font-mono text-text-muted">
            @@ -{hunk.originalStart},{hunk.originalCount} +{hunk.optimizedStart},{hunk.optimizedCount} @@
          </div>
          <div className="p-2 font-mono text-sm">
            {hunk.lines.map((line, idx) => (
              <div
                key={idx}
                className={cn(
                  "px-2 py-0.5 rounded whitespace-pre-wrap break-words",
                  line.type === "added" && "bg-success/10 text-success",
                  line.type === "removed" && "bg-error/10 text-error line-through",
                  line.type === "unchanged" && "text-text-muted",
                  line.type === "modified" && "bg-warning/10 text-warning"
                )}
              >
                {line.type === "added" && "+ "}
                {line.type === "removed" && "- "}
                {line.type === "unchanged" && "  "}
                {line.type === "modified" && "~ "}
                {line.content}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ExplanationPanelProps {
  changes: import("@/features/optimizer/types").OptimizationChange[];
  onSelectChange?: (changeId: string) => void;
  selectedChangeId?: string;
}

/**
 * Explanation panel showing why each change was made.
 */
export function ExplanationPanel({ 
  changes, 
  onSelectChange, 
  selectedChangeId 
}: ExplanationPanelProps) {
  if (changes.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-text-muted p-8">
        <div className="text-center">
          <p className="text-sm font-medium">No changes made</p>
          <p className="text-xs mt-1">The prompt is already well-optimized</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-border bg-bg-secondary">
        <h3 className="text-sm font-semibold text-text-primary">Explanation Panel</h3>
        <p className="text-xs text-text-muted mt-0.5">
          {changes.length} change{changes.length !== 1 ? "s" : ""} applied
        </p>
      </div>
      
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {changes.map((change) => (
          <ExplanationCard
            key={change.id}
            change={change}
            isSelected={selectedChangeId === change.id}
            onClick={() => onSelectChange?.(change.id)}
          />
        ))}
      </div>
      
      <div className="p-3 border-t border-border bg-bg-secondary">
        <SummaryStats changes={changes} />
      </div>
    </div>
  );
}

function ExplanationCard({ 
  change, 
  isSelected, 
  onClick 
}: { 
  change: import("@/features/optimizer/types").OptimizationChange;
  isSelected: boolean;
  onClick: () => void;
}) {
  const severityColors = {
    major: "border-error/30 bg-error/5",
    moderate: "border-warning/30 bg-warning/5",
    minor: "border-accent/30 bg-accent/5",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-3 rounded-lg border transition-all cursor-pointer",
        severityColors[change.severity],
        isSelected && "ring-2 ring-accent shadow-lg"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "px-1.5 py-0.5 rounded text-[10px] font-medium uppercase",
              change.severity === "major" && "bg-error/20 text-error",
              change.severity === "moderate" && "bg-warning/20 text-warning",
              change.severity === "minor" && "bg-accent/20 text-accent"
            )}>
              {change.severity}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-bg-tertiary text-text-muted">
              {change.type}
            </span>
            <span className="text-[10px] text-text-muted font-mono">
              Confidence: {Math.round(change.confidence * 100)}%
            </span>
          </div>
          
          <p className="text-sm text-text-secondary mb-2">{change.explanation}</p>
          
          <div className="grid grid-cols-2 gap-2 text-[10px] text-text-muted">
            <div>
              <span className="font-medium text-text-primary">Why changed:</span>
              <p className="mt-0.5">{change.whyChanged}</p>
            </div>
            <div>
              <span className="font-medium text-text-primary">Expected improvement:</span>
              <p className="mt-0.5">{change.expectedImprovement}</p>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <MetricBadge label="Reasoning" value={change.estimatedReasoningImprovement} />
            <MetricBadge label="Tokens" value={change.estimatedTokenSavings} />
            <MetricBadge label="Quality" value={change.estimatedResponseQuality} />
          </div>
        </div>
        
        <div className="w-48 flex-shrink-0">
          <div className="text-[10px] text-text-muted mb-1">Original</div>
          <pre className="p-2 bg-bg-tertiary rounded text-[10px] text-text-secondary max-h-24 overflow-auto whitespace-pre-wrap font-mono">
            {change.originalText}
          </pre>
          <div className="text-[10px] text-text-muted mt-2 mb-1">Optimized</div>
          <pre className="p-2 bg-bg-tertiary rounded text-[10px] text-text-secondary max-h-24 overflow-auto whitespace-pre-wrap font-mono">
            {change.optimizedText}
          </pre>
        </div>
      </div>
    </div>
  );
}

function MetricBadge({ label, value }: { label: string; value: string }) {
  const colors = {
    high: "bg-success/20 text-success",
    medium: "bg-warning/20 text-warning",
    low: "bg-accent/20 text-accent",
    none: "bg-bg-tertiary text-text-muted",
  };
  
  return (
    <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", colors[value as keyof typeof colors] || colors.none)}>
      {label}: {value.charAt(0).toUpperCase() + value.slice(1)}
    </span>
  );
}

function SummaryStats({ changes }: { changes: import("@/features/optimizer/types").OptimizationChange[] }) {
  const major = changes.filter(c => c.severity === "major").length;
  const moderate = changes.filter(c => c.severity === "moderate").length;
  const minor = changes.filter(c => c.severity === "minor").length;
  const avgConfidence = changes.reduce((sum, c) => sum + c.confidence, 0) / changes.length;
  
  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      <StatCard value={major} label="Major" color="error" />
      <StatCard value={moderate} label="Moderate" color="warning" />
      <StatCard value={minor} label="Minor" color="accent" />
      <StatCard value={`${Math.round(avgConfidence * 100)}%`} label="Confidence" color="success" />
    </div>
  );
}

function StatCard({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <div className="p-2 rounded-lg bg-bg-tertiary">
      <div className={cn("text-lg font-bold", `text-${color}`)}>{value}</div>
      <div className="text-[10px] text-text-muted">{label}</div>
    </div>
  );
}