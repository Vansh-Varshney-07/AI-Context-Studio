import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAllBlogPosts, createBlogPost, deleteBlogPost, updateBlogPost, getBlogPostById } from "@/actions/admin";
import { requireModerator, requireAdmin } from "@/actions/auth";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    await requireModerator();
  } catch {
    return NextResponse.json({ error: "Moderator access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "single") {
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const post = await getBlogPostById(id);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  }

  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;

  const result = await getAllBlogPosts({ page, limit, search, status });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    await requireModerator();
  } catch {
    return NextResponse.json({ error: "Moderator access required" }, { status: 403 });
  }

  const body = await request.json();
  const { title, slug, excerpt, content, coverImage, status, featured, metaTitle, metaDescription, ogImage, canonicalUrl, authorId } = body;

  if (!title || !content || !authorId) {
    return NextResponse.json({ error: "Title, content, and authorId required" }, { status: 400 });
  }

  const finalSlug = slug || slugify(title);
  const isPublished = status === "PUBLISHED";

  const post = await createBlogPost({
    title,
    slug: finalSlug,
    excerpt,
    content,
    coverImage,
    status: status || "DRAFT",
    featured: featured || false,
    metaTitle,
    metaDescription,
    ogImage,
    canonicalUrl,
    authorId,
    publishedAt: isPublished ? new Date() : undefined,
  });

  return NextResponse.json(post, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  try {
    await requireModerator();
  } catch {
    return NextResponse.json({ error: "Moderator access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Blog post ID required" }, { status: 400 });

  const body = await request.json();

  if (body.status === "PUBLISHED" && !body.publishedAt) {
    body.publishedAt = new Date();
  }

  const post = await updateBlogPost(id, body);
  return NextResponse.json(post);
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Blog post ID required" }, { status: 400 });

  await deleteBlogPost(id);
  return NextResponse.json({ success: true });
}
