'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, MessageSquare, Share2, Heart, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

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
  author: { id: string; name: string | null; username: string | null; avatar: string | null; bio: string | null };
  categories: Array<{ category: { id: string; slug: string; name: string; color: string | null } }>;
  tags: Array<{ tag: { id: string; slug: string; name: string; color: string | null } }>;
  _count?: { likes: number; comments: number };
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

export function BlogPostClient({ post }: { post: BlogPostWithRelations }) {
  const primaryCategory = post.categories[0]?.category;
  const categoryLabel = primaryCategory ? categoryLabels[primaryCategory.slug] || primaryCategory.name : 'Blog';
  const categoryColor = primaryCategory ? categoryColors[primaryCategory.slug] || 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <article className="min-h-screen bg-[var(--color-bg-primary)]">
      <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]" aria-label="Breadcrumb">
        <div className="container-app px-4 py-3">
          <ol className="flex items-center gap-2 text-sm" role="list">
            <li>
              <Link href="/" className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-2 text-[var(--color-text-muted)]">
              <span aria-hidden="true">/</span>
              <Link href="/blog" className="transition-colors hover:text-[var(--color-text-primary)]">
                Blog
              </Link>
            </li>
            <li className="flex items-center gap-2 text-[var(--color-text-muted)]">
              <span aria-hidden="true">/</span>
              <span className="max-w-[200px] truncate font-medium text-[var(--color-text-primary)]">
                {post.title}
              </span>
            </li>
          </ol>
        </div>
      </nav>

      {post.coverImage && (
        <header className="relative h-64 lg:h-80 w-full overflow-hidden">
          <Image
            src={post.coverImage}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)]/90 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container-app max-w-4xl">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline" className={categoryColor}>
                  {categoryLabel}
                </Badge>
                <time className="text-sm text-[var(--color-text-muted)]" dateTime={post.publishedAt?.toISOString()}>
                  {post.publishedAt ? formatDate(post.publishedAt) : '—'}
                </time>
                {post.readTime && (
                  <span className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {post.readTime} min read
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white lg:text-5xl">
                {post.title}
              </h1>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-light)] text-sm font-bold text-[var(--color-accent)]">
                    {getAuthorInitials(post.author.name, post.author.username)}
                  </div>
                  <Link
                    href={`https://github.com/${post.author.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-white hover:text-[var(--color-accent)]"
                  >
                    {post.author.name || post.author.username}
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {post.viewCount.toLocaleString()} views
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {post._count?.comments || 0} comments
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      <div className="container-app flex-1 py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            {!post.coverImage && (
              <header className="mb-8 space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={categoryColor}>
                    {categoryLabel}
                  </Badge>
                  <time className="text-sm text-[var(--color-text-muted)]" dateTime={post.publishedAt?.toISOString()}>
                    {post.publishedAt ? formatDate(post.publishedAt) : '—'}
                  </time>
                  {post.readTime && (
                    <span className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime} min read
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)] lg:text-4xl">
                  {post.title}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-light)] text-sm font-bold text-[var(--color-accent)]">
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
                  <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {post.viewCount.toLocaleString()} views
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {post._count?.comments || 0} comments
                    </span>
                  </div>
                </div>
              </header>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none text-[var(--color-text-secondary)]">
              {post.contentHtml ? (
                <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
              ) : (
                <div className="whitespace-pre-wrap">{post.content}</div>
              )}
            </div>

            <footer className="mt-12 border-t border-[var(--color-border)] pt-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link key={tag.tag.id} href={`/blog?tag=${tag.tag.slug}`}>
                      <Badge variant="outline" className="text-xs">
                        {tag.tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-1 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Heart className="mr-1 h-4 w-4" />
                    Like
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Bookmark className="mr-1 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>

              <div className="mt-8 p-6 rounded-xl bg-[var(--color-bg-secondary)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-light)] text-sm font-bold text-[var(--color-accent)]">
                    {getAuthorInitials(post.author.name, post.author.username)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`https://github.com/${post.author.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent)]"
                      >
                        {post.author.name || post.author.username}
                      </Link>
                      <span className="text-sm text-[var(--color-text-muted)]">@{post.author.username}</span>
                    </div>
                    {post.author.bio && (
                      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{post.author.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            </footer>
          </div>

          <aside className="space-y-6 lg:col-span-1">
            <Card className="sticky top-24 p-6">
              <h3 className="mb-4 font-semibold text-[var(--color-text-primary)]">Share this post</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Copy Link
                </Button>
                <Button variant="outline" className="w-full justify-center gap-2">
                  <span className="h-4 w-4">𝕏</span>
                  Post on X
                </Button>
                <Button variant="outline" className="w-full justify-center gap-2">
                  <span className="h-4 w-4">in</span>
                  Share on LinkedIn
                </Button>
              </div>
            </Card>

            <Card className="sticky top-24 p-6">
              <h3 className="mb-4 font-semibold text-[var(--color-text-primary)]">Related Posts</h3>
              <div className="space-y-3">
                {post.tags.slice(0, 2).flatMap((tag) => 
                  post.categories.slice(0, 1).map((cat) => (
                    <Link
                      key={`${tag.tag.id}-${cat.category.id}`}
                      href={`/blog?category=${cat.category.slug}&tag=${tag.tag.slug}`}
                      className="block p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                    >
                      <p className="text-sm font-medium text-[var(--color-text-primary)] line-clamp-1">
                        More posts in {cat.category.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">Tagged with {tag.tag.name}</p>
                    </Link>
                  ))
                )}
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </article>
  );
}