import type { Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { Hero } from '@/components/sections/hero';
import { StatsSection } from '@/components/sections/stats';
import { Features } from '@/components/sections/features';
import { ProductGrid } from '@/components/sections/product-grid';
import { MarketplacePreview } from '@/components/sections/marketplace-preview';
import { DesktopPreview } from '@/components/sections/desktop-preview';
import { RegistryPreview } from '@/components/sections/registry-preview';
import { SearchPreview } from '@/components/sections/search-preview';
import { DownloadCTA } from '@/components/sections/download-cta';
import { GitHubCTA } from '@/components/sections/github-cta';
import { CTA } from '@/components/sections/cta';
import { generateMetadata, organizationSchema, websiteSchema, softwareApplicationSchema } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'AI Context Studio — AI Prompt Engineering Studio',
  description:
    'Build, customize, manage, and export AI instruction assets for Cursor, Claude Code, Windsurf, VS Code, and more. Generate system prompts, instruction files, personas, workflows, and MCP configs — free and open source.',
});

export default async function Home() {
  const stats = await StatsSection();

  return (
    <main className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <Header />
      <section className="flex flex-1 flex-col" aria-labelledby="hero-heading">
        <Hero />
        {stats}
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