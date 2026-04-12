import React from 'react';
import { clsx } from 'clsx';

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className={clsx('w-full h-full text-current', className)}
    >
      <defs>
        <mask id="cutout-eye">
          <rect width="200" height="200" fill="white" />
          <circle cx="100" cy="100" r="48" fill="black" />
        </mask>
        <linearGradient id="irisGrad" x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#4BF0CD" />
          <stop offset="100%" stopColor="#14A083" />
        </linearGradient>
      </defs>

      <path 
        fill="currentColor" 
        d="M 40,20 L 80,20 L 120,100 L 160,20 L 160,180 L 120,180 L 80,100 L 40,180 Z" 
        mask="url(#cutout-eye)" 
      />
      <circle cx="100" cy="100" r="36" fill="url(#irisGrad)" />
      <circle cx="100" cy="100" r="14" fill="#162124" />
      <circle cx="107" cy="93" r="4.5" fill="#FFFFFF" />
    </svg>
  );
}
