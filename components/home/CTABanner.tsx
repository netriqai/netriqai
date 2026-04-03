'use client';

import { ArrowRight, Terminal } from 'lucide-react';
import GlowButton from '@/components/ui/GlowButton';

export default function CTABanner() {
  return (
    <section className="bg-accent-blue overflow-hidden relative">
      <div className="absolute inset-0 tech-grid opacity-10 mix-blend-overlay" />
      
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-24 relative z-10 flex flex-col items-center text-center">
        
        <div className="w-20 h-20 rounded-3xl bg-black/10 flex items-center justify-center text-black mb-12 shadow-inner group">
           <Terminal size={40} className="group-hover:scale-110 transition-transform duration-500" />
        </div>
        
        <h2 className="font-sans font-bold text-3xl sm:text-4xl md:text-7xl text-black tracking-tighter mb-8 md:mb-10 max-w-4xl mx-auto leading-[1.05]">
          Ready to put your business <br className="hidden md:block"/>
          <span className="opacity-80">on autopilot?</span>
        </h2>
        
        <p className="font-sans text-black/70 text-base md:text-xl max-w-2xl mb-12 md:mb-16 leading-relaxed font-medium">
          Book a free 30-minute discovery call to find out exactly how much time and money AI automations can save your business this week.
        </p>
        
        <GlowButton 
          href="/contact" 
          variant="primary" 
          size="lg" 
          className="bg-black text-white hover:bg-neutral-900 border-none shadow-black/20 px-8 flex w-full sm:w-auto md:px-12 py-4 md:py-6"
        >
          <span className="whitespace-nowrap flex items-center gap-2">
             BOOK FREE DISCOVERY CALL 
             <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform shrink-0" />
          </span>
        </GlowButton>
        
      </div>
    </section>
  );
}
