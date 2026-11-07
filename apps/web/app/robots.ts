import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/private/', '/admin/', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-Web',
          'Anthropic-AI',
          'Google-Extended',
          'PerplexityBot',
          'Bytespider',
          'CCBot',
          'FacebookBot',
          'Amazonbot',
          'Applebot-Extended',
          'cohere-ai',
          'Omgilibot',
          'Diffbot',
        ],
        disallow: '/',
      },
    ],
    sitemap: 'https://stackbyalif.my.id/sitemap.xml',
    host: 'https://stackbyalif.my.id',
  };
}
