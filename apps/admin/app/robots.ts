import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/',
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
  };
}
