"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import type { ReferenceSyntaxManifest } from "./types";

/**
 * Upper pane: Reference Syntax. Renders the canonical official structure
 * of the active target's instruction file. Pure presentation.
 */
interface ReferenceSyntaxViewProps {
  manifest: ReferenceSyntaxManifest;
}

export function ReferenceSyntaxView({ manifest }: ReferenceSyntaxViewProps) {
  return (
    <section className="flex h-full flex-col gap-4 overflow-hidden p-5">
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold tracking-tight text-text-primary">
            Reference syntax
          </h3>
          <Badge variant="default">{manifest.filename}</Badge>
        </div>
        <p className="text-xs leading-relaxed text-text-muted">
          {manifest.summary}
        </p>
      </header>
      <div className="relative flex-1 overflow-hidden rounded-lg border border-border bg-bg-secondary/40">
        <ScrollableSections manifest={manifest} />
      </div>
    </section>
  );
}

const ScrollableSections: React.FC<{ manifest: ReferenceSyntaxManifest }> =
  function ScrollableSections({ manifest }) {
    return (
      <div className="h-full overflow-y-auto px-5 py-4">
        <ol className="space-y-4">
          {manifest.sections.map((section, index) => (
            <li key={section.id} className="flex gap-3">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-accent/10 text-[10px] font-semibold text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  {section.heading}
                </p>
                <p className="text-sm leading-relaxed text-text-muted">
                  {section.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  };