"use server";

import { prisma } from "@/lib/prisma";

export interface BlogFilters {
  category?: string;
  tag?: string;
  search?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured?: boolean;
  authorId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedBlogPosts {
  posts: BlogPostWithRelations[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface BlogPostWithRelations {
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
}

export async function getBlogPosts(filters: BlogFilters = {}): Promise<PaginatedBlogPosts> {
  const { category, tag, search, status = "PUBLISHED", featured, authorId, page = 1, limit = 10 } = filters;

  const where: Record<string, unknown> = {
    status,
  };

  if (category) {
    where.categories = { some: { category: { slug: category } } };
  }

  if (tag) {
    where.tags = { some: { tag: { slug: tag } } };
  }

  if (featured !== undefined) {
    where.featured = featured;
  }

  if (authorId) {
    where.authorId = authorId;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];
  }

  const [posts, totalCount] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true } },
        categories: { 
          include: { 
            category: { select: { id: true, slug: true, name: true, color: true } } 
          } 
        },
        tags: { 
          include: { 
            tag: { select: { id: true, slug: true, name: true, color: true } } 
          } 
        },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return { posts, totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page };
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true, bio: true } },
      categories: { 
        include: { 
          category: { select: { id: true, slug: true, name: true, color: true } } 
        } 
      },
      tags: { 
        include: { 
          tag: { select: { id: true, slug: true, name: true, color: true } } 
        } 
      },
    },
  });
}

export async function getBlogCategories() {
  return prisma.blogCategory.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getFeaturedBlogPosts(limit = 3) {
  return prisma.blogPost.findMany({
    where: { status: "PUBLISHED", featured: true },
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true } },
      categories: { 
        include: { 
          category: { select: { id: true, slug: true, name: true, color: true } } 
        } 
      },
      tags: { 
        include: { 
          tag: { select: { id: true, slug: true, name: true, color: true } } 
        } 
      },
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function incrementBlogViewCount(slug: string) {
  return prisma.blogPost.update({
    where: { slug },
    data: { viewCount: { increment: 1 } },
  });
}