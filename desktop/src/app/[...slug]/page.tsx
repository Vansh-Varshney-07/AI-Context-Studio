import type { Metadata } from "next";
import { Suspense } from "react";
import { AppShellClient } from "@components/layout/app-shell-client";

export const metadata: Metadata = {
  title: "AI Context Studio",
  description: "Local-first AI instruction engineering workspace",
};

export async function generateStaticParams() {
  const moduleRoutes = [
    "",
    "dashboard",
    "skills",
    "personas",
    "workflows",
    "prompt-library",
    "system-prompt-engine",
    "instruction-files",
    "memories",
    "mcp",
    "validator",
    "optimizer",
    "configurations",
    "settings",
  ];
  return moduleRoutes.map((route) => ({
    slug: route ? [route] : [],
  }));
}

export default function CatchAll() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-fg-muted">Loading…</div>}>
      <AppShellClient />
    </Suspense>
  );
}