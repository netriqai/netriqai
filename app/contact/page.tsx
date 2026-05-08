import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://netriq.com.au'),
  title: 'Contact Netriq AI — Book Your Neural Audit',
  description:
    'Initiate your automation phase. Book a free 60-minute neural audit with our Lead AI Architect to identify high-ROI automation opportunities for your business.',
  keywords: [
    'contact Netriq AI',
    'AI audit Melbourne',
    'automation consultancy contact',
    'book AI consultation',
    'business automation audit Australia',
    'AI implementation inquiry',
  ],
  openGraph: {
    title: 'Initiate Your Automation Phase — Netriq AI',
    description:
      'Book a free 60-minute neural audit. We map your operational bottlenecks and deliver an implementation roadmap before you commit a single dollar.',
    url: 'https://netriq.com.au/contact',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
