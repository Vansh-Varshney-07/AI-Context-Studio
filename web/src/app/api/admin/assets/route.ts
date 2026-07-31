import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getPendingAssets, approveAsset, rejectAsset, getAllAssetsAdmin } from "@/actions/admin";
import { requireModerator } from "@/actions/auth";

export async function GET(request: NextRequest) {
  try {
    await requireModerator();
  } catch {
    return NextResponse.json({ error: "Moderator access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "pending") {
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const result = await getPendingAssets({ page, limit });
    return NextResponse.json(result);
  }

  if (action === "all") {
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const result = await getAllAssetsAdmin({ page, limit, search, status });
    return NextResponse.json(result);
  }

  const result = await getPendingAssets({ page: 1, limit: 20 });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    await requireModerator();
  } catch {
    return NextResponse.json({ error: "Moderator access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const body = await request.json();
  const { assetId } = body;

  if (!assetId) {
    return NextResponse.json({ error: "Asset ID required" }, { status: 400 });
  }

  if (action === "approve") {
    const asset = await approveAsset(assetId);
    return NextResponse.json(asset);
  }

  if (action === "reject") {
    const { reason } = body;
    if (!reason) {
      return NextResponse.json({ error: "Rejection reason required" }, { status: 400 });
    }
    const asset = await rejectAsset(assetId, reason);
    return NextResponse.json(asset);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}