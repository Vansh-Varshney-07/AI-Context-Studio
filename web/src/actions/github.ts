"use server";

import { getGitHubStats as fetchGitHubStats, getGitHubContributors as fetchGitHubContributors, getGitHubReleases as fetchGitHubReleases, getGitHubRepo as fetchGitHubRepo } from "@/lib/github";
import type { GitHubStats, GitHubContributor, GitHubRelease, GitHubRepo } from "@/lib/github";

async function safeGitHubCall<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function getGitHubStats(): Promise<GitHubStats | null> {
  return safeGitHubCall(fetchGitHubStats, null);
}

export async function getGitHubContributors(limit = 10): Promise<GitHubContributor[]> {
  return safeGitHubCall(() => fetchGitHubContributors(limit), []);
}

export async function getGitHubReleases(limit = 10): Promise<GitHubRelease[]> {
  return safeGitHubCall(() => fetchGitHubReleases(limit), []);
}

export async function getGitHubReposList(): Promise<GitHubRepo[]> {
  return safeGitHubCall(async () => {
    const repo = await fetchGitHubRepo();
    return repo ? [repo] : [];
  }, []);
}