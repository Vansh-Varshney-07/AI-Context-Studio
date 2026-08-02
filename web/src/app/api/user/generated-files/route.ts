import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getMyGeneratedFiles,
  createGeneratedFile,
  updateGeneratedFile,
  deleteGeneratedFile,
  getGeneratedFileById,
} from "@/actions/user";
import { requireAuth } from "@/actions/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "24"), 100);
  const kind = searchParams.get("kind") || undefined;
  const favoriteFilter = searchParams.get("favoriteFilter") === "true";

  const result = await getMyGeneratedFiles({ page, limit, kind, favoriteFilter });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { kind, title, content, metadata, isPublic, tokens, modelUsed } = body;

  if (!kind || !title || !content) {
    return NextResponse.json({ error: "Kind, title, and content required" }, { status: 400 });
  }

  try {
    const file = await createGeneratedFile({
      kind,
      title,
      content,
      metadata,
      isPublic,
      tokens,
      modelUsed,
    });
    return NextResponse.json(file, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create file" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body = await request.json();

  if (!id) return NextResponse.json({ error: "File ID required" }, { status: 400 });

  try {
    await updateGeneratedFile(id, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
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
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "File ID required" }, { status: 400 });

  try {
    await deleteGeneratedFile(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 }
    );
  }
}
