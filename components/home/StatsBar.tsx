'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

const stats = [
  { value: 247, label: 'Workflows Executed', prefix: '' },
  { value: 4.2, label: 'Capital Recouped', prefix: 'AUD $' },
  { value: 99.9, label: 'System Uptime', prefix: '', suffix: '%' },
  { value: 30, label: 'Days to Deploy', prefix: '' },
];

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <section ref={ref} className="relative bg-black border-y border-border-strong py-12 md:py-0 overflow-hidden" aria-label="Key statistics">
      <div className="section-container px-0 md:px-0 max-w-none">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`p-6 md:p-12 border-border-strong bg-surface-1 rounded-xl/50 ${
                i % 2 !== 0 ? 'border-l' : ''
              } ${i > 1 ? 'border-t md:border-t-0' : ''} ${i > 0 ? 'md:border-l' : ''}`}
            >
              <div className="font-mono text-xs uppercase tracking-widest text-text-muted mb-4">
                {stat.label}
              </div>
              <div className="font-sans font-medium text-4xl md:text-5xl text-text-primary tracking-tighter">
                {inView ? (
                  <>
                    <span className="text-text-muted font-mono text-2xl relative -top-3 mr-1">{stat.prefix}</span>
                    <AnimatedCounter from={0} to={stat.value} duration={1.5} decimals={stat.value % 1 !== 0 ? 1 : 0} />
                    <span className="text-text-muted font-mono text-2xl relative -top-3 ml-1">{stat.suffix}</span>
                  </>
                ) : (
                  <span>
                    <span className="text-text-muted font-mono text-2xl relative -top-3 mr-1">{stat.prefix}</span>
                    0
                    <span className="text-text-muted font-mono text-2xl relative -top-3 ml-1">{stat.suffix}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
