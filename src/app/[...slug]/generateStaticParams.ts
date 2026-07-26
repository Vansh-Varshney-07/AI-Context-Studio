import type { Metadata } from "next";

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

export default function CatchAllPage() {
  return null;
}