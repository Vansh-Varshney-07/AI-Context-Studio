import Link from 'next/link';
import {
  Github,
  Twitter,
  MessageCircle,
  Rss,
  Star,
  Users,
  Code,
  Eye,
  Forklift,
  Shield,
  BookOpen,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MotionDiv } from '@/components/ui/motion';

const githubStats = [
  { label: 'Stars', value: '4.2K+', icon: Star, color: 'warning' },
  { label: 'Forks', value: '890+', icon: Forklift, color: 'violet' },
  { label: 'Watchers', value: '120+', icon: Eye, color: 'cyan' },
  { label: 'Contributors', value: '247+', icon: Users, color: 'accent' },
  { label: 'Issues Closed', value: '1.1K+', icon: CheckCircle, color: 'success' },
  { label: 'Commits', value: '3.4K+', icon: Code, color: 'default' },
];

const repos = [
  {
    name: 'ai-context-studio',
    desc: 'Main monorepo: desktop app, web, shared packages',
    stars: '4.2K',
    lang: 'TypeScript',
  },
  {
    name: 'desktop',
    desc: 'Tauri + Next.js native desktop application',
    stars: '1.8K',
    lang: 'TypeScript',
  },
  {
    name: 'web',
    desc: 'Static export: landing, marketplace, docs',
    stars: '980',
    lang: 'TypeScript',
  },
  {
    name: 'shared',
    desc: 'Shared UI components, hooks, types, utils',
    stars: '650',
    lang: 'TypeScript',
  },
  {
    name: 'marketplace',
    desc: 'Rust crate for asset catalog & install protocol',
    stars: '420',
    lang: 'Rust',
  },
  {
    name: 'registry',
    desc: 'Rust crate for asset indexing & metadata',
    stars: '380',
    lang: 'Rust',
  },
];

export function GitHubCTA() {
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
            Every component is MIT licensed. Join 247+ contributors shaping the future of AI
            tooling.
          </p>
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
            <Badge variant="accent">
              <Github className="mr-1 h-3 w-3" /> 4.2K Stars
            </Badge>
            <Badge variant="violet">
              <Forklift className="mr-1 h-3 w-3" /> 890 Forks
            </Badge>
            <Badge variant="cyan">
              <Users className="mr-1 h-3 w-3" /> 247 Contributors
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
          {githubStats.map((stat, index) => (
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
                {stat.value}
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
            {repos.map((repo, index) => (
              <MotionDiv
                key={repo.name}
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
                      <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{repo.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" />
                      {repo.stars}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {repo.lang}
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
                href="https://github.com/ai-context-studio"
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
