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

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  return <BlogDetailsClient slug={slug} />;
}
