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
    { url: `${baseUrl}/generate`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/tools`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/instruction-files`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/tools/mcp-config`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/tools/memories`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/tools/optimize`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/tools/personas`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/tools/skills`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/tools/validate`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/tools/workflows`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/registry`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/community`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/docs`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/download`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/roadmap`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/security`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/changelog`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/license`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/cookies`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
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
