import { MetadataRoute } from 'next';
import { projects } from '@/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://apege.dev';

  const projectUrls = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...projectUrls,
  ];
}
