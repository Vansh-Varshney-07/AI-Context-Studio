import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/metadata';
import { docCategories } from '@/data/docs';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/products`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/marketplace`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/registry`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/community`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/docs`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/download`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/roadmap`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/security`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: 'yearly', priority: 0.5 },
  ];

  const docPages: MetadataRoute.Sitemap = docCategories.flatMap((cat) =>
    cat.items.map((item) => ({
      url: `${baseUrl}${item.href}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  );

  return [...staticPages, ...docPages];
}
