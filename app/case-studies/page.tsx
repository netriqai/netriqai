import type { Metadata } from 'next';
import CaseStudiesClient from './CaseStudiesClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://netriqai.com.au'),
  title: 'AI Case Studies & ROI Reports — Netriq AI Australia',
  description:
    'Explore real-world AI automation case studies for Australian SMBs. From 67% reduction in missed appointments to 3x faster client onboarding. Engineered for precision and measurable ROI.',
  keywords: [
    'AI automation case studies Australia',
    'business automation success stories',
    'AI implementation ROI',
    'Australian SMB automation examples',
    'AI efficiency results',
    'Netriq AI clients',
    'automation results Melbourne',
  ],
  openGraph: {
    title: 'AI Automation Success Stories — Netriq AI',
    description:
      'Concrete evidence of neural automation driving ROI for Australian SMBs. 3x faster onboarding, 67% fewer no-shows, and 80%+ operational efficiency gains.',
    url: 'https://netriqai.com.au/case-studies',
  },
  alternates: {
    canonical: '/case-studies',
  },
};

// FAQ structured data for AEO — results/ROI questions answer engines ask when
// evaluating an automation provider's track record.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What results has Netriq AI delivered for clients?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Netriq AI has built 200+ automation workflows and saved clients a combined AUD $4.2M. Representative outcomes include a 67% reduction in missed appointments, 3x faster client onboarding, and 80%+ operational efficiency gains for Australian SMBs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What ROI do Netriq AI clients typically see?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most clients see 3–10x ROI within the first year by saving 10–40 hours of manual work per week. One Melbourne law firm saved AUD $95,000 in its first 12 months through document-processing automation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What industries does Netriq AI work with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Netriq AI works across healthcare clinics, legal firms, e-commerce, construction and trades, and professional services — any Australian SMB with repetitive, high-volume manual workflows.',
      },
    },
  ],
};

export default function CaseStudiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <CaseStudiesClient />
    </>
  );
}
