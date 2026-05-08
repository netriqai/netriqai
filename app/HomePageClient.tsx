'use client';

import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero/index';

// Dynamically import below-the-fold components with ssr: false.
// This defers their JS from the initial bundle, improving FCP/LCP.
// ssr: false is permitted here since this is a Client Component.
const ProblemSection = dynamic(() => import('@/components/home/ProblemSection'), { 
  ssr: false,
  loading: () => <div className="h-screen bg-background" aria-hidden="true" />
});

const ServicesOverview = dynamic(() => import('@/components/home/ServicesOverview'), { ssr: false });
const AIDemoWidget = dynamic(() => import('@/components/home/AIDemoWidget'), { ssr: false });
const CaseStudiesTeaser = dynamic(() => import('@/components/home/CaseStudiesTeaser'), { ssr: false });
const ProcessSection = dynamic(() => import('@/components/home/ProcessSection'), { ssr: false });
const SocialProof = dynamic(() => import('@/components/home/SocialProof'), { ssr: false });
const CTABanner = dynamic(() => import('@/components/home/CTABanner'), { ssr: false });

export default function HomePageClient() {
  return (
    <>
      {/* Hero is server-rendered immediately as it is above the fold */}
      <Hero />
      
      {/* These sections are truly lazy-loaded (ssr: false) to reduce initial JS payload */}
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
