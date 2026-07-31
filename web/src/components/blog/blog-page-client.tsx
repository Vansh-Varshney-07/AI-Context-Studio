'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/common';

interface BlogPostWithRelations {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  contentHtml: string | null;
  coverImage: string | null;
  authorId: string;
  status: string;
  featured: boolean;
  publishedAt: Date | null;
  viewCount: number;
  readTime: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  author: { id: string; name: string | null; username: string | null; avatar: string | null };
  categories: Array<{ category: { id: string; slug: string; name: string; color: string | null } }>;
  tags: Array<{ tag: { id: string; slug: string; name: string; color: string | null } }>;
  _count?: { likes: number; comments: number };
}

interface BlogPageClientProps {
  initialPosts: BlogPostWithRelations[];
  _initialTotalCount: number;
  initialTotalPages: number;
  categories: Array<{ id: string; slug: string; name: string; color: string | null; _count: { posts: number } }>;
  featuredPosts: BlogPostWithRelations[];
}

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

function formatDate(dateStr: string | Date) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getAuthorInitials(name: string | null, username: string | null) {
  if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  if (username) return username.slice(0, 2).toUpperCase();
  return '??';
}

function BlogPostCard({ post, featured = false }: { post: BlogPostWithRelations; featured?: boolean }) {
  const primaryCategory = post.categories[0]?.category;
  const categoryLabel = primaryCategory ? categoryLabels[primaryCategory.slug] || primaryCategory.name : 'Blog';
  const categoryColor = primaryCategory ? categoryColors[primaryCategory.slug] || 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-gray-100 text-gray-700 border-gray-200';

  if (featured) {
    return (
      <article className="animate-slide-up group">
        <Link
          href={`/blog/${post.slug}`}
          className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] overflow-hidden transition-all hover:border-[var(--color-border-strong)] hover:shadow-xl"
        >
          {post.coverImage && (
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={post.coverImage}
                alt=""
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-3 left-3">
                <Badge variant="outline" className={categoryColor}>
                  {categoryLabel}
                </Badge>
              </div>
            </div>
          )}
          <div className="p-6">
            <div className="mb-3 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                {post.publishedAt ? formatDate(post.publishedAt) : '—'}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                {post.readTime ? `${post.readTime} min read` : '—'}
              </span>
            </div>
            <h4 className="mb-2 text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
              {post.title}
            </h4>
            <p className="mb-4 line-clamp-2 text-[var(--color-text-secondary)]">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent-light)] text-sm font-bold text-[var(--color-accent)]">
                  {getAuthorInitials(post.author.name, post.author.username)}
                </div>
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {post.author.name || post.author.username}
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
    );
  }

  return (
    <article className="animate-slide-up group rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 transition-all hover:border-[var(--color-border-strong)] hover:shadow-lg md:flex md:gap-6">
      <div className="flex-1 min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={categoryColor}>
            {categoryLabel}
          </Badge>
          <span className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {post.publishedAt ? formatDate(post.publishedAt) : '—'}
          </span>
          <span className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
            <Tag className="h-3.5 w-3.5" aria-hidden="true" />
            {post.readTime ? `${post.readTime} min read` : '—'}
          </span>
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="block mb-2 text-xl font-bold text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent)]"
        >
          {post.title}
        </Link>
        <p className="mb-3 line-clamp-2 text-[var(--color-text-secondary)]">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent-light)] text-sm font-bold text-[var(--color-accent)]">
              {getAuthorInitials(post.author.name, post.author.username)}
            </div>
            <Link
              href={`https://github.com/${post.author.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)]"
            >
              {post.author.name || post.author.username}
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.tag.id} variant="outline" className="text-xs">
                {tag.tag.name}
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
  );
}

function BlogPostSkeleton({ featured = false }: { featured?: boolean }) {
  if (featured) {
    return (
      <article className="animate-slide-up">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] overflow-hidden animate-pulse">
          <div className="aspect-video bg-[var(--color-bg-tertiary)]" />
          <div className="p-6 space-y-4">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="animate-slide-up rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 transition-all md:flex md:gap-6">
      <div className="flex-1 min-w-0 space-y-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center md:mt-0 md:ml-6">
        <Skeleton className="h-5 w-20" />
      </div>
    </article>
  );
}

function CategoryBadge({ category }: { category: { slug: string; name: string; color: string | null; _count: { posts: number } } }) {
  return (
    <Link
      href={`/blog?category=${category.slug}`}
      className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-2 text-sm transition-all hover:border-[var(--color-border-strong)] hover:shadow-md"
    >
      <span className="font-medium text-[var(--color-text-primary)]">{category.name}</span>
      <span className="text-[var(--color-text-muted)]">({category._count.posts})</span>
    </Link>
  );
}

export function BlogPageClient({
  initialPosts,
  _initialTotalCount,
  initialTotalPages,
  categories,
  featuredPosts,
}: BlogPageClientProps) {
  const [posts, setPosts] = useState<BlogPostWithRelations[]>(initialPosts);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', '10');
      if (selectedCategory) params.set('category', selectedCategory);

      const response = await fetch(`/api/blog?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedCategory]);

  const handleCategoryChange = (slug: string | null) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <section id="blog" className="section" aria-labelledby="blog-heading">
      <div className="container-app">
        <div className="animate-slide-up mb-16 text-center">
          <h2 id="blog-heading" className="mb-4 text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl">
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
              {featuredPosts.map((post, _index) => (
                <BlogPostCard key={post.id} post={post} featured />
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="animate-slide-up mb-8" style={{ animationDelay: '0.15s' }}>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={cn(
                'rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                !selectedCategory
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]'
              )}
              onClick={(e) => {
                e.preventDefault();
                handleCategoryChange(null);
              }}
            >
              All
            </Link>
            {categories.map((category) => (
              <CategoryBadge key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* All Posts */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="mb-8 text-2xl font-semibold text-[var(--color-text-primary)]">
            All Posts
          </h3>
          <div className="space-y-4">
            {isLoading ? (
              [...Array(5)].map((_, i) => <BlogPostSkeleton key={i} />)
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[var(--color-text-muted)]">No posts found.</p>
              </div>
            ) : (
              posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3 && currentPage < totalPages - 1) {
                    pageNum = currentPage - 2 + i;
                  } else if (currentPage >= totalPages - 1) {
                    pageNum = totalPages - 4 + i;
                  }
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    disabled={isLoading}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <Button variant="outline" size="sm" disabled>
                  ...
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          )}

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
      </div>
    </section>
  );
}