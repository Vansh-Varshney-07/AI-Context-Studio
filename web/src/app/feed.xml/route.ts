import { getBlogPosts } from "@/actions/blog";
import { siteConfig } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  const { posts } = await getBlogPosts({ limit: 20, status: "PUBLISHED" });

  const items = posts
    .map(
      (post: { slug: string; title: string; excerpt: string | null; content: string; publishedAt: Date | null; author: { name: string | null; username: string | null } }) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteConfig.url}/blog/${post.slug}</link>
      <guid>${siteConfig.url}/blog/${post.slug}</guid>
      <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt || post.content.slice(0, 200))}</description>
      <author>${escapeXml(post.author.name || post.author.username || "AI Context Studio")}</author>
    </item>`
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} Blog</title>
    <link>${siteConfig.url}/blog</link>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Release notes, announcements, development logs, tutorials, and community showcases from ${escapeXml(siteConfig.name)}.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
