import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Netriq AI — Melbourne AI Automation Consultancy',
  description:
    'Netriq AI was founded by engineers to close the AI advantage gap between enterprises and Australian SMBs. Learn about our team, values, and mission to democratise AI automation for small businesses.',
  keywords: [
    'Netriq AI about',
    'AI automation company Melbourne',
    'Australian AI consultancy team',
    'SMB AI democratisation',
    'AI automation for small business Australia',
    'Melbourne AI engineers',
  ],
  openGraph: {
    title: 'About Netriq AI — We Build The Intelligence Layer',
    description:
      'Founded by engineers from top-tier AI platforms. Netriq AI exists to give Australian SMBs the same AI advantages that large enterprises have had for years.',
    url: 'https://netriq.com.au/about',
  },
  alternates: {
    canonical: 'https://netriq.com.au/about',
  },
};

// FAQ structured data for AEO — company/"who are they" questions answer engines
// ask when summarising a consultancy.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is Netriq AI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Netriq AI is a Melbourne-based AI automation consultancy founded by engineers to close the AI advantage gap between large enterprises and Australian small and medium businesses.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why was Netriq AI founded?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To give Australian SMBs the same AI automation advantages that large enterprises have had for years — making custom AI pipelines and automation accessible and affordable for smaller teams.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes Netriq AI different from other AI agencies?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Netriq AI is engineering-led and tool-agnostic, building done-for-you automations on the best stack for each client (Make.com, n8n, Zapier, Python, OpenAI, Anthropic Claude) with measurable ROI rather than reselling a single fixed platform.',
      },
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AboutClient />
    </>
  );
}
