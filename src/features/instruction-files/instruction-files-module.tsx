"use client";

import { motion } from "framer-motion";
import { FileText, ChevronUp, ChevronDown, Maximize, Minimize, X } from "lucide-react";
import * as React from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AGENT_INSTRUCTION_TARGET_MAP } from "@/constants/instruction-targets";
import type { AgentInstructionTargetInfo } from "@/types/domain";
import type { AgentInstructionTarget } from "@/types/domain";
import { INSTRUCTION_SYNTAX } from "./reference-syntax";
import { TargetRail } from "./target-rail";
import { ReferenceSyntaxView } from "./reference-syntax-view";
import { CustomGenerator } from "./custom-generator";
import { moduleTransition } from "@/components/motion";
import type { ReferenceSyntaxManifest } from "./types";
import { cn } from "@/utils/cn";

type TargetExplainer = AgentInstructionTargetInfo;

/**
 * Instruction File module renderer.
 *
 * Layout:
 *   [TargetRail] | [Resizable Split: Upper Reference Syntax | Lower Custom Generator]
 *
 * Each pane can be collapsed, expanded full-height, or resized via drag handle.
 * Registry-driven hierarchy: the selected target flows from this component's
 * local state. Adding a target = new manifests + questions only.
 */
export function InstructionFilesModule() {
  const [target, setTarget] = React.useState<AgentInstructionTarget>("general");
  const sections = INSTRUCTION_SYNTAX[target] ?? INSTRUCTION_SYNTAX.general ?? [];
  const info: TargetExplainer = AGENT_INSTRUCTION_TARGET_MAP[target];

  const manifest: ReferenceSyntaxManifest = {
    target,
    filename: AGENT_INSTRUCTION_TARGET_MAP[target]?.filename ?? "AGENTS.md",
    summary: AGENT_INSTRUCTION_TARGET_MAP[target]?.description ?? "",
    sections,
  };

  // Pane state
  const [upperCollapsed, setUpperCollapsed] = React.useState(false);
  const [lowerCollapsed, setLowerCollapsed] = React.useState(false);
  const [upperFull, setUpperFull] = React.useState(false);
  const [lowerFull, setLowerFull] = React.useState(false);
  const [splitRatio, setSplitRatio] = React.useState(40); // % for upper pane

  // When one goes full, hide the other
  const showUpper = !lowerFull && !upperCollapsed;
  const showLower = !upperFull && !lowerCollapsed;

  // Drag to resize
  const [dragging, setDragging] = React.useState(false);

  React.useEffect(() => {
    if (dragging) {
      const onMove = (e: MouseEvent) => {
        const container = document.querySelector('.instruction-files-split') as HTMLElement;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const ratio = Math.max(15, Math.min(85, ((e.clientY - rect.top) / rect.height) * 100));
        setSplitRatio(ratio);
      };
      const onUp = () => setDragging(false);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
    }
  }, [dragging]);

  const handleDragStart = () => setDragging(true);

  // Collapse/expand handlers
  const toggleUpper = () => {
    if (upperFull) {
      setUpperFull(false);
    } else {
      setUpperCollapsed(!upperCollapsed);
    }
  };
  const toggleLower = () => {
    if (lowerFull) {
      setLowerFull(false);
    } else {
      setLowerCollapsed(!lowerCollapsed);
    }
  };
  const maximizeUpper = () => {
    setUpperFull(!upperFull);
    if (!upperFull) setLowerCollapsed(true);
  };
  const maximizeLower = () => {
    setLowerFull(!lowerFull);
    if (!lowerFull) setUpperCollapsed(true);
  };

  return (
    <motion.div
      variants={moduleTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid h-full grid-cols-[16rem_minmax(0,1fr)] overflow-hidden"
    >
      <aside className="h-full border-r border-border bg-bg-secondary">
        <TargetRail active={target} onSelect={setTarget} />
      </aside>
      <section className="flex h-full flex-col overflow-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <FileText className="size-4" />
            </span>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-text-primary">
                {info.label} instructions
              </h1>
              <p className="text-xs text-text-muted">{info.description}</p>
            </div>
          </div>
        </header>

        <div
          ref={(el) => { (el as HTMLElement)?.classList.add('instruction-files-split'); }}
          className="flex min-h-0 flex-1 flex-col relative"
        >
          {/* Upper pane: Reference Syntax */}
          {showUpper && (
            <motion.div
              key="upper"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: upperFull ? "100%" : `${splitRatio}%`, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={cn(
                "relative flex flex-col overflow-hidden transition-all duration-200",
                upperCollapsed && "h-12",
                upperFull && "z-10"
              )}
            >
              {!upperCollapsed && !upperFull && (
                <div className="absolute right-2 top-2 z-10 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={maximizeUpper}
                    aria-label="Maximize reference syntax"
                    title="Maximize"
                  >
                    <Maximize className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={toggleUpper}
                    aria-label="Collapse reference syntax"
                    title="Collapse"
                  >
                    <ChevronUp className="size-3.5" />
                  </Button>
                </div>
              )}
              {upperFull && (
                <div className="absolute right-2 top-2 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={maximizeUpper}
                    aria-label="Restore reference syntax"
                    title="Restore"
                  >
                    <Minimize className="size-3.5" />
                  </Button>
                </div>
              )}
              <div className="flex h-full flex-col min-h-0">
                <div className="flex h-12 items-center justify-between border-b border-border px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-text-secondary">Reference Syntax</span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                      Official {info.label} structure
                    </span>
                  </div>
                </div>
                <div className="flex min-h-0 flex-1 overflow-hidden">
                  {!upperCollapsed && <ReferenceSyntaxView manifest={manifest} />}
                </div>
              </div>
            </motion.div>
          )}

          {/* Resize handle */}
          {showUpper && showLower && !upperFull && !lowerFull && (
            <div
              onMouseDown={handleDragStart}
              className="relative h-1.5 cursor-row-resize bg-border hover:bg-accent/50 transition-colors"
              role="separator"
              aria-label="Resize panes"
              aria-orientation="horizontal"
            >
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-6 rounded-full bg-accent/30" />
            </div>
          )}

          {/* Lower pane: Custom Generator */}
          {showLower && (
            <motion.div
              key="lower"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: lowerFull ? "100%" : `${100 - splitRatio}%`, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={cn(
                "relative flex flex-col overflow-hidden transition-all duration-200",
                lowerCollapsed && "h-12",
                lowerFull && "z-10"
              )}
            >
              {!lowerCollapsed && !lowerFull && (
                <div className="absolute right-2 top-2 z-10 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={maximizeLower}
                    aria-label="Maximize generator"
                    title="Maximize"
                  >
                    <Maximize className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={toggleLower}
                    aria-label="Collapse generator"
                    title="Collapse"
                  >
                    <ChevronDown className="size-3.5" />
                  </Button>
                </div>
              )}
              {lowerFull && (
                <div className="absolute right-2 top-2 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={maximizeLower}
                    aria-label="Restore generator"
                    title="Restore"
                  >
                    <Minimize className="size-3.5" />
                  </Button>
                </div>
              )}
              <div className="flex h-full flex-col min-h-0">
                <div className="flex h-12 items-center justify-between border-b border-border px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-text-secondary">Custom Generator</span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                      Dynamic form for {info.label}
                    </span>
                  </div>
                </div>
                <div className="flex min-h-0 flex-1 overflow-hidden">
                  {!lowerCollapsed && (
                    <Card bordered className="m-2 mt-0 min-h-0 overflow-hidden">
                      <CustomGenerator target={target} />
                    </Card>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Collapsed bar when upper is collapsed */}
          {upperCollapsed && !upperFull && showLower && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 36 }}
              className="flex items-center justify-between border-b border-border px-4 bg-bg-secondary/80 hover:bg-bg-secondary"
            >
              <span className="text-xs text-text-muted">Reference Syntax — collapsed</span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleUpper}>
                <ChevronDown className="size-3.5" />
              </Button>
            </motion.div>
          )}

          {/* Collapsed bar when lower is collapsed */}
          {lowerCollapsed && !lowerFull && showUpper && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 36 }}
              className="flex items-center justify-between border-t border-border px-4 bg-bg-secondary/80 hover:bg-bg-secondary"
            >
              <span className="text-xs text-text-muted">Custom Generator — collapsed</span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleLower}>
                <ChevronUp className="size-3.5" />
              </Button>
            </motion.div>
          )}

          {/* Full-screen overlay close button */}
          {(upperFull || lowerFull) && (
            <div className="absolute right-4 top-4 z-20">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-bg-primary/80"
                onClick={() => {
                  setUpperFull(false);
                  setLowerFull(false);
                  setUpperCollapsed(false);
                  setLowerCollapsed(false);
                }}
                aria-label="Exit fullscreen"
              >
                <X className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}