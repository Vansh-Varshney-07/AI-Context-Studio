import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { submitContactMessage, getContactMessages, getContactMessageById, updateContactMessage, sendReply } from "@/actions/contact";
import { requireAuth } from "@/actions/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const id = searchParams.get("id");

  if (action === "admin") {
    try {
      await requireAuth(); // In real implementation, check admin role
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (id) {
      const message = await getContactMessageById(id);
      if (!message) {
        return NextResponse.json({ error: "Message not found" }, { status: 404 });
      }
      return NextResponse.json(message);
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
    const status = searchParams.get("status") || undefined;
    const type = searchParams.get("type") || undefined;

    const result = await getContactMessages({ page, limit, status, type });
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "submit") {
    const body = await request.json();
    const { name, email, subject, message, type } = body;

    if (!name || !email || !subject || !message || !type) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    // Try to get user if authenticated
    let userId: string | undefined;
    try {
      const session = await requireAuth();
      userId = session.user.id;
    } catch {
      // Not authenticated, continue as guest
    }

    const result = await submitContactMessage({ name, email, subject, message, type }, userId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result, { status: 201 });
  }

  if (action === "reply") {
    try {
      await requireAuth(); // Check admin role
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, reply } = body;

    if (!id || !reply) {
      return NextResponse.json({ error: "ID and reply required" }, { status: 400 });
    }

    const result = await sendReply(id, reply, "support@ai-context-studio.dev");
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAuth(); // Check admin role
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Message ID required" }, { status: 400 });
  }

  const body = await request.json();
  const { status, assignedTo, response } = body;

  const message = await updateContactMessage(id, { status, assignedTo, response });
  return NextResponse.json(message);
}