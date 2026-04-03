'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Chapters that reveal as user scrolls over the pinned image
const chapters = [
  {
    eyebrow: 'PREMIER AI AUTOMATION AGENCY',
    heading: 'Rewiring Business\nWith Intelligence.',
    sub: 'NeuralShift builds enterprise-grade AI automation that handles your operations while you focus on growth.',
    cta: { label: 'Transform Your Workflow', href: '/contact' },
  },
  {
    eyebrow: 'NEURAL ARCHITECTURE',
    heading: 'Your Operations.\nRebuilt From\nThe Inside Out.',
    sub: 'We map your operational DNA into a cohesive neural workflow — engineering onboarding, pipelines, and back-office processes with surgical precision.',
    cta: null,
  },
  {
    eyebrow: 'MEASURABLE IMPACT',
    heading: '3× Growth.\nZero Extra\nHeadcount.',
    sub: 'Businesses using neural automation grow 3× faster. Every lead, invoice, and workflow handled — autonomously.',
    cta: { label: 'See Case Studies', href: '/case-studies' },
  },
];

const toolLogos = ['Make.com', 'n8n', 'OpenAI', 'Anthropic', 'Zapier', 'Relevance AI'];

export default function HeroScrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });

  // ── Image parallax ──
  const imageScale = useTransform(smoothProgress, [0, 1], [1, 1.12]);
  const imageY = useTransform(smoothProgress, [0, 1], ['0%', '-8%']);

  // ── Overlay darkens as we progress ──
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.2, 0.7, 1], [0.3, 0.55, 0.65, 0.85]);

  // ── Chapter opacities & vertical position — all declared at top level ──
  const ch0Opacity = useTransform(scrollYProgress, [0, 0.05, 0.22, 0.30], [0, 1, 1, 0]);
  const ch0Y       = useTransform(scrollYProgress, [0, 0.05, 0.22, 0.30], [30, 0, 0, -30]);

  const ch1Opacity = useTransform(scrollYProgress, [0.30, 0.38, 0.55, 0.62], [0, 1, 1, 0]);
  const ch1Y       = useTransform(scrollYProgress, [0.30, 0.38, 0.55, 0.62], [30, 0, 0, -30]);

  const ch2Opacity = useTransform(scrollYProgress, [0.62, 0.70, 0.88, 0.95], [0, 1, 1, 0]);
  const ch2Y       = useTransform(scrollYProgress, [0.62, 0.70, 0.88, 0.95], [30, 0, 0, -30]);

  const chapterOpacities = [ch0Opacity, ch1Opacity, ch2Opacity];
  const chapterYs        = [ch0Y,      ch1Y,       ch2Y];

  // ── Logos ──
  const logosOpacity = useTransform(scrollYProgress, [0.88, 0.95], [0, 1]);

  // ── Floating data nodes — parallax each independently ──
  const node1Y = useTransform(smoothProgress, [0, 1], [0, -40]);
  const node2Y = useTransform(smoothProgress, [0, 1], [0, 30]);
  const node3Y = useTransform(smoothProgress, [0, 1], [0, -20]);

  // ── Progress dots — declared at top level (no hooks inside .map) ──
  const dot0Opacity = useTransform(scrollYProgress, [0, 0.05, 0.28, 0.33], [0.25, 1, 1, 0.25]);
  const dot1Opacity = useTransform(scrollYProgress, [0.30, 0.35, 0.60, 0.65], [0.25, 1, 1, 0.25]);
  const dot2Opacity = useTransform(scrollYProgress, [0.62, 0.67, 0.92, 0.97], [0.25, 1, 1, 0.25]);
  const dotOpacities = [dot0Opacity, dot1Opacity, dot2Opacity];

  return (
    <div ref={containerRef} className="relative" style={{ height: '400vh' }}>

      {/* Sticky canvas: full viewport height, pins while container scrolls */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ── BASE IMAGE (parallax zoom) ── */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ scale: imageScale, y: imageY }}
        >
          <Image
            src="/images/neural-profile.png"
            alt="Neural Intelligence — NeuralShift AI"
            fill
            priority
            className="object-cover object-center"
          />
        </motion.div>

        {/* ── DARK OVERLAY ── */}
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />

        {/* ── BOTTOM FADE into next section ── */}
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none z-10" />

        {/* ── FLOATING DATA NODES ── */}
        {/* Node 1 top-right */}
        <motion.div
          style={{ y: node1Y }}
          className="absolute top-[16%] right-[8%] z-20 hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <div className="backdrop-blur-md bg-white/20 border border-white/10 rounded-xl px-6 py-5 shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-[rgb(var(--accent-blue))] animate-ping" />
              <span className="text-[9px] font-black tracking-[0.3em] text-white/60 uppercase">Cognitive Synchronisation</span>
            </div>
            <p className="text-white text-xl font-black leading-none">Active</p>
          </div>
          {/* animated dashed connector */}
          <svg className="absolute -bottom-8 left-1/2 -translate-x-1/2" width="2" height="32" overflow="visible">
            <motion.line
              x1="1" y1="0" x2="1" y2="32"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              strokeDasharray="4 4"
              animate={{ strokeDashoffset: [0, -16] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          </svg>
        </motion.div>

        {/* Node 2 mid-left */}
        <motion.div
          style={{ y: node2Y }}
          className="absolute top-[42%] left-[6%] z-20 hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
        >
          <div className="backdrop-blur-md bg-white/20 border border-white/10 rounded-xl px-6 py-5 shadow-2xl">
            <p className="text-[9px] font-bold text-white/50 tracking-[0.3em] uppercase mb-2">Neural Latency</p>
            <p className="text-3xl font-black text-white leading-none">
              0.8<span className="text-[rgb(var(--accent-blue))]">ms</span>
            </p>
          </div>
        </motion.div>

        {/* Node 3 lower-right */}
        <motion.div
          style={{ y: node3Y }}
          className="absolute bottom-[28%] right-[6%] z-20 hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-6 py-5 shadow-2xl">
            <p className="text-[9px] font-bold text-white/50 tracking-[0.3em] uppercase mb-2">Processes Automated</p>
            <p className="text-3xl font-black text-white leading-none">
              1,240<span className="text-[rgb(var(--accent-blue))]">+</span>
            </p>
          </div>
        </motion.div>

        {/* ── SCROLL CHAPTERS ── */}
        {chapters.map((chapter, i) => (
          <motion.div
            key={i}
            style={{ opacity: chapterOpacities[i], y: chapterYs[i] }}
            className="absolute inset-0 flex flex-col items-start justify-end z-10 pointer-events-none"
          >
            <div className="w-full max-w-7xl mx-auto px-8 md:px-16 pb-32 md:pb-40">
              <p className="text-[10px] font-black tracking-[0.35em] text-white/40 uppercase mb-6">
                {chapter.eyebrow}
              </p>

              <h1
                className="font-sans font-black text-white tracking-tight leading-[0.92] mb-8 whitespace-pre-line"
                style={{ fontSize: 'clamp(44px, 7vw, 112px)' }}
              >
                {chapter.heading}
              </h1>

              <p className="text-white/60 text-lg md:text-xl font-sans leading-relaxed max-w-2xl mb-10">
                {chapter.sub}
              </p>

              {chapter.cta && (
                <div className="pointer-events-auto">
                  <Link
                    href={chapter.cta.href}
                    className="flex w-fit mx-auto md:mx-0 items-center gap-3 bg-[rgb(var(--accent-blue))] text-white font-sans font-black text-xs md:text-sm tracking-widest uppercase px-8 md:px-10 py-4 md:py-5 rounded-full hover:brightness-110 transition-all duration-300 shadow-2xl"
                  >
                    <span className="whitespace-nowrap">{chapter.cta.label}</span>
                    <ArrowRight size={18} className="shrink-0" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* ── TOOL LOGOS (appear at end) ── */}
        <motion.div
          style={{ opacity: logosOpacity }}
          className="absolute bottom-8 inset-x-0 z-20 max-w-7xl mx-auto px-8 md:px-16"
        >
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
            <span className="text-[9px] font-black tracking-[0.35em] text-white/25 uppercase">Trusted Stack</span>
            {toolLogos.map((logo) => (
              <span key={logo} className="text-xs font-black tracking-wider text-white/25 uppercase">{logo}</span>
            ))}
          </div>
        </motion.div>

        {/* ── CHAPTER PROGRESS DOTS (right edge) ── */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-4 items-center">
          {dotOpacities.map((dotOpacity, i) => (
            <motion.div
              key={i}
              style={{ opacity: dotOpacity }}
              className="w-1.5 h-1.5 rounded-full bg-white"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
