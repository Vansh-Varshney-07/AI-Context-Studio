"use server";

import { prisma } from "@/lib/prisma";
import type { Platform } from "@prisma/client";

export async function getReleases() {
  return prisma.release.findMany({
    where: { isDraft: false },
    include: {
      assets: { orderBy: [{ isRecommended: "desc" }, { platform: "asc" }] },
    },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getLatestRelease() {
  return prisma.release.findFirst({
    where: { isDraft: false, isPrerelease: false },
    include: {
      assets: { orderBy: [{ isRecommended: "desc" }, { platform: "asc" }] },
    },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getReleaseByVersion(version: string) {
  return prisma.release.findUnique({
    where: { version },
    include: {
      assets: { orderBy: [{ isRecommended: "desc" }, { platform: "asc" }] },
    },
  });
}

export async function getPlatformDownloads(platform: Platform) {
  const latestRelease = await getLatestRelease();
  if (!latestRelease) return [];

  return latestRelease.assets.filter((a) => a.platform === platform);
}

export async function getAllPlatformDownloads() {
  const latestRelease = await getLatestRelease();
  if (!latestRelease) return [];

  const grouped = latestRelease.assets.reduce((acc, asset) => {
    if (!acc[asset.platform]) acc[asset.platform] = [];
    acc[asset.platform].push(asset);
    return acc;
  }, {} as Record<Platform, typeof latestRelease.assets>);

  return grouped;
}

export async function getSystemRequirements() {
  return {
    windows: "Windows 10 1903+ (64-bit)",
    macos: "macOS 12+ (Monterey) — Universal binary supports both Intel and Apple Silicon",
    linux: "glibc 2.31+, GTK 3.24+, WebKit2GTK 2.38+ — AppImage runs on most modern distributions",
    node: "Node.js 20+ (for development)",
    rust: "Rust 1.77+ (for development)",
    memory: "Minimum 512 MB RAM, Recommended 2 GB+",
    disk: "200 MB for app + assets",
  };
}

export async function getSourceCodeInfo() {
  return {
    label: "Source Code",
    description: "Build from source or audit the codebase.",
    url: "https://github.com/ai-context-studio/ai-context-studio",
    releasesUrl: "https://github.com/ai-context-studio/ai-context-studio/releases",
    instructions: [
      "Clone: `git clone https://github.com/ai-context-studio/ai-context-studio.git`",
      "Install: `cd ai-context-studio/desktop && npm install`",
      "Build: `npm run build && npm run tauri build`",
      "Requirements: Node.js 20+, Rust 1.77+, system dependencies",
    ],
  };
}

export async function verifyChecksum(_filePath: string, _expectedChecksum: string): Promise<boolean> {
  // This would be implemented client-side or via a separate verification service
  // For now, return the expected checksum for display
  return true;
}