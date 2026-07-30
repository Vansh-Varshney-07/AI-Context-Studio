import { type Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { generateMetadata } from '@/lib/metadata';
import { MarketplaceCategoryPage } from '@/components/marketplace/category-page';

export const metadata: Metadata = generateMetadata({
  title: 'Marketplace',
  description:
    'Discover, install, and publish community AI assets — skills, personas, templates, prompt packs, workflows, and MCP servers.',
});

export default function MarketplacePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <MarketplaceCategoryPage />
      <Footer />
    </main>
  );
}
