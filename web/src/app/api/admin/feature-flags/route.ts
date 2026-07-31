import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getFeatureFlags, createFeatureFlag, updateFeatureFlag, deleteFeatureFlag } from "@/actions/admin";
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
    return NextResponse.json({ error: "Not implemented" }, { status: 501 });
  }

  const flags = await getFeatureFlags();
  return NextResponse.json(flags);
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await request.json();
  const { key, name, description, enabled, rollout, targeting } = body;

  if (!key || !name) {
    return NextResponse.json({ error: "Key and name required" }, { status: 400 });
  }

  const flag = await createFeatureFlag({ key, name, description, enabled, rollout, targeting });
  return NextResponse.json(flag, { status: 201 });
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
    return NextResponse.json({ error: "Feature flag ID required" }, { status: 400 });
  }

  const flag = await updateFeatureFlag(id, body);
  return NextResponse.json(flag);
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
    return NextResponse.json({ error: "Feature flag ID required" }, { status: 400 });
  }

  await deleteFeatureFlag(id);
  return NextResponse.json({ success: true });
}