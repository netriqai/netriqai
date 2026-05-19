import type { Metadata } from 'next';
import CaseStudiesClient from './CaseStudiesClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://netriq.com.au'),
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
    url: 'https://netriq.com.au/case-studies',
  },
  alternates: {
    canonical: '/case-studies',
  },
};

export default function CaseStudiesPage() {
  return <CaseStudiesClient />;
}
