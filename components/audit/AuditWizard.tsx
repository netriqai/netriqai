'use client';

import { useState, useCallback, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { baseQuestions, getAdaptiveQuestions } from './questions';
import type { Question, AuditResponse } from './questions';
import AuditStep from './AuditStep';
import AuditReport from './AuditReport';

type WizardState = 'questions' | 'loading' | 'error' | 'report';

const loadingLogs = [
  '[SYSTEM] >> INITIALIZING DIAGNOSTIC',
  '[SYSTEM] >> FETCHING INDUSTRY METRICS',
  '[SYSTEM] >> ANALYZING BOTTLENECK DATA',
  '[SYSTEM] >> COMPILING RETURN ON INVESTMENT PROJECTIONS',
  '[SYSTEM] >> GENERATING STRATEGY REPORT',
];

export default function AuditWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const answersRef = useRef(answers); answersRef.current = answers;
  const [wizardState, setWizardState] = useState<WizardState>('questions');
  const [report, setReport] = useState<AuditResponse | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const submitDisabledUntilRef = useRef(0);

  const allQuestions: Question[] = (() => {
    const base = [...baseQuestions];
    const ind = answers.industry as string;
    const team = answers.teamSize as string;
    return (ind && team) ? [...base, ...getAdaptiveQuestions(ind, team)] : base;
  })();

  const currentQuestion = allQuestions[currentStep];

  const submitAudit = useCallback(async () => {
    if (Date.now() < submitDisabledUntilRef.current) return;
    setWizardState('loading');
    submitDisabledUntilRef.current = Date.now() + 5000;

    const interval = setInterval(() => setLoadingStep((s) => Math.min(s + 1, loadingLogs.length - 1)), 1200);

    try {
      const res = await fetch('/api/ai-demo', { method: 'POST', body: JSON.stringify(answersRef.current) });
      clearInterval(interval);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setReport(data as AuditResponse);
      setWizardState('report');
    } catch {
      clearInterval(interval);
      setWizardState('error');
    }
  }, []);

  const handleContinue = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev === allQuestions.length - 1) { submitAudit(); return prev; }
      return prev + 1;
    });
  }, [submitAudit, allQuestions.length]);

  if (wizardState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 min-h-[320px]">
        <div className="relative w-16 h-16 mb-8">
           <div className="absolute inset-0 border-4 border-accent-blue/10 rounded-full" />
           <div className="absolute inset-0 border-4 border-accent-blue rounded-full border-t-transparent animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center font-sans font-bold text-accent-blue text-[10px]">
             {Math.round((loadingStep + 1) / loadingLogs.length * 100)}%
           </div>
        </div>
        
        <div className="max-w-md w-full glass-card border-white/5 p-6 rounded-2xl relative overflow-hidden text-center">
           <div className="absolute top-0 left-0 h-1 bg-accent-blue transition-all duration-700" style={{ width: `${((loadingStep + 1) / loadingLogs.length) * 100}%` }} />
           <div className="space-y-4">
              {loadingLogs.slice(0, loadingStep + 1).map((log, i) => (
                <div key={i} className="text-[10px] font-bold tracking-[0.2em] text-accent-blue uppercase opacity-60 animate-in fade-in slide-in-from-bottom-2">
                  {log.replace('[SYS] >> ', '')}
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  }

  if (wizardState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center p-8 glass-card border-rose-500/20 bg-rose-500/5 rounded-2xl text-center max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-6 border border-rose-500/30">
           <AlertCircle size={24} />
        </div>
        <h4 className="text-xl font-sans font-bold text-text-primary mb-4">Diagnostic Interrupted</h4>
        <p className="text-text-secondary mb-10 opacity-70 font-sans">We encountered a secure synchronization error while generating your neural strategy. Please re-initiate the sequence.</p>
        <button 
          onClick={submitAudit} 
          className="px-12 py-4 bg-rose-500 text-white font-sans font-bold text-xs tracking-widest rounded-full hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20 uppercase"
        >
          Retry Sequence
        </button>
      </div>
    );
  }

  if (wizardState === 'report' && report) return <AuditReport report={report} />;

  return (
    <div className="transition-opacity duration-500">
      <AuditStep
        question={currentQuestion}
        value={answers[currentQuestion.id] ?? (currentQuestion.type === 'multi-select' ? [] : '')}
        onChange={(val) => setAnswers(p => ({ ...p, [currentQuestion.id]: val }))}
        onContinue={handleContinue}
        onBack={() => setCurrentStep(s => Math.max(0, s - 1))}
        stepNumber={currentStep + 1}
        totalSteps={allQuestions.length}
        isFirst={currentStep === 0}
      />
    </div>
  );
}
