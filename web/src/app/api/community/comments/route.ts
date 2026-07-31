import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getComments, createComment, updateComment, deleteComment, likeComment, unlikeComment } from "@/actions/community";
import { requireAuth } from "@/actions/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  const parentId = searchParams.get("parentId");

  if (!postId) {
    return NextResponse.json({ error: "Post ID required" }, { status: 400 });
  }

  const comments = await getComments({
    postId,
    parentId: parentId || null,
    status: "PUBLISHED",
  });

  return NextResponse.json(comments);
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "create") {
    try {
      const session = await requireAuth();
      const body = await request.json();
      const { content, postId, parentId } = body;

      if (!content || !postId) {
        return NextResponse.json({ error: "Content and post ID required" }, { status: 400 });
      }

      const comment = await createComment({
        content,
        postId,
        authorId: session.user.id,
        parentId: parentId || undefined,
      });

      return NextResponse.json(comment, { status: 201 });
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (action === "like") {
    try {
      const session = await requireAuth();
      const body = await request.json();
      const { commentId } = body;

      if (!commentId) {
        return NextResponse.json({ error: "Comment ID required" }, { status: 400 });
      }

      await likeComment(commentId, session.user.id);
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (action === "unlike") {
    try {
      const session = await requireAuth();
      const body = await request.json();
      const { commentId } = body;

      if (!commentId) {
        return NextResponse.json({ error: "Comment ID required" }, { status: 400 });
      }

      await unlikeComment(commentId, session.user.id);
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { commentId, content } = body;

    if (!commentId || !content) {
      return NextResponse.json({ error: "Comment ID and content required" }, { status: 400 });
    }

    const comment = await updateComment(commentId, content, session.user.id);
    return NextResponse.json(comment);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json({ error: "Comment ID required" }, { status: 400 });
    }

    await deleteComment(commentId, session.user.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}