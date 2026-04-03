'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

interface LenisProviderProps {
  children: ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number>(0);
  const pathname = usePathname();

  // Disable browser scroll restoration — Lenis manages scroll
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Scroll to top on every route change
  // Mobile browsers restore scroll after layout paint, so we need multiple attempts
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0; // Safari fallback
      lenisRef.current?.scrollTo(0, { immediate: true });
    };

    // Immediate
    scrollToTop();

    // After next frame (covers most desktop browsers)
    const raf1 = requestAnimationFrame(scrollToTop);

    // After layout paint (covers mobile Chrome/Samsung)
    const t1 = setTimeout(scrollToTop, 0);

    // After mobile browser scroll restoration (covers iOS Safari)
    const t2 = setTimeout(scrollToTop, 100);

    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 0.8, // Faster, more responsive scroll
      lerp: 0.1,    // Tighter interpolation
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      autoResize: true,
    });

    lenisRef.current = lenis;
    lenis.scrollTo(0, { immediate: true });
    
    // Expose globally to fix scroll jumping hooks 
    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);

    // Respect prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      lenis.destroy();
      lenisRef.current = null;
      cancelAnimationFrame(rafIdRef.current);
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(rafIdRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
