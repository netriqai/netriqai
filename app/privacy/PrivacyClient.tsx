'use client';

import SectionReveal from '@/components/ui/SectionReveal';
import NeuralBackground from '@/components/ui/NeuralBackground';
import { Shield, Eye, Lock, RefreshCw, FileText } from 'lucide-react';

export default function PrivacyClient() {
  return (
    <div className="min-h-screen bg-background pt-20 overflow-hidden">
      {/* Cinematic Header */}
      <section className="relative py-24 md:py-32 overflow-hidden border-b border-border-strong/20">
        <NeuralBackground />
        <div className="absolute inset-0 tech-grid opacity-[0.1] z-0" />

        <div className="section-container relative z-10 text-center">
          <SectionReveal>
            <div className="tech-badge rounded-full px-6 py-2 border-accent-blue/20 bg-accent-blue/5 mb-8 inline-flex items-center gap-2">
              <Shield size={14} className="text-accent-blue" />
              DATA SECURITY PROTOCOL ACTIVE
            </div>
            <h1
              className="font-sans font-bold text-text-primary mb-4 leading-none tracking-tight"
              style={{ fontSize: 'clamp(32px, 6vw, 64px)' }}
            >
              Privacy <span className="text-accent-blue">Policy</span>
            </h1>
            <p className="text-text-muted text-sm font-mono uppercase tracking-[0.2em]">
              Last Updated: June 9, 2026
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-24 relative">
        <div className="section-container max-w-4xl">
          <SectionReveal>
            <div className="glass-card p-8 md:p-16 rounded-3xl relative overflow-hidden transition-all duration-500 shadow-2xl border border-border-strong/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="prose prose-invert max-w-none space-y-12 text-text-secondary leading-relaxed font-sans text-base">
                <div>
                  <p className="text-lg opacity-90 leading-relaxed mb-6">
                    At Netriq AI (&ldquo;Netriq&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;), we treat your business data with the highest level of industrial security. This Privacy Policy details how we collect, process, secure, and manage your data across our consulting services, website, and automated AI pipelines.
                  </p>
                  <p className="opacity-70">
                    We comply with the Australian Privacy Principles (APPs) contained in the Privacy Act 1988 (Cth) and other applicable international data regulations.
                  </p>
                </div>

                <hr className="border-border-strong/20" />

                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-sans font-bold text-text-primary flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                      <Eye size={18} />
                    </span>
                    1. Information We Collect
                  </h2>
                  <p className="opacity-80">
                    To engineer and maintain high-fidelity AI workflows, we collect the following types of information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-4 opacity-75">
                    <li><strong className="text-text-primary">Consulting Data:</strong> Contact details, business name, organizational structure, and operational process descriptions.</li>
                    <li><strong className="text-text-primary">Pipeline Telemetry:</strong> Log parameters, execution times, error logs, and throughput metadata from workflow instances (e.g. n8n, Make.com).</li>
                    <li><strong className="text-text-primary">API Credentials:</strong> Temporary access tokens, API keys, or webhook endpoints required to connect your internal applications.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-sans font-bold text-text-primary flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                      <RefreshCw size={18} />
                    </span>
                    2. Data Processing and Storage
                  </h2>
                  <p className="opacity-85">
                    Data processed by our automated tools is routed through secure, encrypted servers. 
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-4 opacity-75">
                    <li><strong className="text-text-primary">Supabase Storage:</strong> All content, sources, and configurations are persisted in our PostgreSQL databases hosted on secure servers with encryption at rest.</li>
                    <li><strong className="text-text-primary">No Model Training:</strong> We strictly configure our integration endpoints with AI providers (including Google Gemini and Anthropic Claude) so that none of your proprietary business data or queries are used to train public LLM models.</li>
                    <li><strong className="text-text-primary">Local Backup Fallbacks:</strong> Core telemetry and templates may be cached locally inside our sandboxed Cloud Run containers using secure memory channels, which are purged upon container recycle.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-sans font-bold text-text-primary flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                      <Lock size={18} />
                    </span>
                    3. Security Architecture
                  </h2>
                  <p className="opacity-80">
                    Netriq employs multiple layers of defense to protect your operational assets:
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-4 opacity-75">
                    <li>All network traffic is encrypted using TLS 1.3 in transit.</li>
                    <li>Environment keys and third-party tokens are secured inside GCP Secret Manager with restricted IAM service account access.</li>
                    <li>We conduct regular vulnerability audits of our Next.js codebases and Supabase row-level security (RLS) policies.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-sans font-bold text-text-primary flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                      <FileText size={18} />
                    </span>
                    4. Third-Party Integrations
                  </h2>
                  <p className="opacity-80">
                    Because we construct automation bridges, your data may interact with trusted third-party platforms (like Stripe, HubSpot, MYOB, or Cliniko). These platforms operate under their own respective privacy policies, and we configure integrations to pass only the minimum required payload to complete each task.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-sans font-bold text-text-primary flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                      <Shield size={18} />
                    </span>
                    5. Contact & Privacy Requests
                  </h2>
                  <p className="opacity-80">
                    If you wish to access, correct, delete, or inquire about your business data processed by Netriq AI, please contact our data officer:
                  </p>
                  <div className="p-6 rounded-2xl bg-surface-2/40 border border-border-strong/30 inline-block">
                    <p className="font-mono text-sm font-bold text-text-primary">
                      Email: hello@netriq.com.au <br />
                      Location: Melbourne, VIC, Australia
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
