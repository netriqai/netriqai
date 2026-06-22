import type { Metadata } from 'next';
import EducationClient from './EducationClient';

export const metadata: Metadata = {
  title: 'AI Academy & Gamified Learning | Netriq AI',
  description:
    'Boost your SMB efficiency with our interactive AI learning hub. Complete educational video modules on CRM automation, custom chatbots, and multi-agent systems to earn XP and unlock digital badges.',
  keywords: [
    'Netriq AI Academy',
    'AI learning hub',
    'SMB AI automation training',
    'interactive AI quizzes',
    'learn chatbot integration',
    'CRM automation tutorial',
    'gamified tech learning',
  ],
  openGraph: {
    title: 'AI Academy & Gamified Learning | Netriq AI',
    description:
      'Level up your business automation skills. Complete video lessons and quizzes, earn XP, and unlock certifications for your SMB.',
    url: 'https://netriq.com.au/education',
  },
  alternates: {
    canonical: 'https://netriq.com.au/education',
  },
};

export default function EducationPage() {
  return <EducationClient />;
}
