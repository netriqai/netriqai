'use client';

import { useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';
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

export default function AuditStep({
  question, value, onChange, onContinue, onBack, stepNumber, totalSteps, isFirst,
}: AuditStepProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => { headingRef.current?.focus(); }, [question.id]);

  useEffect(() => {
    if (isFirst) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onBack(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFirst, onBack]);

  const isValid = (() => {
    if (!question.required) return true;
    if (question.type === 'multi-select') return Array.isArray(value) && value.length > 0;
    if (question.type === 'text') {
      const strVal = typeof value === 'string' ? value : '';
      return strVal.trim().length >= (question.validation?.minLength ?? 0);
    }
    return typeof value === 'string' && value.length > 0;
  })();

  const handleCardSelect = useCallback((optionValue: string) => {
    if (question.type === 'multi-select') {
      const current = Array.isArray(value) ? value : [];
      onChange(current.includes(optionValue)
        ? current.filter((v) => v !== optionValue)
        : [...current, optionValue]);
    } else {
      onChange(optionValue);
    }
  }, [question.type, value, onChange]);

  const handleCardKeyDown = useCallback((e: React.KeyboardEvent, optionValue: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (question.type === 'card-select') { onChange(optionValue); setTimeout(() => onContinue(), 150); }
      else if (question.type === 'multi-select') handleCardSelect(optionValue);
    }
  }, [question.type, onChange, onContinue, handleCardSelect]);

  const textValue = typeof value === 'string' ? value : '';

  return (
    <div className="max-w-xl mx-auto py-4">
      {/* Progress */}
      <div className="mb-10 flex items-center gap-6">
        <div className="flex-1 h-1 bg-border-strong/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent-blue transition-all duration-700 ease-out" 
            style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
          />
        </div>
        <span className="text-[10px] font-bold tracking-[0.2em] text-accent-blue uppercase whitespace-nowrap">
          PHASE_0{stepNumber} / 0{totalSteps}
        </span>
      </div>

      <h3 ref={headingRef} tabIndex={-1} className="text-xl md:text-2xl text-text-primary font-sans font-bold mb-2 tracking-tight outline-none leading-tight">
        {question.title}
      </h3>
      <p className="text-text-secondary text-sm mb-6 opacity-70 leading-relaxed font-sans">{question.subtitle}</p>

      {/* Select Options */}
      {(question.type === 'card-select' || question.type === 'multi-select') && question.options && (
        <div className="flex flex-col gap-3 mb-8">
          {question.options.map((option) => {
            const isSelected = question.type === 'multi-select'
              ? Array.isArray(value) && value.includes(option.value)
              : value === option.value;

            return (
              <button
                key={option.value}
                onClick={() => { handleCardSelect(option.value); if (question.type === 'card-select') setTimeout(() => onContinue(), 250); }}
                onKeyDown={(e) => handleCardKeyDown(e, option.value)}
                className={clsx(
                  "group p-4 rounded-xl border text-left flex justify-between items-center transition-all duration-300 relative overflow-hidden",
                  isSelected 
                    ? "border-accent-blue bg-accent-blue/5 shadow-[0_0_20px_rgba(var(--accent-blue),0.1)]" 
                    : "border-border-strong/40 bg-white/5 hover:border-text-secondary/40 hover:bg-white/10"
                )}
              >
                <div className="flex items-center gap-4 relative z-10">
                   <div className={clsx(
                     "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                     isSelected ? "bg-accent-blue text-white" : "bg-surface-2 text-text-muted group-hover:bg-surface-1"
                   )}>
                      {option.icon ?? <div className="w-4 h-4 rounded-full border-2 border-current" />}
                   </div>
                   <span className={clsx("font-sans font-bold text-sm tracking-tight", isSelected ? "text-accent-blue" : "text-text-primary")}>
                    {option.label}
                   </span>
                </div>
                
                <div className={clsx(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected ? "bg-accent-blue border-accent-blue text-white scale-110" : "border-border-strong group-hover:border-text-muted"
                )}>
                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Text Input */}
      {question.type === 'text' && (
        <div className="mb-12">
          <textarea
            value={textValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className="w-full p-6 border border-border-strong/40 rounded-2xl bg-white/5 text-text-primary text-base font-sans focus:border-accent-blue outline-none resize-none transition-all focus:bg-white/10 placeholder:text-text-muted/40"
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-4">
        {!isFirst && (
          <button onClick={onBack} className="flex-1 py-4 px-8 border border-border-strong/50 rounded-full text-text-secondary font-sans font-bold text-xs uppercase tracking-widest hover:bg-white/5 hover:text-text-primary transition-all">
            BACK
          </button>
        )}
        <button
          onClick={onContinue}
          disabled={!isValid}
          className={clsx(
            "flex-[2] py-3.5 px-8 rounded-full font-sans font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl",
            isValid 
              ? "bg-accent-blue text-white hover:bg-accent-blue/90 shadow-accent-blue/20" 
              : "bg-surface-2 text-text-muted cursor-not-allowed opacity-50"
          )}
        >
          {stepNumber === totalSteps ? 'GENERATE REPORT' : 'CONTINUE'}
        </button>
      </div>
    </div>
  );
}
