'use client';

import { useState } from 'react';
import { BookOpen, Clock, ArrowRight, CheckCircle, Download, Mail } from 'lucide-react';
import GlowButton from '@/components/ui/GlowButton';
import SectionReveal from '@/components/ui/SectionReveal';

interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  color: string;
}

const blogPosts: BlogPost[] = [
  {
    slug: 'automate-customer-support-ai',
    category: 'AI Strategy',
    title: 'How to Automate Your Customer Support with AI (Without Losing the Human Touch)',
    excerpt:
      'Most AI support implementations fail not because the tech is bad, but because the handoff logic is wrong. Here\'s how to build a support system that\'s faster AND more human.',
    readTime: '8 min read',
    date: 'March 10, 2026',
    color: '#6366F1',
  },
  {
    slug: 'ai-automation-healthcare-clinics',
    category: 'Healthcare',
    title: 'The Complete Guide to AI Automation for Australian Healthcare Clinics',
    excerpt:
      'From patient reminders to billing follow-up to compliance documentation — a practical playbook for clinic owners who want to stop losing money to manual admin.',
    readTime: '12 min read',
    date: 'February 28, 2026',
    color: '#06B6D4',
  },
  {
    slug: 'n8n-vs-make-vs-zapier',
    category: 'Tool Comparison',
    title: 'n8n vs Make.com vs Zapier: Which Automation Tool Is Right for Your SMB?',
    excerpt:
      'An honest comparison from someone who\'s built 200+ workflows on all three platforms. Price, features, complexity, and the scenarios where each one wins.',
    readTime: '10 min read',
    date: 'February 14, 2026',
    color: '#4ADE80',
  },
  {
    slug: 'melbourne-law-firm-document-ai',
    category: 'Case Study',
    title: 'How We Saved a Melbourne Law Firm AUD $95k with Document AI',
    excerpt:
      'A step-by-step breakdown of exactly how we automated client onboarding and document processing for a 12-partner firm — and what we\'d do differently next time.',
    readTime: '7 min read',
    date: 'January 30, 2026',
    color: '#6366F1',
  },
  {
    slug: '5-ecommerce-workflows-2026',
    category: 'E-commerce',
    title: 'The 5 Workflows Every E-commerce Business Should Automate in 2026',
    excerpt:
      'Inventory forecasting, cart abandonment, support ticket deflection, supplier ordering, and returns processing. These five automations compound into massive savings.',
    readTime: '9 min read',
    date: 'January 15, 2026',
    color: '#06B6D4',
  },
  {
    slug: 'ai-for-construction-tradies',
    category: 'Construction',
    title: 'AI for Tradies: How Construction Companies Are Cutting Admin Time by 40%',
    excerpt:
      'Project reporting, subcontractor compliance, invoice processing, and quote generation. The construction sector is surprisingly ripe for automation — here\'s where to start.',
    readTime: '8 min read',
    date: 'January 5, 2026',
    color: '#4ADE80',
  },
  {
    slug: 'what-is-an-ai-consultation',
    category: 'Getting Started',
    title: 'What Is an AI Consultation and Why Every SMB Needs One Before Implementing AI',
    excerpt:
      'Most businesses that fail at AI implementation didn\'t do a proper discovery phase. Here\'s what an AI consultation actually involves, what it costs, and what you get out of it.',
    readTime: '6 min read',
    date: 'December 18, 2025',
    color: '#6366F1',
  },
  {
    slug: 'prompt-engineering-business',
    category: 'AI Skills',
    title: 'Prompt Engineering for Business: A Practical Guide for Non-Technical Teams',
    excerpt:
      'You don\'t need to be an engineer to write effective prompts. Learn the frameworks that turn vague AI outputs into precise, usable business content — with real examples.',
    readTime: '11 min read',
    date: 'December 5, 2025',
    color: '#06B6D4',
  },
];

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="h-full p-8 flex flex-col group bg-surface-1 border border-border-strong rounded-[24px] transition-all duration-300 hover:bg-surface-2 hover:border-[rgb(var(--accent-blue))] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[rgb(var(--accent-blue))] opacity-[0.03] blur-3xl group-hover:opacity-[0.08] transition-opacity" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[rgba(var(--accent-blue),0.1)] text-[rgb(var(--accent-blue))] border border-[rgba(var(--accent-blue),0.2)] uppercase tracking-wider">
          {post.category}
        </span>
        <span className="text-text-muted text-[10px] font-mono flex items-center gap-1.5 uppercase opacity-60">
          <Clock size={12} />
          {post.readTime}
        </span>
      </div>

      <h3 className="font-sans font-black text-text-primary mb-4 text-xl leading-tight flex-1 group-hover:text-[rgb(var(--accent-blue))] transition-colors">
        {post.title}
      </h3>
      <p className="text-text-muted text-sm leading-relaxed mb-6 opacity-80">{post.excerpt}</p>

      <div className="flex items-center justify-between mt-auto pt-6 border-t border-border-subtle relative z-10">
        <span className="text-text-muted text-[10px] font-mono uppercase opacity-50">{post.date}</span>
        <button
          className="flex items-center gap-2 text-xs font-black text-text-primary uppercase tracking-widest group-hover:text-[rgb(var(--accent-blue))] transition-all duration-300"
          aria-label={`Read ${post.title}`}
        >
          Access Module <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export default function ResourcesClient() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden border-b border-border-subtle">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--accent-blue),0.05)_0%,transparent_50%)] pointer-events-none" />

        <div className="section-container text-center relative z-10">
          <SectionReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(var(--accent-blue),0.3)] bg-background/50 backdrop-blur-md mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent-blue))] animate-pulse" />
              <span className="text-[9px] font-black tracking-[0.3em] text-[rgb(var(--accent-blue))] uppercase">Knowledge Base & Systems</span>
            </div>

            <h1
              className="font-sans font-black text-text-primary mb-8 leading-[0.95] tracking-tighter"
              style={{ fontSize: 'clamp(40px, 6vw, 84px)' }}
            >
              Technical<br />
              <span className="text-[rgb(var(--accent-blue))]">Guides.</span>
            </h1>
            <p className="text-text-muted text-xl max-w-2xl mx-auto leading-relaxed opacity-80">
              Technical playbooks, ROI models, and deep-dives into the architecture of modern AI automation. Engineered for Australian growth.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Resource Tiles */}
      <section className="py-24 bg-surface-2/30">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => (
              <SectionReveal key={post.slug} delay={i * 100}>
                <BlogCard post={post} />
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-32 border-t border-border-subtle bg-background overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="section-container relative z-10">
          <SectionReveal>
            <div className="max-w-3xl mx-auto text-center bg-surface-1 border border-border-strong rounded-[32px] p-10 md:p-20 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-[rgba(var(--accent-blue),0.1)] border border-[rgba(var(--accent-blue),0.2)]">
                <Mail size={28} className="text-[rgb(var(--accent-blue))]" />
              </div>

              {newsletterSubmitted ? (
                <div className="py-8">
                  <CheckCircle size={48} className="text-[rgb(var(--accent-blue))] mx-auto mb-6" />
                  <h2 className="font-sans font-black text-3xl text-text-primary mb-4 uppercase">Frequency Locked</h2>
                  <p className="text-text-muted text-base opacity-80">
                    You are now subscribed to the Insight Dispatch. Expected arrival: every second Tuesday.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-sans font-black text-3xl md:text-5xl text-text-primary mb-6 leading-tight uppercase tracking-tighter">
                    AI Insights, <span className="text-[rgb(var(--accent-blue))]">No Fluff.</span>
                  </h2>
                  <p className="text-text-muted text-lg mb-10 opacity-80 leading-relaxed">
                    Join 2,400+ Australian operators getting technical automation playbooks and ROI models delivered bi-weekly.
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="YOU@COMPANY.COM"
                      className="flex-1 px-6 py-4 rounded-xl text-text-primary text-xs font-mono placeholder:text-text-muted/30 outline-none transition-all focus:ring-2 focus:ring-[rgb(var(--accent-blue))]/40 bg-background border border-border-strong uppercase"
                      required
                    />
                    <GlowButton
                      type="submit"
                      variant="primary"
                      size="lg"
                    >
                      Subscribe
                    </GlowButton>
                  </form>
                </>
              )}
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
