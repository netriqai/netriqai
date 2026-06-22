'use client';

import SectionReveal from '@/components/ui/SectionReveal';
import NeuralBackground from '@/components/ui/NeuralBackground';
import { FileText, Cpu, Key, HelpCircle, AlertTriangle } from 'lucide-react';

export default function TermsClient() {
  return (
    <div className="min-h-screen bg-background pt-20 overflow-hidden">
      {/* Cinematic Header */}
      <section className="relative py-24 md:py-32 overflow-hidden border-b border-border-strong/20">
        <NeuralBackground />
        <div className="absolute inset-0 tech-grid opacity-[0.1] z-0" />

        <div className="section-container relative z-10 text-center">
          <SectionReveal>
            <div className="tech-badge rounded-full px-6 py-2 border-accent-blue/20 bg-accent-blue/5 mb-8 inline-flex items-center gap-2">
              <FileText size={14} className="text-accent-blue" />
              LEGAL FRAMEWORK STABLE
            </div>
            <h1
              className="font-sans font-bold text-text-primary mb-4 leading-none tracking-tight"
              style={{ fontSize: 'clamp(32px, 6vw, 64px)' }}
            >
              Terms of <span className="text-accent-blue">Service</span>
            </h1>
            <p className="text-text-muted text-sm font-mono uppercase tracking-[0.2em]">
              Last Updated: June 9, 2026
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-24 relative">
        <div className="section-container max-w-4xl">
          <SectionReveal>
            <div className="glass-card p-8 md:p-16 rounded-3xl relative overflow-hidden transition-all duration-500 shadow-2xl border border-border-strong/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="prose prose-invert max-w-none space-y-12 text-text-secondary leading-relaxed font-sans text-base">
                <div>
                  <p className="text-lg opacity-90 leading-relaxed mb-6">
                    Welcome to Netriq AI. These Terms of Service (&ldquo;Terms&rdquo;) govern your engagement with Netriq AI (&ldquo;Netriq&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;), including the development, setup, maintenance, and deployment of custom AI automation workflows, systems, and consulting services.
                  </p>
                  <p className="opacity-70">
                    By booking a consultation, contracting our development services, or accessing our platform, you agree to comply with and be bound by these Terms.
                  </p>
                </div>

                <hr className="border-border-strong/20" />

                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-sans font-bold text-text-primary flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                      <Cpu size={18} />
                    </span>
                    1. Scope of Engagement
                  </h2>
                  <p className="opacity-80">
                    Netriq offers discovery consultations, custom AI pipeline builds, database migrations (e.g. Supabase, PostgreSQL), and support retainers. 
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-4 opacity-75">
                    <li><strong className="text-text-primary">Discovery Roadmap:</strong> Recommendations generated in our audits are based on technical feasibility at the time of writing.</li>
                    <li><strong className="text-text-primary">Development Builds:</strong> Custom workflows (Make.com, n8n, Cloud Run) are built to match the agreed specification document signed by both parties.</li>
                    <li><strong className="text-text-primary">Operational Support:</strong> Retainers cover bugs, API token maintenance, and system health checks, but exclude rebuilding workflows from scratch due to brand-new business rules.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-sans font-bold text-text-primary flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                      <Key size={18} />
                    </span>
                    2. Intellectual Property (IP) and Licenses
                  </h2>
                  <p className="opacity-80">
                    We maintain clear boundaries for intellectual property:
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-4 opacity-75">
                    <li><strong className="text-text-primary">Client IP:</strong> The client retains all ownership of their proprietary business data, databases, and core business logic.</li>
                    <li><strong className="text-text-primary">Netriq Core IP:</strong> Netriq retains ownership over standard utility scripts, generic automation template wrappers, and design elements built prior to or during the project.</li>
                    <li><strong className="text-text-primary">Workflow License:</strong> Upon full payment, the client receives a perpetual, worldwide, non-transferable, royalty-free license to run, modify, and host the custom-built workflows for their own operations.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-sans font-bold text-text-primary flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                      <AlertTriangle size={18} />
                    </span>
                    3. Limitations of Liability & API Disruptions
                  </h2>
                  <p className="opacity-80">
                    AI automation interfaces with dynamic external ecosystems:
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-4 opacity-75">
                    <li><strong className="text-text-primary">LLM Hallucinations:</strong> Netriq is not liable for errors, hallucinations, or incorrect texts generated by LLM models (e.g. Google Gemini, Anthropic Claude, OpenAI) in production workflows. We recommend human-in-the-loop validation for critical customer-facing actions.</li>
                    <li><strong className="text-text-primary">API Deprecation:</strong> Third-party systems (like Google Workspace, HubSpot, MYOB) occasionally update their APIs. Netriq is not responsible for outages caused by sudden third-party deprecations or API limit exhaustion.</li>
                    <li><strong className="text-text-primary">Financial Liability:</strong> In no event shall Netriq be liable for any indirect, special, or consequential damages (including lost profits) exceeding the total fees paid by the client under the active project contract.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-sans font-bold text-text-primary flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                      <HelpCircle size={18} />
                    </span>
                    4. Governing Law
                  </h2>
                  <p className="opacity-80">
                    These Terms are governed by and construed in accordance with the laws of Victoria, Australia. Any disputes arising out of these Terms or our services will be subject to the exclusive jurisdiction of the courts of Victoria.
                  </p>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
