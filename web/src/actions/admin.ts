"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { requireAdmin, requireModerator } from "@/actions/auth";
import type { AnnouncementType } from "@prisma/client";

export async function getAdminStats() {
  const [
    totalUsers,
    totalAssets,
    totalPosts,
    totalBlogPosts,
    totalRegistryPackages,
    totalDownloads,
    totalNewsletterSubscribers,
    pendingAssets,
    reportedContent,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.asset.count(),
    prisma.post.count(),
    prisma.blogPost.count(),
    prisma.registryPackage.count(),
    prisma.download.count(),
    prisma.newsletterSubscriber.count({ where: { status: "CONFIRMED" } }),
    prisma.asset.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.auditLog.count({ where: { action: "REPORT", createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, username: true, role: true, createdAt: true, lastLoginAt: true },
    }),
  ]);

  return {
    totalUsers,
    totalAssets,
    totalPosts,
    totalBlogPosts,
    totalRegistryPackages,
    totalDownloads,
    totalNewsletterSubscribers,
    pendingAssets,
    reportedContent,
    recentUsers,
  };
}

export async function getAllUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}) {
  const { page = 1, limit = 50, search, role, status } = params;
  const where: Prisma.UserWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { username: { contains: search, mode: "insensitive" } },
    ];
  }
  if (role) where.role = role as any;

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        avatar: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        lastLoginAt: true,
        _count: { select: { assets: true, posts: true, followers: true, following: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { users, totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page };
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      assets: { select: { id: true, slug: true, name: true, status: true, downloads: true }, take: 10, orderBy: { createdAt: "desc" } },
      posts: { select: { id: true, slug: true, title: true, status: true }, take: 10, orderBy: { createdAt: "desc" } },
      _count: { select: { assets: true, posts: true, followers: true, following: true, downloads: true } },
    },
  });
}

export async function updateUserRole(userId: string, role: "USER" | "MODERATOR" | "ADMIN" | "OWNER") {
  await requireAdmin();
  return prisma.user.update({ where: { id: userId }, data: { role } });
}

export async function banUser(userId: string, reason: string) {
  await requireAdmin();
  return prisma.user.update({
    where: { id: userId },
    data: { role: "USER" }, // Could add a bannedAt field or status field
  });
}

export async function getPendingAssets(params: { page?: number; limit?: number }) {
  await requireModerator();
  const { page = 1, limit = 20 } = params;

  const [assets, totalCount] = await Promise.all([
    prisma.asset.findMany({
      where: { status: "PENDING_REVIEW" },
      include: {
        author: { select: { id: true, name: true, username: true, email: true, avatar: true } },
        category: { select: { id: true, slug: true, name: true } },
      },
      orderBy: { createdAt: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.asset.count({ where: { status: "PENDING_REVIEW" } }),
  ]);

  return { assets, totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page };
}

export async function approveAsset(assetId: string) {
  await requireModerator();
  return prisma.asset.update({
    where: { id: assetId },
    data: { status: "APPROVED", publishedAt: new Date() },
  });
}

export async function rejectAsset(assetId: string, reason: string) {
  await requireModerator();
  return prisma.asset.update({
    where: { id: assetId },
    data: { status: "REJECTED", deprecationReason: reason },
  });
}

export async function getAllAssetsAdmin(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  await requireModerator();
  const { page = 1, limit = 50, search, status } = params;
  const where: Prisma.AssetWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { author: { name: { contains: search, mode: "insensitive" } } },
    ];
  }
  if (status) where.status = status as any;

  const [assets, totalCount] = await Promise.all([
    prisma.asset.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, username: true } },
        category: { select: { id: true, slug: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.asset.count({ where }),
  ]);

  return { assets, totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page };
}

export async function createAnnouncement(data: {
  title: string;
  content: string;
  type: AnnouncementType;
  priority?: number;
  isGlobal?: boolean;
  targetRoles?: ("USER" | "MODERATOR" | "ADMIN" | "OWNER")[];
  startsAt?: Date;
  endsAt?: Date;
  actionUrl?: string;
  actionLabel?: string;
}) {
  await requireAdmin();
  return prisma.announcement.create({ data });
}

export async function getAnnouncements() {
  return prisma.announcement.findMany({
    where: { isActive: true },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });
}

export async function updateAnnouncement(id: string, data: Partial<{
  title: string;
  content: string;
  type: AnnouncementType;
  priority: number;
  isActive: boolean;
  actionUrl: string;
  actionLabel: string;
}>) {
  await requireAdmin();
  return prisma.announcement.update({ where: { id }, data });
}

export async function deleteAnnouncement(id: string) {
  await requireAdmin();
  return prisma.announcement.delete({ where: { id } });
}

export async function getAuditLogs(params: {
  page?: number;
  limit?: number;
  userId?: string;
  entity?: string;
  action?: string;
}) {
  await requireAdmin();
  const { page = 1, limit = 50, userId, entity, action } = params;
  const where: Prisma.AuditLogWhereInput = {};

  if (userId) where.userId = userId;
  if (entity) where.entity = entity;
  if (action) where.action = action;

  const [logs, totalCount] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: { user: { select: { id: true, name: true, username: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page };
}

export async function getReports() {
  await requireModerator();
  return prisma.auditLog.findMany({
    where: { action: "REPORT" },
    include: { user: { select: { id: true, name: true, username: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getFeatureFlags() {
  await requireAdmin();
  return prisma.featureFlag.findMany({ orderBy: { key: "asc" } });
}

export async function createFeatureFlag(data: {
  key: string;
  name: string;
  description?: string;
  enabled?: boolean;
  rollout?: number;
  targeting?: Prisma.InputJsonValue;
}) {
  await requireAdmin();
  return prisma.featureFlag.create({ data });
}

export async function updateFeatureFlag(id: string, data: Partial<{
  name: string;
  description: string;
  enabled: boolean;
  rollout: number;
  targeting: Prisma.InputJsonValue;
}>) {
  await requireAdmin();
  return prisma.featureFlag.update({ where: { id }, data });
}

export async function deleteFeatureFlag(id: string) {
  await requireAdmin();
  return prisma.featureFlag.delete({ where: { id } });
}