import { MetadataRoute } from 'next';
import { projects } from '@/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://stackbyalif.my.id';
  const lastModified = new Date();

  // Project URLs
  const projectUrls = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/id`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    ...projectUrls,
  ];
}
