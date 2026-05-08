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

export default function AboutPage() {
  return <AboutClient />;
}
