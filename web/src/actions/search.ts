"use server";

import { prisma } from "@/lib/prisma";

export interface SearchFilters {
  query: string;
  types?: ("assets" | "posts" | "blog" | "docs" | "users" | "registry")[];
  page?: number;
  limit?: number;
}

export interface SearchResult {
  type: "asset" | "post" | "blog" | "doc" | "user" | "registry";
  id: string;
  title: string;
  description: string;
  url: string;
  metadata?: Record<string, unknown>;
}

export async function globalSearch(filters: SearchFilters) {
  const { query, types = ["assets", "posts", "blog", "docs", "users", "registry"], page = 1, limit = 10 } = filters;

  if (!query || query.trim().length < 2) {
    return { results: [], totalCount: 0, totalPages: 0, currentPage: 1 };
  }

  const searchTerm = query.trim();
  const results: SearchResult[] = [];

  // Search assets
  if (types.includes("assets")) {
    const assets = await prisma.asset.findMany({
      where: {
        status: "PUBLISHED",
        visibility: "PUBLIC",
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { shortDesc: { contains: searchTerm, mode: "insensitive" } },
          { author: { name: { contains: searchTerm, mode: "insensitive" } } },
          { tags: { some: { tag: { name: { contains: searchTerm, mode: "insensitive" } } } } },
        ],
      },
      select: { id: true, slug: true, name: true, shortDesc: true, kind: true, category: { select: { slug: true } } },
      take: limit,
    });
    results.push(
      ...assets.map((a) => ({
        type: "asset" as const,
        id: a.id,
        title: a.name,
        description: a.shortDesc || "",
        url: `/marketplace/${a.slug}`,
        metadata: { kind: a.kind, category: a.category.slug },
      }))
    );
  }

// Search community posts
  if (types.includes("posts")) {
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { content: { contains: searchTerm, mode: "insensitive" } },
          { excerpt: { contains: searchTerm, mode: "insensitive" } },
          { author: { name: { contains: searchTerm, mode: "insensitive" } } },
          { tags: { some: { tag: { name: { contains: searchTerm, mode: "insensitive" } } } } },
        ],
      },
      select: { id: true, slug: true, title: true, excerpt: true, type: true, author: { select: { username: true } } },
      take: limit,
    });
    results.push(
      ...posts.map((p) => ({
        type: "post" as const,
        id: p.id,
        title: p.title,
        description: p.excerpt || "",
        url: `/community/${p.slug}`,
        metadata: { type: p.type, author: p.author.username },
      }))
    );
  }

  // Search blog posts
  if (types.includes("blog")) {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { content: { contains: searchTerm, mode: "insensitive" } },
          { excerpt: { contains: searchTerm, mode: "insensitive" } },
          { author: { name: { contains: searchTerm, mode: "insensitive" } } },
          { tags: { some: { tag: { name: { contains: searchTerm, mode: "insensitive" } } } } },
        ],
      },
      select: { id: true, slug: true, title: true, excerpt: true, author: { select: { username: true } } },
      take: limit,
    });
    results.push(
      ...posts.map((p) => ({
        type: "blog" as const,
        id: p.id,
        title: p.title,
        description: p.excerpt || "",
        url: `/blog/${p.slug}`,
        metadata: { author: p.author.username },
      }))
    );
  }

  // Search docs
  if (types.includes("docs")) {
    const pages = await prisma.docPage.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { content: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      select: { id: true, slug: true, title: true, description: true, category: { select: { slug: true } } },
      take: limit,
    });
    results.push(
      ...pages.map((p) => ({
        type: "doc" as const,
        id: p.id,
        title: p.title,
        description: p.description || "",
        url: `/docs/${p.category.slug}/${p.slug}`,
        metadata: { category: p.category.slug },
      }))
    );
  }

  // Search users
  if (types.includes("users")) {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { username: { contains: searchTerm, mode: "insensitive" } },
          { bio: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      select: { id: true, username: true, name: true, avatar: true, bio: true, _count: { select: { assets: true, followers: true } } },
      take: limit,
    });
    results.push(
      ...users.map((u) => ({
        type: "user" as const,
        id: u.id,
        title: u.name || u.username || "Unknown User",
        description: u.bio || "",
        url: `/u/${u.username}`,
        metadata: { username: u.username, assetsCount: u._count.assets, followersCount: u._count.followers },
      }))
    );
  }

  // Search registry packages
  if (types.includes("registry")) {
    const packages = await prisma.registryPackage.findMany({
      where: {
        isDeprecated: false,
        OR: [
          { displayName: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { name: { contains: searchTerm, mode: "insensitive" } },
          { author: { name: { contains: searchTerm, mode: "insensitive" } } },
          { keywords: { some: { keyword: { name: { contains: searchTerm, mode: "insensitive" } } } } },
        ],
      },
      select: { id: true, name: true, displayName: true, description: true, author: { select: { username: true } } },
      take: limit,
    });
    results.push(
      ...packages.map((p) => ({
        type: "registry" as const,
        id: p.id,
        title: p.displayName,
        description: p.description,
        url: `/registry/${p.name}`,
        metadata: { packageName: p.name, author: p.author.username },
      }))
    );
  }

  // Sort by relevance (simple scoring)
  const scoredResults = results.map((r) => {
    let score = 0;
    const q = searchTerm.toLowerCase();
    if (r.title.toLowerCase().includes(q)) score += 10;
    if (r.description.toLowerCase().includes(q)) score += 5;
    return { ...r, score };
  });

  scoredResults.sort((a, b) => b.score - a.score);

  const totalCount = scoredResults.length;
  const totalPages = Math.ceil(totalCount / limit);
  const paginatedResults = scoredResults.slice((page - 1) * limit, page * limit);

  return {
    results: paginatedResults,
    totalCount,
    totalPages,
    currentPage: page,
  };
}

export async function getSearchSuggestions(query: string, limit = 5) {
  if (!query || query.trim().length < 2) return [];

  const term = query.trim().toLowerCase();

  const [assets, posts, blogPosts, docs, users, packages] = await Promise.all([
    prisma.asset.findMany({
      where: { status: "PUBLISHED", visibility: "PUBLIC", name: { contains: term, mode: "insensitive" } },
      select: { name: true, slug: true, kind: true },
      take: limit,
    }),
    prisma.post.findMany({
      where: { status: "PUBLISHED", title: { contains: term, mode: "insensitive" } },
      select: { title: true, slug: true },
      take: limit,
    }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED", title: { contains: term, mode: "insensitive" } },
      select: { title: true, slug: true },
      take: limit,
    }),
    prisma.docPage.findMany({
      where: { isPublished: true, title: { contains: term, mode: "insensitive" } },
      select: { title: true, slug: true, category: { select: { slug: true } } },
      take: limit,
    }),
    prisma.user.findMany({
      where: { username: { contains: term, mode: "insensitive" } },
      select: { username: true, name: true },
      take: limit,
    }),
    prisma.registryPackage.findMany({
      where: { isDeprecated: false, displayName: { contains: term, mode: "insensitive" } },
      select: { displayName: true, name: true },
      take: limit,
    }),
  ]);

  const suggestions = [
    ...assets.map((a) => ({ text: a.name, type: "asset" as const, url: `/marketplace/${a.slug}` })),
    ...posts.map((p) => ({ text: p.title, type: "post" as const, url: `/community/${p.slug}` })),
    ...blogPosts.map((p) => ({ text: p.title, type: "blog" as const, url: `/blog/${p.slug}` })),
    ...docs.map((d) => ({ text: d.title, type: "doc" as const, url: `/docs/${d.category.slug}/${d.slug}` })),
    ...users.map((u) => ({ text: u.name || u.username, type: "user" as const, url: `/u/${u.username}` })),
    ...packages.map((p) => ({ text: p.displayName, type: "registry" as const, url: `/registry/${p.name}` })),
  ];

  return suggestions.slice(0, limit);
}