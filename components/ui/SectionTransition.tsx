'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function SectionTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Animate the path to flatten or curve based on scroll
  const pathTransform = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "M0 100 Q 50 0, 100 100 L 100 0 L 0 0 Z", // Initial deep curve
      "M0 50 Q 50 0, 100 50 L 100 0 L 0 0 Z",   // Flattening
      "M0 0 Q 50 0, 100 0 L 100 0 L 0 0 Z"      // Complete flat
    ]
  );

  return (
    <div ref={containerRef} className="absolute -top-32 left-0 right-0 h-32 pointer-events-none z-30">
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none" 
        className="fill-background"
      >
        <motion.path d={pathTransform} />
      </svg>
    </div>
  );
}
