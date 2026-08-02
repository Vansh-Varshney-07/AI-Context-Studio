"use server";

import { prisma } from "@/lib/prisma";
import { getGitHubStats } from "./github";

export interface SiteStats {
  marketplace: {
    assetCount: number;
    totalDownloads: number;
  };
  community: {
    userCount: number;
    postCount: number;
  };
  github: {
    stars: number;
    forks: number;
    watchers: number;
    openIssues: number;
    contributors: number;
    totalCommits: number;
  };
}

async function safeDbQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch {
    return fallback;
  }
}

export async function getSiteStats(): Promise<SiteStats> {
  const githubStats = await getGitHubStats();

  const [assetCount, totalDownloads, userCount, postCount] = await Promise.all([
    safeDbQuery(() => prisma.asset.count({ where: { status: "PUBLISHED", visibility: "PUBLIC" } }), 0),
    safeDbQuery(() => prisma.asset.aggregate({ where: { status: "PUBLISHED", visibility: "PUBLIC" }, _sum: { downloads: true } }), { _sum: { downloads: 0 } }),
    safeDbQuery(() => prisma.user.count(), 0),
    safeDbQuery(() => prisma.post.count({ where: { status: "PUBLISHED" } }), 0),
  ]);

  return {
    marketplace: {
      assetCount,
      totalDownloads: totalDownloads._sum.downloads || 0,
    },
    community: {
      userCount,
      postCount,
    },
    github: githubStats || {
      stars: 0,
      forks: 0,
      watchers: 0,
      openIssues: 0,
      contributors: 0,
      totalCommits: 0,
    },
  };
}