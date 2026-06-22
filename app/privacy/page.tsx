import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy | Netriq AI',
  description:
    'Privacy policy and data protection guidelines for Netriq AI. Learn how we handle your business data, automation pipeline security, and customer privacy.',
  keywords: [
    'Netriq AI privacy policy',
    'AI data security Australia',
    'enterprise data protection Melbourne',
    'AI compliance and privacy',
  ],
  openGraph: {
    title: 'Privacy Policy | Netriq AI',
    description:
      'Our data protection protocols and privacy guidelines. We ensure your business logic and automation data remain secure.',
    url: 'https://netriq.com.au/privacy',
  },
  alternates: {
    canonical: 'https://netriq.com.au/privacy',
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
