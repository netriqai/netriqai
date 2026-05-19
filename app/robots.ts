import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/', '/portal'],
      },
      // Allow major AI/LLM crawlers — critical for GEO (Generative Engine Optimisation)
      {
        userAgent: [
          'GPTBot',           // OpenAI / ChatGPT
          'ChatGPT-User',     // ChatGPT browsing
          'Claude-Web',       // Anthropic Claude
          'ClaudeBot',        // Anthropic Claude bot
          'Google-Extended',  // Google Gemini
          'PerplexityBot',    // Perplexity AI
          'YouBot',           // You.com
          'Bingbot',          // Microsoft Copilot indexing
          'meta-externalagent', // Meta AI
          'cohere-ai',        // Cohere AI
        ],
        allow: '/',
        disallow: ['/portal'],
      },
    ],
    sitemap: 'https://netriq.com.au/sitemap.xml',
  };
}
