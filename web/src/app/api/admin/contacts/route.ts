import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAdminContactMessages, getContactMessage, updateContactMessageStatus } from "@/actions/admin";
import { requireModerator } from "@/actions/auth";

export async function GET(request: NextRequest) {
  try {
    await requireModerator();
  } catch {
    return NextResponse.json({ error: "Moderator access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
  const status = searchParams.get("status") || undefined;
  const type = searchParams.get("type") || undefined;

  if (action === "single") {
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const message = await getContactMessage(id);
    if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(message);
  }

  const result = await getAdminContactMessages({ page, limit, status, type });
  return NextResponse.json(result);
}

export async function PATCH(request: NextRequest) {
  try {
    await requireModerator();
  } catch {
    return NextResponse.json({ error: "Moderator access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Contact message ID required" }, { status: 400 });

  const body = await request.json();
  const message = await updateContactMessageStatus(id, body);
  return NextResponse.json(message);
}
