import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getPosts, getPostBySlug, getPostTags, createPost } from "@/actions/community";
import { requireAuth } from "@/actions/auth";
import type { PostType, PostStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const action = searchParams.get("action");

  if (slug) {
    const post = await getPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  }

  if (action === "tags") {
    const tags = await getPostTags();
    return NextResponse.json(tags);
  }

  const typeParam = searchParams.get("type");
  const statusParam = searchParams.get("status");
  const tag = searchParams.get("tag");
  const authorId = searchParams.get("authorId");
  const search = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

  const filters = {
    type: (typeParam as PostType) || undefined,
    status: (statusParam as PostStatus) || "PUBLISHED",
    tag: tag || undefined,
    authorId: authorId || undefined,
    search: search || undefined,
    page,
    limit,
  };

  const result = await getPosts(filters);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "create") {
    try {
      const session = await requireAuth();
      const body = await request.json();
      const { title, content, excerpt, type, tags, status } = body;

      if (!title || !content || !type) {
        return NextResponse.json({ error: "Title, content, and type are required" }, { status: 400 });
      }

      const post = await createPost({
        title,
        content,
        excerpt,
        type,
        tags,
        authorId: session.user.id,
        status: status || "PUBLISHED",
      });

      return NextResponse.json(post, { status: 201 });
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}