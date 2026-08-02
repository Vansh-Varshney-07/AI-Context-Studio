"use client";

import Link from "next/link";
import {
  Github,
  Star,
  Users,
  Code,
  Eye,
  Forklift,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MotionDiv } from "@/components/ui/motion";
import { formatNumber } from "@/lib/format";

interface GitHubStats {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  contributors: number;
  totalCommits: number;
}

interface GitHubRepo {
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

interface GitHubCTAClientProps {
  initialStats: GitHubStats | null;
  initialRepos: GitHubRepo[];
}

const githubStatsConfig = [
  { label: "Stars", key: "stars" as keyof GitHubStats, icon: Star, color: "warning" },
  { label: "Forks", key: "forks" as keyof GitHubStats, icon: Forklift, color: "violet" },
  { label: "Watchers", key: "watchers" as keyof GitHubStats, icon: Eye, color: "cyan" },
  { label: "Contributors", key: "contributors" as keyof GitHubStats, icon: Users, color: "accent" },
  { label: "Open Issues", key: "openIssues" as keyof GitHubStats, icon: CheckCircle, color: "success" },
  { label: "Commits", key: "totalCommits" as keyof GitHubStats, icon: Code, color: "default" },
];

export function GitHubCTAClient({ initialStats, initialRepos }: GitHubCTAClientProps) {
  const stats = initialStats || {
    stars: 0,
    forks: 0,
    watchers: 0,
    openIssues: 0,
    contributors: 0,
    totalCommits: 0,
  };

  const repos = initialRepos.length > 0 ? initialRepos : [
    {
      id: 1,
      name: "AI-Context-Studio",
      full_name: "Vansh-Varshney-07/AI-Context-Studio",
      description: "Main monorepo: desktop app, web, shared packages",
      stargazers_count: stats.stars,
      forks_count: stats.forks,
      watchers_count: stats.watchers,
      open_issues_count: stats.openIssues,
      language: "TypeScript",
      html_url: "https://github.com/Vansh-Varshney-07/AI-Context-Studio",
      updated_at: new Date().toISOString(),
      owner: { login: "Vansh-Varshney-07", avatar_url: "https://github.com/Vansh-Varshney-07.png" },
    },
  ];

  return (
    <section
      id="github"
      className="section bg-[var(--color-bg-secondary)]"
      aria-labelledby="github-heading"
    >
      <div className="container-app">
        <MotionDiv
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2
            id="github-heading"
            className="mb-4 text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl"
          >
            Open Source — Built in Public
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--color-text-secondary)]">
            Every component is MIT licensed. Join {formatNumber(stats.contributors)}+ contributors shaping the future of AI
            tooling.
          </p>
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
            <Badge variant="accent">
              <Github className="mr-1 h-3 w-3" /> {formatNumber(stats.stars)} Stars
            </Badge>
            <Badge variant="violet">
              <Forklift className="mr-1 h-3 w-3" /> {formatNumber(stats.forks)} Forks
            </Badge>
            <Badge variant="cyan">
              <Users className="mr-1 h-3 w-3" /> {formatNumber(stats.contributors)} Contributors
            </Badge>
            <Badge variant="success">
              <Shield className="mr-1 h-3 w-3" /> MIT License
            </Badge>
          </div>
        </MotionDiv>

        <MotionDiv
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {githubStatsConfig.map((stat, index) => (
            <MotionDiv
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 text-center transition-colors hover:border-[var(--color-border-strong)]"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)]">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-[var(--color-text-primary)]">
                {formatNumber(stats[stat.key])}
              </div>
              <div className="text-sm text-[var(--color-text-muted)]">{stat.label}</div>
            </MotionDiv>
          ))}
        </MotionDiv>

        <MotionDiv
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="mb-6 text-center text-xl font-semibold text-[var(--color-text-primary)]">
            Core Repositories
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {repos.slice(0, 6).map((repo, index) => (
              <MotionDiv
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <Card className="card-hover h-full p-6">
                  <div className="mb-3 flex items-start gap-3">
                    <Github className="mt-0.5 h-6 w-6 shrink-0 text-[var(--color-text-muted)]" />
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-mono font-semibold text-[var(--color-text-primary)]">
                        {repo.name}
                      </h4>
                      <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">
                        {repo.description || "No description"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" />
                      {formatNumber(repo.stargazers_count)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {repo.language || "TypeScript"}
                    </Badge>
                  </div>
                </Card>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>

        <MotionDiv
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="inline-flex items-center gap-4">
            <Button size="lg">
              <Link
                href="https://github.com/Vansh-Varshney-07/AI-Context-Studio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Github className="h-5 w-5" />
                View on GitHub
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="/community#contribute" className="inline-flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contribute
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            Read our{' '}
            <a href="/community#contribute" className="text-[var(--color-accent)] hover:underline">
              Contributing Guide
            </a>{' '}
            and{' '}
            <a href="/community#conduct" className="text-[var(--color-accent)] hover:underline">
              Code of Conduct
            </a>
          </p>
        </MotionDiv>
      </div>
    </section>
  );
}