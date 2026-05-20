'use client';

import { Zap, Target, Shield, TrendingUp, Users, ArrowRight, Binary, Code2, Cpu } from 'lucide-react';
import GlowButton from '@/components/ui/GlowButton';
import SectionReveal from '@/components/ui/SectionReveal';
import NeuralBackground from '@/components/ui/NeuralBackground';
import clsx from 'clsx';

const values = [
  {
    icon: Target,
    title: 'Outcomes Over Outputs',
    description:
      'We don\'t get paid to build automations. We get paid to deliver results. Every decision we make is optimised for your ROI, not our hours.',
    color: 'var(--accent-blue)',
  },
  {
    icon: Shield,
    title: 'No Hype. Just Results.',
    description:
      'We refuse to sell AI for AI\'s sake. If automation won\'t meaningfully improve your business, we\'ll tell you. Our reputation is our primary asset.',
    color: 'var(--accent-blue)',
  },
  {
    icon: TrendingUp,
    title: 'Built to Scale',
    description:
      'Every system we build is designed to grow with you. We build on proven, enterprise-grade platforms — not fragile custom code that breaks under load.',
    color: 'var(--accent-blue)',
  },
  {
    icon: Users,
    title: 'Partner, Not Vendor',
    description:
      'We\'re invested in your success beyond the project. Our retainer clients think of us as their AI department — because that\'s exactly what we are.',
    color: 'var(--accent-blue)',
  },
];

const techStack = [
  'Make.com', 'n8n', 'Zapier', 'OpenAI API', 'Anthropic Claude',
  'Groq', 'Relevance AI', 'HubSpot', 'Salesforce', 'Airtable',
  'Notion', 'Slack', 'Shopify', 'Xero', 'MYOB',
  'DocuSign', 'Twilio', 'Intercom', 'Gorgias', 'Cliniko',
];

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-background pt-20 overflow-hidden">
      {/* Cinematic Hero */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <NeuralBackground />
        <div className="absolute inset-0 tech-grid opacity-[0.1] z-0" />

        <div className="section-container relative z-10 text-center">
          <SectionReveal>
            <div className="tech-badge rounded-full px-6 py-2 border-accent-blue/20 bg-accent-blue/5 mb-8 inline-flex">
              MISSION PROTOCOL INITIATED
            </div>
            <h1
              className="font-sans font-bold text-text-primary mb-8 leading-[0.95] tracking-tight"
              style={{ fontSize: 'clamp(40px, 7vw, 84px)' }}
            >
              We Build <br />
              <span className="text-accent-blue">The Intelligence Layer.</span>
            </h1>
            <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed opacity-80 font-sans">
              Netriq AI was founded by engineers who got tired of watching enterprise companies hoard AI advantages while Australian SMBs got left behind.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Manifesto / Story */}
      <section className="py-32">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
            <SectionReveal>
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent-blue/10 rounded-full blur-[60px] pointer-events-none" />
                <h2 className="text-3xl md:text-5xl font-sans font-bold text-text-primary tracking-tight leading-tight mb-8">
                  Democratizing <br />
                  <span className="text-accent-blue">Industrial Logic.</span>
                </h2>
                <div className="space-y-6 text-lg text-text-secondary leading-relaxed font-sans opacity-80">
                  <p>
                    Large enterprises have had dedicated AI teams for years. They&apos;ve automated their invoicing, their customer support, their sales outreach, their compliance reporting. They&apos;re running leaner, faster, and cheaper than ever before.
                  </p>
                  <p>
                    Meanwhile, most Australian SMBs are still manually copying data between systems and chasing invoices by phone. This isn&apos;t a technology problem. It&apos;s an access problem.
                  </p>
                  <div className="p-8 rounded-3xl bg-accent-blue/5 border border-accent-blue/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-accent-blue group-hover:scale-110 group-hover:opacity-20 transition-all">
                      <Binary size={64} />
                    </div>
                    <p className="font-sans font-bold text-xl text-text-primary leading-relaxed relative z-10 italic">
                      &ldquo;Netriq AI exists to close that gap. We bring enterprise-grade AI automation at SMB prices, with an obsessive focus on measurable ROI.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={150}>
              <div className="glass-card p-10 md:p-14 rounded-3xl relative overflow-hidden transition-all duration-500 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="mb-12">
                  <div className="w-16 h-16 rounded-2xl bg-accent-blue/10 flex items-center justify-center text-accent-blue mb-8 shadow-glow-sm">
                    <Cpu size={32} />
                  </div>
                  <h3 className="text-2xl font-sans font-bold text-text-primary tracking-tight mb-6 underline decoration-accent-blue/30 decoration-4 underline-offset-8">Why We Build.</h3>
                  <p className="text-text-secondary text-base leading-relaxed font-sans opacity-70">
                    Our technical leadership comes from decades of experience at top-tier platforms, where they saw that AI leverage was only accessible to the top 1%. We exist to bring that power to the broader community.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border-strong/40 flex items-center justify-center text-text-muted group-hover:border-accent-blue group-hover:text-accent-blue transition-all font-sans font-bold text-sm">200+</div>
                    <div className="text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase">Workflows Shipped</div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border-strong/40 flex items-center justify-center text-text-muted group-hover:border-accent-blue group-hover:text-accent-blue transition-all font-sans font-bold text-sm">4.2M</div>
                    <div className="text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase">Projected Client Savings (AUD)</div>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 bg-surface-1/30 relative">
        <div className="section-container">
          <SectionReveal className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-sans font-bold text-text-primary tracking-tight leading-tight mb-4">
              Operational <span className="text-accent-blue">Integrity.</span>
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <SectionReveal key={value.title} delay={i * 100}>
                <div className="glass-card p-10 rounded-3xl group h-full transition-all duration-500 hover:border-accent-blue/30 shadow-xl flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-accent-blue/5 border border-accent-blue/10 flex items-center justify-center text-accent-blue mb-8 group-hover:bg-accent-blue group-hover:text-white transition-all duration-500 shadow-glow-sm">
                    <value.icon size={24} />
                  </div>
                  <h3 className="text-xl font-sans font-bold text-text-primary mb-4 tracking-tight group-hover:text-accent-blue transition-all">{value.title}</h3>
                  <p className="text-text-secondary text-sm font-sans leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">{value.description}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 border-y border-border-strong/20 bg-background/50">
        <div className="section-container">
          <div className="flex flex-wrap gap-3 justify-center">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-bold tracking-[0.2em] font-sans px-6 py-3 rounded-full transition-all duration-300 bg-surface-2/40 border border-border-strong/30 text-text-muted hover:border-accent-blue/40 hover:text-text-primary hover:bg-accent-blue/5 uppercase"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-40 bg-background relative overflow-hidden text-center border-t border-border-strong/20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-blue/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="section-container relative z-10">
          <SectionReveal>
            <div className="tech-badge rounded-full mb-8">IDENTITY VERIFICATION COMPLETE</div>
            <h2
              className="font-sans font-bold text-text-primary mb-8 tracking-tight"
              style={{ fontSize: 'clamp(28px, 4.5vw, 48px)' }}
            >
              The gap is closing. <br />
              <span className="text-accent-blue">Will you stay on the right side of it?</span>
            </h2>
            <p className="text-text-secondary text-lg mb-12 max-w-xl mx-auto leading-relaxed opacity-80 font-sans">
              Netriq AI is a partner for those who prioritize efficiency over effort. Book your free consultation and secure your architectural advantage.
            </p>
            <GlowButton href="/contact" variant="primary" size="lg" className="px-12 rounded-full shadow-2xl shadow-accent-blue/20">
              Generate AI ROI Roadmap
              <ArrowRight size={20} />
            </GlowButton>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
