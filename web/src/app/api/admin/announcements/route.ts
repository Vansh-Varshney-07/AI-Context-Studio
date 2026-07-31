import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createAnnouncement, getAnnouncements, updateAnnouncement, deleteAnnouncement } from "@/actions/admin";
import { requireAdmin } from "@/actions/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    // This would need a getAnnouncementById function
    return NextResponse.json({ error: "Not implemented" }, { status: 501 });
  }

  const announcements = await getAnnouncements();
  return NextResponse.json(announcements);
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await request.json();
  const { title, content, type, priority, isGlobal, targetRoles, startsAt, endsAt, actionUrl, actionLabel } = body;

  if (!title || !content || !type) {
    return NextResponse.json({ error: "Title, content, and type required" }, { status: 400 });
  }

  const announcement = await createAnnouncement({
    title,
    content,
    type,
    priority: priority || 0,
    isGlobal: isGlobal !== false,
    targetRoles: targetRoles || ["USER", "MODERATOR", "ADMIN", "OWNER"],
    startsAt: startsAt ? new Date(startsAt) : undefined,
    endsAt: endsAt ? new Date(endsAt) : undefined,
    actionUrl,
    actionLabel,
  });

  return NextResponse.json(announcement, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: "Announcement ID required" }, { status: 400 });
  }

  const announcement = await updateAnnouncement(id, body);
  return NextResponse.json(announcement);
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Announcement ID required" }, { status: 400 });
  }

  await deleteAnnouncement(id);
  return NextResponse.json({ success: true });
}