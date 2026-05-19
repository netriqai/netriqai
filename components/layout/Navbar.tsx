'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';
import GlowButton from '@/components/ui/GlowButton';
import { useTheme } from '@/components/providers/ThemeProvider';

import Logo from '@/components/ui/Logo';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/services', label: 'SERVICES' },
  { href: '/case-studies', label: 'CASE STUDIES' },
  { href: '/about', label: 'ABOUT' },
  { href: '/portal', label: 'PORTAL' },
  { href: '/contact', label: 'CONTACT' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 md:px-12',
        scrolled ? 'md:py-4' : 'md:py-8'
      )}
    >
      <div className={clsx(
        'max-w-7xl mx-auto flex items-center justify-between transition-all duration-500 rounded-full px-8 py-3',
        scrolled ? 'bg-surface-1/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20' : 'bg-transparent'
      )}>

        <Link href="/" className="flex items-center gap-0 group">
          <div className="w-8 h-8 text-accent-blue transition-transform duration-300 group-hover:scale-110 -mr-1">
            <Logo />
          </div>
          <span className="font-sans font-bold text-xl md:text-2xl text-text-primary tracking-tighter transition-all">
            etriq<span className="text-accent-blue italic">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'text-[12px] font-bold uppercase tracking-[0.25em] transition-colors duration-200',
                  isActive ? 'text-accent-blue' : 'text-text-muted hover:text-text-primary'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center border border-border-strong/30 rounded-full bg-surface-1/40 backdrop-blur-sm text-text-muted hover:text-accent-blue transition-all"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {!mounted ? <Sun size={18} /> : (theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />)}
          </button>
          <GlowButton href="/contact" variant="primary" size="sm" className="rounded-full px-6">
            START AUDIT
          </GlowButton>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <button
            className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={clsx(
          'md:hidden fixed inset-x-6 top-[80px] glass-card rounded-[32px] z-50 transition-all duration-300 overflow-hidden shadow-2xl',
          mobileOpen ? 'max-h-[500px] opacity-100 p-8 border-white/10' : 'max-h-0 opacity-0 p-0 border-transparent pointer-events-none'
        )}
      >
        <div className="flex flex-col gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'text-lg font-bold uppercase tracking-widest pb-4 border-b border-border-strong/10',
                  isActive ? 'text-accent-blue' : 'text-text-primary'
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-text-muted font-bold tracking-[0.2em]">APPEARANCE</span>
            <button onClick={toggleTheme} className="text-xs font-bold text-accent-blue flex items-center gap-2">
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              {theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}
            </button>
          </div>
          <Link
            href="/contact"
            className="mt-4 bg-accent-blue text-white font-sans font-bold text-center text-sm tracking-widest py-4 rounded-full shadow-lg shadow-accent-blue/20 uppercase"
          >
            GET STARTED
          </Link>
        </div>
      </div>
    </header>
  );
}
