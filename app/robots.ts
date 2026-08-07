import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/private/', '/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: 'https://stackbyalif.my.id/sitemap.xml',
    host: 'https://stackbyalif.my.id',
  };
}
