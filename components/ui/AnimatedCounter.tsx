'use client';

import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  // Support both old interface (end) and new interface (from/to)
  from?: number;
  to?: number;
  end?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function AnimatedCounter({
  from = 0,
  to,
  end,
  prefix = '',
  suffix = '',
  duration = 2,
  decimals = 0,
  className = '',
}: AnimatedCounterProps) {
  const target = to ?? end ?? 0;
  const [count, setCount] = useState(from);

  useEffect(() => {
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const easedProgress = easeOutCubic(progress);
      setCount(from + (target - from) * easedProgress);
      if (progress < 1) requestAnimationFrame(tick);
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, target, duration]);

  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.round(count).toLocaleString();

  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
