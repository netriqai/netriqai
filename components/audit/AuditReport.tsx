'use client';

import type { AuditResponse } from './questions';
import { Zap, ArrowRight } from 'lucide-react';

interface AuditReportProps { report: AuditResponse; }

export default function AuditReport({ report }: AuditReportProps) {
  return (
    <div className="max-w-4xl mx-auto py-8">
      
      <div className="mb-16 pb-8 border-b border-border-strong/40 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="tech-badge rounded-full mb-4 px-4 py-1.5 border-accent-blue/30 bg-accent-blue/5 text-accent-blue font-bold text-[10px] tracking-[0.2em]">
            DIAGNOSTIC SUITE // EXECUTED
          </div>
          <h3 className="text-3xl md:text-5xl font-sans font-bold text-text-primary tracking-tight">Strategy Map</h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-text-muted tracking-[0.3em] uppercase mb-1">DATA CLUSTERS</p>
          <p className="text-sm font-bold text-text-primary tracking-tight">
            {report.context.industry} • {report.context.state} • {report.context.teamSize} EMPLOYEES
          </p>
        </div>
      </div>
      
      <div className="space-y-10">
        {report.opportunities.map((opp, i) => (
          <div key={i} className="group glass-card border-white/5 rounded-2xl overflow-hidden relative shadow-2xl transition-all duration-500 hover:border-accent-blue/30">
            <div className="absolute top-0 right-0 p-6 flex flex-col items-end gap-2">
               <span className="text-[10px] font-bold tracking-[0.3em] text-accent-blue/60">PRIORITY</span>
               <span className="px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/30 text-[10px] font-bold text-accent-blue">
                 {opp.impact.toUpperCase()}
               </span>
            </div>

            <div className="p-8 md:p-12">
              <h4 className="font-sans font-bold text-text-primary text-2xl mb-6 tracking-tight group-hover:text-accent-blue transition-colors">{opp.title}</h4>
              <p className="text-text-secondary text-base leading-relaxed mb-10 opacity-70 font-sans max-w-2xl">{opp.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border-strong/20 border border-border-strong/10 rounded-2xl overflow-hidden shadow-inner translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="bg-background/20 backdrop-blur-sm p-6 flex flex-col justify-end">
                  <span className="text-[9px] font-bold text-text-muted mb-2 tracking-[0.2em] uppercase">EST SAVINGS</span>
                  <span className="text-accent-blue text-3xl font-bold font-sans tracking-tighter">{opp.savings}</span>
                </div>
                <div className="bg-background/20 backdrop-blur-sm p-6 flex flex-col justify-end">
                  <span className="text-[9px] font-bold text-text-muted mb-2 tracking-[0.2em] uppercase">TIME RETURNED</span>
                  <span className="text-text-primary text-3xl font-bold font-sans tracking-tighter">{opp.timeSaved}</span>
                </div>
                <div className="bg-background/20 backdrop-blur-sm p-6 flex flex-col justify-end">
                  <span className="text-[9px] font-bold text-text-muted mb-2 tracking-[0.2em] uppercase">DEPLOY RHYTHM</span>
                  <span className="text-text-primary text-xl font-bold font-sans tracking-tight">{opp.implementationTimeframe}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 pt-20 border-t border-border-strong/20">
        <div className="flex items-center gap-4 mb-12">
           <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue"><Zap size={20}/></div>
           <h4 className="font-sans font-bold text-text-primary text-2xl tracking-tight">Execution Roadmap</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {report.roadmap.map((step) => (
            <div key={step.phase} className="p-8 glass-card border-white/5 rounded-2xl relative group hover:border-accent-blue/20 transition-all duration-300">
              <span className="text-accent-blue text-[10px] font-bold tracking-[0.3em] mb-4 block opacity-60">PHASE {step.phase}</span>
              <p className="text-text-primary font-bold mb-3 tracking-tight font-sans">{step.title}</p>
              <p className="text-[11px] text-text-muted leading-relaxed opacity-70 font-sans">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 text-center">
        <a href="/contact" className="inline-flex items-center gap-4 px-12 py-5 bg-accent-blue text-white font-sans font-bold text-sm tracking-[0.2em] rounded-full hover:bg-accent-blue/90 hover:scale-105 transition-all shadow-xl shadow-accent-blue/30 group uppercase">
          Initiate Full Deployment
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
             <ArrowRight size={16} />
          </div>
        </a>
      </div>

    </div>
  );
}
