"use client";

import { motion } from "framer-motion";
import { type LucideIcon, ArrowUpRight } from "lucide-react";
import * as React from "react";

import { listStagger, slideUp } from "@/components/motion";
import { cn } from "@/utils/cn";

export interface QuickStartCardData {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
}

interface QuickStartCardsProps {
  cards: QuickStartCardData[];
  onSelect?: (id: string) => void;
}

/**
 * Quick Start grid rendered from props so future modules can register
 * their own "quick start" affordances without touching this component.
 */
export function QuickStartCards({ cards, onSelect }: QuickStartCardsProps) {
  return (
    <motion.section
      variants={listStagger}
      initial="hidden"
      animate="visible"
      aria-label="Quick start"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        const handle = () => {
          card.onClick?.();
          onSelect?.(card.id);
        };
        return (
          <motion.button
            key={card.id}
            type="button"
            onClick={handle}
            variants={slideUp}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
              "gradient-border group relative flex flex-col items-start gap-2 rounded-xl border border-border-default bg-bg-elevated/80 p-5 text-left",
              "shadow-e1 transition-shadow hover:shadow-e2",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            )}
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-[var(--accent-primary-hover)]">
              <Icon className="size-4" />
            </span>
            <h3 className="text-sm font-semibold text-fg-primary">
              {card.title}
            </h3>
            <p className="text-xs leading-relaxed text-fg-muted">
              {card.description}
            </p>
            <span className="mt-auto inline-flex items-center gap-1 pt-1 text-[11px] font-medium text-fg-secondary opacity-0 transition-opacity group-hover:opacity-100">
              Open
              <ArrowUpRight className="size-3" />
            </span>
          </motion.button>
        );
      })}
    </motion.section>
  );
}
