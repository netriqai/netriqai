import type { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms of Service | Netriq AI',
  description:
    'Terms of service and contract frameworks for Netriq AI consulting, automation development, and integration retainers.',
  keywords: [
    'Netriq AI terms of service',
    'AI consulting contract Australia',
    'automation service agreement Melbourne',
    'client terms Netriq',
  ],
  openGraph: {
    title: 'Terms of Service | Netriq AI',
    description:
      'Service terms, consulting agreements, and operational policies for working with Netriq AI.',
    url: 'https://netriq.com.au/terms',
  },
  alternates: {
    canonical: 'https://netriq.com.au/terms',
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
