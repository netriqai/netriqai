'use client';

import clsx from 'clsx';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;   // kept for API compatibility, ignored
  glow?: boolean;   // kept for API compatibility, ignored
}

export default function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={clsx(
        'bg-white border border-border-subtle rounded-2xl transition-all duration-200',
        'hover:shadow-card-hover hover:-translate-y-0.5',
        className
      )}
    >
      {children}
    </div>
  );
}
