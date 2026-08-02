export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string | null;
  html_url: string;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export interface GitHubReleaseAsset {
  name: string;
  size: number;
  browser_download_url: string;
  content_type: string;
}

export interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string | null;
  published_at: string;
  html_url: string;
  assets: GitHubReleaseAsset[];
  prerelease: boolean;
  draft: boolean;
}

export interface GitHubStats {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  contributors: number;
  totalCommits: number;
}

const GITHUB_API_BASE = "https://api.github.com";

async function githubFetch<T>(endpoint: string): Promise<T | null> {
  const owner = process.env.GITHUB_OWNER || "Vansh-Varshney-07";
  const repo = process.env.GITHUB_REPO || "AI-Context-Studio";
  const token = process.env.GITHUB_TOKEN;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}${endpoint}`, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.warn(`GitHub API error: ${response.status} ${response.statusText} for ${endpoint}`);
      return null;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.warn(`GitHub API fetch failed for ${endpoint}:`, error);
    return null;
  }
}

export async function getGitHubRepo(): Promise<GitHubRepo | null> {
  return githubFetch<GitHubRepo>("");
}

export async function getGitHubContributors(limit = 10): Promise<GitHubContributor[]> {
  const data = await githubFetch<GitHubContributor[]>(`/contributors?per_page=${limit}&anon=1`);
  return data || [];
}

export async function getGitHubReleases(limit = 10): Promise<GitHubRelease[]> {
  const data = await githubFetch<GitHubRelease[]>(`/releases?per_page=${limit}`);
  return data || [];
}

export async function getGitHubStats(): Promise<GitHubStats | null> {
  const repo = await getGitHubRepo();
  if (!repo) return null;

  const contributors = await getGitHubContributors(100);
  
  // For commits count, we'd need to use the commits API which is paginated
  // For now, we'll estimate or use a cached value
  let totalCommits = 0;
  try {
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_OWNER || "Vansh-Varshney-07"}/${process.env.GITHUB_REPO || "AI-Context-Studio"}/commits?per_page=1`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
        },
      }
    );
    // Parse Link header for total count
    const linkHeader = commitsResponse.headers.get("link");
    if (linkHeader) {
      const lastMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
      if (lastMatch && lastMatch[1]) {
        totalCommits = parseInt(lastMatch[1], 10);
      }
    }
  } catch {
    // Ignore commit count errors
  }

  return {
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    watchers: repo.watchers_count,
    openIssues: repo.open_issues_count,
    contributors: contributors.length,
    totalCommits,
  };
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}