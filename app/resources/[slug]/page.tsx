import type { Metadata } from 'next';
import BlogDetailsClient from './BlogDetailsClient';
import { readBlogs } from '@/lib/blogDb';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blogs = await readBlogs();
  const blog = blogs.find(b => b.slug === slug);

  if (!blog) {
    return {
      title: 'Article Not Found — Netriq AI Australia',
      description: 'The requested knowledge base article module could not be found.'
    };
  }

  return {
    metadataBase: new URL('https://netriq.com.au'),
    title: `${blog.title} — Netriq AI Australia`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: 'article',
      publishedTime: new Date(blog.date).toISOString()
    },
    alternates: {
      canonical: `/resources/${blog.slug}`
    }
  };
}

function isoOrUndefined(input?: string): string | undefined {
  if (!input) return undefined;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const blogs = await readBlogs();
  const blog = blogs.find(b => b.slug === slug);

  // Article + breadcrumb structured data for AEO. Answer engines cite and
  // attribute well-marked-up articles; the breadcrumb reinforces site structure.
  const jsonLd = blog
    ? [
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: blog.title,
          description: blog.excerpt,
          articleSection: blog.category,
          datePublished: isoOrUndefined(blog.date),
          dateModified: isoOrUndefined(blog.date),
          image: 'https://netriq.com.au/og-image.png',
          author: {
            '@type': 'Organization',
            name: 'Netriq AI Consulting',
            url: 'https://netriq.com.au',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Netriq AI Consulting',
            logo: {
              '@type': 'ImageObject',
              url: 'https://netriq.com.au/icon.svg',
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://netriq.com.au/resources/${blog.slug}`,
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://netriq.com.au' },
            { '@type': 'ListItem', position: 2, name: 'Resources', item: 'https://netriq.com.au/resources' },
            { '@type': 'ListItem', position: 3, name: blog.title, item: `https://netriq.com.au/resources/${blog.slug}` },
          ],
        },
      ]
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BlogDetailsClient slug={slug} />
    </>
  );
}
