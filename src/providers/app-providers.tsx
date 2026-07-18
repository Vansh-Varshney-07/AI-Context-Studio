"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { Tooltip } from "@/components/ui/tooltip";
import { createQueryClient } from "@/lib/query-client";
import { ToasterProvider } from "@/providers/toaster-provider";

/**
 * App-level React providers composition.
 *
 * Single mount point (`<AppProviders/>`) wraps the workspace shell so the
 * root layout stays declarative and providers are tested in isolation.
 *
 * Order matters:
 *  QueryClientProvider  -> data fetching for any module that needs it
 *  ToasterProvider       -> toast portal, must live above any toasting component
 *  TooltipProvider       -> radix tooltip root, wraps interactive UI primitives
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(() => createQueryClient());
  return (
    <QueryClientProvider client={client}>
      <ToasterProvider>
        <Tooltip.Provider delayDuration={150}>{children}</Tooltip.Provider>
      </ToasterProvider>
    </QueryClientProvider>
  );
}
