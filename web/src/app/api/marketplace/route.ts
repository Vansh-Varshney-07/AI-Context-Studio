import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getMarketplaceAssets, getAssetBySlug, incrementDownloadCount, incrementViewCount } from "@/actions/marketplace";
import type { AssetKind } from "@prisma/client";

type MarketplaceSortBy = "trending" | "recent" | "rating" | "downloads" | "alphabetical";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  // Get single asset by slug
  if (slug) {
    const asset = await getAssetBySlug(slug);
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Increment view count
    await incrementViewCount(asset.id);

    return NextResponse.json(asset);
  }

  // Get paginated list with filters
  const kindParam = searchParams.get("kind")?.split(",");
  const kind = kindParam?.map((k) => k as AssetKind) || undefined;

  const sortParam = searchParams.get("sort");
  const filters = {
    category: searchParams.get("category") || undefined,
    kind,
    verifiedOnly: searchParams.get("verified") === "true",
    compatibility: searchParams.get("compat")?.split(",") || undefined,
    search: searchParams.get("q") || undefined,
    sortBy: (sortParam as MarketplaceSortBy) || "trending",
    page: parseInt(searchParams.get("page") || "1"),
    limit: Math.min(parseInt(searchParams.get("limit") || "20"), 100),
  };

  const result = await getMarketplaceAssets(filters);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "download") {
    const body = await request.json();
    const { assetId, versionId } = body;

    if (!assetId) {
      return NextResponse.json({ error: "Asset ID required" }, { status: 400 });
    }

    await incrementDownloadCount(assetId, versionId);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}