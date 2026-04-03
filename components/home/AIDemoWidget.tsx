'use client';

import AuditWizard from '@/components/audit/AuditWizard';

export default function AIDemoWidget() {
  return (
    <section className="py-20 md:py-24 bg-transparent relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
          <div className="tech-badge rounded-full mb-6">
             <span className="w-1.5 h-1.5 bg-accent-blue rounded-full shadow-[0_0_8px_rgba(var(--accent-blue),0.8)]" />
             DIAGNOSTIC ARCHITECTURE
          </div>
          <h2 className="text-4xl md:text-6xl font-sans font-bold text-text-primary mb-8 tracking-tight leading-[1.05]">
            Run Your <span className="text-accent-blue">Operational Diagnostic.</span>
          </h2>
          <p className="text-text-secondary text-lg md:text-xl leading-relaxed opacity-70 max-w-2xl mx-auto">
            Quantify the precise financial impact of manual error and bandwidth limitations across your current operations. Output generated in real-time.
          </p>
        </div>

        <div className="max-w-5xl mx-auto glass-card border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Subtle top light effect */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="bg-background/40 backdrop-blur-xl p-6 md:p-8 relative z-10">
            <AuditWizard />
          </div>
        </div>
      </div>
    </section>
  );
}
