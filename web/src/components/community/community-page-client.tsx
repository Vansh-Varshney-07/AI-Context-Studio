"use client";

import { Header, Footer } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CTA } from "@/components/sections/cta";
import {
  Users,
  Star,
  Code,
  MessageCircle,
  Github,
  ExternalLink,
} from "lucide-react";
import { formatNumber } from "@/lib/format";

interface SiteStats {
  marketplace: { assetCount: number; totalDownloads: number };
  community: { userCount: number; postCount: number };
  github: { stars: number; forks: number; watchers: number; openIssues: number; contributors: number; totalCommits: number };
}

interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

interface FeaturedUser {
  id: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
  bio: string | null;
  profile: {
    displayName: string | null;
    headline: string | null;
    github: string | null;
    website: string | null;
  } | null;
  _count: { assets: number; followers: number };
}

interface CommunityPageClientProps {
  initialStats: SiteStats;
  initialContributors: GitHubContributor[];
  initialFeaturedUsers: FeaturedUser[];
}

export function CommunityPageClient({ initialStats, initialContributors, initialFeaturedUsers }: CommunityPageClientProps) {
  const stats = initialStats;
  const githubContributors = initialContributors;
  const featuredUsers = initialFeaturedUsers;

  const communityStats = [
    { label: "Contributors", value: stats.github.contributors, description: "Active developers building with us" },
    { label: "Assets Published", value: stats.marketplace.assetCount, description: "Skills, personas, templates & more" },
    { label: "Community Members", value: stats.community.userCount, description: "Developers worldwide" },
    { label: "GitHub Stars", value: stats.github.stars, description: "Open source appreciation" },
    { label: "Discussions", value: stats.community.postCount, description: "Questions, ideas, and showcases" },
  ];

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <section className="flex flex-1 flex-col">
        <section className="section bg-[var(--color-bg-secondary)]" aria-labelledby="community-heading">
          <div className="container-app">
            <div className="animate-slide-up mb-16 text-center">
              <h2 id="community-heading" className="mb-4 text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl">
                Community — Built Together
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--color-text-secondary)]">
                Open source thrives on collaboration. Join developers worldwide building the future
                of AI prompt engineering.
              </p>
              <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
                <Badge variant="accent">
                  <Users className="mr-1 h-3 w-3" /> {formatNumber(stats.github.contributors)}+ Contributors
                </Badge>
                <Badge variant="violet">
                  <Star className="mr-1 h-3 w-3" /> {formatNumber(stats.github.stars)} Stars
                </Badge>
                <Badge variant="cyan">
                  <Code className="mr-1 h-3 w-3" /> {formatNumber(stats.github.totalCommits)}+ Commits
                </Badge>
                <Badge variant="success">
                  <MessageCircle className="mr-1 h-3 w-3" /> {formatNumber(stats.community.postCount)}+ Discussions
                </Badge>
              </div>
            </div>

            <div className="animate-slide-up mb-16 grid gap-8 lg:grid-cols-3" style={{ animationDelay: "0.2s" }}>
              {communityStats.slice(0, 3).map((stat, index) => (
                <div
                  key={stat.label}
                  className="animate-slide-up rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 text-center"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="mb-2 text-4xl font-bold text-[var(--color-accent)] lg:text-5xl">
                    {formatNumber(stat.value)}
                  </div>
                  <div className="text-lg font-semibold text-[var(--color-text-primary)]">
                    {stat.label}
                  </div>
                  <div className="mt-1 text-sm text-[var(--color-text-muted)]">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>

            {featuredUsers.length > 0 ? (
              <div className="animate-slide-up mb-16" style={{ animationDelay: "0.4s" }}>
                <h3 className="mb-6 text-center text-2xl font-bold text-[var(--color-text-primary)]">
                  Featured Creators
                </h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featuredUsers.map((user, index) => {
                    const profile = user.profile;
                    const displayName = profile?.displayName || user.name || user.username || "Unknown";
                    const bio = profile?.headline || user.bio || "Contributing to AI Context Studio";
                    const avatarUrl = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;
                    const githubUrl = profile?.github || `https://github.com/${user.username}`;
                    const websiteUrl = profile?.website;

                    return (
                      <Card key={user.id} className="card-hover animate-slide-up flex flex-col p-6" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                        <div className="mb-4 flex items-center gap-4">
                          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--color-accent-light)] text-2xl font-bold text-[var(--color-accent)]">
                            <img src={avatarUrl} alt={displayName} className="h-16 w-16 rounded-xl" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-[var(--color-text-primary)]">
                              {displayName}
                            </h4>
                            <p className="text-sm text-[var(--color-text-muted)]">{bio}</p>
                          </div>
                        </div>
                        <div className="mb-4 flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                          <span className="flex items-center gap-1">
                            <Code className="h-4 w-4" /> {user._count.assets} Assets
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current text-[var(--color-warning)]" /> {user._count.followers} Followers
                          </span>
                        </div>
                        <div className="mt-auto flex gap-2">
                          <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center gap-1 text-center text-sm font-medium text-[var(--color-accent)] hover:underline"
                          >
                            <Github className="h-4 w-4" /> GitHub
                          </a>
                          {websiteUrl && (
                            <a
                              href={websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-1 items-center justify-center gap-1 text-center text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                            >
                              <ExternalLink className="h-4 w-4" /> Website
                            </a>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="animate-slide-up mb-16 text-center" style={{ animationDelay: "0.4s" }}>
                <p className="text-[var(--color-text-secondary)] mb-4">No featured creators yet. Be the first to contribute!</p>
                <a href="https://github.com/Vansh-Varshney-07/AI-Context-Studio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                  <Button size="lg" variant="outline">Contribute on GitHub</Button>
                </a>
              </div>
            )}

            <div className="animate-slide-up mb-16" style={{ animationDelay: "0.6s" }}>
              <h3 className="mb-6 text-center text-2xl font-bold text-[var(--color-text-primary)]">
                Recent Contributors
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {githubContributors.length > 0 ? (
                  githubContributors.map((contributor, index) => (
                    <div
                      key={contributor.id}
                      className="animate-slide-up rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4"
                      style={{ animationDelay: `${0.6 + index * 0.05}s` }}
                    >
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-violet-light)] text-lg font-bold text-[var(--color-violet)]">
                          <img src={contributor.avatar_url} alt={contributor.login} className="h-10 w-10 rounded-lg" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                        </div>
                        <div>
                          <p className="font-medium text-[var(--color-text-primary)]">
                            {contributor.login}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            Contributor · {contributor.contributions} contributions
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-[var(--color-text-secondary)]">No contributors found yet. Be the first!</p>
                  </div>
                )}
              </div>
            </div>

            <div className="animate-slide-up grid gap-8 lg:grid-cols-2" style={{ animationDelay: "0.8s" }}>
              <Card className="card-hover p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent-light)] text-[var(--color-accent)]">
                  <Github className="h-8 w-8" />
                </div>
                <h4 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">
                  Contribute on GitHub
                </h4>
                <p className="mb-6 text-[var(--color-text-secondary)]">
                  Found a bug? Have a feature request? Want to improve documentation? All
                  contributions welcome.
                </p>
                <a
                  href="https://github.com/Vansh-Varshney-07/AI-Context-Studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Button size="lg">View Contributing Guide</Button>
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Card>
              <Card className="card-hover p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-violet-light)] text-[var(--color-violet)]">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <h4 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">
                  Join the Discussion
                </h4>
                <p className="mb-6 text-[var(--color-text-secondary)]">
                  Connect with other developers, share your assets, get help, and shape the roadmap.
                </p>
                <a
                  href="https://github.com/Vansh-Varshney-07/AI-Context-Studio/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Button size="lg" variant="outline">
                    GitHub Discussions
                  </Button>
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Card>
            </div>
          </div>
        </section>
        <CTA />
      </section>
      <Footer />
    </main>
  );
}