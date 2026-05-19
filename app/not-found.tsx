'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center relative overflow-hidden px-6 py-32" id="main-content">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[rgb(var(--accent-blue))]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 text-center max-w-xl mx-auto">
        {/* Animated Cyber Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgb(var(--accent-blue))]/30 bg-[rgb(var(--accent-blue))]/5 text-[rgb(var(--accent-blue))] text-xs font-semibold tracking-wider uppercase mb-8 animate-pulse">
          <Compass className="w-3.5 h-3.5" />
          Error 404 // Route Not Registered
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-sans font-bold text-text-primary tracking-tight mb-6">
          Lost in <span className="text-[rgb(var(--accent-blue))]">Transit.</span>
        </h1>

        {/* Subtext */}
        <p className="text-text-muted text-lg md:text-xl leading-relaxed mb-12 opacity-80">
          The intelligence layer could not resolve the requested node. It may have been re-routed or deprecated.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[14px] bg-text-primary text-background font-semibold hover:bg-text-primary/95 hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-black/10"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[14px] bg-transparent border border-border-strong text-text-primary font-semibold hover:bg-text-primary/5 hover:-translate-y-0.5 transition-all duration-300"
          >
            <Compass className="w-4 h-4" />
            Explore Services
          </Link>
        </div>
      </div>
    </main>
  );
}
