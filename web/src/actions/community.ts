"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { PostType, PostStatus } from "@prisma/client";

export interface PostFilters {
  type?: "DISCUSSION" | "ANNOUNCEMENT" | "TUTORIAL" | "SHOWCASE" | "QUESTION" | "DEVLOG" | "RELEASE";
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "MODERATED";
  tag?: string;
  authorId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedPosts {
  posts: PostWithRelations[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface PostWithRelations {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  authorId: string;
  type: string;
  status: string;
  pinned: boolean;
  locked: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  author: { id: string; name: string | null; username: string | null; avatar: string | null; bio: string | null };
  tags: Array<{ tag: { id: string; slug: string; name: string; color: string | null } }>;
}

export async function getPosts(filters: PostFilters = {}): Promise<PaginatedPosts> {
  const { type, status = "PUBLISHED", tag, authorId, search, page = 1, limit = 20 } = filters;

  const where: Prisma.PostWhereInput = {
    status,
  };

  if (type) where.type = type;
  if (authorId) where.authorId = authorId;
  if (tag) where.tags = { some: { tag: { slug: tag } } };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
      { author: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const orderBy = [
    { pinned: "desc" },
    { publishedAt: "desc" },
    { createdAt: "desc" },
  ] satisfies Prisma.PostOrderByWithRelationInput[];

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true, bio: true } },
        tags: { include: { tag: { select: { id: true, slug: true, name: true, color: true } } } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page };
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true, bio: true } },
      tags: { include: { tag: { select: { id: true, slug: true, name: true, color: true } } } },
      comments: {
        where: { status: "PUBLISHED", parentId: null },
        include: {
          author: { select: { id: true, name: true, username: true, avatar: true } },
          replies: {
            where: { status: "PUBLISHED" },
            include: { author: { select: { id: true, name: true, username: true, avatar: true } } },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (post) {
    await prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });
  }

  return post;
}

export async function getPostTags() {
  return prisma.tag.findMany({
    where: { posts: { some: {} } },
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });
}

export async function createPost(data: {
  title: string;
  content: string;
  excerpt?: string;
  type: "DISCUSSION" | "ANNOUNCEMENT" | "TUTORIAL" | "SHOWCASE" | "QUESTION" | "DEVLOG" | "RELEASE";
  tags?: string[];
  authorId: string;
  status?: "DRAFT" | "PUBLISHED";
}) {
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 100);

  const existingSlug = await prisma.post.findUnique({ where: { slug } });
  const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

  return prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      slug: finalSlug,
      type: data.type,
      status: data.status || "PUBLISHED",
      authorId: data.authorId,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      tags: data.tags
        ? {
            create: data.tags.map((tagSlug) => ({
              tag: { connectOrCreate: { where: { slug: tagSlug }, create: { slug: tagSlug, name: tagSlug } } },
            })),
          }
        : undefined,
    },
  });
}

export async function updatePost(postId: string, data: Partial<{
  title: string;
  content: string;
  excerpt: string | null;
  type: PostType;
  status: PostStatus;
  tags: string[];
}>) {
  return prisma.post.update({
    where: { id: postId },
    data: {
      ...data,
      tags: data.tags
        ? {
            set: [],
            connectOrCreate: data.tags.map((tagSlug) => ({
              where: { postId_tagId: { postId, tagId: tagSlug } },
              create: { tag: { connectOrCreate: { where: { slug: tagSlug }, create: { slug: tagSlug, name: tagSlug } } } },
            })),
          }
        : undefined,
    },
  });
}

export async function deletePost(postId: string) {
  return prisma.post.delete({ where: { id: postId } });
}

export interface CommentFilters {
  postId: string;
  parentId?: string | null;
  status?: "PUBLISHED" | "DELETED" | "MODERATED";
}

export async function getComments(filters: CommentFilters) {
  const { postId, parentId = null, status = "PUBLISHED" } = filters;

  return prisma.comment.findMany({
    where: { postId, parentId, status },
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true } },
      replies: {
        where: { status: "PUBLISHED" },
        include: { author: { select: { id: true, name: true, username: true, avatar: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: parentId ? "asc" : "desc" },
  });
}

export async function createComment(data: {
  content: string;
  postId: string;
  authorId: string;
  parentId?: string;
}) {
  const parent = data.parentId ? await prisma.comment.findUnique({ where: { id: data.parentId } }) : null;
  const depth = parent ? (parent.depth || 0) + 1 : 0;

  return prisma.comment.create({
    data: {
      content: data.content,
      postId: data.postId,
      authorId: data.authorId,
      parentId: data.parentId,
      depth,
    },
    include: { author: { select: { id: true, name: true, username: true, avatar: true } } },
  });
}

export async function updateComment(commentId: string, content: string, userId: string) {
  return prisma.comment.update({
    where: { id: commentId, authorId: userId },
    data: { content, updatedAt: new Date() },
  });
}

export async function deleteComment(commentId: string, userId: string) {
  return prisma.comment.update({
    where: { id: commentId, authorId: userId },
    data: { status: "DELETED", content: "[Deleted]" },
  });
}

export async function likeComment(commentId: string, userId: string) {
  return prisma.like.upsert({
    where: { userId_targetId_targetType: { userId, targetId: commentId, targetType: "COMMENT" } },
    create: { userId, targetId: commentId, targetType: "COMMENT" },
    update: {},
  });
}

export async function unlikeComment(commentId: string, userId: string) {
  return prisma.like.delete({
    where: { userId_targetId_targetType: { userId, targetId: commentId, targetType: "COMMENT" } },
  });
}