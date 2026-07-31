import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAdminStats, getAllUsers, getUserById, updateUserRole, banUser } from "@/actions/admin";
import { requireAdmin } from "@/actions/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "stats") {
    const stats = await getAdminStats();
    return NextResponse.json(stats);
  }

  if (action === "users") {
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
    const search = searchParams.get("search") || undefined;
    const role = searchParams.get("role") || undefined;

    const result = await getAllUsers({ page, limit, search, role });
    return NextResponse.json(result);
  }

  if (action === "user") {
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  }

  const stats = await getAdminStats();
  return NextResponse.json(stats);
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "update-role") {
    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role || !["USER", "MODERATOR", "ADMIN", "OWNER"].includes(role)) {
      return NextResponse.json({ error: "Invalid userId or role" }, { status: 400 });
    }

    const user = await updateUserRole(userId, role);
    return NextResponse.json(user);
  }

  if (action === "ban") {
    const body = await request.json();
    const { userId, reason } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const user = await banUser(userId, reason);
    return NextResponse.json(user);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}