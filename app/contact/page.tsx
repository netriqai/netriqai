import type { Metadata } from 'next';
import { Suspense } from 'react';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://netriq.com.au'),
  title: 'Contact Netriq AI — Book Your Free Consultation',
  description:
    'Initiate your automation phase. Book a free 30-minute consultation with our Lead AI Architect to identify high-ROI automation opportunities for your business.',
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
      'Book a free 30-minute consultation. We map your operational bottlenecks and deliver an implementation roadmap before you commit a single dollar.',
    url: 'https://netriq.com.au/contact',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p className="text-text-muted text-xs uppercase tracking-widest font-mono">Loading Consultation Gate...</p></div>}>
      <ContactClient />
    </Suspense>
  );
}
