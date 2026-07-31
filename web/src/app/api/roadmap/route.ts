import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRoadmapItems, getRoadmapStats, voteRoadmapItem, removeRoadmapVote } from "@/actions/roadmap";
import { requireAuth } from "@/actions/auth";
import type { RoadmapStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "stats") {
    const stats = await getRoadmapStats();
    return NextResponse.json(stats);
  }

  const statusParam = searchParams.get("status");
  const filters = {
    status: (statusParam as RoadmapStatus) || undefined,
    phase: searchParams.get("phase") || undefined,
  };

  const items = await getRoadmapItems(filters);
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "vote") {
    try {
      const session = await requireAuth();
      const body = await request.json();
      const { itemId, type } = body;

      if (!itemId || !type || !["UP", "DOWN"].includes(type)) {
        return NextResponse.json({ error: "Invalid vote data" }, { status: 400 });
      }

      await voteRoadmapItem(itemId, session.user.id, type);
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (action === "unvote") {
    try {
      const session = await requireAuth();
      const body = await request.json();
      const { itemId } = body;

      if (!itemId) {
        return NextResponse.json({ error: "Item ID required" }, { status: 400 });
      }

      await removeRoadmapVote(itemId, session.user.id);
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}