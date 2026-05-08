'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Clock, CheckCircle, ChevronDown, ChevronUp, Zap, Calendar, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import GlowButton from '@/components/ui/GlowButton';
import SectionReveal from '@/components/ui/SectionReveal';
import NeuralBackground from '@/components/ui/NeuralBackground';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';

interface ContactFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  teamSize: string;
  service: string;
  challenge: string;
}

const industries = [
  'Retail / E-commerce',
  'Healthcare',
  'Professional Services',
  'Legal',
  'Construction / Trades',
  'Finance / Accounting',
  'Hospitality',
  'Education',
  'Other',
];

const teamSizes = [
  '1–5 people',
  '6–20 people',
  '21–50 people',
  '51–100 people',
  '100+ people',
];

const serviceProtocols = [
  { id: 'audit', label: 'AI Discovery Audit' },
  { id: 'build', label: 'Custom Automation Build' },
  { id: 'support', label: 'Neural Support & Updates' },
  { id: 'training', label: 'AI Team Training' },
];

const calendarFaqs = [
  {
    q: 'What happens in the audit?',
    a: 'A focused 60-minute video call. We ask about your biggest operational bottlenecks, walk through 2–3 of your core workflows, and identify your highest-ROI automation opportunities. By the end of the call, you\'ll have a clear picture of what\'s possible and what it would cost.',
  },
  {
    q: 'Who will I speak to?',
    a: 'You\'ll speak directly with our Lead AI Architect. Not a salesperson. Not a junior consultant.',
  },
  {
    q: 'Is this really free?',
    a: 'Yes — 100% free, no commitment required. We offer free audits because they generate qualified work for us and genuine value for you.',
  },
];

const inputClasses = 'w-full px-6 py-4 rounded-2xl text-text-primary text-sm placeholder:text-text-muted/40 outline-none transition-all focus:ring-2 focus:ring-accent-blue/50 bg-white/5 border border-border-strong/40 focus:border-accent-blue focus:bg-white/10';
const inputErrorClasses = 'w-full px-6 py-4 rounded-2xl text-text-primary text-sm placeholder:text-text-muted/40 outline-none transition-all focus:ring-2 focus:ring-accent-blue/50 bg-white/5 border border-rose-500/50 focus:border-rose-500 focus:bg-white/10';

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get('service');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormData>();

  useEffect(() => {
    if (preselectedService) {
      const service = serviceProtocols.find(s => s.id === preselectedService);
      if (service) {
        setValue('service', service.label);
      }
    }
  }, [preselectedService, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
        reset();
      } else {
        alert('Transmission failed. Please try again or use direct email.');
      }
    } catch (err) {
      console.error('NETWORK_FAILURE:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 overflow-hidden">
      {/* Cinematic Hero */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <NeuralBackground />
        <div className="absolute inset-0 tech-grid opacity-[0.1] z-0" />
        
        <div className="section-container relative z-10 text-center">
          <SectionReveal>
            <div className="tech-badge rounded-full px-6 py-2 border-accent-blue/20 bg-accent-blue/5 mb-8 inline-flex">
              SECURE_COMMUNICATION_CHANNEL
            </div>
            <h1
              className="font-sans font-bold text-text-primary mb-8 leading-[0.95] tracking-tight"
              style={{ fontSize: 'clamp(44px, 7vw, 90px)' }}
            >
              Initiate Your <br/>
              <span className="text-accent-blue">Automation Phase.</span>
            </h1>
            <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed opacity-80 font-sans">
              Book your free 60-minute neural audit or send us a secure message. We typically sync with new inquiries within 2 hours.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Main content */}
      <section className="py-24">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
             <div className="space-y-12">
                <SectionReveal>
                   <div className="glass-card border-white/5 p-10 md:p-14 rounded-3xl relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                      
                      <div className="flex items-center gap-4 mb-10 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue shadow-glow-sm">
                          <Calendar size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-sans font-bold text-text-primary tracking-tight">Reserve Neural Audit</h2>
                          <p className="text-[10px] font-bold text-text-muted tracking-[0.2em] uppercase">60 MINS • VIDEO SYNC • $0.00 COST</p>
                        </div>
                      </div>

                      <div className="w-full rounded-2xl flex flex-col items-center justify-center py-20 px-10 text-center border border-white/5 bg-background/40 backdrop-blur-sm relative z-10 group overflow-hidden" style={{ minHeight: '350px' }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Calendar size={48} className="text-accent-blue/30 mb-6 group-hover:scale-110 group-hover:text-accent-blue transition-all" />
                        <p className="font-sans font-bold text-text-primary text-lg mb-3">
                          Interactive Scheduler
                        </p>
                        <p className="text-text-secondary text-sm mb-10 max-w-xs opacity-70 leading-relaxed font-sans">
                          Sync directly with our neural architects to map your operational bottlenecks.
                        </p>
                        <GlowButton
                          href="https://calendly.com"
                          variant="primary"
                          size="md"
                          external
                          className="px-8 rounded-full shadow-xl shadow-accent-blue/20"
                        >
                          Book via Calendly
                          <ArrowRight size={16} />
                        </GlowButton>
                      </div>

                      <div className="mt-8 flex items-center gap-3 p-4 rounded-2xl bg-accent-blue/5 border border-accent-blue/10 relative z-10">
                         <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse shadow-glow-sm" />
                         <span className="text-accent-blue text-[10px] font-bold tracking-widest uppercase font-sans">
                           Live Response Sync: Typical Latency 2 Hours
                         </span>
                      </div>
                   </div>
                </SectionReveal>

                <SectionReveal delay={100}>
                   <div className="space-y-4">
                      <h3 className="text-[10px] font-bold tracking-[0.4em] text-text-muted uppercase mb-4 px-4">Audit Protocol FAQ</h3>
                      {calendarFaqs.map((faq, i) => (
                        <div key={i} className="glass-card border-white/5 rounded-2xl overflow-hidden shadow-xl transition-all hover:border-accent-blue/20 group">
                           <button
                             className="w-full flex items-center justify-between p-6 text-left"
                             onClick={() => setOpenFaq(openFaq === i ? null : i)}
                           >
                             <span className={clsx("font-sans font-bold text-sm tracking-tight transition-colors", openFaq === i ? "text-accent-blue" : "text-text-primary group-hover:text-accent-blue")}>
                               {faq.q}
                             </span>
                             {openFaq === i ? <ChevronUp size={18} className="text-accent-blue" /> : <ChevronDown size={18} className="text-text-muted" />}
                           </button>
                           <div className={clsx("px-6 overflow-hidden transition-all duration-300", openFaq === i ? "max-h-[200px] mb-6 opacity-100" : "max-h-0 opacity-0")}>
                              <p className="text-text-secondary text-sm leading-relaxed font-sans opacity-70">
                                {faq.a}
                              </p>
                           </div>
                        </div>
                      ))}
                   </div>
                </SectionReveal>
             </div>

             <SectionReveal delay={150}>
                <div className="glass-card border-white/5 p-10 md:p-14 rounded-3xl relative overflow-hidden shadow-2xl h-fit">
                   <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-blue/5 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2 pointer-events-none" />
                   
                   <div className="flex items-center gap-4 mb-12 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-primary shadow-glow-sm transition-colors">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-sans font-bold text-text-primary tracking-tight">Direct Sync</h2>
                      <p className="text-[10px] font-bold text-text-muted tracking-[0.2em] uppercase">SECURE MESSAGE TRANSMISSION</p>
                    </div>
                  </div>

                  {submitted ? (
                     <div className="text-center py-20 relative z-10 animate-in fade-in slide-in-from-bottom-5">
                       <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue shadow-glow">
                         <CheckCircle size={40} />
                       </div>
                       <h3 className="text-2xl font-sans font-bold text-text-primary mb-4 tracking-tight">Sync Established.</h3>
                       <p className="text-text-secondary leading-relaxed font-sans opacity-70 mb-10 max-w-sm mx-auto">
                         Transmission received. Our core team will provide a neural response in approximately 2 hours.
                       </p>
                       <GlowButton onClick={() => setSubmitted(false)} variant="ghost" className="rounded-full px-10 border-border-strong/40">
                         SEND ANOTHER TRANSMISSION
                       </GlowButton>
                     </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10" noValidate>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                              <label htmlFor="name" className="text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase mb-2 block px-2">Operator Name</label>
                              <input
                                id="name"
                                type="text"
                                placeholder="IDENTIFIER"
                                {...register('name', { required: 'Name required' })}
                                className={errors.name ? inputErrorClasses : inputClasses}
                              />
                           </div>
                           <div>
                              <label htmlFor="company" className="text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase mb-2 block px-2">Organization</label>
                              <input
                                id="company"
                                type="text"
                                placeholder="COMPANY.INC"
                                {...register('company', { required: 'Org required' })}
                                className={errors.company ? inputErrorClasses : inputClasses}
                              />
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                              <label htmlFor="email" className="text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase mb-2 block px-2">Sync Email</label>
                              <input
                                id="email"
                                type="email"
                                placeholder="OPERATOR@CORE.COM"
                                {...register('email', { required: 'Email required', pattern: /^\S+@\S+$/i })}
                                className={errors.email ? inputErrorClasses : inputClasses}
                              />
                           </div>
                           <div>
                              <label htmlFor="phone" className="text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase mb-2 block px-2">Comm Channel (Optional)</label>
                              <input
                                id="phone"
                                type="tel"
                                placeholder="+61 XXX XXX XXX"
                                {...register('phone')}
                                className={inputClasses}
                              />
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                              <label className="text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase mb-2 block px-2">Industry Sector</label>
                              <select {...register('industry', { required: true })} className={clsx(inputClasses, "appearance-none")}>
                                <option value="">SELECT_SECTOR...</option>
                                {industries.map(ind => <option key={ind} value={ind} className="bg-background">{ind.toUpperCase()}</option>)}
                              </select>
                           </div>
                           <div>
                              <label className="text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase mb-2 block px-2">Neural Scale</label>
                              <select {...register('teamSize', { required: true })} className={clsx(inputClasses, "appearance-none")}>
                                <option value="">PEOPLE_COUNT...</option>
                                {teamSizes.map(size => <option key={size} value={size} className="bg-background">{size.toUpperCase()}</option>)}
                              </select>
                           </div>
                        </div>

                        <div>
                           <label htmlFor="challenge" className="text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase mb-2 block px-2">Core Operational Bottleneck</label>
                           <textarea
                             id="challenge"
                             rows={4}
                             placeholder="DESCRIBE_WORKFLOW_FAILURE..."
                             {...register('challenge', { required: true, minLength: 10 })}
                             className={clsx(errors.challenge ? inputErrorClasses : inputClasses, "resize-none")}
                           />
                        </div>

                        <GlowButton type="submit" variant="primary" size="lg" className="w-full justify-center rounded-full mt-4 group" disabled={submitting}>
                           {submitting ? 'TRANSMITTING...' : (
                             <>
                               <Zap size={18} className="transition-transform group-hover:scale-125" />
                               SEND SECURE TRANSMISSION
                             </>
                           )}
                        </GlowButton>

                        <div className="flex items-center justify-center gap-6 mt-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                           <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest text-text-muted"><ShieldCheck size={14}/> AES_256</div>
                           <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest text-text-muted"><Clock size={14}/> LOW_LATENCY</div>
                        </div>
                    </form>
                  )}
                </div>
             </SectionReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
