import { type Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { generateMetadata } from '@/lib/metadata';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Calendar, Tag, Github, Twitter, MessageCircle, ExternalLink } from 'lucide-react';

export const metadata: Metadata = generateMetadata({
  title: 'Blog & Updates',
  description: 'Latest news, release notes, announcements, and development logs from AI Context Studio. Stay up to date with new features, community highlights, and roadmap progress.',
});

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: 'release' | 'announcement' | 'devlog' | 'tutorial' | 'showcase';
  author: { name: string; avatar: string; github: string };
  tags: string[];
  readTime: string;
  featured?: boolean;
  thumbnail?: string;
}

const blogPosts: BlogPost[] = [
  {
    slug: 'v1-2-0-release',
    title: 'AI Context Studio v1.2.0 — MCP Server Support, Agent Orchestration, and Plugin SDK',
    description: 'Major release adding Model Context Protocol server integration, multi-agent workflow orchestration, and a new TypeScript Plugin SDK for custom exporters and validators.',
    date: '2024-08-15',
    category: 'release',
    author: { name: 'Sarah Chen', avatar: 'SC', github: 'sarahchen' },
    tags: ['MCP', 'Agents', 'Plugin SDK', 'Workflows'],
    readTime: '8 min read',
    featured: true,
    thumbnail: 'https://picsum.photos/seed/v120-release/800/450',
  },
  {
    slug: 'marketplace-milestone',
    title: 'Marketplace Hits 10,000 Assets — Community Celebration',
    description: 'The AI Context Studio marketplace has surpassed 10,000 community-published assets. We celebrate the creators and highlight the most impactful skills, personas, and workflows.',
    date: '2024-08-01',
    category: 'announcement',
    author: { name: 'Priya Patel', avatar: 'PP', github: 'priyapatel' },
    tags: ['Marketplace', 'Community', 'Milestone'],
    readTime: '5 min read',
    featured: true,
    thumbnail: 'https://picsum.photos/seed/marketplace-10k/800/450',
  },
  {
    slug: 'security-audit-results',
    title: 'Third-Party Security Audit Complete — Zero Critical Findings',
    description: 'Independent security firm Trail of Bits completed a comprehensive audit of AI Context Studio v1.1. Results: zero critical, zero high, and only two low-severity findings (all addressed).',
    date: '2024-07-28',
    category: 'announcement',
    author: { name: 'Alex Rivera', avatar: 'AR', github: 'alexr' },
    tags: ['Security', 'Audit', 'Compliance'],
    readTime: '6 min read',
    thumbnail: 'https://picsum.photos/seed/security-audit/800/450',
  },
  {
    slug: 'building-custom-skills',
    title: 'Tutorial: Building Custom Skills for Your Team',
    description: 'Step-by-step guide to creating reusable AI skills with typed inputs/outputs, validation, and versioning. Includes real-world examples for code review, API design, and testing.',
    date: '2024-07-20',
    category: 'tutorial',
    author: { name: 'Jordan Kim', avatar: 'JK', github: 'jordankim' },
    tags: ['Skills', 'Tutorial', 'TypeScript', 'Best Practices'],
    readTime: '12 min read',
    thumbnail: 'https://picsum.photos/seed/custom-skills/800/450',
  },
  {
    slug: 'v1-1-0-release',
    title: 'AI Context Studio v1.1.0 — Workflow Engine, Memory System, and Prompt Optimizer',
    description: 'New release introduces visual workflow builder, persistent agent memories, and AI-powered prompt optimization. Plus: improved MCP manager and marketplace search.',
    date: '2024-06-15',
    category: 'release',
    author: { name: 'Marcus Johnson', avatar: 'MJ', github: 'marcusj' },
    tags: ['Workflows', 'Memories', 'Prompt Optimizer', 'MCP'],
    readTime: '10 min read',
    featured: true,
    thumbnail: 'https://picsum.photos/seed/v110-release/800/450',
  },
  {
    slug: 'registry-spec-v2',
    title: 'Registry Specification v2.0 — Federated Discovery and Dependency Lockfiles',
    description: 'The new registry spec adds federated registry discovery, reproducible dependency lockfiles (asset-lock.json), and enhanced compatibility metadata for cross-target assets.',
    date: '2024-06-01',
    category: 'devlog',
    author: { name: 'Taylor Moore', avatar: 'TM', github: 'taylorm' },
    tags: ['Registry', 'Specification', 'Federation', 'Lockfiles'],
    readTime: '9 min read',
    thumbnail: 'https://picsum.photos/seed/registry-v2/800/450',
  },
  {
    slug: 'showcase-production-apps',
    title: 'Community Showcase: 5 Production Apps Built with AI Context Studio',
    description: 'Real teams share how they use AI Context Studio in production: fintech API generation, healthcare compliance automation, game dev asset pipelines, and more.',
    date: '2024-05-20',
    category: 'showcase',
    author: { name: 'Taylor Moore', avatar: 'TM', github: 'taylorm' },
    tags: ['Showcase', 'Production', 'Case Studies'],
    readTime: '7 min read',
    thumbnail: 'https://picsum.photos/seed/showcase-apps/800/450',
  },
  {
    slug: 'mcp-integration-deep-dive',
    title: 'Deep Dive: MCP Integration Architecture',
    description: 'Technical deep dive into how AI Context Studio implements the Model Context Protocol — sandboxing, capability negotiation, and cross-editor config export.',
    date: '2024-05-10',
    category: 'devlog',
    author: { name: 'Marcus Johnson', avatar: 'MJ', github: 'marcusj' },
    tags: ['MCP', 'Architecture', 'Rust', 'Tauri'],
    readTime: '11 min read',
    thumbnail: 'https://picsum.photos/seed/mcp-deep-dive/800/450',
  },
  {
    slug: 'v1-0-0-release',
    title: 'AI Context Studio v1.0 — The First Stable Release',
    description: 'After 18 months of development, 3,400+ commits, and 247 contributors — AI Context Studio 1.0 is here. Desktop app, marketplace, registry, docs, and MCP support all stable.',
    date: '2024-04-01',
    category: 'release',
    author: { name: 'Sarah Chen', avatar: 'SC', github: 'sarahchen' },
    tags: ['Release', 'v1.0', 'Milestone'],
    readTime: '8 min read',
    featured: true,
    thumbnail: 'https://picsum.photos/seed/v100-release/800/450',
  },
  {
    slug: 'prompt-engineering-best-practices',
    title: 'Prompt Engineering Best Practices for AI Coding Assistants',
    description: 'Research-backed patterns for writing effective system prompts, instruction files, and few-shot examples. Covers specificity, context management, and evaluation methodologies.',
    date: '2024-03-15',
    category: 'tutorial',
    author: { name: 'Jordan Kim', avatar: 'JK', github: 'jordankim' },
    tags: ['Prompt Engineering', 'Best Practices', 'Research'],
    readTime: '15 min read',
    thumbnail: 'https://picsum.photos/seed/prompt-best-practices/800/450',
  },
  {
    slug: 'roadmap-q2-2024',
    title: 'Roadmap Update: Q2 2024 Priorities — Online Hub, Plugin SDK, AI Agents',
    description: 'Our transparent roadmap for the next quarter: cross-device sync with end-to-end encryption, TypeScript Plugin SDK, and multi-agent orchestration with evaluation harness.',
    date: '2024-03-01',
    category: 'announcement',
    author: { name: 'Sarah Chen', avatar: 'SC', github: 'sarahchen' },
    tags: ['Roadmap', 'Planning', 'Online Hub', 'Plugin SDK'],
    readTime: '6 min read',
    thumbnail: 'https://picsum.photos/seed/roadmap-q2/800/450',
  },
  {
    slug: 'contributor-spotlight',
    title: 'Contributor Spotlight: Building the PostgreSQL MCP Server',
    description: 'Interview with dbadmin, creator of the most-downloaded MCP server. How they built it, lessons learned, and advice for new server authors.',
    date: '2024-02-20',
    category: 'showcase',
    author: { name: 'Taylor Moore', avatar: 'TM', github: 'taylorm' },
    tags: ['Contributor', 'MCP', 'PostgreSQL', 'Interview'],
    readTime: '8 min read',
    thumbnail: 'https://picsum.photos/seed/contributor-spotlight/800/450',
  },
  {
    slug: 'local-first-philosophy',
    title: 'Why Local-First? Our Architecture Philosophy Explained',
    description: 'Deep dive into the technical and ethical reasons behind our local-first architecture — data sovereignty, offline capability, and the future of AI tooling.',
    date: '2024-02-01',
    category: 'devlog',
    author: { name: 'Sarah Chen', avatar: 'SC', github: 'sarahchen' },
    tags: ['Architecture', 'Philosophy', 'Local-First', 'Privacy'],
    readTime: '10 min read',
    thumbnail: 'https://picsum.photos/seed/local-first/800/450',
  },
];

const categoryLabels: Record<string, string> = {
  release: 'Release',
  announcement: 'Announcement',
  devlog: 'Dev Log',
  tutorial: 'Tutorial',
  showcase: 'Showcase',
};

const categoryColors: Record<string, string> = {
  release: 'bg-green-100 text-green-700 border-green-200',
  announcement: 'bg-blue-100 text-blue-700 border-blue-200',
  devlog: 'bg-purple-100 text-purple-700 border-purple-200',
  tutorial: 'bg-amber-100 text-amber-700 border-amber-200',
  showcase: 'bg-pink-100 text-pink-700 border-pink-200',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(p => p.featured).slice(0, 3);
  const regularPosts = blogPosts.filter(p => !p.featured);

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <section className="flex flex-1 flex-col">
        <section id="blog" className="section" aria-labelledby="blog-heading">
          <div className="container-app">
            <div className="animate-slide-up mb-16 text-center">
              <h2
                id="blog-heading"
                className="mb-4 text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl"
              >
                Blog & Updates
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-[var(--color-text-secondary)]">
                Release notes, announcements, development logs, tutorials, and community showcases.
                Subscribe via <a href="/rss.xml" className="text-[var(--color-accent)] hover:underline">RSS</a> or follow on <a href="https://twitter.com/aicontextstudio" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">Twitter</a>.
              </p>
            </div>

            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <div className="animate-slide-up mb-16" style={{ animationDelay: '0.1s' }}>
                <h3 className="mb-8 text-2xl font-semibold text-[var(--color-text-primary)]">
                  Featured Posts
                </h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featuredPosts.map((post, index) => (
                    <article
                      key={post.slug}
                      className="animate-slide-up group"
                      style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] overflow-hidden transition-all hover:border-[var(--color-border-strong)] hover:shadow-xl"
                      >
                        {post.thumbnail && (
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src={post.thumbnail}
                              alt=""
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute top-3 left-3">
                              <Badge
                                variant="outline"
                                className={categoryColors[post.category]}
                              >
                                {categoryLabels[post.category]}
                              </Badge>
                            </div>
                          </div>
                        )}
                        <div className="p-6">
                          <div className="mb-3 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                              {formatDate(post.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                              {post.readTime}
                            </span>
                          </div>
                          <h4 className="mb-2 text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                            {post.title}
                          </h4>
                          <p className="mb-4 line-clamp-2 text-[var(--color-text-secondary)]">
                            {post.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent-light)] text-sm font-bold text-[var(--color-accent)]">
                                {post.author.avatar}
                              </div>
                              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                                {post.author.name}
                              </span>
                            </div>
                            <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)] group-hover:gap-2 transition-all">
                              Read more
                              <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* All Posts */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="mb-8 text-2xl font-semibold text-[var(--color-text-primary)]">
                All Posts
              </h3>
              <div className="space-y-4">
                {regularPosts.map((post, index) => (
                  <article
                    key={post.slug}
                    className="animate-slide-up group rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 transition-all hover:border-[var(--color-border-strong)] hover:shadow-lg md:flex md:gap-6"
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={categoryColors[post.category]}
                        >
                          {categoryLabels[post.category]}
                        </Badge>
                        <span className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                          {formatDate(post.date)}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                          <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                          {post.readTime}
                        </span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="block mb-2 text-xl font-bold text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent)]"
                      >
                        {post.title}
                      </Link>
                      <p className="mb-3 line-clamp-2 text-[var(--color-text-secondary)]">
                        {post.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent-light)] text-sm font-bold text-[var(--color-accent)]">
                            {post.author.avatar}
                          </div>
                          <Link
                            href={`https://github.com/${post.author.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)]"
                          >
                            {post.author.name}
                          </Link>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center md:mt-0 md:ml-6">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
                      >
                        Read more
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm" disabled>
                  ...
                </Button>
                <Button variant="outline" size="sm">12</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="animate-slide-up mt-16 rounded-2xl bg-[var(--color-bg-secondary)] p-8 lg:p-12 text-center" style={{ animationDelay: '0.3s' }}>
              <h3 className="mb-2 text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
                Stay Updated
              </h3>
              <p className="mx-auto mb-6 max-w-xl text-[var(--color-text-secondary)]">
                Get the latest releases, tutorials, and community highlights delivered to your inbox.
                No spam, unsubscribe anytime.
              </p>
              <form className="flex flex-col gap-3 max-w-md mx-auto sm:flex-row" action="/api/newsletter" method="POST">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                  aria-label="Email address"
                />
                <Button type="submit" size="lg">
                  Subscribe
                </Button>
              </form>
              <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                By subscribing, you agree to our{' '}
                <a href="/privacy" className="text-[var(--color-accent)] hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </section>
        <div className="section bg-[var(--color-bg-secondary)]" />
      </section>
      <Footer />
    </main>
  );
}