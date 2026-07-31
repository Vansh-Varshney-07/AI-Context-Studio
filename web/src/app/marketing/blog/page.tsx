import { type Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { generateMetadata } from '@/lib/metadata';
import { BlogPageClient } from '@/components/blog/blog-page-client';
import { getBlogPosts, getBlogCategories, getFeaturedBlogPosts } from '@/actions/blog';

export const metadata: Metadata = generateMetadata({
  title: 'Blog & Updates',
  description: 'Latest news, release notes, announcements, and development logs from AI Context Studio. Stay up to date with new features, community highlights, and roadmap progress.',
});

// Force dynamic rendering to avoid database queries during build
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const [initialData, categories, featuredPosts] = await Promise.all([
    getBlogPosts({ page: 1, limit: 10 }),
    getBlogCategories(),
    getFeaturedBlogPosts(3),
  ]);

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <BlogPageClient
        initialPosts={initialData.posts}
        initialTotalCount={initialData.totalCount}
        initialTotalPages={initialData.totalPages}
        categories={categories}
        featuredPosts={featuredPosts}
      />
      <Footer />
    </main>
  );
}