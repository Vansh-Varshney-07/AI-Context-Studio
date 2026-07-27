import { Construction } from "lucide-react";
import * as React from "react";

import { EmptyState } from "@shared/components/common/empty-state";
import type { ModuleParams } from "@shared/types/navigation";

/**
 * Module renderer contract.
 *
 * Every module exposes a single React component implementing this contract.
 * It receives the active navigation params and renders inside MainWorkspace.
 */
export interface ModuleRendererProps<P extends ModuleParams = ModuleParams> {
  params: P;
}

export type ModuleRenderer = React.ComponentType<ModuleRendererProps>;

/**
 * Registry mapping `ModuleId -> ModuleRenderer`.
 * Adding a new module = appending to this map — nothing else.
 */
export interface ModuleRendererRegistry {
  [id: string]: ModuleRenderer;
}

/**
 * Placeholder renderer shown when a module is registered in the manifest
 * but its renderer is not yet implemented. Per the stack-engineer contract
 * we do NOT ship unimplemented features; this placeholder is the explicit
 * "not yet built" affordance that precedes a build phase.
 */
export function ComingSoon<P extends ModuleParams>({ params }: ModuleRendererProps<P>) {
  return (
    <div className="mx-auto flex max-w-3xl px-6 py-16">
      <EmptyState
        icon={Construction}
        title="Coming in a later phase"
        description="This module is scaffolded into navigation; its UI is built in the corresponding build phase."
        action={<span className="text-xs text-fg-subtle">params: {Object.keys(params).length ? Object.keys(params).join(", ") : "—"}</span>}
      />
    </div>
  );
}

