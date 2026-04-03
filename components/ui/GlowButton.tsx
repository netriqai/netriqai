'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { MouseEventHandler, MouseEvent, ReactNode } from 'react';
import { triggerHaptic } from '@/lib/haptic';

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
  sm: 'px-4 py-2 text-xs gap-1.5',
  md: 'px-6 py-3 text-sm gap-2',
  lg: 'px-8 py-4 text-sm gap-2.5',
};

export default function GlowButton({
  children, href, onClick, variant = 'primary', className, size = 'md', type = 'button', disabled = false, ariaLabel, external = false,
}: GlowButtonProps) {
  const baseClasses = clsx(
    'inline-flex items-center justify-center font-sans font-bold transition-all duration-300 rounded-full',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-blue',
    sizeClasses[size],
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className
  );

  const primaryClasses = clsx(baseClasses, 'bg-accent-blue text-white hover:bg-accent-blue/90 shadow-lg shadow-accent-blue/10 hover:shadow-accent-blue/20 hover:scale-[1.02]');
  const ghostClasses = clsx(baseClasses, 'bg-transparent text-text-primary hover:bg-surface-2 transition-all');

  const content = <span className="flex items-center gap-[inherit] tracking-[0.15em] uppercase text-[11px]">{children}</span>;
  const classes = variant === 'primary' ? primaryClasses : ghostClasses;

  const handleOnClick = (e: MouseEvent<HTMLButtonElement>) => {
    triggerHaptic('light');
    if (onClick) onClick(e);
  };

  const handleLinkClick = () => {
    triggerHaptic('light');
  };

  if (href) {
    if (external) {
      return <a href={href} onClick={handleLinkClick} target="_blank" rel="noopener noreferrer" className={classes} aria-label={ariaLabel}>{content}</a>;
    }
    return <Link href={href} onClick={handleLinkClick} className={classes} aria-label={ariaLabel}>{content}</Link>;
  }

  return <button type={type} onClick={handleOnClick} disabled={disabled} className={classes} aria-label={ariaLabel}>{content}</button>;
}
