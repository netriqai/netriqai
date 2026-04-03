'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show when scrolled past 500px
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined' && (window as any).lenis) {
      // Use the Lenis engine natively rather than causing a DOM conflict
      (window as any).lenis.scrollTo(0, { duration: 1.5, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] p-3 md:p-4 bg-accent-blue hover:bg-accent-blue/90 
                     border border-white/20 backdrop-blur-xl rounded-full text-white shadow-2xl 
                     group transition-all duration-300 flex items-center justify-center
                     hover:shadow-[0_10px_30px_rgba(var(--accent-blue),0.4)] hover:scale-105 active:scale-95"
          aria-label="Scroll to top"
        >
          <ArrowUp size={22} className="group-hover:-translate-y-1 transition-all duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
