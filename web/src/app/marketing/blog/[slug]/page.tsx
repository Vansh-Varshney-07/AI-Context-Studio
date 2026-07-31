import { type Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { BlogPostClient } from "@/components/blog/blog-post-client";
import { generateMetadata as generatePageMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/actions/blog";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return generatePageMetadata({ title: "Post Not Found" });
  }

  return generatePageMetadata({
    title: post.title,
    description: post.excerpt || post.content.slice(0, 160),
    openGraph: {
      title: `${post.title} | AI Context Studio Blog`,
      description: post.excerpt || post.content.slice(0, 160),
      images: post.coverImage ? [post.coverImage] : [],
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.author.name ? [post.author.name] : [post.author.username || "AI Context Studio"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160),
      images: post.coverImage ? [post.coverImage] : [],
    },
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <section className="flex flex-1 flex-col">
        <BlogPostClient post={post} />
      </section>
      <Footer />
    </main>
  );
}