import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

// FAQ structured data for AEO (Answer Engine Optimisation). These are the
// highest-intent questions an answer engine is asked about an AI consultancy —
// distinct from the implementation-focused FAQ on /services.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does Netriq AI do?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Netriq AI is a Melbourne-based AI automation consultancy for Australian small and medium businesses. We design and build custom AI pipelines, sales automation, and intelligent customer-support systems — done-for-you, with measurable ROI.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who is Netriq AI best for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Australian SMBs that want done-for-you AI automation without hiring an in-house engineering team — from a single fixed-scope project (from AUD $2,500) through to an ongoing automation partner on a monthly retainer.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Netriq AI located?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Netriq AI is based in Melbourne, Victoria, and works with clients Australia-wide.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I get started with Netriq AI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Book a free 30-minute consultation at netriqai.com.au/contact. We map your operational bottlenecks and deliver an implementation roadmap before you commit any budget.',
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomePageClient />
    </>
  );
}
