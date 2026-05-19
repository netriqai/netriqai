'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';

const caseStudies = [
  {
    industry: 'Healthcare',
    location: 'Melbourne, Victoria',
    metric: '67%',
    metricLabel: 'reduction in no-shows in 21 days',
    problem: 'Patient appointment no-shows and billing follow-up consumed 3 FTE worth of admin time.',
    solution: 'Automated appointment reminders, rebooking flows, and billing nudge sequences.',
    tools: ['Make.com', 'Twilio', 'HubSpot'],
    result: '24+ hours/week of admin saved. Admin team redeployed to patient care.',
    color: '#06B6D4',
  },
  {
    industry: 'E-commerce',
    location: 'Sydney, New South Wales',
    metric: '60%',
    metricLabel: 'reduction in overstock within Year 1',
    problem: 'Persistent overstocking and stockouts tied up working capital. Manual supplier ordering was error-prone.',
    solution: 'AI-powered demand forecasting with automated supplier PO generation and reorder triggers.',
    tools: ['n8n', 'OpenAI', 'Shopify', 'Xero'],
    result: '99.2% stock availability. Stockout costs eliminated. Ordering time cut by 93%.',
    color: '#4ADE80',
  },
  {
    industry: 'Professional Services',
    location: 'Brisbane, Queensland',
    metric: '3×',
    metricLabel: 'faster client onboarding with AI document processing',
    problem: 'New client onboarding took 4–6 weeks manually. Lawyers spent 40% of time on admin.',
    solution: 'Document AI + client intake automation + automated contract generation and CRM sync.',
    tools: ['Relevance AI', 'Make.com', 'Notion', 'DocuSign'],
    result: 'Onboarding reduced from 6 weeks to 10 days. 85% less admin time per partner.',
    color: '#6366F1',
  },
];

export default function CaseStudiesTeaser() {
  return (
    <section className="py-20 md:py-24 bg-transparent relative overflow-hidden">
      {/* Cinematic Accents */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mb-20 md:mb-32">
          <div className="tech-badge rounded-full mb-6">
            PROVEN TRACK RECORD
          </div>
          <h2 className="text-4xl md:text-6xl font-sans font-bold tracking-tight text-text-primary mb-8 leading-[1.05]">
            Engineering Return on Investment <br/>
            <span className="text-accent-blue opacity-90">Through Intelligence.</span>
          </h2>
          <p className="text-text-secondary text-lg md:text-xl leading-relaxed opacity-80">
            Real businesses. Real neural pipelines. Real money saved. Here is what happens when Netriq AI bridge the gap between AI and operations.
          </p>
        </div>

        {/* Case study cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((cs, i) => (
            <div key={cs.industry + cs.location} className="group glass-card p-6 md:p-8 rounded-3xl flex flex-col transition-all duration-500 hover:border-accent-blue/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col h-full">
                {/* Industry tag & Location - Symmetrical Stacked Alignment */}
                <div className="flex flex-col gap-1.5 mb-8">
                  <span className="w-fit px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] text-accent-blue bg-accent-blue/10 border border-accent-blue/20 group-hover:bg-accent-blue/20 transition-all font-sans">
                    {cs.industry.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-3 bg-accent-blue/20" />
                    <span className="text-text-muted text-[9px] uppercase font-bold tracking-[0.2em] opacity-60 font-sans">
                      {cs.location}
                    </span>
                  </div>
                </div>

                {/* Key metric */}
                <div className="mb-6 md:mb-8">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-text-primary tracking-tighter mb-1.5 group-hover:text-accent-blue transition-colors">
                    {cs.metric}
                  </div>
                  <p className="text-text-muted text-[10px] font-bold uppercase tracking-[0.1em] opacity-80 leading-tight">{cs.metricLabel}</p>
                </div>

                {/* Challenge / Solution */}
                <div className="space-y-6 mb-8 flex-1">
                  <div>
                    <p className="text-[8px] font-bold text-accent-blue/50 uppercase tracking-[0.2em] mb-1.5 font-mono">CHALLENGE</p>
                    <p className="text-text-secondary text-[13px] leading-relaxed opacity-90">{cs.problem}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-bold text-accent-blue/50 uppercase tracking-[0.2em] mb-1.5 font-mono">NEURAL SOLUTION</p>
                    <p className="text-text-secondary text-[13px] leading-relaxed opacity-90">{cs.solution}</p>
                  </div>
                </div>

                {/* Result */}
                <div className="pt-6 border-t border-border-strong/20 mt-auto">
                   <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                         <span className="text-[10px] font-bold tracking-[0.2em] text-text-muted mb-1">FINAL IMPACT</span>
                         <span className="text-sm font-bold text-text-primary tracking-tight">{cs.result}</span>
                      </div>
                      <Link href="/case-studies" className="w-12 h-12 rounded-full border border-border-strong/30 flex items-center justify-center text-text-muted hover:bg-accent-blue hover:text-white hover:border-accent-blue transition-all duration-300">
                         <ArrowRight size={20} />
                      </Link>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <Link
            href="/case-studies"
            className="group inline-flex items-center gap-4 text-text-primary font-sans font-bold text-base hover:text-accent-blue transition-all duration-300"
          >
            EXPLORE FULL CASE STUDIES <span className="w-8 h-8 rounded-full border border-border-strong flex items-center justify-center group-hover:bg-accent-blue group-hover:text-white group-hover:border-accent-blue transition-all"><ArrowRight size={16} /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
