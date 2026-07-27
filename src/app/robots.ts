import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/static/", "/*.json$"],
    },
    sitemap: "https://ai-context-studio.vercel.app/sitemap.xml",
    host: "https://ai-context-studio.vercel.app",
  };
}

export const dynamic = "force-static";