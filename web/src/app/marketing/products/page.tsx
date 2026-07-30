import { type Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { ProductGrid } from '@/components/sections/product-grid';
import { CTA } from '@/components/sections/cta';
import { generateMetadata } from '@/lib/metadata';
import { ArchitectureDiagram } from '@/components/products/architecture-diagram';
import { FeatureComparison } from '@/components/products/feature-comparison';
import { WhySeparateApps } from '@/components/products/why-separate-apps';

export const metadata: Metadata = generateMetadata({
  title: 'Products',
  description:
    'Explore the AI Context Studio ecosystem — Desktop App, Online Hub, Marketplace, Registry, Community, and upcoming Cloud platform.',
});

export default function ProductsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <section className="flex flex-1 flex-col">
        <ProductGrid />
        <ArchitectureDiagram />
        <FeatureComparison />
        <WhySeparateApps />
        <CTA />
      </section>
      <Footer />
    </main>
  );
}
