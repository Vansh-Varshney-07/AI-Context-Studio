"use client";

import { motion } from "framer-motion";
import { type LucideIcon, MoreHorizontal } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/empty-state";
import { slideUp } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/utils/date";
import { cn } from "@/utils/cn";

export interface RecentFileItem {
  id: string;
  icon: LucideIcon;
  title: string;
  kindLabel: string;
  updatedAt: string;
  tags?: string[];
  pinned?: boolean;
}

interface RecentFilesProps {
  files: RecentFileItem[];
  onOpen?: (id: string) => void;
  className?: string;
}

/**
 * Recent files panel — single, premium-styled list section. When empty,
 * renders an EmptyState so the dashboard never has a hollow panel.
 */
export function RecentFiles({ files, onOpen, className }: RecentFilesProps) {
  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-fg-primary">Recent files</h2>
        <Button variant="ghost" size="sm">
          View all
        </Button>
      </div>

      {files.length === 0 ? (
        <EmptyState
          icon={MoreHorizontal}
          title="No recent files yet"
          description="Create an instruction file or prompt to see it here."
          action={
            <Button size="sm" variant="secondary">
              Create your first file
            </Button>
          }
        />
      ) : (
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="flex flex-col gap-2"
        >
          {files.map((file) => (
            <RecentFileRow key={file.id} file={file} onOpen={onOpen} />
          ))}
        </motion.ul>
      )}
    </section>
  );
}

const RecentFileRow = React.forwardRef<
  HTMLLIElement,
  { file: RecentFileItem; onOpen?: (id: string) => void }
>(function RecentFileRow({ file, onOpen }, ref) {
  const Icon = file.icon;
  return (
    <motion.li ref={ref} variants={slideUp} whileTap={{ scale: 0.99 }}>
      <button
        type="button"
        onClick={() => onOpen?.(file.id)}
        className="gradient-border flex w-full items-center gap-3 rounded-lg border border-border-default bg-bg-elevated/70 p-3 text-left shadow-e1 transition-shadow hover:shadow-e2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span className="flex size-8 items-center justify-center rounded-md bg-white/5 text-fg-secondary">
          <Icon className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-fg-primary">
              {file.title}
            </span>
            {file.pinned ? <Pin /> : null}
          </span>
          <span className="mt-0.5 flex items-center gap-2 text-xs text-fg-muted">
            <span>{file.kindLabel}</span>
            <span aria-hidden>•</span>
            <span>{formatRelativeTime(file.updatedAt)}</span>
          </span>
        </span>
        {file.tags?.length ? (
          <span className="hidden shrink-0 items-center gap-1 md:flex">
            {file.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </span>
        ) : null}
        <MoreHorizontal className="size-4 shrink-0 text-fg-subtle" />
      </button>
    </motion.li>
  );
});

function Pin() {
  return (
    <span
      title="Pinned"
      className="inline-flex shrink-0 text-[var(--accent-primary-hover)]"
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M16 3l5 5-3 1.5-1.5 5.5L13 13l-7 8 2-8-4-4 12-6z" />
      </svg>
    </span>
  );
}
