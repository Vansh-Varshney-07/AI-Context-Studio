import type { MetadataRoute } from "next";

const MODULES = [
  "",
  "/dashboard",
  "/skills",
  "/personas",
  "/workflows",
  "/prompt-library",
  "/system-prompt-engine",
  "/instruction-files",
  "/memories",
  "/mcp",
  "/validator",
  "/optimizer",
  "/settings",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ai-context-studio.vercel.app";
  const now = new Date();

  return MODULES.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}

export const dynamic = "force-static";