import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { subscribeToNewsletter, confirmNewsletterSubscription, unsubscribeFromNewsletter } from "@/actions/newsletter";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "subscribe") {
    const body = await request.json();
    const { email, name, source } = body;

    const result = await subscribeToNewsletter(email, name, source);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ message: result.message });
  }

  if (action === "confirm") {
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }
    const result = await confirmNewsletterSubscription(token);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ message: result.message });
  }

  if (action === "unsubscribe") {
    const body = await request.json();
    const { email } = body;
    const result = await unsubscribeFromNewsletter(email);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ message: result.message });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}