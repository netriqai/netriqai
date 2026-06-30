import { MetadataRoute } from 'next';
import { readBlogsLocal } from '@/lib/blogDb';

const baseUrl = 'https://netriq.com.au';

// Parse human-readable post dates (e.g. "June 8, 2026") into YYYY-MM-DD.
// Falls back to a stable static date if parsing fails, so the sitemap never
// emits an invalid lastModified.
function toIsoDate(input?: string, fallback = '2025-05-01'): string {
  if (!input) return fallback;
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return fallback;
  return d.toISOString().split('T')[0];
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Use static dates instead of new Date() for static pages — dynamic dates
  // cause unnecessary sitemap churn and signal to crawlers that content
  // changes on every request.
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: '2025-05-01',
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: '2025-05-01',
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: '2025-04-01',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: '2025-04-01',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/education`,
      lastModified: '2025-05-01',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: '2025-03-01',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: '2025-05-01',
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // Enumerate published blog posts so the freshest content is discoverable.
  const blogRoutes: MetadataRoute.Sitemap = readBlogsLocal().map((post) => ({
    url: `${baseUrl}/resources/${post.slug}`,
    lastModified: toIsoDate(post.date),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...blogRoutes];
}
