import { type Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { AssetDetail } from '@/components/marketplace/asset-detail';
import { assets } from '@/data/marketplace';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
import { notFound } from 'next/navigation';

interface AssetDetailPageProps {
  params: Promise<{ asset: string }>;
}

export async function generateStaticParams() {
  return assets.map((asset) => ({
    asset: asset.id,
  }));
}

export async function generateMetadata({ params }: AssetDetailPageProps): Promise<Metadata> {
  const { asset } = await params;
  const assetData = assets.find((a) => a.id === asset);

  if (!assetData) {
    return generatePageMetadata({ title: 'Asset Not Found' });
  }

  return generatePageMetadata({
    title: assetData.name,
    description: assetData.description,
    openGraph: {
      title: `${assetData.name} | AI Context Studio Marketplace`,
      description: assetData.description,
      images: assetData.thumbnail ? [assetData.thumbnail] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: assetData.name,
      description: assetData.description,
      images: assetData.thumbnail ? [assetData.thumbnail] : [],
    },
  });
}

export default async function AssetDetailPage({ params }: AssetDetailPageProps) {
  const { asset } = await params;
  const assetData = assets.find((a) => a.id === asset);

  if (!assetData) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <section className="flex flex-1 flex-col">
        <AssetDetail asset={assetData} />
      </section>
      <Footer />
    </main>
  );
}
