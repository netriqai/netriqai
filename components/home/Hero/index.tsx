'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { NODE_COUNT, TUNNEL_DEPTH, VARIANTS, ICONS, NodeData } from './types';
import { TunnelNode } from './TunnelNode';
import { NodeConnector } from './NodeConnector';

function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  
  const tunnelZ = useTransform(scrollYProgress, [0, 1], [0, 2200]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const tunnelOpacity = useTransform(scrollYProgress, [0.6, 1], [1, 0]);

  // Generate stable nodes
  const nodes = useMemo(() => {
    const rawNodes = Array.from({ length: NODE_COUNT }).map((_, i) => {
      const radius = 250 + (seededRandom(i) * 650);
      const angle = seededRandom(i + 1) * Math.PI * 2;
      const z = -(seededRandom(i + 2) * TUNNEL_DEPTH);
      const orderX = Math.cos(angle) * radius;
      const orderY = Math.sin(angle) * radius;
      const chaosX = (seededRandom(i + 3) - 0.5) * 3000;
      const chaosY = (seededRandom(i + 4) - 0.5) * 3000;
      const chaosZ = 500 + (seededRandom(i + 5) * 1000);
      
      return {
        id: i,
        variant: VARIANTS[Math.floor(seededRandom(i + 6) * VARIANTS.length)],
        iconIndex: Math.floor(seededRandom(i + 7) * ICONS.length),
        chaosX, chaosY, chaosZ,
        orderX, orderY, orderZ: z,
        baseAngle: angle,
        swarmSpeed: 2 + seededRandom(i + 8) * 4,
        swarmRadius: radius
      };
    });

    return rawNodes.map((node, i) => {
      const neighbors = rawNodes
        .map((other, idx) => ({ 
          idx, 
          dist: Math.sqrt(Math.pow(node.orderX - other.orderX, 2) + Math.pow(node.orderY - other.orderY, 2) + Math.pow(node.orderZ - other.orderZ, 2)) 
        }))
        .filter(n => n.idx !== i)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 2)
        .map(n => n.idx);
      return { ...node, neighbors };
    });
  }, []);

  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);
  const [autoHoveredId, setAutoHoveredId] = useState<number | null>(null);
  
  // FIXED: Autonomous scan logic that doesn't clear on every render
  useEffect(() => {
    setMounted(true);
    setVisibleCount(NODE_COUNT); // Instantly render all nodes without causing re-render layout thrashing
    setTimeout(() => setIsOrdered(true), 100);
  }, []);

  // Dedicated Auto-Scan effect
  useEffect(() => {
    const scan = () => {
      if (hoveredNodeId === null) {
        setAutoHoveredId(Math.floor(Math.random() * nodes.length));
      }
    };
    
    const scanInterval = setInterval(scan, 4000);
    return () => clearInterval(scanInterval);
  }, [hoveredNodeId, nodes.length]);

  const activeNodeId = hoveredNodeId ?? autoHoveredId;

  return (
    <section ref={containerRef} className="relative h-[120vh] bg-transparent overflow-hidden">
      <LazyMotion features={domAnimation}>
      <div className="sticky top-0 h-screen w-full overflow-hidden [perspective:1200px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--accent-blue),0.06)_0%,transparent_60%)] pointer-events-none" />
        
        {mounted && (
          <motion.div 
            className="absolute inset-0 will-change-[transform,opacity]" 
            style={{ 
              transformStyle: 'preserve-3d',
              z: tunnelZ,
              opacity: tunnelOpacity
            }}
          >
            <motion.div
              className="absolute inset-0 will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateZ: 360, rotateY: [0, 5, -5, 0] }}
              transition={{ duration: 150, repeat: Infinity, ease: 'linear', rotateY: { duration: 20, repeat: Infinity, ease: "easeInOut" } }}
            >
              <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(var(--accent-blue),0.15)_0%,transparent_70%)] will-change-transform" style={{ transform: `translateZ(${-TUNNEL_DEPTH}px)` }} />
              
              {nodes.slice(0, visibleCount).map((node) => (
                <TunnelNode 
                  key={node.id} 
                  data={node} 
                  isOrdered={isOrdered} 
                  onHover={setHoveredNodeId} 
                  isAutoHovered={activeNodeId === node.id}
                />
              ))}

              <AnimatePresence>
                {activeNodeId !== null && nodes[activeNodeId]?.neighbors.map((neighborIdx) => (
                  <NodeConnector 
                    key={`conn-${nodes[activeNodeId].id}-${nodes[neighborIdx].id}`} 
                    start={nodes[activeNodeId]} 
                    end={nodes[neighborIdx]} 
                    opacity={hoveredNodeId !== null ? 0.4 : 0.25}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}

        {/* Messaging Layer */}
        <motion.div style={{ y: textY, opacity: textOpacity }} className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }} className="mb-8 pointer-events-auto">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-[rgba(var(--accent-blue),0.3)] bg-background/50 backdrop-blur-md shadow-[0_0_30px_rgba(var(--accent-blue),0.1)] transition-all hover:border-[rgba(var(--accent-blue),0.6)]">
                <span className="w-2 h-2 rounded-full bg-[rgb(var(--accent-blue))] animate-pulse" />
                <span className="text-[11px] font-black tracking-[0.4em] text-[rgb(var(--accent-blue))] uppercase">Premier AI Automation Agency</span>
              </div>
           </motion.div>
           
           <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }} className="font-sans font-black text-text-primary tracking-tighter leading-[0.95] mb-8 pointer-events-auto" style={{ fontSize: 'clamp(44px, 8vw, 110px)' }}>
             Rewiring Business.<br />
             <span className="text-[rgb(var(--accent-blue))]">With Intelligence.</span>
           </motion.h1>
           
           <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.4 }} className="text-text-muted text-lg md:text-xl font-sans leading-relaxed max-w-2xl mb-12">
             Enterprise-grade AI automation that handles your operations while you focus on growth — engineering every workflow with surgical precision.
           </motion.p>
           
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.6 }} className="flex flex-col sm:flex-row items-center gap-4 md:gap-5 w-full sm:w-auto px-4 md:px-0 pointer-events-auto">
              <Link href="/contact" className="flex items-center justify-center gap-3 bg-text-primary text-background font-black text-xs md:text-sm tracking-widest uppercase px-10 py-5 rounded-full hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                Transform Your Workflow
                <ArrowRight size={18} />
              </Link>
              <Link href="/case-studies" className="flex items-center justify-center gap-3 border border-border-strong text-text-primary font-black text-xs md:text-sm tracking-widest uppercase px-10 py-5 rounded-full hover:bg-surface-2 transition-all duration-300 backdrop-blur-md w-full sm:w-auto">
                See Case Studies
              </Link>
           </motion.div>
        </motion.div>
        
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
      </div>
      </LazyMotion>
    </section>
  );
}
