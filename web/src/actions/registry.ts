"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface RegistryFilters {
  keyword?: string;
  authorId?: string;
  search?: string;
  isOfficial?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedRegistryPackages {
  packages: RegistryPackageWithRelations[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface RegistryPackageWithRelations {
  id: string;
  name: string;
  displayName: string;
  description: string;
  authorId: string;
  repository: string | null;
  homepage: string | null;
  license: string | null;
  isOfficial: boolean;
  isDeprecated: boolean;
  downloads: number;
  stars: number;
  dependents: number;
  createdAt: Date;
  updatedAt: Date;
  author: { id: string; name: string | null; username: string | null; avatar: string | null };
  versions: Array<{
    id: string;
    version: string;
    changelog: string | null;
    readme: string | null;
    downloads: number;
    isPrerelease: boolean;
    isDeprecated: boolean;
    publishedAt: Date | null;
  }>;
  keywords: Array<{ keyword: { id: string; name: string } }>;
  dependencies: Array<{
    versionRange: string;
    type: string;
    dependent: { id: string; name: string; displayName: string };
  }>;
}

export async function getRegistryPackages(filters: RegistryFilters = {}): Promise<PaginatedRegistryPackages> {
  const { keyword, authorId, search, isOfficial, page = 1, limit = 20 } = filters;

  const where: Prisma.RegistryPackageWhereInput = {
    isDeprecated: false,
  };

  if (authorId) where.authorId = authorId;
  if (isOfficial !== undefined) where.isOfficial = isOfficial;
  if (keyword) {
    where.keywords = { some: { keyword: { name: keyword } } };
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { displayName: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { author: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [packages, totalCount] = await Promise.all([
    prisma.registryPackage.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true } },
        versions: {
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            version: true,
            changelog: true,
            readme: true,
            downloads: true,
            isPrerelease: true,
            isDeprecated: true,
            publishedAt: true,
          },
        },
        keywords: { include: { keyword: { select: { id: true, name: true } } } },
        dependencies: {
          include: { dependent: { select: { id: true, name: true, displayName: true } } },
          take: 10,
        },
      },
      orderBy: [{ isOfficial: "desc" }, { downloads: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.registryPackage.count({ where }),
  ]);

  return { packages, totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page };
}

export async function getRegistryPackageByName(name: string) {
  const pkg = await prisma.registryPackage.findUnique({
    where: { name },
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true, bio: true } },
      versions: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          version: true,
          changelog: true,
          readme: true,
          downloads: true,
          isPrerelease: true,
          isDeprecated: true,
          deprecationReason: true,
          createdAt: true,
          publishedAt: true,
        },
      },
      keywords: { include: { keyword: { select: { id: true, name: true } } } },
      dependencies: {
        include: { dependent: { select: { id: true, name: true, displayName: true, author: { select: { username: true } } } } },
      },
      dependents_: {
        include: { package: { select: { id: true, name: true, displayName: true, author: { select: { username: true } } } } },
      },
    },
  });

  if (pkg) {
    await prisma.registryPackage.update({
      where: { id: pkg.id },
      data: { downloads: { increment: 1 } },
    });
  }

  return pkg;
}

export async function getRegistryPackageVersion(packageName: string, version: string) {
  const pkg = await prisma.registryPackage.findUnique({ where: { name: packageName } });
  if (!pkg) return null;

  return prisma.registryVersion.findUnique({
    where: { packageId_version: { packageId: pkg.id, version } },
    include: {
      package: { select: { id: true, name: true, displayName: true, author: { select: { username: true } } } },
    },
  });
}

export async function getRegistryKeywords() {
  return prisma.registryKeyword.findMany({
    include: { _count: { select: { packages: true } } },
    orderBy: { name: "asc" },
  });
}

export async function createRegistryPackage(data: {
  name: string;
  displayName: string;
  description: string;
  authorId: string;
  repository?: string;
  homepage?: string;
  license?: string;
  keywords?: string[];
}) {
  return prisma.registryPackage.create({
    data: {
      name: data.name.toLowerCase(),
      displayName: data.displayName,
      description: data.description,
      authorId: data.authorId,
      repository: data.repository,
      homepage: data.homepage,
      license: data.license,
      keywords: data.keywords
        ? {
            create: data.keywords.map((keyword) => ({
              keyword: { connectOrCreate: { where: { name: keyword }, create: { name: keyword } } },
            })),
          }
        : undefined,
    },
  });
}

export async function publishRegistryVersion(data: {
  packageId: string;
  version: string;
  manifest: Prisma.InputJsonValue;
  tarballUrl: string;
  tarballSize: number;
  checksum: string;
  signature?: string;
  changelog?: string;
  readme?: string;
  isPrerelease?: boolean;
}) {
  return prisma.registryVersion.create({
    data: {
      packageId: data.packageId,
      version: data.version,
      manifest: data.manifest,
      tarballUrl: data.tarballUrl,
      tarballSize: data.tarballSize,
      checksum: data.checksum,
      signature: data.signature,
      changelog: data.changelog,
      readme: data.readme,
      isPrerelease: data.isPrerelease || false,
    },
  });
}

export async function starRegistryPackage(packageId: string, userId: string) {
  return prisma.like.upsert({
    where: { userId_targetId_targetType: { userId, targetId: packageId, targetType: "ASSET" } },
    create: { userId, targetId: packageId, targetType: "ASSET" },
    update: {},
  });
}

export async function unstarRegistryPackage(packageId: string, userId: string) {
  return prisma.like.delete({
    where: { userId_targetId_targetType: { userId, targetId: packageId, targetType: "ASSET" } },
  });
}

export async function getUserStarredPackages(userId: string) {
  const likes = await prisma.like.findMany({
    where: { userId, targetType: "ASSET" },
    select: { targetId: true },
  });
  const packageIds = likes.map((l) => l.targetId);
  const packages = await prisma.registryPackage.findMany({
    where: { id: { in: packageIds } },
    select: { id: true, name: true, displayName: true },
  });
  return packages;
}