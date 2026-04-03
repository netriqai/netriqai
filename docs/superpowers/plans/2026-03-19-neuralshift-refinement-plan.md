# NeuralShift AI Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform NeuralShift AI from a dark glass-morphism site to a modern minimal light theme with butter-smooth scrolling, mobile-first responsiveness, and an enhanced adaptive AI audit wizard with AU-specific intelligence.

**Architecture:** Progressive refinement — globals/tokens first, then strip removed components, rewrite core UI components for light theme, rebuild the AI audit as a step-by-step wizard, and finally create session context + PRD documents. Each task builds on the previous, so execute sequentially.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 3.4, Lenis (smooth scroll), TypeAnimation, react-countup, Groq SDK (llama-3.3-70b), Cloudflare Pages edge runtime.

**Spec:** `docs/superpowers/specs/2026-03-19-neuralshift-refinement-design.md`

---

### Task 1: Create feature branch and uninstall removed packages

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Create feature branch**

```bash
git checkout -b refine/modern-minimal
```

- [ ] **Step 2: Uninstall removed dependencies**

```bash
npm uninstall @tsparticles/react @tsparticles/slim gsap vanilla-tilt @types/vanilla-tilt
```

This removes ~80KB from the client bundle: tsparticles (~45KB), gsap+ScrollTrigger (~30KB), vanilla-tilt (~5KB).

- [ ] **Step 3: Verify package.json no longer contains removed packages**

Run: `cat package.json | grep -E "tsparticles|gsap|vanilla-tilt"`
Expected: No output (packages removed)

- [ ] **Step 4: Run npm install to update lockfile**

```bash
npm install
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: remove tsparticles, gsap, vanilla-tilt dependencies"
```

---

### Task 2: Rewrite globals.css — new design tokens and light theme

**Files:**
- Rewrite: `app/globals.css`

Replace the entire file. The new CSS establishes the modern minimal light theme, removes all dark/glass/glow styles, removes `cursor: none`, removes all theme variants (mono/plasma), replaces FAQ `max-height` with `grid-template-rows`, and keeps only `fade-in-up` and `marquee` animations.

- [ ] **Step 1: Rewrite globals.css**

```css
/* Fonts loaded via next/font/google in layout.tsx — no @import needed */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ============================================
   CSS CUSTOM PROPERTIES — MODERN MINIMAL THEME
   ============================================ */
:root {
  --bg: #FAFAF9;
  --bg-dark: #0F0F0F;
  --primary: #6366F1;
  --secondary: #06B6D4;
  --accent: #16A34A;
  --card-bg: #FFFFFF;
  --card-border: #E5E5E5;
  --text-primary: #0F0F0F;
  --text-secondary: #666666;
  --text-muted: #737373;
  --font-syne: 'Syne', sans-serif;
  --font-inter: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --radius: 12px;
  --radius-lg: 16px;
  --transition: all 0.2s ease;
}

/* ============================================
   BASE STYLES
   ============================================ */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
}

body {
  background-color: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-inter);
  font-size: 16px;
  line-height: 1.6;
  overflow-x: hidden;
}

/* ============================================
   SELECTION COLOR
   ============================================ */
::selection {
  background: rgba(99, 102, 241, 0.15);
  color: #0F0F0F;
}

::-moz-selection {
  background: rgba(99, 102, 241, 0.15);
  color: #0F0F0F;
}

/* ============================================
   CUSTOM SCROLLBAR
   ============================================ */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: #F5F5F4;
}

::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--secondary);
}

* {
  scrollbar-width: thin;
  scrollbar-color: var(--primary) #F5F5F4;
}

/* ============================================
   SKIP TO MAIN CONTENT
   ============================================ */
.skip-to-main {
  position: fixed;
  top: -100px;
  left: 20px;
  z-index: 9999;
  padding: 12px 24px;
  background: var(--primary);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  transition: top 0.3s;
  text-decoration: none;
}

.skip-to-main:focus {
  top: 20px;
}

/* ============================================
   CARD
   ============================================ */
.card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  transition: var(--transition);
}

.card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* ============================================
   DARK SECTION (hero, CTAs)
   ============================================ */
.section-dark {
  background-color: var(--bg-dark);
  color: #F1F5F9;
}

.section-dark .text-muted {
  color: #A1A1AA;
}

/* ============================================
   KEYFRAMES
   ============================================ */
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* ============================================
   UTILITY CLASSES
   ============================================ */
.animate-fade-in-up {
  animation: fade-in-up 0.5s ease forwards;
}

.section-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (min-width: 768px) {
  .section-container {
    padding: 0 48px;
  }
}

.section-padding {
  padding: 80px 0;
}

@media (max-width: 768px) {
  .section-padding {
    padding: 48px 0;
  }
}

/* ============================================
   MARQUEE
   ============================================ */
.marquee-wrapper {
  overflow: hidden;
  white-space: nowrap;
  display: flex;
}

.marquee-track {
  display: inline-flex;
  white-space: nowrap;
  animation: marquee 30s linear infinite;
  gap: 48px;
  will-change: transform;
}

.marquee-track:hover {
  animation-play-state: paused;
}

/* ============================================
   FAQ ACCORDION (grid-template-rows for perf)
   ============================================ */
.faq-answer {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
}

.faq-answer.open {
  grid-template-rows: 1fr;
}

.faq-answer > div {
  overflow: hidden;
}

/* ============================================
   SCROLL REVEAL
   ============================================ */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ============================================
   FOCUS STYLES (Accessibility)
   ============================================ */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
  border-radius: 4px;
}

button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}

/* ============================================
   RESPONSIVE UTILITIES
   ============================================ */
@media (max-width: 640px) {
  .hide-mobile {
    display: none;
  }
}

@media (min-width: 641px) {
  .show-mobile-only {
    display: none;
  }
}

/* ============================================
   REDUCED MOTION
   ============================================ */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .reveal {
    opacity: 1;
    transform: none;
  }

  .marquee-track {
    animation: none;
  }
}
```

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: Build completes (there will be import errors from removed packages — those get fixed in subsequent tasks)

Note: The build may fail at this point because components still reference removed packages. That's expected — Task 3 removes those components.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: rewrite globals.css for modern minimal light theme"
```

---

### Task 3: Update tailwind.config.js for light theme

**Files:**
- Modify: `tailwind.config.js`

- [ ] **Step 1: Rewrite tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF9',
        'bg-dark': '#0F0F0F',
        primary: '#6366F1',
        secondary: '#06B6D4',
        accent: '#16A34A',
        card: '#FFFFFF',
        'text-primary': '#0F0F0F',
        'text-secondary': '#666666',
        'text-muted': '#737373',
        'border-subtle': '#E5E5E5',
        'indigo': {
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
        },
        'cyan': {
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'Syne', 'sans-serif'],
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'hero': ['56px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'section': ['40px', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'sub': ['28px', { lineHeight: '1.2' }],
        'body-lg': ['18px', { lineHeight: '1.7' }],
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease forwards',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.08)',
        'button': '0 1px 2px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Commit**

```bash
git add tailwind.config.js
git commit -m "style: update tailwind config for light theme colors and shadows"
```

---

### Task 4: Delete removed components and clean up layout

**Files:**
- Delete: `components/ui/ParticleBackground.tsx`
- Delete: `components/ui/CustomCursor.tsx`
- Delete: `components/ui/LoadingScreen.tsx`
- Delete: `components/ui/ThemeSwitcher.tsx`
- Delete: `components/ui/GlassCard.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Delete removed component files (keep GlassCard — rewrite in-place)**

```bash
rm components/ui/ParticleBackground.tsx
rm components/ui/CustomCursor.tsx
rm components/ui/LoadingScreen.tsx
rm components/ui/ThemeSwitcher.tsx
```

Note: GlassCard.tsx is NOT deleted here. It is rewritten in-place to preserve imports across 8+ files. The `tilt` and `glow` props become no-ops.

- [ ] **Step 1b: Rewrite GlassCard.tsx as clean card component**

```tsx
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
```

This preserves the component name and export so all existing imports continue to work. The `tilt` and `glow` props are accepted but ignored — they can be cleaned up when each consumer is rewritten in Tasks 11-12.

- [ ] **Step 2: Rewrite app/layout.tsx — remove deleted imports, keep structure**

```tsx
import type { Metadata, Viewport } from 'next';
import { Syne, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LenisProvider from '@/components/providers/LenisProvider';

export const runtime = 'edge';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NeuralShift AI — AI Automation Consultancy | Melbourne, Australia',
    template: '%s | NeuralShift AI',
  },
  description:
    'NeuralShift AI builds custom AI automation systems for Australian SMBs. We automate operations, sales pipelines, support teams, and back-office workflows. Starting from AUD $2,500.',
  keywords: [
    'AI automation',
    'AI consultancy',
    'Melbourne AI',
    'Australian AI agency',
    'business automation',
    'workflow automation',
    'Make.com',
    'n8n',
    'AI implementation',
    'SMB automation',
    'AI strategy',
  ],
  authors: [{ name: 'NeuralShift AI', url: 'https://neuralshift.com.au' }],
  creator: 'NeuralShift AI',
  publisher: 'NeuralShift AI',
  metadataBase: new URL('https://neuralshift.com.au'),
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://neuralshift.com.au',
    siteName: 'NeuralShift AI',
    title: 'NeuralShift AI — We Rewire Your Business With AI',
    description:
      "We don't just automate your business. We rewire it. Custom AI automation for Australian SMBs — 200+ workflows built, AUD $4.2M saved for clients.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NeuralShift AI — AI Automation Consultancy Melbourne',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeuralShift AI — AI Automation for Australian SMBs',
    description:
      "We don't just automate your business. We rewire it. 200+ workflows built. AUD $4.2M saved.",
    images: ['/og-image.png'],
    creator: '@neuralshiftai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-background text-text-primary font-inter antialiased">
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <LenisProvider>
          <Navbar />
          <main id="main-content">
            {children}
          </main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
```

Key changes: Removed `LoadingScreen`, `CustomCursor` imports and usage. No `data-theme` attribute on html. No cursor provider.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "refactor: remove ParticleBackground, CustomCursor, LoadingScreen, ThemeSwitcher, GlassCard"
```

---

### Task 5: Rewrite LenisProvider — remove GSAP, simplify config

**Files:**
- Modify: `components/providers/LenisProvider.tsx`

- [ ] **Step 1: Rewrite LenisProvider**

```tsx
'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';

interface LenisProviderProps {
  children: ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number>(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => 1 - Math.pow(1 - t, 4), // easeOutQuart
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);

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
```

Key changes: Removed all GSAP imports and ScrollTrigger integration. Uses native `requestAnimationFrame` instead of `gsap.ticker`. Simplified easing to `easeOutQuart`.

- [ ] **Step 2: Commit**

```bash
git add components/providers/LenisProvider.tsx
git commit -m "perf: simplify LenisProvider, remove GSAP ScrollTrigger dependency"
```

---

### Task 6: Rewrite GlowButton as clean Button component

**Files:**
- Rewrite: `components/ui/GlowButton.tsx` (keep filename for import compatibility, rename internally)

- [ ] **Step 1: Rewrite GlowButton.tsx**

```tsx
'use client';

import Link from 'next/link';
import clsx from 'clsx';
import type { ReactNode, MouseEventHandler } from 'react';

interface GlowButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: 'primary' | 'ghost';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  ariaLabel?: string;
  external?: boolean;
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-6 py-3.5 text-base gap-2 md:px-8 md:py-4 md:text-lg md:gap-2.5',
};

export default function GlowButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className,
  size = 'md',
  type = 'button',
  disabled = false,
  ariaLabel,
  external = false,
}: GlowButtonProps) {
  const baseClasses = clsx(
    'inline-flex items-center justify-center font-syne font-semibold rounded-xl transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    sizeClasses[size],
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className
  );

  const primaryClasses = clsx(
    baseClasses,
    'bg-primary text-white shadow-button',
    !disabled && 'hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-card-hover active:translate-y-0'
  );

  const ghostClasses = clsx(
    baseClasses,
    'text-text-primary border border-border-subtle bg-white',
    !disabled && 'hover:border-primary hover:text-primary hover:-translate-y-0.5 hover:shadow-card active:translate-y-0'
  );

  const classes = variant === 'primary' ? primaryClasses : ghostClasses;

  const content = (
    <span className="flex items-center gap-[inherit]">{children}</span>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          aria-label={ariaLabel}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
```

Key changes: Removed all gradient backgrounds, glow box-shadows, backdrop-filter, hover glow effects, and `::before` overlay pseudo-elements. Solid indigo fill for primary, white with border for ghost. Clean shadow hover states.

- [ ] **Step 2: Commit**

```bash
git add components/ui/GlowButton.tsx
git commit -m "style: rewrite GlowButton as clean solid button, remove glow effects"
```

---

### Task 7: Simplify SectionReveal component

**Files:**
- Modify: `components/ui/SectionReveal.tsx`

- [ ] **Step 1: Read current SectionReveal**

Read `components/ui/SectionReveal.tsx` to see the current implementation.

- [ ] **Step 2: Rewrite SectionReveal — pure Intersection Observer + CSS**

```tsx
'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function SectionReveal({ children, className = '', delay = 0 }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
```

Key changes: Removed direction prop (always up), simplified to minimal Intersection Observer. Uses inline styles for transition to avoid CSS class complexity. Compositor-only transforms.

- [ ] **Step 3: Commit**

```bash
git add components/ui/SectionReveal.tsx
git commit -m "perf: simplify SectionReveal to pure IntersectionObserver + CSS"
```

---

### Task 8: Rewrite Navbar for light theme

**Files:**
- Modify: `components/layout/Navbar.tsx`

- [ ] **Step 1: Rewrite Navbar**

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Zap } from 'lucide-react';
import clsx from 'clsx';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/about', label: 'About' },
  { href: '/resources', label: 'Resources' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'py-3 bg-white/90 backdrop-blur-md border-b border-border-subtle shadow-sm'
          : 'py-5 bg-transparent'
      )}
      role="banner"
    >
      <div className="section-container flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="NeuralShift AI — Home"
        >
          <div className="relative w-9 h-9 flex items-center justify-center rounded-lg overflow-hidden bg-primary">
            <span className="font-syne font-extrabold text-white text-sm tracking-tight">
              NS
            </span>
          </div>
          <span className="font-syne font-bold text-lg text-text-primary group-hover:text-primary transition-colors">
            NeuralShift
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-1"
          role="navigation"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg',
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-text-muted hover:text-text-primary'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/contact"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-syne font-semibold text-sm text-white bg-primary hover:bg-indigo-600 transition-all duration-200 hover:-translate-y-0.5 shadow-button hover:shadow-card-hover"
            aria-label="Book your free AI audit"
          >
            <Zap size={14} />
            Book Free Audit
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-gray-100 transition-all duration-200"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        id="mobile-menu"
        className={clsx(
          'md:hidden fixed inset-x-0 top-[60px] z-50 transition-all duration-300 ease-out overflow-hidden',
          mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
        aria-hidden={!mobileOpen}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="bg-white border-b border-border-subtle shadow-lg px-6 pt-4 pb-6">
          <nav className="flex flex-col gap-1 mb-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors duration-200',
                    isActive
                      ? 'bg-indigo-50 text-primary font-semibold'
                      : 'text-text-muted hover:text-text-primary hover:bg-gray-50'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  tabIndex={mobileOpen ? 0 : -1}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-syne font-semibold text-base text-white bg-primary hover:bg-indigo-600 transition-colors"
            tabIndex={mobileOpen ? 0 : -1}
            aria-label="Book your free AI audit"
          >
            <Zap size={16} />
            Book Free Audit
          </Link>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-40 top-[60px]"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
```

Key changes: Removed ThemeSwitcher import and rendering. Light theme colors (white bg, gray borders). No gradient glow on CTA. Clean hover states. Lighter mobile overlay.

- [ ] **Step 2: Commit**

```bash
git add components/layout/Navbar.tsx
git commit -m "style: rewrite Navbar for light theme, remove ThemeSwitcher"
```

---

### Task 9: Rewrite Hero section for modern minimal

**Files:**
- Modify: `components/home/Hero.tsx`

- [ ] **Step 1: Rewrite Hero.tsx**

```tsx
'use client';

import { TypeAnimation } from 'react-type-animation';
import { ArrowRight, Zap } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import GlowButton from '@/components/ui/GlowButton';

const toolLogos = ['Make.com', 'n8n', 'OpenAI', 'HubSpot', 'Anthropic', 'Zapier', 'Airtable', 'Relevance AI'];

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center pt-20 section-dark"
      aria-label="Hero section"
    >
      <div className="section-container relative z-10 text-center">
        {/* Badge */}
        <SectionReveal delay={0} className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest text-indigo-300 border border-indigo-500/20 bg-indigo-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            AI Automation Agency · Melbourne, AU
          </div>
        </SectionReveal>

        {/* Heading */}
        <SectionReveal delay={100}>
          <h1
            className="font-syne font-extrabold text-white tracking-tight mb-5"
            style={{ fontSize: 'clamp(28px, 7vw, 56px)', lineHeight: '1.1', letterSpacing: '-0.02em' }}
          >
            <span className="block">We Automate</span>
            <span className="block">
              So You Can{' '}
              <span className="text-indigo-400">Focus on Growth</span>
            </span>
          </h1>
        </SectionReveal>

        {/* TypeAnimation as subtitle */}
        <SectionReveal delay={150}>
          <div className="flex justify-center mb-6">
            <p className="text-gray-400 text-sm md:text-base font-mono">
              Now automating:{' '}
              <TypeAnimation
                sequence={[
                  'Your Operations',     2400,
                  'Your Sales Pipeline', 2400,
                  'Your Support Team',   2400,
                  'Your Onboarding',     2400,
                  'Your Back Office',    2400,
                ]}
                wrapper="span"
                speed={55}
                deletionSpeed={70}
                repeat={Infinity}
                cursor
                className="text-indigo-400 font-semibold font-syne"
              />
            </p>
          </div>
        </SectionReveal>

        {/* Subtext */}
        <SectionReveal delay={200}>
          <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            NeuralShift AI builds custom automation systems that eliminate manual work, cut costs, and scale your business — without you needing to touch a line of code. We&apos;ve saved Australian SMBs{' '}
            <span className="text-white font-semibold">AUD $4.2M</span> and counting.
          </p>
        </SectionReveal>

        {/* CTAs */}
        <SectionReveal delay={300}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <GlowButton href="/contact" variant="primary" size="lg" ariaLabel="Book your free AI audit">
              <Zap size={18} />
              Book Free AI Audit
            </GlowButton>
            <GlowButton href="/case-studies" variant="ghost" size="lg" ariaLabel="View our work and case studies" className="border-white/15 text-white hover:border-white/30 hover:text-white bg-white/5">
              See Our Work
              <ArrowRight size={18} />
            </GlowButton>
          </div>
        </SectionReveal>

        {/* Tool logos */}
        <SectionReveal delay={400}>
          <div className="text-center">
            <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mb-5">
              We build with the tools that power modern AI
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {toolLogos.map((logo) => (
                <span
                  key={logo}
                  className="font-mono text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200 tracking-wide"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
```

Key changes: Removed ParticleBackground import, ambient gradient divs, scroll indicator, scroll event listener. TypeAnimation rendered as plain subtitle text (not in pill). Dark section (`section-dark` class). Clean solid indigo text instead of gradient. No `useEffect`, no `useRef`.

- [ ] **Step 2: Commit**

```bash
git add components/home/Hero.tsx
git commit -m "style: rewrite Hero for modern minimal - remove particles, simplify"
```

---

### Task 10: Rewrite StatsBar with horizontal scroll on mobile

**Files:**
- Modify: `components/home/StatsBar.tsx`

- [ ] **Step 1: Read current StatsBar**

Read `components/home/StatsBar.tsx` to understand current structure.

- [ ] **Step 2: Rewrite StatsBar.tsx**

Rewrite to use light theme styling. On mobile (<640px): horizontal scrollable row. On desktop: 4-column grid. Replace glass-card styling with solid card + left accent border. Keep AnimatedCounter for number animations.

Key changes:
- Background: `bg-white` with subtle top/bottom borders
- Stats: solid backgrounds with left accent borders (alternating primary/secondary)
- Mobile: `flex overflow-x-auto` with `flex-shrink-0` items
- Remove any glass-card or backdrop-filter references
- Keep the AnimatedCounter component (it's lightweight)

- [ ] **Step 3: Commit**

```bash
git add components/home/StatsBar.tsx
git commit -m "style: rewrite StatsBar for light theme with horizontal mobile scroll"
```

---

### Task 11: Rewrite remaining home page sections for light theme

**Files:**
- Modify: `components/home/ProblemSection.tsx`
- Modify: `components/home/ServicesOverview.tsx`
- Modify: `components/home/CaseStudiesTeaser.tsx`
- Modify: `components/home/ProcessSection.tsx`
- Modify: `components/home/SocialProof.tsx`
- Modify: `components/home/CTABanner.tsx`
- Modify: `components/layout/Footer.tsx`

- [ ] **Step 1: Read all remaining section components**

Read each file to understand current content and structure.

- [ ] **Step 2: Rewrite ProblemSection.tsx**

Convert from dark glass-morphism to light theme. Replace `glass-card` with `card` class. Replace gradient text with solid indigo text. Use `bg-background` (light off-white). Keep content structure intact.

- [ ] **Step 3: Rewrite ServicesOverview.tsx**

Convert cards from glass-morphism to solid white cards with border and shadow hover. Replace gradient text, glow effects. Use indigo accent for "Most Popular" badge. Keep pricing and content.

- [ ] **Step 4: Rewrite CaseStudiesTeaser.tsx**

Light theme cards. Replace gradient accents with solid indigo left-borders. Keep case study content. Clean hover effects (shadow lift only).

- [ ] **Step 5: Rewrite ProcessSection.tsx**

Desktop: keep vertical timeline with indigo line. Mobile: convert to horizontal stepper (1 → 2 → 3 → 4) with 2x2 compact card grid below. Remove the `timeline-line` animated scaleY — use static visible line. Cards: white background, border, indigo step number.

- [ ] **Step 6: Rewrite SocialProof.tsx**

Light background. Clean testimonial cards (white bg, border, shadow). Keep marquee for partner logos (already CSS-only with `will-change: transform`). Remove any glow/neural-pulse effects.

- [ ] **Step 7: Rewrite CTABanner.tsx**

Dark section (`section-dark` class) for visual contrast. Clean typography — Syne heading, Inter body. Solid indigo CTA button. Remove any gradient borders or glow effects.

- [ ] **Step 8: Rewrite Footer.tsx**

Remove neural particles CSS background. Clean dark footer with solid background. Keep link structure and content. Remove glow/gradient effects from social icons.

- [ ] **Step 9: Commit**

```bash
git add components/home/ components/layout/Footer.tsx
git commit -m "style: rewrite all home sections and footer for light theme"
```

---

### Task 12: Update secondary pages for light theme

**Files:**
- Modify: `app/about/page.tsx`
- Modify: `app/services/page.tsx`
- Modify: `app/case-studies/page.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `app/resources/page.tsx`

- [ ] **Step 1: Read all page files**

Read each page file to understand current content.

- [ ] **Step 2: Update about/page.tsx**

Replace all dark theme references: `glass-card` → `card`, gradient text → solid indigo, dark backgrounds → light. Keep content (team members, values, manifesto). Use `section-dark` for hero section only.

- [ ] **Step 3: Update services/page.tsx**

Light theme cards for service tiers. Clean comparison table (white bg, borders). FAQ accordion already handled by globals.css `grid-template-rows` change — ensure FAQ sections wrap answer content in `<div>` inside `.faq-answer` for the grid transition to work.

- [ ] **Step 4: Update case-studies/page.tsx**

Light theme filter buttons and case study cards. Industry filter: active state uses indigo bg. Cards: white bg, border, shadow hover.

- [ ] **Step 5: Update contact/page.tsx**

Light theme form inputs (white bg, gray borders). Form validation styling in light context. Success state with indigo accent.

- [ ] **Step 6: Update resources/page.tsx**

Light theme blog cards and lead magnet section. Newsletter signup with light styling.

- [ ] **Step 7: Commit**

```bash
git add app/about/ app/services/ app/case-studies/ app/contact/ app/resources/
git commit -m "style: update all secondary pages for light theme"
```

---

### Task 13: Build the audit question definitions and branching logic

**Files:**
- Create: `components/audit/questions.ts`

- [ ] **Step 0: Create audit directory**

```bash
mkdir -p components/audit
```

- [ ] **Step 1: Create the questions data file**

```typescript
export interface QuestionOption {
  value: string;
  label: string;
  icon?: string;
}

export interface Question {
  id: string;
  title: string;
  subtitle: string;
  type: 'card-select' | 'text' | 'select' | 'multi-select' | 'toggle-group';
  options?: QuestionOption[];
  placeholder?: string;
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
  };
}

export const baseQuestions: Question[] = [
  {
    id: 'industry',
    title: 'What industry are you in?',
    subtitle: 'This helps us tailor insights to your specific market dynamics in Australia.',
    type: 'card-select',
    options: [
      { value: 'Retail', label: 'Retail', icon: '🏪' },
      { value: 'Healthcare', label: 'Healthcare', icon: '🏥' },
      { value: 'Construction', label: 'Construction', icon: '🏗️' },
      { value: 'Legal', label: 'Legal', icon: '⚖️' },
      { value: 'Finance', label: 'Finance', icon: '💰' },
      { value: 'Professional Services', label: 'Professional Services', icon: '💼' },
    ],
    required: true,
  },
  {
    id: 'businessDescription',
    title: 'Tell us about your business',
    subtitle: 'A brief description helps us find specific AI opportunities.',
    type: 'text',
    placeholder: 'e.g., We run a 3-location physiotherapy practice in Melbourne...',
    required: true,
    validation: { minLength: 10, maxLength: 500 },
  },
  {
    id: 'state',
    title: 'Where are you based?',
    subtitle: 'State-specific regulations and market dynamics shape our recommendations.',
    type: 'card-select',
    options: [
      { value: 'NSW', label: 'NSW' },
      { value: 'VIC', label: 'VIC' },
      { value: 'QLD', label: 'QLD' },
      { value: 'WA', label: 'WA' },
      { value: 'SA', label: 'SA' },
      { value: 'TAS', label: 'TAS' },
      { value: 'NT', label: 'NT' },
      { value: 'ACT', label: 'ACT' },
    ],
    required: true,
  },
  {
    id: 'region',
    title: 'Metro or regional?',
    subtitle: 'Regional businesses face different challenges and opportunities than metro ones.',
    type: 'card-select',
    options: [
      { value: 'metro', label: 'Metro / Capital city' },
      { value: 'regional', label: 'Regional / Rural' },
    ],
    required: true,
  },
  {
    id: 'teamSize',
    title: 'How big is your team?',
    subtitle: 'This helps us scale recommendations to your capacity.',
    type: 'card-select',
    options: [
      { value: '1-5', label: '1-5 people' },
      { value: '6-20', label: '6-20 people' },
      { value: '21-50', label: '21-50 people' },
      { value: '51-200', label: '51-200 people' },
      { value: '200+', label: '200+ people' },
    ],
    required: true,
  },
];

export const adaptiveQuestions: Question[] = [
  {
    id: 'painPoints',
    title: 'What are your biggest operational pain points?',
    subtitle: 'Select all that apply — this shapes which AI opportunities we prioritise.',
    type: 'multi-select',
    options: [
      { value: 'manual-data-entry', label: 'Manual data entry' },
      { value: 'customer-follow-up', label: 'Customer follow-up' },
      { value: 'compliance-reporting', label: 'Compliance & reporting' },
      { value: 'scheduling', label: 'Scheduling' },
      { value: 'inventory', label: 'Inventory management' },
      { value: 'invoicing', label: 'Invoicing & payments' },
      { value: 'other', label: 'Other' },
    ],
    required: true,
  },
  {
    id: 'techMaturity',
    title: 'Where is your business on the tech spectrum?',
    subtitle: 'No judgment — this helps us recommend the right starting point.',
    type: 'card-select',
    options: [
      { value: 'paper', label: 'Mostly paper & spreadsheets' },
      { value: 'some-cloud', label: 'Some cloud tools (Xero, Google Workspace, etc.)' },
      { value: 'integrated', label: 'Integrated systems (CRM, project management, etc.)' },
      { value: 'ai-curious', label: 'Already using some AI' },
    ],
    required: true,
  },
  {
    id: 'revenueGoal',
    title: 'What would success look like?',
    subtitle: 'Pick the outcome that matters most to you right now.',
    type: 'card-select',
    options: [
      { value: 'reduce-costs', label: 'Reduce costs' },
      { value: 'increase-revenue', label: 'Increase revenue' },
      { value: 'customer-experience', label: 'Improve customer experience' },
      { value: 'scale-without-hiring', label: 'Scale without hiring' },
      { value: 'compliance', label: 'Reduce compliance risk' },
    ],
    required: true,
  },
];

export const industryQuestions: Record<string, Question> = {
  Healthcare: {
    id: 'industrySpecific',
    title: 'How many patients do you see per week?',
    subtitle: 'This helps us estimate time savings and ROI for your practice.',
    type: 'card-select',
    options: [
      { value: 'under-50', label: 'Under 50' },
      { value: '50-150', label: '50-150' },
      { value: '150-500', label: '150-500' },
      { value: '500+', label: '500+' },
    ],
    required: true,
  },
  Retail: {
    id: 'industrySpecific',
    title: 'What\'s your online vs in-store revenue split?',
    subtitle: 'Different channels benefit from different AI automations.',
    type: 'card-select',
    options: [
      { value: 'mostly-instore', label: 'Mostly in-store' },
      { value: 'mixed', label: 'Roughly 50/50' },
      { value: 'mostly-online', label: 'Mostly online' },
      { value: 'online-only', label: 'Online only' },
    ],
    required: true,
  },
  Construction: {
    id: 'industrySpecific',
    title: 'How many active projects at any given time?',
    subtitle: 'Project volume determines where automation has the biggest impact.',
    type: 'card-select',
    options: [
      { value: '1-3', label: '1-3 projects' },
      { value: '4-10', label: '4-10 projects' },
      { value: '10-25', label: '10-25 projects' },
      { value: '25+', label: '25+ projects' },
    ],
    required: true,
  },
  Legal: {
    id: 'industrySpecific',
    title: 'What\'s your primary practice area?',
    subtitle: 'Different areas of law have different automation opportunities.',
    type: 'card-select',
    options: [
      { value: 'commercial', label: 'Commercial / Corporate' },
      { value: 'property', label: 'Property & Conveyancing' },
      { value: 'litigation', label: 'Litigation' },
      { value: 'family', label: 'Family Law' },
      { value: 'criminal', label: 'Criminal' },
      { value: 'other', label: 'Other' },
    ],
    required: true,
  },
  Finance: {
    id: 'industrySpecific',
    title: 'How many clients do you manage?',
    subtitle: 'Client volume drives the ROI of automation in financial services.',
    type: 'card-select',
    options: [
      { value: 'under-50', label: 'Under 50' },
      { value: '50-200', label: '50-200' },
      { value: '200-500', label: '200-500' },
      { value: '500+', label: '500+' },
    ],
    required: true,
  },
  'Professional Services': {
    id: 'industrySpecific',
    title: 'Do you use a billable hours model?',
    subtitle: 'Billing model affects which automations deliver the most ROI.',
    type: 'card-select',
    options: [
      { value: 'yes', label: 'Yes, billable hours' },
      { value: 'fixed-fee', label: 'Fixed fee / project-based' },
      { value: 'retainer', label: 'Retainer model' },
      { value: 'mixed', label: 'Mixed model' },
    ],
    required: true,
  },
};

/**
 * Determines which adaptive questions to show based on base answers.
 * Small teams (1-5) skip tech maturity (assumed low).
 * All teams get pain points and revenue goal.
 * All teams get industry-specific question.
 */
export function getAdaptiveQuestions(
  industry: string,
  teamSize: string
): Question[] {
  const questions: Question[] = [adaptiveQuestions[0]]; // pain points always

  if (teamSize !== '1-5') {
    questions.push(adaptiveQuestions[1]); // tech maturity for larger teams
  }

  questions.push(adaptiveQuestions[2]); // revenue goal always

  const industryQ = industryQuestions[industry];
  if (industryQ) {
    questions.push(industryQ);
  }

  return questions;
}
```

- [ ] **Step 2: Commit**

```bash
git add components/audit/questions.ts
git commit -m "feat: add audit question definitions with adaptive branching logic"
```

---

### Task 14: Build AuditWizard and AuditStep components

**Files:**
- Create: `components/audit/AuditWizard.tsx`
- Create: `components/audit/AuditStep.tsx`

- [ ] **Step 1: Create AuditStep.tsx**

Individual step component that renders different question types.

Key props: `question: Question`, `value: string | string[]`, `onChange: (value: string | string[]) => void`, `onContinue: () => void`, `onBack: () => void`, `stepNumber: number`, `totalSteps: number`, `isFirst: boolean`.

Implementation requirements:
- **Progress bar** at top: `<div role="progressbar" aria-valuenow={stepNumber} aria-valuemax={totalSteps}>`
- **Step counter**: "Step {n} of {total}" label
- **Heading** receives focus on mount via `useEffect` + `ref.current?.focus()` with `tabIndex={-1}` and `outline: none`
- **Question types**:
  - `card-select`: 2-column grid of selectable cards, min 48px height, selected state = indigo border + indigo-50 bg
  - `text`: textarea with character counter (`{length}/500`), min 10 chars validation
  - `multi-select`: same as card-select but multiple selections allowed, stored as `string[]`
- **Validation**: inline error below input, Continue button disabled until valid
- **Buttons**: Continue (full-width, primary) + Back (text link below, hidden on first step)
- **Transitions**: CSS `transform: translateX()` slide between steps
- **Keyboard**: Enter on card = select + advance, Escape = go back

```tsx
// Skeleton structure — implement fully
'use client';

import { useEffect, useRef } from 'react';
import type { Question } from './questions';

interface AuditStepProps {
  question: Question;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onContinue: () => void;
  onBack: () => void;
  stepNumber: number;
  totalSteps: number;
  isFirst: boolean;
}

export default function AuditStep({ question, value, onChange, onContinue, onBack, stepNumber, totalSteps, isFirst }: AuditStepProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [question.id]);

  const isValid = /* validate based on question.type and question.validation */ true;

  return (
    <div>
      {/* Progress bar */}
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
          style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
          role="progressbar"
          aria-valuenow={stepNumber}
          aria-valuemax={totalSteps}
        />
      </div>

      <div className="py-8 px-6 max-w-lg mx-auto">
        <p className="text-xs text-text-muted uppercase tracking-widest mb-2">
          Step {stepNumber} of {totalSteps}
        </p>
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl font-syne font-bold text-text-primary mb-2 outline-none"
        >
          {question.title}
        </h3>
        <p className="text-text-muted text-sm mb-6">{question.subtitle}</p>

        {/* Render question type: card-select, text, multi-select */}
        {/* ... implement each type ... */}

        <button
          onClick={onContinue}
          disabled={!isValid}
          className="w-full mt-6 py-3.5 bg-primary text-white font-syne font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors"
        >
          Continue →
        </button>
        {!isFirst && (
          <button
            onClick={onBack}
            className="w-full mt-2 py-3 text-text-muted text-sm hover:text-text-primary transition-colors"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create AuditWizard.tsx**

Wizard container managing all state and step transitions.

```tsx
'use client';

import { useState, useCallback } from 'react';
import { baseQuestions, getAdaptiveQuestions } from './questions';
import type { Question } from './questions';
import AuditStep from './AuditStep';
import AuditReport from './AuditReport';

// Response types from spec
interface Opportunity {
  title: string;
  yourRole: string;
  description: string;
  impact: 'High' | 'Medium';
  savings: string;
  timeSaved: string;
  implementationTimeframe: string;
}

interface RoadmapStep {
  phase: '1-30' | '31-60' | '61-90';
  title: string;
  description: string;
}

export interface AuditResponse {
  opportunities: Opportunity[];
  roadmap: RoadmapStep[];
  context: {
    industry: string;
    state: string;
    teamSize: string;
    businessDescription: string;
  };
  source: 'ai' | 'mock';
}

type WizardState = 'questions' | 'loading' | 'error' | 'report';

export default function AuditWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [wizardState, setWizardState] = useState<WizardState>('questions');
  const [report, setReport] = useState<AuditResponse | null>(null);
  const [submitDisabledUntil, setSubmitDisabledUntil] = useState(0);

  // Build question list: base questions first, then adaptive once we have industry + teamSize
  const allQuestions: Question[] = (() => {
    const base = [...baseQuestions]; // 5 questions (industry, businessDescription, state, region, teamSize)
    const industry = answers.industry as string;
    const teamSize = answers.teamSize as string;
    if (industry && teamSize) {
      return [...base, ...getAdaptiveQuestions(industry, teamSize)];
    }
    return base;
  })();

  const currentQuestion = allQuestions[currentStep];
  const isLastStep = currentStep === allQuestions.length - 1;

  const handleContinue = useCallback(async () => {
    if (isLastStep) {
      // Submit
      setWizardState('loading');
      setSubmitDisabledUntil(Date.now() + 5000); // rate limit: 5s cooldown

      try {
        const res = await fetch('/api/ai-demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(answers),
        });
        if (!res.ok) throw new Error('API error');
        const data = await res.json() as AuditResponse;
        setReport(data);
        setWizardState('report');
      } catch {
        setWizardState('error');
      }
    } else {
      setCurrentStep((s) => s + 1);
    }
  }, [isLastStep, answers]);

  const handleRetry = useCallback(async () => {
    if (Date.now() < submitDisabledUntil) return;
    setWizardState('loading');
    setSubmitDisabledUntil(Date.now() + 5000);

    try {
      const res = await fetch('/api/ai-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json() as AuditResponse;
      setReport(data);
      setWizardState('report');
    } catch {
      setWizardState('error');
    }
  }, [answers, submitDisabledUntil]);

  if (wizardState === 'loading') {
    return (
      <div className="card p-8 text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <div className="space-y-2" aria-live="polite">
          {['Analysing your industry...', 'Mapping AU market context...', 'Generating opportunities...'].map((text, i) => (
            <p key={text} className="text-sm text-text-muted font-mono animate-fade-in-up" style={{ animationDelay: `${i * 800}ms` }}>
              {text}
            </p>
          ))}
        </div>
      </div>
    );
  }

  if (wizardState === 'error') {
    return (
      <div className="card p-8 text-center">
        <p className="text-text-primary font-semibold mb-2">We couldn&apos;t generate your report right now.</p>
        <p className="text-text-muted text-sm mb-4">Your answers are saved — try again or contact us directly.</p>
        <button onClick={handleRetry} className="px-6 py-3 bg-primary text-white rounded-xl font-syne font-semibold hover:bg-indigo-600 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  if (wizardState === 'report' && report) {
    return <AuditReport report={report} />;
  }

  return (
    <div className="card overflow-hidden" aria-live="polite">
      <AuditStep
        question={currentQuestion}
        value={answers[currentQuestion.id] ?? (currentQuestion.type === 'multi-select' ? [] : '')}
        onChange={(val) => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }))}
        onContinue={handleContinue}
        onBack={() => setCurrentStep((s) => Math.max(0, s - 1))}
        stepNumber={currentStep + 1}
        totalSteps={allQuestions.length}
        isFirst={currentStep === 0}
      />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/audit/AuditWizard.tsx components/audit/AuditStep.tsx
git commit -m "feat: build AuditWizard and AuditStep components"
```

---

### Task 15: Build AuditReport component

**Files:**
- Create: `components/audit/AuditReport.tsx`

- [ ] **Step 1: Create AuditReport.tsx**

```tsx
'use client';

import { Sparkles } from 'lucide-react';
import GlowButton from '@/components/ui/GlowButton';
import type { AuditResponse } from './AuditWizard';

interface AuditReportProps {
  report: AuditResponse;
}

const phaseColors = {
  '1-30': { bg: 'bg-indigo-500/10', border: 'border-l-primary', label: 'text-indigo-400' },
  '31-60': { bg: 'bg-cyan-500/10', border: 'border-l-secondary', label: 'text-cyan-400' },
  '61-90': { bg: 'bg-green-500/10', border: 'border-l-green-500', label: 'text-green-400' },
};

export default function AuditReport({ report }: AuditReportProps) {
  return (
    <div>
      {/* Header */}
      <div className="border-b-2 border-primary pb-4 mb-6">
        <p className="text-xs text-primary uppercase tracking-widest font-semibold font-mono">Your AI Uplift Report</p>
        <h3 className="text-xl md:text-2xl font-syne font-bold text-text-primary mt-1">
          3 High-Impact AI Opportunities
        </h3>
        <p className="text-sm text-text-muted mt-1">
          {report.context.industry} · {report.context.state} · {report.context.teamSize} team
        </p>
      </div>

      {/* Opportunities */}
      <div className="space-y-4">
        {report.opportunities.map((opp, i) => (
          <div
            key={i}
            className="p-5 border border-border-subtle rounded-xl bg-white animate-fade-in-up"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h4 className="font-syne font-bold text-text-primary">{opp.title}</h4>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                opp.impact === 'High' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {opp.impact} Impact
              </span>
            </div>
            <p className="text-xs text-primary font-semibold mb-2">YOUR ROLE: {opp.yourRole}</p>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">{opp.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-lg font-bold text-primary">{opp.savings}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">Est. Annual Savings</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-lg font-bold text-secondary">{opp.timeSaved}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">Time Freed</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center col-span-2 md:col-span-1">
                <p className="text-lg font-bold text-text-primary">{opp.implementationTimeframe}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">Implementation</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 30/60/90 Roadmap */}
      <div className="mt-6 p-5 bg-bg-dark rounded-xl text-white">
        <h4 className="font-syne font-bold mb-4">Your 30/60/90 Day AI Roadmap</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {report.roadmap.map((step) => {
            const colors = phaseColors[step.phase];
            return (
              <div key={step.phase} className={`p-3 ${colors.bg} rounded-lg border-l-3 ${colors.border}`}>
                <p className={`text-xs font-bold ${colors.label}`}>DAYS {step.phase}</p>
                <p className="text-xs text-gray-300 mt-1">{step.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 text-center">
        <GlowButton href="/contact" variant="primary" size="lg" ariaLabel="Book your deep-dive session">
          <Sparkles size={16} />
          Book Your Deep-Dive Session
        </GlowButton>
        <p className="text-xs text-text-muted mt-2">30-minute strategy call · No obligation · We&apos;ll expand on these findings</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/audit/AuditReport.tsx
git commit -m "feat: build AuditReport component with ROI display and roadmap"
```

---

### Task 16: Rewrite AIDemoWidget to use AuditWizard

**Files:**
- Modify: `components/home/AIDemoWidget.tsx`

- [ ] **Step 1: Rewrite AIDemoWidget.tsx**

Replace the current simple form with the new AuditWizard component. Keep the section wrapper, heading, and SectionReveal structure. Replace the form content with `<AuditWizard />`.

```tsx
'use client';

import { Sparkles } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import AuditWizard from '@/components/audit/AuditWizard';

export default function AIDemoWidget() {
  return (
    <section
      className="section-padding relative"
      aria-labelledby="demo-heading"
    >
      <div className="section-container">
        <SectionReveal className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono text-primary mb-5 bg-indigo-50 border border-indigo-100">
            <Sparkles size={12} />
            Live AI Audit — No signup required
          </div>
          <h2
            id="demo-heading"
            className="font-syne font-extrabold text-text-primary mb-4"
            style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}
          >
            See AI In Action — Right Now
          </h2>
          <p className="text-text-muted text-base md:text-lg max-w-xl mx-auto">
            Answer a few questions and we&apos;ll show you your top AI automation opportunities with estimated ROI.
          </p>
        </SectionReveal>

        <SectionReveal delay={100}>
          <div className="max-w-2xl mx-auto">
            <AuditWizard />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/AIDemoWidget.tsx
git commit -m "feat: replace AIDemoWidget form with AuditWizard"
```

---

### Task 17: Rewrite API endpoint for enhanced audit

**Files:**
- Modify: `app/api/ai-demo/route.ts`

- [ ] **Step 1: Rewrite the API route**

Expand the request payload to accept all wizard fields. Rewrite the system prompt with AU-specific context, team-size-aware ROI scaling, "YOUR ROLE" framing, and 30/60/90 roadmap. Update response to match the TypeScript interface from the spec (Opportunity with `yourRole`, `savings`, `timeSaved`, `implementationTimeframe`, `impact` as union type; RoadmapStep; AuditResponse).

Update mock responses for each industry calibrated to small AU businesses (sub-$10K for small teams). Mock response structure must match the new AuditResponse interface.

Key system prompt elements:
- AU state-specific regulations (SafeWork QLD, WorkSafe VIC, AHPRA, Fair Work, ATO)
- AU tool ecosystem (Xero, MYOB, Cliniko, ServiceM8, Square AU, Deputy)
- Australian labor costs (~$30-$45/hr admin, $60-$100/hr professional)
- ROI scaled by team size (1-5: $2K-$8K, 6-20: $8K-$25K, etc.)
- "YOUR ROLE" field describing what the business owner does
- Competitive positioning ("Most AU [industry] SMBs your size...")

- [ ] **Step 2: Verify the endpoint builds**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/api/ai-demo/route.ts
git commit -m "feat: rewrite AI audit API with AU context, ROI scaling, and roadmap"
```

---

### Task 18: Full build verification and mobile testing

**Files:**
- None (testing only)

- [ ] **Step 1: Run the full build**

```bash
npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 2: Start dev server and test**

```bash
npm run dev
```

Test at these viewports in Chrome DevTools:
- 320px (smallest mobile)
- 375px (iPhone SE/13 mini)
- 414px (iPhone 14)
- 768px (iPad)
- 1024px (desktop)
- 1440px (large desktop)

Verify:
- Hero section renders correctly (dark section, no particles)
- Scroll is smooth (single Lenis system, no jank)
- Stats bar scrolls horizontally on mobile
- Process section shows horizontal stepper on mobile
- AI audit wizard steps through correctly
- All pages render with light theme
- No console errors about missing modules
- FAQ accordions expand/collapse smoothly

- [ ] **Step 3: Fix any issues found**

Address build errors, visual bugs, or mobile responsiveness issues.

- [ ] **Step 4: Commit fixes if any**

```bash
git add -A
git commit -m "fix: address build and visual issues from testing"
```

---

### Task 19: Create Session Context document

**Files:**
- Create: `docs/session-context.md`

- [ ] **Step 1: Write session-context.md**

Internal strategy document capturing:

1. **Project Overview** — NeuralShift AI is an AU-focused AI consultancy targeting SMBs. Website serves as the primary sales and lead qualification tool.

2. **Target Audience** — Australian SMBs (1-200 employees), primarily small businesses (1-50 staff). Non-technical decision makers who need to trust that AI can help without understanding the tech. Secondary: medium businesses (51-200) who want to scale operations.

3. **Market Positioning** — AU-deep, not global-wide. Competitive advantage through local intelligence (state regulations, AU tool ecosystem, AU labor cost benchmarks). The AI audit is the primary differentiator — no other AU consultancy offers real-time, personalized AI opportunity analysis.

4. **Key Design Decisions & Rationale**
   - Modern Minimal UI (light, editorial) — dark glass-morphism alienated non-technical SMB owners; light theme is more approachable and trustworthy
   - Adaptive AI Audit Wizard — 2-field form was too generic; step-by-step wizard with branching questions produces genuinely useful insights
   - AU-specific intelligence — generic global advice is what ChatGPT does for free; AU context (regulations, tools, labor costs) is the moat
   - ROI calibration by team size — small businesses need to see sub-$10K opportunities, not $100K+ enterprise figures
   - Performance-first — stripped Lenis/GSAP dual scroll conflict, removed particles/tilt/cursor for butter-smooth experience

5. **Competitive Differentiation** — AI audit as conversion tool (lead qualification + proof of capability). AU-specific context in every recommendation. "YOUR ROLE" framing showing business owner's participation.

6. **Technical Decisions** — Next.js 15 + Cloudflare Pages edge runtime. Groq SDK with llama-3.3-70b for AI responses. Lenis-only smooth scroll. CSS-only animations (no GSAP). ~80KB bundle reduction.

7. **Future Considerations** — Regional expansion (architecture supports per-geography modules), CMS integration for blog/case studies, saved audit reports with user accounts, A/B testing on audit conversion rates.

- [ ] **Step 2: Commit**

```bash
git add docs/session-context.md
git commit -m "docs: add session context document for team alignment"
```

---

### Task 20: Create PRD document

**Files:**
- Create: `docs/prd.md`

- [ ] **Step 1: Write prd.md**

Development blueprint covering:

1. **Product Overview** — NeuralShift AI website. Primary purpose: generate qualified leads through an AI-powered audit that demonstrates the consultancy's capabilities.

2. **Objectives** — Convert visitors to audit completions (>15% of homepage visitors start audit). Generate qualified leads with rich context (industry, pain points, tech maturity). Demonstrate AI capability through the audit experience itself.

3. **User Personas**
   - **Small Business Owner (Sarah)** — Runs a 8-person accounting firm in Melbourne. Skeptical about AI but curious. Needs to see concrete dollar amounts and time savings. Uses Xero, Google Workspace. Wants to know "what would this actually do for my business?"
   - **Medium Business Decision Maker (James)** — Operations manager at a 120-person construction company in Brisbane. Has budget for AI projects but needs to justify ROI to directors. Uses integrated project management systems. Wants competitive benchmarking.

4. **Feature Requirements**
   - F1: Modern minimal UI with light editorial theme
   - F2: Butter-smooth scrolling (60fps, single scroll system)
   - F3: Mobile-first responsive design (320px-1440px)
   - F4: Adaptive AI audit wizard (4 base + 2-3 branching questions)
   - F5: AU-contextualized audit report with ROI quantification
   - F6: 30/60/90 day roadmap per audit report
   - F7: "YOUR ROLE" business owner participation callouts

5. **Technical Requirements**
   - Next.js 15, React 19, Tailwind CSS 3.4
   - Edge runtime (Cloudflare Pages)
   - Groq SDK (llama-3.3-70b) with mock fallback
   - Lighthouse Performance >90 on mobile
   - FCP <1.5s, CLS <0.1, TTI <2s
   - WCAG AA compliance (contrast ratios, keyboard nav, screen reader)
   - Bundle size: <200KB (after removing ~80KB of unused libraries)

6. **Information Architecture** — Home (hero, stats, problem, services, audit, case studies, process, social proof, CTA), About, Services, Case Studies, Contact, Resources.

7. **Success Metrics** — Audit start rate, audit completion rate, contact form submissions post-audit, bounce rate, Lighthouse scores, scroll FPS.

8. **Out of Scope (v1)** — CMS, user accounts, multi-language, A/B testing, analytics, regional expansion beyond AU.

9. **Dependencies & Risks** — Groq API availability (mitigated by mock fallback), AU market data accuracy in prompts, mobile performance on older devices.

- [ ] **Step 2: Commit**

```bash
git add docs/prd.md
git commit -m "docs: add PRD as development blueprint"
```

---

### Summary

| Task | Description | Est. Complexity |
|------|-------------|-----------------|
| 1 | Create branch, uninstall packages | Simple |
| 2 | Rewrite globals.css | Medium |
| 3 | Update tailwind.config.js | Simple |
| 4 | Delete removed components, clean layout | Simple |
| 5 | Rewrite LenisProvider | Simple |
| 6 | Rewrite GlowButton | Simple |
| 7 | Simplify SectionReveal | Simple |
| 8 | Rewrite Navbar | Medium |
| 9 | Rewrite Hero | Medium |
| 10 | Rewrite StatsBar | Medium |
| 11 | Rewrite remaining home sections | Large (7 components) |
| 12 | Update secondary pages | Large (5 pages) |
| 13 | Audit question definitions | Medium |
| 14 | AuditWizard + AuditStep components | Large |
| 15 | AuditReport component | Medium |
| 16 | Rewrite AIDemoWidget | Simple |
| 17 | Rewrite API endpoint | Large |
| 18 | Build verification + mobile testing | Medium |
| 19 | Session Context document | Simple |
| 20 | PRD document | Simple |
