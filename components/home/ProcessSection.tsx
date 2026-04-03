'use client';

import { Terminal, Cpu, HardDrive, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

const phases = [
  { step: '01', title: 'DISCOVERY', icon: Terminal, desc: 'We learn how your business operates today to identify repetitive tasks that are costing you time and money.' },
  { step: '02', title: 'STRATEGY', icon: HardDrive, desc: 'We build a custom roadmap showing exactly how much time AI can save your team each week.' },
  { step: '03', title: 'BUILD & INSTALL', icon: Cpu, desc: 'We privately build the automations and connect them softly to the software you already use.' },
  { step: '04', title: 'SUPPORT', icon: Fingerprint, desc: 'We monitor everything behind the scenes 24/7 so you never have to worry about maintenance.' },
];

export default function ProcessSection() {
  return (
    <section className="bg-transparent border-b border-border-strong font-mono uppercase">
      {/* Header */}
      <div className="border-b border-border-strong px-6 py-12 md:px-12 md:py-16 bg-surface-1 text-center">
        <h2 className="text-3xl md:text-5xl font-sans font-medium text-text-primary tracking-tight mb-4">
          How We Work.
        </h2>
        <p className="max-w-xl mx-auto text-text-muted text-xs tracking-widest leading-relaxed">
          The 4-step process we use to transform overwhelmed teams into highly efficient automated businesses.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border-strong bg-transparent">
        {phases.map((phase, i) => (
          <div key={i} className="group hover:bg-surface-1 transition-colors relative h-full flex flex-col justify-between">
            {/* Top */}
            <div className="p-8 pb-12">
              <div className="flex justify-between items-center mb-16 text-text-muted transition-colors group-hover:text-accent-blue">
                <phase.icon size={24} />
                <span className="text-xs font-bold tracking-widest">{phase.step}</span>
              </div>
              <h3 className="text-text-primary text-lg tracking-widest font-semibold mb-6">{phase.title}</h3>
              <p className="text-xs text-text-secondary leading-loose normal-case opacity-90">
                {phase.desc}
              </p>
            </div>
            
            {/* Bottom Status Line */}
            <div className="p-4 border-t border-border-strong border-dashed text-[10px] tracking-widest text-text-muted flex justify-between">
              <span>STATUS</span>
              <span>[PENDING]</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
