import { getGitHubStats, getGitHubReposList } from "@/actions/github";
import { GitHubCTAClient } from "./github-cta-client";

export async function GitHubCTA() {
  const [stats, repos] = await Promise.all([
    getGitHubStats(),
    getGitHubReposList(),
  ]);

  return <GitHubCTAClient initialStats={stats} initialRepos={repos} />;
}