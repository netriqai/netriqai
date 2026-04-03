import { memo } from 'react';
import clsx from 'clsx';
import { ICONS, Variant } from './types';

interface NodeContentProps {
  variant: Variant;
  iconIndex: number;
  id: number;
  isHovered: boolean;
}

export const NodeContent = memo(function NodeContent({ variant, iconIndex, id, isHovered }: NodeContentProps) {
  if (variant === 'dot') {
    return <div className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent-blue))] shadow-[0_0_12px_rgba(var(--accent-blue),1)]" />;
  }
  if (variant === 'hud') {
    return (
      <div className={clsx("flex items-end gap-1 p-2 border rounded-lg backdrop-blur-md transition-colors", isHovered ? "border-[rgb(var(--accent-blue))] bg-[rgba(var(--accent-blue),0.4)]" : "border-white/25 bg-white/20")}>
         <div className="w-1 bg-[rgb(var(--accent-blue))] animate-pulse h-4" />
         <div className="w-1 bg-white/50 h-2" />
         <div className="w-1 bg-white/30 h-3" />
      </div>
    );
  }
  if (variant === 'label') {
    return (
      <div className={clsx("text-[8px] font-mono px-2 py-1.5 whitespace-nowrap uppercase tracking-[0.3em] shadow-2xl transition-all border rounded-lg", isHovered ? "bg-[rgb(var(--accent-blue))] text-white border-[rgb(var(--accent-blue))]" : "bg-background/90 text-text-muted border-white/10")}>
        Neural Node {id.toString().padStart(3, '0')}
      </div>
    );
  }
  if (variant === 'icon') {
    const Icon = ICONS[iconIndex % ICONS.length];
    return (
      <div className={clsx("p-2 border rounded-xl backdrop-blur-md transition-all duration-500 shadow-xl", isHovered ? "border-[rgb(var(--accent-blue))] bg-[rgb(var(--accent-blue))] scale-105" : "border-white/20 bg-white/10")}>
        <Icon size={16} className={clsx("transition-colors", isHovered ? "text-white" : "text-text-muted")} />
      </div>
    );
  }
  return null;
});
