'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export default function NeuralInsight() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax and growth effects
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1.05]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const neuralPulseRange = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const textX = useTransform(scrollYProgress, [0, 0.5], [-50, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[100vh] flex items-center justify-center bg-transparent overflow-hidden py-24"
    >
      <div className="section-container grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        
        {/* Left Side: Animated High-Fidelity Visual */}
        <div className="relative flex justify-center lg:justify-start">
          <motion.div 
            style={{ scale: imageScale, opacity: imageOpacity }}
            className="relative w-full max-w-[600px] aspect-square rounded-[80px] overflow-hidden border border-white/10 shadow-[0_0_120px_rgba(var(--accent-blue),0.1)] group"
          >
            {/* The High-Fidelity "Original" Visual */}
            <Image 
              src="/images/neural-profile.png" 
              alt="Neural Intelligence Visualization" 
              fill
              className="object-cover"
            />
            
            {/* Dynamic Moving Parts (Layered Brain Pulse) */}
            <motion.div 
               className="absolute inset-x-[25%] inset-y-[15%] rounded-full bg-accent-blue/20 blur-[100px] pointer-events-none"
               animate={{ 
                 opacity: [0.1, 0.4, 0.1],
                 scale: [1, 1.2, 1]
               }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Scrolling Overlay: Neural Flow */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
               <motion.circle 
                 cx="50%" 
                 cy="40%" 
                 r={neuralPulseRange}
                 fill="none" 
                 stroke="var(--accent-blue)" 
                 strokeWidth="0.5" 
                 strokeDasharray="4 8"
                 className="opacity-30"
               />
               <motion.circle 
                 cx="50%" 
                 cy="40%" 
                 r={useTransform(scrollYProgress, [0, 1], [50, 200])}
                 fill="none" 
                 stroke="var(--accent-blue)" 
                 strokeWidth="0.2" 
                 className="opacity-10"
               />
            </svg>

            {/* Interaction Layer */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
          </motion.div>

          {/* Floating UI Detail */}
          <motion.div 
            style={{ y: useTransform(scrollYProgress, [0, 1], [40, -40]) }}
            className="absolute -top-10 -right-10 glass-card p-6 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-3xl z-20 hidden md:block"
          >
             <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(var(--accent-blue),1)] animate-ping" />
                   <span className="text-[10px] font-black tracking-widest text-text-primary uppercase">Cognitive Synchronisation: Active</span>
                </div>
                <div className="h-px w-full bg-white/10" />
                <p className="text-[9px] text-text-muted uppercase tracking-widest leading-none">Neural Latency</p>
                <span className="text-xl font-display font-black text-white leading-none">0.8ms</span>
             </div>
          </motion.div>
        </div>

        {/* Right Side: Copy Content */}
        <motion.div style={{ x: textX, opacity: textOpacity }} className="flex flex-col items-start max-w-xl">
           <div className="tech-badge rounded-full mb-10">
              <span className="w-2 h-2 bg-accent-blue rounded-full shadow-[0_0_8px_rgba(var(--accent-blue),0.8)]" />
              INTELLIGENT EDGE
           </div>
           
           <h2 className="text-4xl md:text-6xl font-sans font-bold text-text-primary mb-10 tracking-tight leading-[1.05]">
              Beyond Just Code. <br/>
              <span className="text-accent-blue">Neural Architecture.</span>
           </h2>
           
           <p className="text-text-secondary text-lg md:text-xl leading-relaxed opacity-80 mb-12">
              Our systems don&apos;t just run scripts; they adapt to your business environment. By mapping your operational DNA into a cohesive neural workflow, we ensure that every automation is an investment in your company&apos;s cognitive capital.
           </p>

           <div className="space-y-8 w-full">
              {[
                { title: 'Adaptive Learning', desc: 'Processes new data patterns in real-time.' },
                { title: 'Predictive Routing', desc: 'Pre-emptively handles bottlenecks before they scale.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start group">
                   <div className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center text-accent-blue group-hover:bg-accent-blue group-hover:text-white transition-all duration-500 shadow-inner">
                      <span className="font-mono text-sm font-black">0{i+1}</span>
                   </div>
                   <div>
                      <h4 className="text-text-primary font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </motion.div>

      </div>

      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-blue/5 rounded-full blur-[140px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 translate-y-1/2" />
    </section>
  );
}
