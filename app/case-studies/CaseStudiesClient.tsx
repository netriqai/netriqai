'use client';

import { useState } from 'react';
import { TrendingUp, Zap, MapPin, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import GlowButton from '@/components/ui/GlowButton';
import SectionReveal from '@/components/ui/SectionReveal';
import NeuralBackground from '@/components/ui/NeuralBackground';
import { useRef } from 'react';
import clsx from 'clsx';

// Logo Components
import HRFinanceLogo from '@/components/logos/HRFinanceLogo';
import TaxBudLogo from '@/components/logos/TaxBudLogo';
import FinvueLogo from '@/components/logos/FinvueLogo';
import ASRInteriorsLogo from '@/components/logos/ASRInteriorsLogo';
import ITBYOMLogo from '@/components/logos/ITBYOMLogo';

type Industry = 'All' | 'Retail' | 'Healthcare' | 'Professional Services' | 'Legal' | 'Construction' | 'Finance';

interface CaseStudy {
  industry: Exclude<Industry, 'All'>;
  location: string;
  headline: string;
  metric: string;
  metricLabel: string;
  challenge: string;
  solution: string;
  result: string;
  tools: string[];
  quote: string;
  quoteAuthor: string;
}

const clientLogoMap: Record<string, React.ReactNode> = {
  'hrfinance.com.au': <HRFinanceLogo />,
  'taxbud.com.au': <TaxBudLogo />,
  'finvue.com.au': <FinvueLogo />,
  'asrinteriors.com.au': <ASRInteriorsLogo />,
  'itbeyourownmind.com': <ITBYOMLogo />,
};

const featuredClients = [
  { 
    name: 'HR Finance', 
    domain: 'hrfinance.com.au', 
    url: 'https://hrfinance.com.au',
    description: 'Finance & Mortgage Specialists',
    results: 'Automated Loan Processing'
  },
  { 
    name: 'Taxbud', 
    domain: 'taxbud.com.au', 
    url: 'https://taxbud.com.au',
    description: 'Digital Taxation Services',
    results: 'AI Tax Workflow Automation'
  },
  { 
    name: 'Finvue', 
    domain: 'finvue.com.au', 
    url: 'https://finvue.com.au',
    description: 'Wealth Management Platform',
    results: 'Data Aggregation & Reporting'
  },
  {
    name: 'ASR Interiors',
    domain: 'asrinteriors.com.au',
    url: 'https://www.asrinteriors.com.au/',
    description: 'Luxury Interior Design & Renovation',
    results: 'Client Pipeline Automation'
  },
  {
    name: 'itBYOM',
    domain: 'itbeyourownmind.com',
    url: 'https://itbeyourownmind.com',
    description: 'Psychotherapy & Mentorship Space',
    results: 'Interactive Clinical Platform'
  },
];

const caseStudies: CaseStudy[] = [
  {
    industry: 'Healthcare',
    location: 'Melbourne, VIC',
    headline: 'Automated patient appointment reminders + billing follow-up',
    metric: '67%',
    metricLabel: 'fewer missed appointments',
    challenge:
      'A 15-practitioner clinic was losing hours each week to no-shows and unpaid invoices. Three full-time admin staff spent 60% of their time on manual phone reminders and chasing overdue accounts.',
    solution:
      'Built a multi-channel appointment reminder system (SMS + email + WhatsApp) with intelligent timing based on appointment type and patient history. Added automated billing follow-up sequences with one-click payment links.',
    result: 'No-show rate dropped from 23% to 8%. 24+ hours per week of manual admin eliminated. Two admin staff redeployed to patient-facing roles. Billing collections improved by 34% in Month 1.',
    tools: ['Make.com', 'Twilio', 'HubSpot', 'Cliniko'],
    quote: 'We thought we needed to hire another admin. Netriq AI showed us we needed automation. The ROI was obvious within 30 days.',
    quoteAuthor: 'Practice Manager, Melbourne Clinic',
  },
  {
    industry: 'Retail',
    location: 'Sydney, NSW',
    headline: 'AI inventory forecasting + supplier automation',
    metric: '60%',
    metricLabel: 'reduction in overstock',
    challenge:
      "A 3-location retail chain with 2,000+ SKUs was experiencing persistent stockouts and overstock tying up significant working capital. Manual ordering took 12 hours/week.",
    solution:
      'Deployed AI demand forecasting model using 3 years of sales data, seasonal patterns, and local event calendars. Automated supplier purchase orders triggered at smart reorder points. Full Shopify + Xero integration.',
    result: '99.2% stock availability across all locations. Overstock reduced by 60%. Manual ordering time cut by 93% (dropped from 12 hours to 45 minutes per week).',
    tools: ['n8n', 'OpenAI', 'Shopify', 'Xero', 'Airtable'],
    quote: 'Our stockout problem is completely solved. The system ordered exactly the right stock for the Easter long weekend before I even thought to check.',
    quoteAuthor: 'Head of Operations, Sydney Retail Chain',
  },
  {
    industry: 'Legal',
    location: 'Brisbane, QLD',
    headline: 'Document processing + client intake automation',
    metric: '3×',
    metricLabel: 'faster client onboarding',
    challenge:
      'A 12-partner law firm was onboarding new clients in 4–6 weeks. Partners spent 30–40% of their time on admin, document chasing, and data entry. Billing for this admin time was inconsistent.',
    solution:
      'Built an end-to-end client intake system with AI document extraction, automated conflict checks, digital engagement letter generation, and CRM auto-population. DocuSign integrated for seamless e-signature.',
    result: 'Client onboarding reduced from 6 weeks to 10 business days. 85% reduction in admin time per partner (8+ hours/week saved per partner). 92% of client intake automated.',
    tools: ['Relevance AI', 'Make.com', 'Clio', 'DocuSign', 'Notion'],
    quote: "I was skeptical. I'm a lawyer — I thought AI couldn't handle legal documents properly. I was completely wrong. It's more accurate than manual data entry.",
    quoteAuthor: 'Managing Partner, Brisbane Law Firm',
  },
  {
    industry: 'Construction',
    location: 'Perth, WA',
    headline: 'Project reporting + compliance automation',
    metric: '40%',
    metricLabel: 'faster project reporting',
    challenge:
      'A civil construction company with 20+ active projects was drowning in admin. Project managers spent Fridays writing progress reports. Subcontractor compliance documents were tracked in spreadsheets and frequently out of date.',
    solution:
      'Automated daily progress report compilation from field photos, time tracking apps, and site notes using AI narrative generation. Built a subcontractor compliance portal with automatic expiry alerts and document verification.',
    result: 'Reporting time cut from 6 hours/week to 90 minutes per project manager. 100% subcontractor compliance rate achieved. 75% reduction in reporting overhead. Zero compliance incidents since launch.',
    tools: ['n8n', 'OpenAI', 'Airtable', 'Procore', 'MYOB'],
    quote: 'Friday used to be report day. Now it\'s actually productive. And we haven\'t had a compliance breach since the system went live 14 months ago.',
    quoteAuthor: 'Operations Director, Perth Civil',
  },
  {
    industry: 'Finance',
    location: 'Melbourne, VIC',
    headline: 'Client reporting + compliance automation for financial planning',
    metric: '5×',
    metricLabel: 'more clients per advisor',
    challenge:
      'A boutique financial planning firm was manually generating client portfolio reports every month. Each report took 3–4 hours. Advisors were capped at 25 clients each due to admin load. Compliance documentation was inconsistent.',
    solution:
      'Built automated monthly report generation pulling from portfolio management systems, adding AI-generated narrative commentary personalised to each client. Automated compliance checklist completion and AFSL documentation.',
    result: 'Each advisor can now service 120+ clients (up from 25). Report generation: 3 hours → 8 minutes. Compliance documentation 95% automated. Firm revenue up 4× with same headcount.',
    tools: ['Make.com', 'OpenAI', 'Xplan', 'Salesforce', 'DocuSign'],
    quote: 'We went from 25 to 120 clients per advisor without hiring anyone. The business fundamentally changed. Netriq AI basically gave us our growth path.',
    quoteAuthor: 'CEO, Melbourne Financial Planning',
  },
];

const industries: Industry[] = ['All', 'Retail', 'Healthcare', 'Professional Services', 'Legal', 'Construction', 'Finance'];

export default function CaseStudiesClient() {
  const [activeFilter, setActiveFilter] = useState<Industry>('All');

  const filtered = activeFilter === 'All'
    ? caseStudies
    : caseStudies.filter((cs) => cs.industry === activeFilter);

  return (
    <div className="min-h-screen bg-background pt-20 overflow-hidden">
      {/* Cinematic Hero */}
      <section className="relative py-32 md:py-48 overflow-hidden border-b border-border-subtle">
        <NeuralBackground />
        <div className="absolute inset-0 tech-grid opacity-[0.05] z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--accent-blue),0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="section-container relative z-10 text-center">
          <SectionReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(var(--accent-blue),0.3)] bg-background/50 backdrop-blur-md mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent-blue))] animate-pulse" />
              <span className="text-[9px] font-black tracking-[0.3em] text-[rgb(var(--accent-blue))] uppercase">Execution_Proof_v4.0</span>
            </div>
            
            <h1
              className="font-sans font-black text-text-primary mb-8 leading-[0.95] tracking-tighter"
              style={{ fontSize: 'clamp(44px, 7vw, 96px)' }}
            >
              Real World <br/>
              <span className="text-[rgb(var(--accent-blue))]">Output.</span>
            </h1>
            <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed opacity-80">
              Measurable ROI engineered for Australian SMBs. These are not projections—they are verified operational shifts.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* NEW: Featured Clients Section */}
      <section className="py-24 bg-background relative overflow-hidden border-b border-border-strong/10">
        <div className="section-container">
          <SectionReveal className="text-center mb-16">
            <div className="tech-badge rounded-full mb-6 mx-auto">STRATEGIC ECOSYSTEM</div>
            <h2 className="text-2xl md:text-4xl font-sans font-bold text-text-primary tracking-tight">Active Deployments.</h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredClients.map((client, i) => (
              <SectionReveal key={client.domain} delay={i * 100}>
                <a 
                  href={client.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block p-8 rounded-[32px] bg-surface-1 border border-border-strong hover:border-accent-blue/40 transition-all duration-500 hover:shadow-2xl hover:shadow-accent-blue/5"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center justify-center p-4 rounded-[20px] bg-text-primary/[0.03] backdrop-blur-md border border-text-primary/10 group-hover:border-accent-blue/50 group-hover:bg-accent-blue/5 transition-all duration-500 shadow-xl shadow-black/5 dark:shadow-black/20">
                      {clientLogoMap[client.domain]}
                    </div>
                    <div className="text-text-muted group-hover:text-accent-blue transition-colors">
                      <ExternalLink size={20} />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-sans font-black text-text-primary mb-2 uppercase tracking-tight">
                    {client.name}
                  </h3>
                  <p className="text-text-muted text-xs font-mono tracking-widest uppercase mb-6 opacity-60">
                    {client.description}
                  </p>
                  
                  <div className="pt-6 border-t border-border-strong/40">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={16} className="text-accent-blue" />
                      <span className="text-[10px] font-black text-text-primary tracking-widest uppercase">
                        {client.results}
                      </span>
                    </div>
                  </div>
                </a>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Toolbar - Modular Terminal Style */}
      <section className="sticky top-20 z-40 py-6 border-b border-border-strong bg-background/90 backdrop-blur-xl shadow-2xl">
        <div className="section-container">
          <div className="flex flex-wrap gap-2 justify-center">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setActiveFilter(industry)}
                className={clsx(
                  "px-6 py-2 rounded-lg text-[9px] font-black tracking-[0.2em] uppercase transition-all duration-300 border",
                  activeFilter === industry
                    ? "bg-[rgb(var(--accent-blue))] border-[rgb(var(--accent-blue))] text-background shadow-[0_0_20px_rgba(var(--accent-blue),0.3)]"
                    : "bg-surface-1 border-border-strong text-text-muted hover:border-[rgb(var(--accent-blue))]/50 hover:text-text-primary"
                )}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Case studies — horizontal scroll carousel */}
      <section className="py-16 md:py-24 bg-surface-2/30 overflow-hidden">
        <SectionReveal className="section-container mb-6">
          <p className="text-[9px] font-black text-text-muted/50 tracking-[0.3em] uppercase font-mono">SCROLL TO EXPLORE →</p>
        </SectionReveal>

        {/* Scroll track — full bleed so cards peek at edges */}
        <div
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 px-6 md:px-[max(24px,calc((100vw-1280px)/2+24px))]"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {filtered.map((cs, i) => (
            <div
              key={`${cs.industry}-${cs.location}`}
              className="group flex-none w-[340px] md:w-[420px] bg-surface-1/80 dark:bg-surface-1/40 backdrop-blur-md border border-border-strong rounded-[28px] relative overflow-hidden transition-all duration-500 hover:bg-surface-1 hover:dark:bg-surface-1/65 hover:border-[rgb(var(--accent-blue))]/40 hover:shadow-2xl hover:shadow-[rgba(var(--accent-blue),0.05)]"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Plain glass spotlight overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(var(--accent-blue),0.05)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative z-10 p-7 flex flex-col h-full">

                {/* Card header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-black tracking-[0.35em] text-[rgb(var(--accent-blue))] uppercase">
                      {cs.industry}_SECTOR
                    </span>
                    <div className="flex items-center gap-1.5 text-text-muted text-[9px] font-mono tracking-widest uppercase opacity-60">
                      <MapPin size={10} className="text-[rgb(var(--accent-blue))]" />
                      {cs.location}
                    </div>
                  </div>
                  <div className="p-3 bg-[rgba(var(--accent-blue),0.1)] border border-[rgba(var(--accent-blue),0.2)] rounded-xl group-hover:bg-[rgb(var(--accent-blue))] group-hover:text-background transition-all duration-500">
                    <TrendingUp size={18} />
                  </div>
                </div>

                {/* Metric */}
                <div className="mb-5">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl md:text-5xl font-sans font-black text-text-primary tracking-tighter group-hover:text-[rgb(var(--accent-blue))] transition-colors">
                      {cs.metric}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent-blue))] animate-pulse shadow-[0_0_8px_rgb(var(--accent-blue))]" />
                  </div>
                  <span className="text-text-muted text-[9px] font-mono tracking-[0.35em] uppercase opacity-50">{cs.metricLabel}</span>
                </div>

                {/* Headline */}
                <h2 className="text-base font-sans font-black text-text-primary leading-[1.2] tracking-tight uppercase mb-5 group-hover:translate-x-0.5 transition-transform">
                  {cs.headline}
                </h2>

                {/* Challenge */}
                <div className="p-4 rounded-xl bg-surface-2 border border-border-strong/40 mb-4">
                  <p className="text-[8px] font-black text-[rgb(var(--accent-blue))] tracking-[0.3em] uppercase mb-2">Bottleneck</p>
                  <p className="text-text-muted text-xs leading-relaxed opacity-80 line-clamp-3">{cs.challenge}</p>
                </div>

                {/* Result */}
                <div className="p-4 rounded-xl border border-[rgba(var(--accent-blue),0.15)] bg-[rgba(var(--accent-blue),0.03)] mb-5">
                  <p className="text-[8px] font-black text-[rgb(var(--accent-blue))] tracking-[0.3em] uppercase mb-2">Verified Output</p>
                  <p className="text-text-primary text-xs font-black uppercase tracking-tight leading-snug">{cs.result}</p>
                </div>

                {/* Tools */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {cs.tools.map((tool) => (
                    <span
                      key={tool}
                      className="text-[8px] font-black tracking-widest px-3 py-1.5 rounded-lg bg-background text-text-muted border border-border-strong group-hover:border-[rgb(var(--accent-blue))]/30 transition-colors uppercase"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                {/* Quote */}
                <div className="mt-auto p-5 rounded-[18px] bg-background border border-border-strong">
                  <blockquote className="text-text-primary text-xs leading-relaxed mb-3 font-sans font-bold opacity-90 line-clamp-3">
                    &ldquo;{cs.quote}&rdquo;
                  </blockquote>
                  <p className="text-text-muted text-[9px] font-mono tracking-widest uppercase opacity-60 truncate">{cs.quoteAuthor}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA - The Final Blueprint */}
      <section className="py-40 bg-background relative overflow-hidden text-center border-t border-border-strong">
        <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[rgb(var(--accent-blue))] opacity-[0.03] rounded-full blur-[180px] pointer-events-none" />
        
        <div className="section-container relative z-10">
          <SectionReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-mono mb-8 bg-surface-1 border border-border-strong text-text-muted uppercase tracking-[0.4em]">
              INITIATE_DIAGNOSTIC_v4
            </div>
            <h2
              className="font-sans font-black text-text-primary mb-8 tracking-tighter uppercase leading-[0.9]"
              style={{ fontSize: 'clamp(40px, 6vw, 84px)' }}
            >
              Scale is <br/> 
              <span className="text-[rgb(var(--accent-blue))]">Engineered.</span>
            </h2>
            <p className="text-text-muted text-xl mb-12 max-w-xl mx-auto leading-relaxed opacity-80 font-sans">
              Request a precision consultation of your operational bottlenecks. We deliver the implementation roadmap before you commit a single dollar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
              <GlowButton href="/contact" variant="primary" size="lg" className="w-full sm:w-auto rounded-[16px] px-12 group uppercase tracking-widest">
                Generate ROI Roadmap
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </GlowButton>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
