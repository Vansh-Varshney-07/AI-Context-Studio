import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/actions/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const days = parseInt(searchParams.get("days") || "30");
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  if (action === "overview") {
    const [
      totalUsers,
      newUsers,
      totalAssets,
      newAssets,
      totalDownloads,
      totalPageViews,
      activeUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: startDate } } }),
      prisma.asset.count(),
      prisma.asset.count({ where: { createdAt: { gte: startDate } } }),
      prisma.download.count({ where: { createdAt: { gte: startDate } } }),
      prisma.pageView.count({ where: { createdAt: { gte: startDate } } }),
      prisma.user.count({ where: { lastLoginAt: { gte: startDate } } }),
    ]);

    return NextResponse.json({
      totalUsers,
      newUsers,
      totalAssets,
      newAssets,
      totalDownloads,
      totalPageViews,
      activeUsers,
      periodDays: days,
    });
  }

  if (action === "downloads") {
    const downloads = await prisma.download.groupBy({
      by: ["createdAt"],
      where: { createdAt: { gte: startDate } },
      _count: { id: true },
      orderBy: { createdAt: "asc" },
    });

    const byPlatform = await prisma.download.groupBy({
      by: ["platform"],
      where: { createdAt: { gte: startDate }, platform: { not: null } },
      _count: { id: true },
    });

    const byAsset = await prisma.download.groupBy({
      by: ["assetId"],
      where: { createdAt: { gte: startDate } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 20,
    });

    const assetIds = byAsset.map((a) => a.assetId);
    const assets = await prisma.asset.findMany({
      where: { id: { in: assetIds } },
      select: { id: true, name: true, slug: true },
    });

    const assetMap = new Map(assets.map((a) => [a.id, a]));
    const topAssets = byAsset.map((a) => ({
      asset: assetMap.get(a.assetId),
      downloads: a._count.id,
    }));

    return NextResponse.json({ downloads, byPlatform, topAssets });
  }

  if (action === "pageviews") {
    const pageViews = await prisma.pageView.groupBy({
      by: ["url"],
      where: { createdAt: { gte: startDate } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 50,
    });

    const dailyViews = await prisma.pageView.groupBy({
      by: ["createdAt"],
      where: { createdAt: { gte: startDate } },
      _count: { id: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ pageViews, dailyViews });
  }

  if (action === "users") {
    const newUsers = await prisma.user.groupBy({
      by: ["createdAt"],
      where: { createdAt: { gte: startDate } },
      _count: { id: true },
      orderBy: { createdAt: "asc" },
    });

    const byRole = await prisma.user.groupBy({
      by: ["role"],
      _count: { id: true },
    });

    const activeUsers = await prisma.user.count({ where: { lastLoginAt: { gte: startDate } } });
    const verifiedUsers = await prisma.user.count({ where: { emailVerified: true } });

    return NextResponse.json({ newUsers, byRole, activeUsers, verifiedUsers });
  }

  if (action === "assets") {
    const newAssets = await prisma.asset.groupBy({
      by: ["createdAt"],
      where: { createdAt: { gte: startDate } },
      _count: { id: true },
      orderBy: { createdAt: "asc" },
    });

    const byKind = await prisma.asset.groupBy({
      by: ["kind"],
      where: { status: "PUBLISHED", visibility: "PUBLIC" },
      _count: { id: true },
    });

    const byCategory = await prisma.asset.groupBy({
      by: ["categoryId"],
      where: { status: "PUBLISHED", visibility: "PUBLIC" },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 20,
    });

    const categoryIds = byCategory.map((c) => c.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, slug: true },
    });

    const categoryMap = new Map(categories.map((c) => [c.id, c]));
    const topCategories = byCategory.map((c) => ({
      category: categoryMap.get(c.categoryId),
      count: c._count.id,
    }));

    return NextResponse.json({ newAssets, byKind, topCategories });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}