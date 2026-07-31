import { type Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { AssetDetail } from "@/components/marketplace/asset-detail";
import { generateMetadata as generatePageMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { getAssetBySlug } from "@/actions/marketplace";

interface AssetDetailPageProps {
  params: Promise<{ asset: string }>;
}

export async function generateMetadata({ params }: AssetDetailPageProps): Promise<Metadata> {
  const { asset } = await params;
  const assetData = await getAssetBySlug(asset);

  if (!assetData) {
    return generatePageMetadata({ title: "Asset Not Found" });
  }

  return generatePageMetadata({
    title: assetData.name,
    description: assetData.description,
    openGraph: {
      title: `${assetData.name} | AI Context Studio Marketplace`,
      description: assetData.description,
      images: assetData.screenshots[0]?.url ? [assetData.screenshots[0].url] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: assetData.name,
      description: assetData.description,
      images: assetData.screenshots[0]?.url ? [assetData.screenshots[0].url] : [],
    },
  });
}

export default async function AssetDetailPage({ params }: AssetDetailPageProps) {
  const { asset } = await params;
  const assetData = await getAssetBySlug(asset);

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