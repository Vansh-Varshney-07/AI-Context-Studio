import { type Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { RoadmapClient } from '@/components/sections/roadmap-client';
import { generateMetadata } from '@/lib/metadata';
import { getRoadmapItems } from '@/actions/roadmap';

export const metadata: Metadata = generateMetadata({
  title: 'Roadmap',
  description:
    "Track AI Context Studio's development roadmap. View completed features, in-progress work, planned improvements, and future vision. Filter by status and category.",
});

// Force dynamic rendering to avoid database queries during build
export const dynamic = 'force-dynamic';

export default async function RoadmapPage() {
  const items = await getRoadmapItems();

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <RoadmapClient initialItems={items} />
      <Footer />
    </main>
  );
}