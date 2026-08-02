import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateMyProfile, updateMyEmail, updateMyUsername, getMySessions, revokeSession } from "@/actions/user";
import { requireAuth } from "@/actions/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const myProfile = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        sessions: {
          where: { expires: { gt: new Date() } },
          orderBy: { updatedAt: "desc" },
          take: 10,
        },
      },
    });
    return NextResponse.json(myProfile);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Email update
  if (body.email && typeof body.email === "string") {
    const result = await updateMyEmail(body.email);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  // Username update (handled in profile update)
  if (body.username && typeof body.username === "string") {
    const result = await updateMyUsername(body.username);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Full profile update
  try {
    const user = await updateMyProfile({
      name: body.name,
      username: body.username,
      bio: body.bio,
      avatar: body.avatar,
      profile: body.profile,
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("sessionId");

  if (id) {
    await revokeSession(id);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Session ID required" }, { status: 400 });
}
