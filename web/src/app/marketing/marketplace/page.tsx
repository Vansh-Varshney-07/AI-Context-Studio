import { type Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { generateMetadata } from '@/lib/metadata';
import { MarketplaceCategoryPageClient } from '@/components/marketplace/category-page-client';
import { getMarketplaceAssets, getCategories, getAssetKinds } from '@/actions/marketplace';

export const metadata: Metadata = generateMetadata({
  title: 'Marketplace',
  description:
    'Discover, install, and publish community AI assets — skills, personas, templates, prompt packs, workflows, and MCP servers.',
});

// Force dynamic rendering to avoid database queries during build
export const dynamic = 'force-dynamic';

export default async function MarketplacePage() {
  // Fetch initial data for SSR
  const [initialData, categories, kinds] = await Promise.all([
    getMarketplaceAssets({ page: 1, limit: 20 }),
    getCategories(),
    getAssetKinds(),
  ]);

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <MarketplaceCategoryPageClient
        initialAssets={initialData.assets}
        initialTotalCount={initialData.totalCount}
        initialTotalPages={initialData.totalPages}
        categories={categories}
        kinds={kinds}
      />
      <Footer />
    </main>
  );
}