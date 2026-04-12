'use client';

const stats = [
  { value: '50+', label: 'Installations' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.2M', label: 'AUD Saved' },
  { value: '2.1M', label: 'Rows Processed' },
];

const partners = ['MAKE.COM', 'OPENAI', 'ANTHROPIC', 'N8N', 'AERON', 'ZAPIER', 'AWS', 'GCP'];

export default function SocialProof() {
  return (
    <section className="bg-transparent border-y border-border-strong/50 overflow-hidden py-16 md:py-20">
      {/* Logos Marquee - Balanced & Centered */}
      <div className="mb-20 flex justify-center overflow-hidden text-[10px] font-bold tracking-[0.4em] text-text-muted/60 whitespace-nowrap">
        <div className="flex gap-20 shrink-0 pr-20 animate-marquee justify-around min-w-full">
          {partners.map((p, i) => <span key={i} className="hover:text-text-primary transition-colors cursor-default">{p}</span>)}
        </div>
        <div className="flex gap-20 shrink-0 pr-20 animate-marquee justify-around min-w-full" aria-hidden="true">
          {partners.map((p, i) => <span key={i} className="hover:text-text-primary transition-colors cursor-default">{p}</span>)}
        </div>
      </div>

      <div className="section-container">
        <div className="max-w-5xl mx-auto text-center">
          <div className="relative inline-block">
            <span className="text-accent-blue text-5xl md:text-7xl font-serif opacity-10 absolute -top-12 -left-8 select-none">&quot;</span>
            <blockquote className="text-2xl md:text-4xl font-sans font-bold leading-[1.1] text-text-primary mb-12 tracking-tight relative z-10">
              A 60% reduction in manual tracking errors within the first month. The system paid for itself before the end of the first quarter. Netriq AI is the gold standard for Australian Small and Medium Businesses.
            </blockquote>
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-[10px] font-bold text-accent-blue shadow-inner">SM</div>
              <div>
                <strong className="text-text-primary block text-sm tracking-wide uppercase">SARAH M.</strong>
                <span className="text-[10px] text-text-muted uppercase tracking-[0.3em] font-bold opacity-60">OPERATIONS DIRECTOR, MELBOURNE RETAIL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
