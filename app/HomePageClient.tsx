'use client';

import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero/index';

// Dynamically import below-the-fold components for code-splitting (this defers
// their JS from the initial bundle), but keep SSR enabled so the text content
// is present in the server-rendered HTML. This is critical for SEO/GEO/AEO:
// search and AI crawlers that don't execute JavaScript must still see services,
// pricing, case studies, and social proof. Do NOT re-add `ssr: false` here —
// doing so ships an almost-empty document to crawlers.
const ProblemSection = dynamic(() => import('@/components/home/ProblemSection'));
const ServicesOverview = dynamic(() => import('@/components/home/ServicesOverview'));
const AIDemoWidget = dynamic(() => import('@/components/home/AIDemoWidget'));
const CaseStudiesTeaser = dynamic(() => import('@/components/home/CaseStudiesTeaser'));
const ProcessSection = dynamic(() => import('@/components/home/ProcessSection'));
const SocialProof = dynamic(() => import('@/components/home/SocialProof'));
const CTABanner = dynamic(() => import('@/components/home/CTABanner'));

export default function HomePageClient() {
  return (
    <>
      {/* Hero is server-rendered immediately as it is above the fold */}
      <Hero />
      
      {/* Code-split but server-rendered so content is crawlable (see note above) */}
      <ProblemSection />
      <ServicesOverview />
      <AIDemoWidget />
      <CaseStudiesTeaser />
      <ProcessSection />
      <SocialProof />
      <CTABanner />
    </>
  );
}
