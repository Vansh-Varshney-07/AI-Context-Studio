"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { requireAuth, getUser } from "@/actions/auth";
import { revalidatePath } from "next/cache";

// ============================================
// USER PROFILE
// ============================================

export async function getProfile(username: string) {
  return prisma.user.findUnique({
    where: { username },
    include: {
      profile: true,
      _count: {
        select: {
          assets: { where: { status: "PUBLISHED" } },
          posts: { where: { status: "PUBLISHED" } },
          followers: true,
          following: true,
        },
      },
    },
  });
}

export async function getMyProfile() {
  const user = await getUser();
  if (!user) return null;
  return prisma.user.findUnique({
    where: { id: user.id },
    include: {
      profile: true,
      _count: {
        select: {
          assets: { where: { status: "PUBLISHED" } },
          posts: { where: { status: "PUBLISHED" } },
          followers: true,
          following: true,
          generatedFiles: true,
        },
      },
    },
  });
}

export async function updateMyProfile(data: {
  name?: string;
  username?: string;
  bio?: string;
  avatar?: string;
  profile?: {
    displayName?: string;
    headline?: string;
    location?: string;
    website?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    skills?: string[];
  };
}) {
  const session = await requireAuth();

  const { profile, ...userData } = data;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...userData,
      profile: profile
        ? {
            upsert: {
              create: profile,
              update: profile,
            },
          }
        : undefined,
    },
    include: { profile: true },
  });

  revalidatePath("/settings");
  revalidatePath(`/profile/${user.username || ""}`);
  return user;
}

export async function getUserDashboardStats() {
  const user = await getUser();
  if (!user) return null;

  const [totalAssets, publishedAssets, totalPosts, totalDownloads, totalGenerated, favoriteGenerated, recentActive] = await Promise.all([
    prisma.asset.count({ where: { authorId: user.id } }),
    prisma.asset.count({ where: { authorId: user.id, status: "PUBLISHED" } }),
    prisma.post.count({ where: { authorId: user.id } }),
    prisma.download.count({ where: { userId: user.id } }),
    prisma.generatedFile.count({ where: { userId: user.id } }),
    prisma.generatedFile.count({ where: { userId: user.id, isFavorite: true } }),
    prisma.generatedFile.count({ where: { userId: user.id, createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
  ]);

  return {
    totalAssets,
    publishedAssets,
    totalPosts,
    totalGenerated,
    favoriteGenerated,
    recentActive,
    followers: 0, // Will fetch from user relation
    following: 0,
  };
}

// ============================================
// USER SETTINGS
// ============================================

export async function updateMyEmail(newEmail: string) {
  const session = await requireAuth();

  if (!newEmail.includes("@")) {
    return { success: false, error: "Invalid email address" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { emailVerified: false, email: newEmail },
  });

  // Better-auth handles email change verification separately
  revalidatePath("/settings");
  return { success: true };
}

export async function updateMyUsername(username: string) {
  const session = await requireAuth();

  if (username.length < 3 || username.length > 30) {
    return { success: false, error: "Username must be 3-30 characters" };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { success: false, error: "Username can only contain letters, numbers, hyphens, and underscores" };
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing && existing.id !== session.user.id) {
    return { success: false, error: "Username already taken" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { username },
  });

  revalidatePath("/settings");
  return { success: true };
}

export async function getMySessions() {
  const session = await requireAuth();
  return prisma.session.findMany({
    where: { userId: session.user.id, expires: { gt: new Date() } },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });
}

export async function revokeSession(sessionId: string) {
  const session = await requireAuth();
  await prisma.session.deleteMany({
    where: { id: sessionId, userId: session.user.id },
  });
  revalidatePath("/settings");
  return { success: true };
}

// ============================================
// GENERATED FILES (My Assets)
// ============================================

export async function getMyGeneratedFiles(params: {
  page?: number;
  limit?: number;
  kind?: string;
  favoriteFilter?: boolean;
} = {}) {
  const user = await getUser();
  if (!user) return { files: [], totalCount: 0, totalPages: 0, currentPage: 1 };

  const { page = 1, limit = 24, kind, favoriteFilter } = params;
  const where: Prisma.GeneratedFileWhereInput = { userId: user.id };

  if (kind) where.kind = kind as "SYSTEM_PROMPT" | "INSTRUCTION_FILE" | "PERSONA" | "WORKFLOW" | "MEMORY" | "CONTEXT_FILE" | "PROMPT_TEMPLATE" | "MCP_CONFIG";
  if (favoriteFilter) where.isFavorite = true;

  const [files, totalCount] = await Promise.all([
    prisma.generatedFile.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.generatedFile.count({ where }),
  ]);

  return { files, totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page };
}

export async function createGeneratedFile(data: {
  kind: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
  isPublic?: boolean;
  tokens?: number;
  modelUsed?: string;
}) {
  const user = await getUser();
  if (!user) throw new Error("Authentication required");

  return prisma.generatedFile.create({
    data: {
      userId: user.id,
      kind: data.kind as "SYSTEM_PROMPT" | "INSTRUCTION_FILE" | "PERSONA" | "WORKFLOW" | "MEMORY" | "CONTEXT_FILE" | "PROMPT_TEMPLATE" | "MCP_CONFIG",
      title: data.title,
      content: data.content,
      metadata: data.metadata ? (data.metadata as Prisma.InputJsonValue) : undefined,
      isPublic: data.isPublic || false,
      tokens: data.tokens,
      modelUsed: data.modelUsed,
    },
  });
}

export async function updateGeneratedFile(id: string, data: Partial<{
  title: string;
  content: string;
  isPublic: boolean;
  isFavorite: boolean;
  metadata: Record<string, unknown>;
}>) {
  const user = await getUser();
  if (!user) throw new Error("Authentication required");

  return prisma.generatedFile.updateMany({
    where: { id, userId: user.id },
    data: {
      title: data.title,
      content: data.content,
      isPublic: data.isPublic,
      isFavorite: data.isFavorite,
      ...(data.metadata ? { metadata: data.metadata as Prisma.InputJsonValue } : {}),
    },
  });
}

export async function deleteGeneratedFile(id: string) {
  const user = await getUser();
  if (!user) throw new Error("Authentication required");
  return prisma.generatedFile.deleteMany({ where: { id, userId: user.id } });
}

export async function getGeneratedFileById(id: string) {
  const user = await getUser();
  if (!user) return null;
  return prisma.generatedFile.findFirst({
    where: { id, userId: user.id },
  });
}
