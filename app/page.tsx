import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero/index';

// Dynamically import below-the-fold components to improve initial load speed (FCP/LCP)
const ProblemSection = dynamic(() => import('@/components/home/ProblemSection'), { 
  ssr: true,
  loading: () => <div className="h-screen bg-background" /> // Placeholder while loading
});

const ServicesOverview = dynamic(() => import('@/components/home/ServicesOverview'), { ssr: true });
const AIDemoWidget = dynamic(() => import('@/components/home/AIDemoWidget'), { ssr: true });
const CaseStudiesTeaser = dynamic(() => import('@/components/home/CaseStudiesTeaser'), { ssr: true });
const ProcessSection = dynamic(() => import('@/components/home/ProcessSection'), { ssr: true });
const SocialProof = dynamic(() => import('@/components/home/SocialProof'), { ssr: true });
const CTABanner = dynamic(() => import('@/components/home/CTABanner'), { ssr: true });

export default function HomePage() {
  return (
    <>
      {/* Hero is loaded immediately as it is above the fold */}
      <Hero />
      
      {/* These sections are lazy-loaded to reduce initial JS payload */}
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
