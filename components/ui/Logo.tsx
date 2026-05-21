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
          <rect x="-100" y="-100" width="200" height="200" fill="white" />
          <circle cx="0" cy="0" r="48" fill="black" />
        </mask>

        <linearGradient id="irisGrad" x1="-100%" y1="-100%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4BF0CD" />
          <stop offset="100%" stopColor="#14A083" />
        </linearGradient>
      </defs>

      <g transform="translate(100, 100)">
        <g>
          <path 
            fill="currentColor" 
            d="M -60,-80 L -20,-80 L 20,0 L 60,-80 L 60,80 L 20,80 L -20,0 L -60,80 Z" 
            mask="url(#cutout-eye)" 
          />
          <animateTransform 
            attributeName="transform" 
            type="scale" 
            values="1.08;1;1.08" 
            dur="4s" 
            repeatCount="indefinite" 
            calcMode="spline" 
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        </g>

        <circle cx="0" cy="0" r="36" fill="url(#irisGrad)">
          <animate 
            attributeName="r" 
            values="36;39;36" 
            dur="4s" 
            repeatCount="indefinite" 
            calcMode="spline" 
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        </circle>

        <circle cx="0" cy="0" r="14" fill="#162124">
          <animate 
            attributeName="r" 
            values="14;12.5;14" 
            dur="4s" 
            repeatCount="indefinite" 
            calcMode="spline" 
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        </circle>

        <circle cx="7" cy="-7" r="4.5" fill="#FFFFFF">
          <animate 
            attributeName="cx" 
            values="7;8.5;7" 
            dur="4s" 
            repeatCount="indefinite" 
            calcMode="spline" 
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          <animate 
            attributeName="cy" 
            values="-7;-8.5;-7" 
            dur="4s" 
            repeatCount="indefinite" 
            calcMode="spline" 
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        </circle>
      </g>
    </svg>
  );
}
