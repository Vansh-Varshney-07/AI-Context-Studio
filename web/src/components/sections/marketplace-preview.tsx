import { getMarketplaceAssets, getCategories } from "@/actions/marketplace";
import { MarketplacePreviewClient } from "./marketplace-preview-client";

export async function MarketplacePreview() {
  const [featuredResult, categories] = await Promise.all([
    getMarketplaceAssets({ featured: true, limit: 3 }),
    getCategories(),
  ]);

  const assets = featuredResult.assets.map((asset) => ({
    id: asset.id,
    name: asset.name,
    description: asset.description ?? "",
    shortDesc: asset.shortDesc,
    category: asset.category
      ? {
          id: asset.category.id,
          slug: asset.category.slug,
          name: asset.category.name,
          icon: asset.category.icon,
        }
      : null,
    downloads: asset.downloads,
    rating: asset.rating,
    reviewCount: asset.reviewCount,
    verified: asset.verified,
    featured: asset.featured,
    tags: asset.tags.map((t) => t.tag.name),
  }));

  return <MarketplacePreviewClient initialAssets={assets} initialCategories={categories} />;
}
