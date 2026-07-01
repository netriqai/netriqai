'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Database, ShieldAlert, Cpu, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import GlowButton from '@/components/ui/GlowButton';
import clsx from 'clsx';

const services = [
  {
    icon: Terminal,
    code: 'Service 01',
    name: 'AI Discovery Consultation',
    tagline: 'Deep-dive workflow mapping to identify return on investment potential.',
    description: 'We analyze how your team works today. We identify bottlenecks and map out exactly where AI can save you time and money.',
    price: 'AUD $2,500',
    id: 'audit',
    tags: ['Business Review', 'Return on Investment Plan', 'Roadmap'],
  },
  {
    icon: Cpu,
    code: 'Service 02',
    name: 'Custom Build',
    tagline: 'Secure, tailor-made neural automations.',
    description: 'We build and install secure custom AI automations directly into the tools your business already uses everyday.',
    price: 'AUD $8,000',
    id: 'build',
    tags: ['Custom Build', 'Setup', 'Testing'],
  },
  {
    icon: Database,
    code: 'Service 03',
    name: 'Neural Support',
    tagline: 'Continuous monitoring and 24/7 upgrades.',
    description: 'We monitor your systems 24/7. As your business grows, we continuously upgrade your AI to do more.',
    price: 'AUD $1,500/mo',
    id: 'support',
    tags: ['Monitoring', 'Updates', 'Fixes'],
  },
  {
    icon: ShieldAlert,
    code: 'Service 04',
    name: 'Team Training',
    tagline: 'Upskill your staff into efficient AI operators.',
    description: 'We train your staff on how to use their new AI tools, so they can achieve more in less time without technical skills.',
    price: 'AUD $3,000',
    id: 'training',
    tags: ['Live Coaching', 'Guides', 'Q&A'],
  },
  {
    icon: Globe,
    code: 'Service 05',
    name: 'Website Development',
    tagline: 'Websites built to convert and to be found by Google and AI.',
    description: 'We design and build fast, custom websites with SEO, AEO and GEO optimisation built in — so you rank on Google and get surfaced by AI assistants.',
    price: 'Custom Quote',
    id: 'web',
    tags: ['Web Design', 'SEO / AEO / GEO', 'Performance'],
  },
];

export default function ServicesOverview() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(0);

  return (
    <section className="py-20 md:py-24 bg-transparent relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="section-container relative z-10 w-full px-4 md:px-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 md:mb-24 gap-8">
          <div className="max-w-3xl">
            <div className="tech-badge rounded-full mb-6">
              ARCHITECTURE & IMPLEMENTATION
            </div>
            <h2 className="text-3xl md:text-6xl font-sans font-bold tracking-tight text-text-primary mb-6 leading-[1.05]">
              Intelligence Built Into <br className="hidden md:block" />
              <span className="text-accent-blue opacity-90">The Core of Your Business.</span>
            </h2>
            <p className="text-text-secondary text-lg md:text-xl leading-relaxed opacity-80 max-w-2xl font-sans">
              From initial bottleneck discovery to custom-built neural pipelines, we deploy the high-fidelity AI systems that drive Australian Small and Medium Businesses forward.
            </p>
          </div>

          <Link href="/services" className="group font-sans text-[10px] font-bold text-text-primary uppercase tracking-[0.4em] flex items-center gap-4 border border-border-strong/50 rounded-xl px-10 py-5 bg-surface-1/50 backdrop-blur-md hover:bg-accent-blue hover:text-white transition-all duration-500 w-fit shrink-0">
            VIEW SPECIFICATIONS <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* HIGH PERFORMANCE FLEX ACCORDION - High Density Stage */}
        <div className="flex flex-col md:flex-row gap-3 h-auto md:h-[480px] transition-all duration-500 ease-out">
          {services.map((service, i) => {
            const isActive = hoveredIdx === i;
            
            return (
              <motion.div
                key={i}
                layout
                onMouseEnter={() => setHoveredIdx(i)}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={clsx(
                  "relative overflow-hidden transition-all duration-500 rounded-[28px] border",
                  isActive 
                    ? "md:flex-[4] bg-accent-blue/10 border-accent-blue/40 shadow-glow-sm" 
                    : "md:flex-[1] bg-white dark:bg-surface-1 border-border-strong/30 hover:border-accent-blue/20 opacity-100",
                  "group cursor-pointer md:h-full backdrop-blur-xl",
                  isActive ? "h-auto min-h-[440px] md:h-full" : "h-[90px] md:h-full"
                )}
               >
                {/* Subtle Background Interaction */}
                <div className={clsx(
                  "absolute inset-0 bg-gradient-to-br from-accent-blue/10 via-transparent to-transparent transition-opacity duration-1000",
                  isActive ? "opacity-100" : "opacity-0"
                )} />

                <div className="relative z-10 p-4 md:p-6 flex flex-col h-full overflow-hidden">
                  
                  {/* Header Row - Condensed */}
                  <div className="flex items-center justify-between mb-8 h-10">
                    <div className={clsx(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border",
                      isActive 
                        ? "bg-accent-blue border-accent-blue text-white shadow-glow-sm scale-110" 
                        : "bg-surface-2 border-border-strong/40 text-accent-blue opacity-100 group-hover:bg-accent-blue/10"
                    )}>
                      <service.icon size={18} />
                    </div>
                    {isActive && (
                       <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.3 }}
                          className="font-mono text-[8px] text-text-muted tracking-[0.6em] uppercase"
                       >
                         {service.code}
                       </motion.span>
                    )}
                  </div>

                  {/* Body Logic */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <motion.h3 
                      layout="position"
                      className={clsx(
                        "font-sans font-black text-text-primary tracking-tighter transition-all duration-300 leading-[0.95] uppercase",
                        isActive ? "text-2xl lg:text-3xl mb-3" : "text-sm md:text-base mb-0 opacity-100"
                      )}
                    >
                      {service.name.split(' ').map((word, idx) => (
                        <span key={idx} className="block">{word}</span>
                      ))}
                    </motion.h3>

                    {/* Content visible only when active - Surgical Reveal */}
                    <div className={clsx(
                        "flex flex-col flex-1 min-h-0 transition-opacity duration-300",
                        isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none absolute"
                    )}>
                        <p className="text-text-primary/80 text-xs md:text-sm font-bold leading-normal mb-3 font-sans max-w-sm">
                        {service.tagline}
                        </p>
                        
                        <p className="text-text-secondary text-[11px] md:text-xs leading-relaxed mb-4 opacity-70 font-sans max-w-lg line-clamp-2">
                        {service.description}
                        </p>

                         {/* Tags moved to footer */}

                        <div className="mt-auto pt-4 border-t border-accent-blue/20">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
                                <div />
                                <Link href={`/contact?service=${service.id}`}>
                                    <GlowButton variant="primary" className="rounded-full shadow-2xl px-6 py-2.5 h-10 uppercase text-[8px] tracking-[0.2em] whitespace-nowrap">
                                        ENQUIRE <ArrowRight size={12} />
                                    </GlowButton>
                                </Link>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Vertical Side Identity */}
                  {!isActive && (
                     <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <div className="rotate-90 lg:rotate-90 origin-bottom-right lg:translate-x-0 translate-x-2 whitespace-nowrap text-[8px] font-bold tracking-[0.8em] text-text-muted/20 uppercase font-mono hidden lg:block">
                           Req_Mod_0{i+1}
                        </div>
                     </div>
                  )}

                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <GlowButton href="/contact" variant="primary" size="md" className="rounded-full px-12 py-4 h-12 shadow-2xl shadow-accent-blue/30 overflow-hidden">
            Book Your Free Discovery Call
            <ArrowRight size={18} />
          </GlowButton>
        </div>

      </div>
    </section>
  );
}
