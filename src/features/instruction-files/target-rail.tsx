"use client";

import { motion } from "framer-motion";
import * as React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag } from "@/components/common";
import { AGENT_INSTRUCTION_TARGETS } from "@/constants/instruction-targets";
import type { AgentInstructionTarget } from "@/types/domain";
import { cn } from "@/utils/cn";

/**
 * Hierarchy step 1: choose the assistant target.
 *
 * Data-driven from `AGENT_INSTRUCTION_TARGETS` so adding a target only
 * requires editing the constants file.
 */
interface TargetRailProps {
  active: AgentInstructionTarget;
  onSelect: (target: AgentInstructionTarget) => void;
}

export function TargetRail({ active, onSelect }: TargetRailProps) {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-1 p-2">
        <p className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Agent Instructions
        </p>
        {AGENT_INSTRUCTION_TARGETS.map((target) => {
          const isActive = target.id === active;
          return (
            <motion.button
              key={target.id}
              type="button"
              onClick={() => onSelect(target.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "group flex flex-col items-start gap-1 rounded-lg border border-transparent px-3 py-2 text-left transition-colors",
                "hover:border-border hover:bg-bg-tertiary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                isActive && "border-border bg-bg-secondary",
              )}
              aria-current={isActive ? "true" : undefined}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  isActive ? "text-text-primary" : "text-text-secondary",
                )}
              >
                {target.label}
              </span>
              <span className="text-[11px] text-text-muted">{target.filename}</span>
              {isActive ? (
                <Tag variant="accent" className="mt-0.5">
                  Selected
                </Tag>
              ) : null}
            </motion.button>
          );
        })}
      </div>
    </ScrollArea>
  );
}