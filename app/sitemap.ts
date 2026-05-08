import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://netriq.com.au';

  // Use static dates instead of new Date() — dynamic dates cause unnecessary
  // sitemap churn and signal to crawlers that content changes on every request.
  return [
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
}
