"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";

import { ToastProvider, Toaster } from "@/components/ui/toaster";

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

interface WebProvidersProps {
  children: ReactNode;
}

export function WebProviders({ children }: WebProvidersProps) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <TooltipProvider delayDuration={150}>
          {children}
          <Toaster />
        </TooltipProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}