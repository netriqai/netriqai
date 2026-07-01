'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, Search, Cpu, RefreshCw, GraduationCap, Globe, ArrowRight } from 'lucide-react';
import GlowButton from '@/components/ui/GlowButton';
import SectionReveal from '@/components/ui/SectionReveal';
import NeuralBackground from '@/components/ui/NeuralBackground';
import clsx from 'clsx';

const services = [
  {
    id: 'audit',
    icon: Search,
    name: 'AI Discovery Audit',
    tagline: 'Identify exactly where AI fits into your business before you build anything.',
    price: 'AUD $2,500',
    priceHigh: 'AUD $5,000',
    color: 'var(--accent-blue)',
    features: [
      'Deep-dive workflow mapping',
      'AI Opportunity Report (30+ pages)',
      'ROI projections for every automation',
      'Prioritised 90-day roadmap',
    ],
    badge: null,
    cta: 'Book Consultation',
  },
  {
    id: 'implementation',
    icon: Cpu,
    name: 'Done-For-You Implement',
    tagline: 'We build, test, and securely install custom AI automations for your team.',
    price: 'AUD $8,000',
    priceHigh: 'AUD $60,000',
    color: 'var(--text-primary)',
    features: [
      'Full-scope custom automation build',
      'API integrations with existing tools',
      'AI model setup & prompt engineering',
      'Full technical documentation',
    ],
    badge: 'MOST_POPULAR',
    cta: 'Start Now',
  },
  {
    id: 'retainer',
    icon: RefreshCw,
    name: 'Ongoing Support',
    tagline: 'Your outsourced AI operations partner — monitoring and upgrading 24/7.',
    price: 'AUD $1,500',
    priceHigh: 'AUD $6,000',
    suffix: '/mo',
    color: 'var(--text-secondary)',
    features: [
      '2–8 new automations built per month',
      'Guaranteed 99.9% uptime monitoring',
      'Monthly performance/ROI reports',
      'Priority fixes with 4-hour SLA',
    ],
    badge: null,
    cta: 'Discuss Support',
  },
  {
    id: 'workshops',
    icon: GraduationCap,
    name: 'Team Training',
    tagline: 'Turn your non-technical staff into highly efficient AI operators.',
    price: 'AUD $3,000',
    priceHigh: 'AUD $8,000',
    color: 'var(--text-muted)',
    features: [
      'Half-day or full-day workshops',
      'Tailored to your specific industry',
      'Hands-on practical tool guides',
      'Post-workshop resource pack',
    ],
    badge: null,
    cta: 'Book Training',
  },
  {
    id: 'web',
    icon: Globe,
    name: 'Website Development',
    tagline: 'High-performance websites engineered to convert — and built to be found by Google and AI search from day one.',
    price: 'Custom Quote',
    color: 'var(--accent-blue)',
    features: [
      'Custom design & responsive build',
      'SEO, AEO & GEO optimisation built-in',
      'Structured data & LLM-readable content',
      'Fast, secure & analytics-ready',
    ],
    badge: null,
    cta: 'Request a Quote',
  },
];

const faqs = [
  {
    question: 'How long does implementation take?',
    answer: 'Most projects are live within 30 days. Simple automations take 1–2 weeks. Complex, multi-system builds take 6–8 weeks.',
  },
  {
    question: 'Do I need technical knowledge?',
    answer: 'Zero technical knowledge required. We handle 100% of the build. Your job is to understand your business — ours is the technology.',
  },
  {
    question: 'What automation tools do you use?',
    answer: 'We use Make.com, n8n, Zapier, Python, OpenAI, Anthropic, and more. We are tool-agnostic and choose the best stack for your budget and needs.',
  },
  {
    question: 'What ROI can I expect?',
    answer: 'Most clients see 3–10× ROI within the first year by saving 10-40 hours of manual labor per week.',
  },
  {
    question: 'Do you build websites, and are they optimised for search and AI?',
    answer: 'Yes. We design and build fast, custom websites with SEO, AEO (Answer Engine Optimisation) and GEO (Generative Engine Optimisation) built in from the start — structured data, LLM-readable content, and clean performance so you rank on Google and get surfaced by AI assistants like ChatGPT, Gemini and Perplexity.',
  },
];

export default function ServicesClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>('implementation');

  return (
    <div className="min-h-screen bg-background pt-20 overflow-hidden">
      {/* Cinematic Hero */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <NeuralBackground />
        <div className="absolute inset-0 tech-grid opacity-[0.1] z-0" />

        <div className="section-container relative z-10 text-center">
          <SectionReveal>
            <div className="tech-badge rounded-full px-6 py-2 border-accent-blue/20 bg-accent-blue/5 mb-8 inline-flex">
              OPERATIONAL CAPABILITIES
            </div>
            <h1
              className="font-sans font-bold text-text-primary mb-8 leading-[0.95] tracking-tight"
              style={{ fontSize: 'clamp(44px, 7vw, 90px)' }}
            >
              Neural <br />
              <span className="text-accent-blue">Architecture.</span>
            </h1>
            <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed opacity-80 font-sans">
              From discovering exactly where AI can save you money, to building and maintaining the systems securely. Engineering precision for every workflow.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Interactive Service Tiers (Flex Accordion) */}
      <section className="py-24 relative overflow-hidden">
        <div className="w-full max-w-[1700px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[700px]">
            {services.map((service, i) => {
              const isActive = hoveredId === service.id;

              return (
                <motion.div
                  key={service.id}
                  layout
                  onMouseEnter={() => setHoveredId(service.id)}
                  className={clsx(
                    "relative overflow-hidden transition-all duration-700 rounded-[32px] border",
                    isActive
                      ? "lg:flex-[2.5] bg-accent-blue/10 border-accent-blue/40 shadow-glow-sm"
                      : "lg:flex-[1] bg-white dark:bg-surface-1 border-border-strong/30 opacity-100",
                    "group cursor-pointer h-[500px] lg:h-full backdrop-blur-xl"
                  )}
                >
                  {/* Background Accents */}
                  <div className={clsx(
                    "absolute inset-0 bg-gradient-to-br from-accent-blue/10 via-transparent to-transparent transition-opacity duration-1000",
                    isActive ? "opacity-100" : "opacity-0"
                  )} />

                  {service.badge && (
                    <div className="absolute top-8 right-8 px-4 py-1.5 bg-accent-blue text-white text-[8px] font-black tracking-[0.3em] uppercase rounded-full shadow-2xl z-20">
                      {service.badge}
                    </div>
                  )}

                  <div className="relative z-10 p-8 md:p-12 flex flex-col h-full">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-8 lg:mb-12">
                      <div className={clsx(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border",
                        isActive
                          ? "bg-accent-blue border-accent-blue text-white shadow-glow-sm scale-110"
                          : "bg-surface-2 border-border-strong/40 text-accent-blue opacity-100 group-hover:bg-accent-blue/10"
                      )}>
                        <service.icon size={24} />
                      </div>
                      <span className="text-[9px] font-black tracking-[0.4em] text-text-muted opacity-50 uppercase whitespace-nowrap font-mono">
                        MODULAR_0{i + 1}
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 flex flex-col">
                      <h2 className={clsx(
                        "font-sans font-black text-text-primary tracking-tighter transition-all uppercase leading-[0.95]",
                        isActive ? "text-3xl lg:text-5xl mb-6" : "text-xl lg:text-2xl mb-4"
                      )}>
                        {service.name}
                      </h2>

                      <p className={clsx(
                        "text-text-secondary text-base lg:text-lg leading-relaxed mb-8 transition-all duration-500 font-sans",
                        isActive ? "opacity-100 max-w-lg" : "opacity-80 line-clamp-2"
                      )}>
                        {service.tagline}
                      </p>

                      {/* Hidden details that reveal on hover */}
                      <div className={clsx(
                        "space-y-12 transition-all duration-700",
                        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 lg:pointer-events-none"
                      )}>
                        {/* Features Grid */}
                        <ul className="grid grid-cols-1 gap-4 bg-background/50 p-6 rounded-2xl border border-border-strong/20">
                          {service.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-3 text-sm text-text-primary font-bold font-sans">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent-blue shadow-[0_0_8px_rgb(var(--accent-blue))]" />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-auto">
                          <GlowButton href={`/contact?service=${service.id}`} variant="primary" size="lg" className="w-full lg:w-auto px-10 rounded-xl shadow-2xl shadow-accent-blue/20 uppercase tracking-widest text-[9px]">
                            ENQUIRE
                            <ArrowRight size={18} />
                          </GlowButton>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vertical Side Identity */}
                  {!isActive && (
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <div className="rotate-90 origin-bottom-right whitespace-nowrap text-[8px] font-black tracking-[0.8em] text-text-muted/10 uppercase font-mono hidden lg:block">
                        System Spec 0{i + 1}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Layer */}
      <section className="py-40 bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-blue/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="section-container max-w-4xl mx-auto relative z-10">
          <SectionReveal className="text-center mb-16">
            <div className="tech-badge rounded-full mb-6 mx-auto">SYSTEM FAQ PROTOCOL</div>
            <h2 className="text-3xl md:text-5xl font-sans font-bold text-text-primary tracking-tight">Execution Intelligence.</h2>
          </SectionReveal>

          <div className="grid divide-y divide-border-strong/40 border-y border-border-strong/40">
            {faqs.map((faq, i) => (
              <SectionReveal key={i} delay={i * 50}>
                <div className="bg-background/40 backdrop-blur-sm group transition-all">
                  <button
                    className="w-full flex items-center justify-between py-10 px-6 text-left hover:bg-white/5 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span className={clsx("text-lg md:text-xl font-sans font-bold tracking-tight transition-colors", openFaq === i ? "text-accent-blue" : "text-text-primary group-hover:text-accent-blue")}>
                      {faq.question}
                    </span>
                    {openFaq === i ? <ChevronUp size={24} className="text-accent-blue" /> : <ChevronDown size={24} className="text-text-muted group-hover:text-accent-blue transition-colors" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-8 overflow-hidden"
                      >
                        <p className="pb-10 text-text-secondary font-sans leading-relaxed text-base max-w-3xl opacity-70">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-40 bg-background relative overflow-hidden border-t border-border-strong/20 text-center">
        <div className="section-container relative z-10">
          <SectionReveal>
            <div className="tech-badge rounded-full mb-8">INITIATE DIAGNOSTIC</div>
            <h2 className="text-4xl md:text-6xl font-sans font-bold text-text-primary tracking-tight mb-8">
              Optimization <br />
              <span className="text-accent-blue">starts with clarity.</span>
            </h2>
            <GlowButton href="/contact" variant="primary" size="lg" className="rounded-full shadow-2xl shadow-accent-blue/20 px-12">
              Generate AI ROI Roadmap
              <ArrowRight size={20} />
            </GlowButton>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
