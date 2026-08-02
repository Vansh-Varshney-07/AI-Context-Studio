"use server";

import { prisma } from "@/lib/prisma";
import { AssetKind } from "@prisma/client";

export interface MarketplaceFilters {
  category?: string;
  kind?: AssetKind[];
  verifiedOnly?: boolean;
  compatibility?: string[];
  search?: string;
  featured?: boolean;
  sortBy?: "trending" | "recent" | "rating" | "downloads" | "alphabetical";
  page?: number;
  limit?: number;
}

export interface PaginatedAssets {
  assets: AssetWithRelations[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface AssetWithRelations {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDesc: string | null;
  kind: AssetKind;
  authorId: string;
  categoryId: string;
  status: string;
  visibility: string;
  currentVersionId: string | null;
  downloads: number;
  stars: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  featured: boolean;
  deprecated: boolean;
  deprecationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  author: { id: string; name: string | null; username: string | null; avatar: string | null };
  category: { id: string; slug: string; name: string; icon: string | null } | null;
  tags: Array<{ tag: { id: string; slug: string; name: string; color: string | null } }>;
  compatibilities: Array<{ target: string; minVersion: string | null; maxVersion: string | null; verified: boolean }>;
  versions: Array<{ version: string; changelog: string; createdAt: Date; status: string; isPrerelease: boolean }>;
  screenshots: Array<{ url: string; alt: string | null; sortOrder: number }>;
  dependencies: Array<{
    id: string;
    versionRange: string;
    isOptional: boolean;
    type: string;
    dependency: { id: string; slug: string; name: string; kind: string; author: { username: string | null } };
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    title: string | null;
    content: string;
    createdAt: Date;
    user: { id: string; name: string | null; username: string | null; avatar: string | null };
  }>;
  _count: { reviews: number; downloads_: number };
}

export async function getMarketplaceAssets(filters: MarketplaceFilters = {}): Promise<PaginatedAssets> {
  const {
    category,
    kind,
    verifiedOnly,
    compatibility,
    search,
    featured,
    sortBy = "trending",
    page = 1,
    limit = 20,
  } = filters;

  const where: Record<string, unknown> = {
    status: "PUBLISHED",
    visibility: "PUBLIC",
  };

  if (category && category !== "All") {
    where.category = { slug: category };
  }

  if (kind && kind.length > 0) {
    where.kind = { in: kind };
  }

  if (verifiedOnly) {
    where.verified = true;
  }

  if (featured) {
    where.featured = true;
  }

  if (compatibility && compatibility.length > 0) {
    where.compatibilities = {
      some: {
        target: { in: compatibility },
        verified: true,
      },
    };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { author: { name: { contains: search, mode: "insensitive" } } },
      { tags: { some: { tag: { name: { contains: search, mode: "insensitive" } } } } },
    ];
  }

  let orderBy: Record<string, unknown> | Array<Record<string, unknown>>;
  switch (sortBy) {
    case "recent":
      orderBy = { createdAt: "desc" };
      break;
    case "rating":
      orderBy = { rating: "desc" };
      break;
    case "downloads":
      orderBy = { downloads: "desc" };
      break;
    case "alphabetical":
      orderBy = { name: "asc" };
      break;
    case "trending":
    default:
      orderBy = [
        { rating: "desc" },
        { downloads: "desc" },
        { createdAt: "desc" },
      ];
      break;
  }

  const [assets, totalCount] = await Promise.all([
    prisma.asset.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true } },
        category: { select: { id: true, slug: true, name: true, icon: true } },
        tags: { 
          include: { 
            tag: { select: { id: true, slug: true, name: true, color: true } } 
          } 
        },
        compatibilities: { select: { target: true, minVersion: true, maxVersion: true, verified: true } },
        versions: { 
          select: { version: true, changelog: true, createdAt: true, status: true, isPrerelease: true },
          orderBy: { createdAt: "desc" },
          take: 5 
        },
        screenshots: { orderBy: { sortOrder: "asc" } },
        dependencies: {
          include: {
            dependency: { select: { id: true, slug: true, name: true, kind: true, author: { select: { username: true } } } },
          },
        },
        reviews: {
          include: {
            user: { select: { id: true, name: true, username: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: { select: { reviews: true, downloads_: true } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.asset.count({ where }),
  ]);

  return {
    assets,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

export async function getAssetBySlug(slug: string) {
  return prisma.asset.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true, bio: true } },
      category: { select: { id: true, slug: true, name: true, icon: true } },
      tags: { 
        include: { 
          tag: { select: { id: true, slug: true, name: true, color: true } } 
        } 
      },
      compatibilities: { select: { target: true, minVersion: true, maxVersion: true, verified: true } },
      versions: { 
        select: { id: true, version: true, changelog: true, readme: true, createdAt: true, status: true, isPrerelease: true },
        orderBy: { createdAt: "desc" } 
      },
      screenshots: { orderBy: { sortOrder: "asc" } },
      dependencies: {
        include: {
          dependency: { select: { id: true, slug: true, name: true, kind: true, author: { select: { username: true } } } },
        },
      },
      reviews: {
        include: {
          user: { select: { id: true, name: true, username: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { reviews: true, downloads_: true } },
    },
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { assets: { where: { status: "PUBLISHED", visibility: "PUBLIC" } } } } },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAssetKinds(): Promise<string[]> {
  return Object.values(AssetKind);
}

export async function incrementDownloadCount(assetId: string, versionId?: string, userId?: string) {
  return prisma.$transaction([
    prisma.asset.update({
      where: { id: assetId },
      data: { downloads: { increment: 1 } },
    }),
    prisma.download.create({
      data: {
        assetId,
        versionId,
        userId,
      },
    }),
  ]);
}

export async function incrementViewCount(assetId: string) {
  return prisma.assetStat.upsert({
    where: { assetId },
    create: { assetId, views: 1 },
    update: { views: { increment: 1 } },
  });
}