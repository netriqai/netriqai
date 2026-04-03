'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Mail, FileText, CheckCircle2, Clock, Zap, MessageSquare, Sparkles, ArrowRight, BrainCircuit, Cpu } from 'lucide-react';
import SectionTransition from '@/components/ui/SectionTransition';
import { triggerHaptic } from '@/lib/haptic';
import clsx from 'clsx';

export default function ProblemSection() {
  const [isSimulating, setIsSimulating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.05, rootMargin: '400px' });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // AUTO-TRIGGER: Activate simulation when user enters the section
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setIsSimulating(true), 600); // Slight delay for anticipation
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const gridY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section ref={containerRef} className="py-12 md:py-16 relative bg-transparent border-y border-border-strong/30 overflow-hidden group/problem">
      
      {/* Scroll-driven curved transition at the top */}
      <SectionTransition />
      
      <motion.div style={{ y: gridY }} className="absolute inset-0 z-0 opacity-40 mix-blend-overlay pointer-events-none" />
      
      {/* Subtle Vignette Glow Overlay to increase depth */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      
      {/* Containerized Full Width Layout */}
      <div className="w-full relative z-20 flex flex-col items-center max-w-[1920px] mx-auto px-6 md:px-12">
        
        {/* Header Content */}
            <div className="mb-6">
              <div className="tech-badge rounded-full px-5 py-1.5 border-accent-blue/20 bg-background/50 backdrop-blur-xl transition-all hover:bg-background/80">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-blue shadow-[0_0_12px_rgb(var(--accent-blue))]" />
                <span className="text-[11px] font-bold tracking-[0.25em] text-accent-blue uppercase">THE BOTTLENECK ANALYSIS</span>
              </div>
            </div>
            
            <h2 className="text-4xl md:text-7xl font-sans font-bold tracking-tighter text-text-primary mb-6 leading-[0.95] max-w-5xl mx-auto text-center">
              Manual Admin is The <br className="hidden md:block" />
              <span className="text-accent-blue opacity-90 drop-shadow-2xl">Silent Profit Killer.</span>
            </h2>
            
            <p className="text-base md:text-xl leading-relaxed opacity-80 max-w-3xl mx-auto font-sans text-center mb-12">
              As a growing business, repetitive taskwork eats your most valuable asset: time. Every manual invoice, scattered email, and delayed follow-up is a leak in your bottom line. We deploy simple, powerful AI workflows to automate the grind, letting your team focus on driving real growth.
            </p>

        {/* simulation Visual */}
        <div className="w-full relative min-h-[380px] md:min-h-[420px] flex items-center justify-center">
          
          {/* Edge-Connected Circuit Layer - Theme Aware Stroke */}
          {isInView && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[600px] pointer-events-none z-10 hidden lg:block overflow-visible opacity-30">
              <svg width="100%" height="100%" viewBox="0 0 1600 600" preserveAspectRatio="xMidYMid slice" fill="none" className="overflow-visible">
                 <g stroke="rgb(var(--accent-blue))" strokeWidth="1.5" strokeOpacity="0.1">
                    <path d="M400 150 L 550 150 L 700 250" />
                    <path d="M400 350 L 550 350 L 700 350" />
                    <path d="M400 450 L 550 450 L 700 350" />
                    
                    <path d="M900 300 L 1050 200 L 1200 200" strokeOpacity={isSimulating ? 0.3 : 0.1} />
                    <path d="M900 300 L 1050 400 L 1200 400" strokeOpacity={isSimulating ? 0.3 : 0.1} />
                 </g>

                 {isSimulating && (
                   <>
                     {[0, 0.4].map((i) => (
                       <motion.circle key={`in-${i}`} r="3" fill="rgb(var(--accent-blue))" filter="blur(1.5px)">
                         <animateMotion dur="1.8s" repeatCount="indefinite" path="M400 150 L 550 150 L 700 250" begin={`${i}s`} />
                       </motion.circle>
                     ))}
                     <motion.circle r="3" fill="rgb(var(--accent-blue))" filter="blur(1.5px)">
                         <animateMotion dur="2.2s" repeatCount="indefinite" path="M400 350 L 550 350 L 700 350" />
                     </motion.circle>

                     {[0, 0.5].map((i) => (
                       <motion.circle key={`out-up-${i}`} r="4" fill="rgb(var(--accent-blue))" className="shadow-glow-sm">
                         <animateMotion dur="1s" repeatCount="indefinite" path="M900 300 L 1050 200 L 1200 200" begin={`${i}s`} />
                       </motion.circle>
                     ))}
                     <motion.circle r="4" fill="rgb(var(--accent-blue))" className="shadow-glow-sm">
                         <animateMotion dur="0.8s" repeatCount="indefinite" path="M900 300 L 1050 400 L 1200 400" />
                     </motion.circle>
                   </>
                 )}
              </svg>
            </div>
          )}

          <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[480px_1fr_480px] gap-8 md:gap-16 items-center relative z-20">
            
            <div className="flex flex-col items-center">
              <motion.div 
                className={clsx(
                  "w-full p-4 md:p-6 rounded-[12px] bg-surface-1/60 dark:bg-surface-1/25 border border-white/10 backdrop-blur-xl transition-all duration-700 shadow-2xl relative overflow-hidden group/card",
                  isSimulating ? "opacity-30 blur-[4px] scale-95" : "opacity-100"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000" />
                
                <div className="flex items-center justify-between mb-10 relative z-10">
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-black tracking-[0.4em] text-red-500 dark:text-accent-blue uppercase mb-1 transition-colors duration-500">Manual Process</span>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-red-500/80">Overwhelmed</span>
                      </div>
                    </div>
                  <div className="w-3 h-3 rounded-full bg-red-500 dark:bg-accent-blue/40 animate-pulse" />
                </div>
                
                <div className="space-y-4 relative z-10">
                  {[
                    { icon: Mail, label: 'Scattered Emails', status: 'Blocked' },
                    { icon: FileText, label: 'Manual Copy-Paste', status: 'Error-Prone' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-background/40 dark:bg-surface-2/40 p-4 rounded-xl border border-border-subtle/20 flex items-center gap-4 hover:bg-white/10 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted">
                        <item.icon size={16} />
                      </div>
                      <div className="flex-1 text-left">
                          <p className="text-xs text-text-primary font-bold">{item.label}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-red-500/50 w-full" />
                            </div>
                            <span className="text-[8px] font-mono text-red-500/80">{item.status}</span>
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col items-center justify-center relative group/trigger">
                <div className="relative md:absolute md:-top-32 lg:-top-52 w-full md:w-[280px] h-auto md:h-16 flex flex-col items-center justify-center gap-2 z-40 pointer-events-none mb-6 md:mb-0">
                    <AnimatePresence mode="wait">
                      {!isSimulating ? (
                        <motion.div
                          key="ready"
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="flex flex-col items-center gap-1.5"
                        >
                            <div className="px-4 py-1.5 rounded-full border border-white/5 bg-background/40 backdrop-blur-xl flex items-center gap-2 shadow-2xl">
                               <div className="w-1 h-1 rounded-full bg-accent-blue animate-pulse" />
                               <span className="text-[9px] font-black tracking-[0.3em] text-white/50 uppercase">Workflow Ready</span>
                            </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="active"
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="flex flex-col items-center gap-3"
                        >
                            <div className="px-6 py-2 rounded-full border border-accent-blue/40 bg-accent-blue/10 backdrop-blur-xl flex items-center gap-3 shadow-[0_0_50px_rgba(var(--accent-blue),0.2)]">
                               <span className="w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(var(--accent-blue),0.8)]" />
                               <span className="text-[10px] font-black tracking-[0.2em] text-accent-blue uppercase">Automated</span>
                            </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                </div>

                <div className="relative scale-80 md:scale-[1.0] lg:scale-[1.1] my-4 lg:my-0">
                  <div className={clsx(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-accent-blue/10 rounded-full transition-all duration-1000",
                    isSimulating ? "scale-150 rotate-180 border-accent-blue/40" : "scale-100 rotate-0"
                  )} />
                  <div className={clsx(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-accent-blue/5 rounded-full transition-all duration-1500",
                    isSimulating ? "scale-125 -rotate-180 border-accent-blue/20" : "scale-100 rotate-0"
                  )} />

                  <button 
                    onClick={() => {
                        setIsSimulating(!isSimulating);
                        triggerHaptic('medium');
                    }}
                    className={clsx(
                        "relative flex items-center justify-center bg-background border rounded-full transition-all duration-700 z-20 overflow-hidden",
                        !isSimulating 
                          ? "w-24 h-24 border-white/5 hover:border-accent-blue/50 hover:shadow-[0_0_60px_rgba(var(--accent-blue),0.2)]" 
                          : "w-24 h-24 border-accent-blue bg-accent-blue shadow-[0_0_80px_rgba(var(--accent-blue),0.5)]"
                    )}
                  >
                    <Zap 
                      size={28} 
                      className={clsx(
                        "transition-all duration-500",
                        isSimulating ? "text-white scale-110" : "text-text-muted group-hover/trigger:text-accent-blue"
                      )} 
                      fill={isSimulating ? "currentColor" : "none"}
                    />
                    
                    {isSimulating && (
                       <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                          className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full"
                       />
                    )}
                  </button>
                </div>
            </div>

            <div className="flex flex-col items-center">
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                animate={{ 
                  opacity: isSimulating ? 1 : 0.1, 
                  x: isSimulating ? 0 : 40,
                  filter: isSimulating ? "blur(0px)" : "blur(12px)"
                }}
                className={clsx(
                  "w-full p-4 md:p-6 rounded-[12px] border backdrop-blur-xl transition-all duration-1000 shadow-2xl relative overflow-hidden group/neural",
                  isSimulating ? "bg-accent-blue/20 border-accent-blue/40" : "bg-surface-1/25 border-white/10"
                )}
              >
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/[0.05] via-transparent to-transparent opacity-0 group-hover/neural:opacity-100 transition-opacity duration-1000" />

                  <div className="flex items-center justify-between mb-10 relative z-10 text-left">
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-black tracking-[0.4em] text-accent-blue uppercase mb-1">AI Guided Workflow</span>
                        <div className="flex items-center gap-2 px-3 py-1 bg-accent-blue/5 border border-accent-blue/20 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(var(--accent-blue),0.8)]" />
                          <span className="text-[10px] font-mono text-accent-blue/80 tracking-tighter">Running Smoothly</span>
                        </div>
                      </div>
                    <div className="flex gap-1">
                       <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-ping" />
                       <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    {[
                      { icon: Sparkles, label: 'Instant Lead Sorting', gain: 'Automated' },
                      { icon: BrainCircuit, label: 'Error-Free Invoices', gain: '100% Acc' },
                      { icon: Cpu, label: '24/7 Follow-ups', gain: 'Active' }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-accent-blue/10 p-6 rounded-xl border border-accent-blue/20 flex items-center gap-5 hover:bg-accent-blue/20 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                          <item.icon size={18} />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-xs text-text-primary font-bold">{item.label}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="h-1 flex-1 bg-accent-blue/10 rounded-full overflow-hidden">
                                 <motion.div 
                                    animate={{ x: isSimulating ? ['-100%', '100%'] : '-100%' }}
                                    transition={{ repeat: Infinity, duration: 1.5, delay: idx * 0.2 }}
                                    className="h-full bg-accent-blue w-1/2" 
                                  />
                              </div>
                              <span className="text-[8px] font-mono text-accent-blue">{item.gain}</span>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-accent-blue/10 flex items-center justify-between relative z-10">
                     <div className="text-left flex flex-col">
                        <span className="text-[8px] font-bold tracking-[0.4em] text-accent-blue/60 uppercase font-mono">Time Saved Per Week</span>
                        <div className="flex justify-between items-end mt-2">
                           <span className="text-2xl font-sans font-bold text-accent-blue">15+ Hrs</span>
                        </div>
                     </div>
                     <div className="flex gap-0.5 pb-1">
                        {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-3 bg-accent-blue/20" />)}
                        <div className="w-1 h-3 bg-accent-blue" />
                     </div>
                  </div>
                </motion.div>
            </div>

          </div>
        </div>

        <div className="mt-8 md:mt-10 pb-12 md:pb-16 relative z-20 flex justify-center px-4 md:px-0">
           <button className="flex items-center justify-center w-full md:w-auto gap-4 md:gap-6 px-8 md:px-10 py-3.5 md:py-4 bg-accent-blue text-white font-sans font-black text-[10px] md:text-xs tracking-widest md:tracking-[0.3em] rounded-full hover:shadow-[0_40px_100px_rgba(var(--accent-blue),0.4)] hover:scale-105 active:scale-95 transition-all duration-700 group uppercase shadow-2xl border border-white/20">
              <span className="whitespace-nowrap">Ignite Your Transformation</span>
              <Zap size={16} className="shrink-0 group-hover:translate-x-2 transition-transform" fill="currentColor" />
           </button>
        </div>

      </div>
    </section>
  );
}
