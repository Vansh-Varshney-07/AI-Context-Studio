import { type Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { generateMetadata } from "@/lib/metadata";
import { CommunityPageClient } from "@/components/community/community-page-client";
import { getSiteStats } from "@/actions/stats";
import { getGitHubContributors } from "@/actions/github";

export const metadata: Metadata = generateMetadata({
  title: "Community",
  description:
    "Join the AI Context Studio community. Explore featured creators, recent contributors, and learn how to contribute.",
});

async function getFeaturedUsers() {
  try {
    const { prisma } = await import("@/lib/prisma");
    return await prisma.user.findMany({
      where: { role: { in: ["ADMIN", "OWNER"] } },
      include: {
        _count: { select: { assets: true, followers: true } },
        profile: { select: { displayName: true, headline: true, github: true, website: true } },
      },
      take: 3,
    });
  } catch {
    return [];
  }
}

export default async function CommunityPage() {
  const [siteStats, githubContributors, featuredUsers] = await Promise.all([
    getSiteStats(),
    getGitHubContributors(10),
    getFeaturedUsers(),
  ]);

  return <CommunityPageClient initialStats={siteStats} initialContributors={githubContributors} initialFeaturedUsers={featuredUsers} />;
}