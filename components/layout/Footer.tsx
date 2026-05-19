'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Linkedin, Twitter, Github } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const footerLinks = {
  navigation: [
    { label: 'HOME', href: '/' },
    { label: 'SERVICES', href: '/services' },
    { label: 'CASE STUDIES', href: '/case-studies' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT', href: '/contact' },
  ],
  resources: [
    { label: 'DOCUMENTATION', href: '/resources' },
    { label: 'RESOURCES', href: '/resources' },
  ],
};

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/admin') return null;

  return (
    <footer className="bg-background border-t border-border-strong/50 py-20 px-6 md:px-12 relative overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-blue/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-24 mb-20">

          {/* Brand & Mission */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-0 mb-8 group">
              <div className="w-12 h-12 text-accent-blue transition-transform duration-300 group-hover:scale-110 -mr-2">
                <Logo />
              </div>
              <span className="font-sans font-bold text-3xl text-text-primary tracking-tighter">
                etriq<span className="text-accent-blue italic">AI</span>
              </span>
            </Link>
            <p className="text-text-secondary text-base leading-relaxed max-w-sm mb-10 opacity-70">
              Transforming Australian Small and Medium Businesses operations through high-fidelity neural automation. Engineering the industrial intelligence of tomorrow, today.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-12 h-12 rounded-full border border-border-strong/30 flex items-center justify-center text-text-muted hover:bg-accent-blue hover:text-white hover:border-accent-blue transition-all duration-300 shadow-sm"><Linkedin size={18} /></a>
              <a href="#" className="w-12 h-12 rounded-full border border-border-strong/30 flex items-center justify-center text-text-muted hover:bg-accent-blue hover:text-white hover:border-accent-blue transition-all duration-300 shadow-sm"><Twitter size={18} /></a>
              <a href="#" className="w-12 h-12 rounded-full border border-border-strong/30 flex items-center justify-center text-text-muted hover:bg-accent-blue hover:text-white hover:border-accent-blue transition-all duration-300 shadow-sm"><Github size={18} /></a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.3em] text-text-primary uppercase mb-10 group flex items-center gap-2">
              <span className="w-1 h-1 bg-accent-blue rounded-full group-hover:scale-150 transition-transform" />
              NAVIGATION
            </h4>
            <ul className="space-y-5">
              {footerLinks.navigation.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm font-bold text-text-muted hover:text-accent-blue transition-colors tracking-tight">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.3em] text-text-primary uppercase mb-10 group flex items-center gap-2">
              <span className="w-1 h-1 bg-accent-blue rounded-full group-hover:scale-150 transition-transform" />
              RESOURCES
            </h4>
            <ul className="space-y-5">
              {footerLinks.resources.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm font-bold text-text-muted hover:text-accent-blue transition-colors tracking-tight">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-border-strong/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-bold tracking-[0.1em] text-text-muted">
            &copy; {new Date().getFullYear()} NETRIQ AI. BASED IN MELBOURNE, AU.
          </div>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[10px] font-bold tracking-[0.1em] text-text-muted hover:text-text-primary transition-colors">PRIVACY POLICY</Link>
            <Link href="/terms" className="text-[10px] font-bold tracking-[0.1em] text-text-muted hover:text-text-primary transition-colors">TERMS OF SERVICE</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
