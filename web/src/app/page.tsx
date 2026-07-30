import { Header, Footer } from '@/components/layout';
import { Hero } from '@/components/sections/hero';
import { Stats } from '@/components/sections/stats';
import { Features } from '@/components/sections/features';
import { ProductGrid } from '@/components/sections/product-grid';
import { MarketplacePreview } from '@/components/sections/marketplace-preview';
import { DesktopPreview } from '@/components/sections/desktop-preview';
import { RegistryPreview } from '@/components/sections/registry-preview';
import { SearchPreview } from '@/components/sections/search-preview';
import { DownloadCTA } from '@/components/sections/download-cta';
import { GitHubCTA } from '@/components/sections/github-cta';
import { CTA } from '@/components/sections/cta';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <section className="flex flex-1 flex-col" aria-labelledby="hero-heading">
        <Hero />
        <Stats />
        <Features />
        <ProductGrid />
        <MarketplacePreview />
        <DesktopPreview />
        <RegistryPreview />
        <SearchPreview />
        <DownloadCTA />
        <GitHubCTA />
        <CTA />
      </section>
      <Footer />
    </main>
  );
}
