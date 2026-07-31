import { type Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { generateMetadata } from '@/lib/metadata';
import { communityStats, featuredCreators, recentContributors } from '@/data/community';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CTA } from '@/components/sections/cta';
import {
  Users,
  Star,
  Code,
  MessageCircle,
  Github,
  Twitter,
  ExternalLink,
} from 'lucide-react';

export const metadata: Metadata = generateMetadata({
  title: 'Community',
  description:
    'Join 247+ contributors shaping the future of AI tooling. Explore featured creators, recent contributors, and learn how to contribute to AI Context Studio.',
});

export function CommunityPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <section className="flex flex-1 flex-col">
        <section
          className="section bg-[var(--color-bg-secondary)]"
          aria-labelledby="community-heading"
        >
          <div className="container-app">
            <div className="animate-slide-up mb-16 text-center">
              <h2
                id="community-heading"
                className="mb-4 text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl"
              >
                Community — Built Together
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--color-text-secondary)]">
                Open source thrives on collaboration. Join developers worldwide building the future
                of AI prompt engineering.
              </p>
              <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
                <Badge variant="accent">
                  <Users className="mr-1 h-3 w-3" /> 247+ Contributors
                </Badge>
                <Badge variant="violet">
                  <Star className="mr-1 h-3 w-3" /> 4.2K Stars
                </Badge>
                <Badge variant="cyan">
                  <Code className="mr-1 h-3 w-3" /> 3.4K+ Commits
                </Badge>
                <Badge variant="success">
                  <MessageCircle className="mr-1 h-3 w-3" /> Active Discord
                </Badge>
              </div>
            </div>

            <div
              className="animate-slide-up mb-16 grid gap-8 lg:grid-cols-3"
              style={{ animationDelay: '0.2s' }}
            >
              {communityStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="animate-slide-up rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 text-center"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="mb-2 text-4xl font-bold text-[var(--color-accent)] lg:text-5xl">
                    {stat.value}
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

            <div className="animate-slide-up mb-16" style={{ animationDelay: '0.4s' }}>
              <h3 className="mb-6 text-center text-2xl font-bold text-[var(--color-text-primary)]">
                Featured Creators
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredCreators.map((creator, index) => (
                  <Card
                    key={creator.name}
                    className="card-hover animate-slide-up flex flex-col p-6"
                    style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  >
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--color-accent-light)] text-2xl font-bold text-[var(--color-accent)]">
                        {creator.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[var(--color-text-primary)]">
                          {creator.name}
                        </h4>
                        <p className="text-sm text-[var(--color-text-muted)]">{creator.bio}</p>
                      </div>
                    </div>
                    <div className="mb-4 flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                      <span className="flex items-center gap-1">
                        <Code className="h-4 w-4" /> {creator.assets} Assets
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-[var(--color-warning)]" />{' '}
                        {creator.stars} Stars
                      </span>
                    </div>
                    <div className="mt-auto flex gap-2">
                      <a
                        href={creator.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1 text-center text-sm font-medium text-[var(--color-accent)] hover:underline"
                      >
                        <Github className="h-4 w-4" /> GitHub
                      </a>
                      <a
                        href={creator.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1 text-center text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                      >
                        <Twitter className="h-4 w-4" /> Twitter
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="animate-slide-up mb-16" style={{ animationDelay: '0.6s' }}>
              <h3 className="mb-6 text-center text-2xl font-bold text-[var(--color-text-primary)]">
                Recent Contributors
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {recentContributors.map((contributor, index) => (
                  <div
                    key={contributor.username}
                    className="animate-slide-up rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4"
                    style={{ animationDelay: `${0.6 + index * 0.05}s` }}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-violet-light)] text-lg font-bold text-[var(--color-violet)]">
                        {contributor.username.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)]">
                          {contributor.username}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {contributor.role} · {contributor.contributions} contributions
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="animate-slide-up grid gap-8 lg:grid-cols-2"
              style={{ animationDelay: '0.8s' }}
            >
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
                  href="https://github.com/ai-context-studio"
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
                  href="https://discord.gg/ai-context-studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Button size="lg" variant="outline">
                    Join Discord
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

export default CommunityPage;
