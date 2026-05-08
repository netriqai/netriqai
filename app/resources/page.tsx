import type { Metadata } from 'next';
import ResourcesClient from './ResourcesClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://netriq.com.au'),
  title: 'AI Automation Resources & Guides — Netriq AI',
  description:
    'Technical playbooks, ROI models, and deep-dives into the architecture of modern AI automation. Engineered for Australian growth.',
  keywords: [
    'AI automation guides',
    'business automation playbooks',
    'AI strategy Australia',
    'n8n vs make comparison',
    'healthcare automation guide',
    'AI for law firms Melbourne',
  ],
  openGraph: {
    title: 'Technical AI Guides & Resources — Netriq AI',
    description:
      'Join 2,400+ Australian operators getting technical automation playbooks and ROI models delivered bi-weekly.',
    url: 'https://netriq.com.au/resources',
  },
  alternates: {
    canonical: '/resources',
  },
};

export default function ResourcesPage() {
  return <ResourcesClient />;
}
