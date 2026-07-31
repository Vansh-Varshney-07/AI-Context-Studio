import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getBlogPosts, getBlogPostBySlug, getBlogCategories, getFeaturedBlogPosts, incrementBlogViewCount } from "@/actions/blog";
import type { BlogStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  // Get single post by slug
  if (slug) {
    const post = await getBlogPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Increment view count
    await incrementBlogViewCount(slug);

    return NextResponse.json(post);
  }

  // Get featured posts
  if (searchParams.get("featured") === "true") {
    const limit = parseInt(searchParams.get("limit") || "3");
    const posts = await getFeaturedBlogPosts(limit);
    return NextResponse.json(posts);
  }

  // Get categories
  if (searchParams.get("categories") === "true") {
    const categories = await getBlogCategories();
    return NextResponse.json(categories);
  }

  // Get paginated list with filters
  const statusParam = searchParams.get("status");
  const filters = {
    category: searchParams.get("category") || undefined,
    tag: searchParams.get("tag") || undefined,
    search: searchParams.get("q") || undefined,
    status: (statusParam as BlogStatus) || "PUBLISHED",
    featured: searchParams.get("featured") === "true" ? true : searchParams.get("featured") === "false" ? false : undefined,
    authorId: searchParams.get("authorId") || undefined,
    page: parseInt(searchParams.get("page") || "1"),
    limit: Math.min(parseInt(searchParams.get("limit") || "10"), 50),
  };

  const result = await getBlogPosts(filters);
  return NextResponse.json(result);
}