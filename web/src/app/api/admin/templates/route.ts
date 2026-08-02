import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getSystemPromptTemplates,
  createSystemPromptTemplate,
  updateSystemPromptTemplate,
  deleteSystemPromptTemplate,
} from "@/actions/admin";
import { requireAdmin, requireModerator } from "@/actions/auth";

export async function GET(request: NextRequest) {
  try {
    await requireModerator();
  } catch {
    return NextResponse.json({ error: "Moderator access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const targetId = searchParams.get("targetId") || undefined;
  const activeOnly = searchParams.get("active") === "true";

  const templates = await getSystemPromptTemplates({ category, targetId, activeOnly });
  return NextResponse.json(templates);
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await request.json();
  const { key, name, description, category, targetId, content, constraints, isActive, isDefault, sortOrder } = body;

  if (!key || !name || !category || !content) {
    return NextResponse.json({ error: "Key, name, category, and content required" }, { status: 400 });
  }

  const template = await createSystemPromptTemplate({
    key,
    name,
    description,
    category,
    targetId,
    content,
    constraints,
    isActive: isActive ?? true,
    isDefault: isDefault ?? false,
    sortOrder: sortOrder ?? 0,
  });

  return NextResponse.json(template, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Template ID required" }, { status: 400 });

  const body = await request.json();
  const template = await updateSystemPromptTemplate(id, body);
  return NextResponse.json(template);
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Template ID required" }, { status: 400 });

  await deleteSystemPromptTemplate(id);
  return NextResponse.json({ success: true });
}
