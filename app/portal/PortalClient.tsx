'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, Plus, Filter, Download, CreditCard, CheckCircle2, 
  ArrowRight, X, Clock, HelpCircle, ShieldCheck, MapPin, DollarSign,
  TrendingUp, Award, Layers, Sparkles
} from 'lucide-react';
import GlowButton from '@/components/ui/GlowButton';
import SectionReveal from '@/components/ui/SectionReveal';
import NeuralBackground from '@/components/ui/NeuralBackground';
import clsx from 'clsx';

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  project: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  gst: number;
  total: number;
  status: 'paid' | 'unpaid' | 'pending' | 'overdue';
}

const initialInvoices: Invoice[] = [
  {
    id: 'NTQ-2026-004',
    project: 'AI Discovery Audit & Architecture',
    date: '2026-05-10',
    dueDate: '2026-05-24',
    items: [
      { description: 'Workflow Bottleneck Mapping Session', quantity: 1, rate: 1200, amount: 1200 },
      { description: 'AI Opportunity Roadmap Document (32 pages)', quantity: 1, rate: 800, amount: 800 },
      { description: 'Technical ROI Projection Report', quantity: 1, rate: 500, amount: 500 }
    ],
    subtotal: 2500,
    gst: 250,
    total: 2750,
    status: 'paid'
  },
  {
    id: 'NTQ-2026-005',
    project: 'Done-For-You Implementation Phase 1',
    date: '2026-05-15',
    dueDate: '2026-05-29',
    items: [
      { description: 'Custom Neural Pipeline Custom Build', quantity: 1, rate: 4500, amount: 4500 },
      { description: 'API Integrations & Webhook Architecture (Shopify + Xero)', quantity: 1, rate: 2500, amount: 2500 },
      { description: 'Secure Database Synchronization Setup', quantity: 1, rate: 1000, amount: 1000 }
    ],
    subtotal: 8000,
    gst: 800,
    total: 8800,
    status: 'unpaid'
  },
  {
    id: 'NTQ-2026-006',
    project: 'Monthly AI Retainer & Support',
    date: '2026-05-01',
    dueDate: '2026-05-15',
    items: [
      { description: 'Continuous 24/7 Monitoring Retainer', quantity: 1, rate: 1000, amount: 1000 },
      { description: 'Automations Upgrades & Performance Tweaks', quantity: 1, rate: 500, amount: 500 }
    ],
    subtotal: 1500,
    gst: 150,
    total: 1650,
    status: 'overdue'
  }
];

export default function PortalClient() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'paid' | 'unpaid' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create Invoice State
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState('Custom Pipeline Automation');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemRate, setNewItemRate] = useState(1500);

  // Payment Modal State
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Stats Summary
  const stats = useMemo(() => {
    let paidTotal = 0;
    let unpaidTotal = 0;
    let overdueTotal = 0;
    
    invoices.forEach(inv => {
      if (inv.status === 'paid') paidTotal += inv.total;
      else if (inv.status === 'unpaid') unpaidTotal += inv.total;
      else if (inv.status === 'overdue') overdueTotal += inv.total;
    });

    return { paidTotal, unpaidTotal, overdueTotal };
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesFilter = activeFilter === 'all' || inv.status === activeFilter;
      const matchesSearch = 
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.project.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [invoices, activeFilter, searchQuery]);

  // Handle mock billing creation
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject || !newItemDesc) return;

    const subtotal = newItemRate;
    const gst = subtotal * 0.1;
    const total = subtotal + gst;

    const newInvoice: Invoice = {
      id: `NTQ-2026-00${invoices.length + 4}`,
      project: newProject,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        { description: newItemDesc, quantity: 1, rate: newItemRate, amount: newItemRate }
      ],
      subtotal,
      gst,
      total,
      status: 'unpaid'
    };

    setInvoices([newInvoice, ...invoices]);
    setIsCreating(false);
    setNewProject('Custom Pipeline Automation');
    setNewItemDesc('');
    setNewItemRate(1500);
  };

  // Handle mock card payment simulation
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvv) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      setTimeout(() => {
        if (payingInvoice) {
          setInvoices(prev => prev.map(inv => 
            inv.id === payingInvoice.id ? { ...inv, status: 'paid' } : inv
          ));
          // If detailed modal was open for this invoice, update it too
          if (selectedInvoice?.id === payingInvoice.id) {
            setSelectedInvoice(prev => prev ? { ...prev, status: 'paid' } : null);
          }
        }
        setPayingInvoice(null);
        setCardNumber('');
        setCardExpiry('');
        setCardCvv('');
        setPaymentSuccess(false);
      }, 1800);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pt-24 overflow-hidden relative">
      <NeuralBackground />
      <div className="absolute inset-0 tech-grid opacity-[0.06] pointer-events-none" />

      {/* Background radial soft light */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[rgba(6,148,148,0.05)] rounded-full blur-[100px] pointer-events-none" />

      <main className="section-container relative z-10 py-12">
        
        {/* Header Branding Panel */}
        <SectionReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="tech-badge rounded-full mb-4">
                CLIENT OPERATIONS INTERFACE
              </div>
              <h1 className="text-4xl md:text-6xl font-sans font-black tracking-tight text-text-primary uppercase leading-[0.95] mb-4">
                Invoice <br/>
                <span className="text-[rgb(var(--accent-blue))]">Management.</span>
              </h1>
              <p className="text-text-secondary text-base md:text-lg max-w-xl opacity-80 leading-relaxed font-sans">
                Review and settle project accounts, track deployment bills, and mock project invoicing inside our real-time sandbox panel.
              </p>
            </div>
            
            <GlowButton 
              onClick={() => setIsCreating(true)} 
              variant="primary" 
              className="rounded-full shadow-2xl shrink-0 uppercase tracking-widest text-[10px]"
            >
              <Plus size={16} /> Create Mock Invoice
            </GlowButton>
          </div>
        </SectionReveal>

        {/* Dashboard Financial Summary Cards */}
        <SectionReveal delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            {/* Paid Card */}
            <div className="bg-surface-1/40 backdrop-blur-md border border-border-strong/30 rounded-3xl p-6 relative overflow-hidden group hover:border-[rgb(var(--accent-blue))]/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(var(--accent-blue),0.02)] to-transparent pointer-events-none" />
              <p className="text-[9px] font-black text-text-muted/60 tracking-[0.3em] uppercase mb-1.5 font-mono">SETTLED BALANCES</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-sans font-black text-text-primary tracking-tighter">
                  ${stats.paidTotal.toLocaleString()}
                </span>
                <span className="text-[10px] text-text-muted font-bold font-mono">AUD</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-[rgb(var(--accent-blue))] font-black tracking-wider uppercase">
                <CheckCircle2 size={12} /> accounts perfectly aligned
              </div>
            </div>

            {/* Unpaid Card */}
            <div className="bg-surface-1/40 backdrop-blur-md border border-border-strong/30 rounded-3xl p-6 relative overflow-hidden group hover:border-[rgb(var(--accent-blue))]/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(var(--accent-blue),0.02)] to-transparent pointer-events-none" />
              <p className="text-[9px] font-black text-text-muted/60 tracking-[0.3em] uppercase mb-1.5 font-mono">PENDING BALANCE</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-sans font-black text-text-primary tracking-tighter">
                  ${stats.unpaidTotal.toLocaleString()}
                </span>
                <span className="text-[10px] text-text-muted font-bold font-mono">AUD</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-amber-500 font-black tracking-wider uppercase">
                <Clock size={12} /> awaiting simulation settlement
              </div>
            </div>

            {/* Overdue Card */}
            <div className="bg-surface-1/40 backdrop-blur-md border border-border-strong/30 rounded-3xl p-6 relative overflow-hidden group hover:border-[rgb(var(--accent-blue))]/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(var(--accent-blue),0.02)] to-transparent pointer-events-none" />
              <p className="text-[9px] font-black text-text-muted/60 tracking-[0.3em] uppercase mb-1.5 font-mono">OVERDUE BALANCE</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-sans font-black text-text-primary tracking-tighter text-rose-500">
                  ${stats.overdueTotal.toLocaleString()}
                </span>
                <span className="text-[10px] text-text-muted font-bold font-mono">AUD</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-rose-500 font-black tracking-wider uppercase">
                <ShieldCheck size={12} className="animate-pulse" /> action required inside sandbox
              </div>
            </div>

          </div>
        </SectionReveal>

        {/* Filters and List Block */}
        <SectionReveal delay={150}>
          <div className="bg-surface-1/30 backdrop-blur-xl border border-border-strong/40 rounded-[32px] overflow-hidden shadow-xl mb-12">
            
            {/* Filter bar */}
            <div className="p-6 md:p-8 border-b border-border-strong/30 flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Category tabs */}
              <div className="flex gap-2 p-1.5 bg-background/50 border border-border-strong/40 rounded-2xl w-full md:w-auto overflow-x-auto scrollbar-hide">
                {(['all', 'paid', 'unpaid', 'overdue'] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={clsx(
                      "px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                      activeFilter === filter 
                        ? "bg-[rgb(var(--accent-blue))] text-white shadow-glow-sm" 
                        : "text-text-muted hover:text-text-primary hover:bg-background/20"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Search tool */}
              <div className="relative w-full md:w-[320px]">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/60" />
                <input
                  type="text"
                  placeholder="Search project bills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background/40 border border-border-strong/30 rounded-2xl text-xs font-sans text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))]/60 transition-colors"
                />
              </div>

            </div>

            {/* Invoice items list */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-strong/20 bg-background/10">
                    <th className="py-5 px-8 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono">Invoice ID</th>
                    <th className="py-5 px-8 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono">Project Scope</th>
                    <th className="py-5 px-8 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono">Issue Date</th>
                    <th className="py-5 px-8 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono">Due Date</th>
                    <th className="py-5 px-8 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono text-right">Amount (AUD)</th>
                    <th className="py-5 px-8 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono">Status</th>
                    <th className="py-5 px-8 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono text-center">Interactive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-strong/10">
                  <AnimatePresence mode="popLayout">
                    {filteredInvoices.map((inv) => (
                      <motion.tr 
                        key={inv.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="group hover:bg-surface-1/40 transition-colors"
                      >
                        {/* ID */}
                        <td className="py-5 px-8 text-xs font-black text-text-primary font-mono group-hover:text-[rgb(var(--accent-blue))] transition-colors">
                          {inv.id}
                        </td>
                        
                        {/* Project */}
                        <td className="py-5 px-8 text-xs font-bold text-text-primary font-sans max-w-[240px] truncate">
                          {inv.project}
                        </td>

                        {/* Date */}
                        <td className="py-5 px-8 text-xs text-text-muted/80 font-mono">
                          {inv.date}
                        </td>

                        {/* Due Date */}
                        <td className="py-5 px-8 text-xs text-text-muted/80 font-mono">
                          {inv.dueDate}
                        </td>

                        {/* Total */}
                        <td className="py-5 px-8 text-xs font-black text-text-primary text-right font-mono">
                          ${inv.total.toLocaleString()}
                        </td>

                        {/* Status badge */}
                        <td className="py-5 px-8">
                          <span className={clsx(
                            "inline-flex px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider",
                            inv.status === 'paid' && "bg-[rgba(6,148,148,0.1)] text-[rgb(var(--accent-blue))] border border-[rgba(6,148,148,0.2)]",
                            inv.status === 'unpaid' && "bg-amber-500/10 text-amber-500 border border-amber-500/20",
                            inv.status === 'overdue' && "bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse"
                          )}>
                            {inv.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-8 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              className="text-[8px] font-black uppercase tracking-widest px-3 py-2 rounded-lg bg-background border border-border-strong/30 text-text-muted hover:text-text-primary hover:border-border-strong transition-colors"
                            >
                              Details
                            </button>
                            {inv.status !== 'paid' && (
                              <button
                                onClick={() => setPayingInvoice(inv)}
                                className="text-[8px] font-black uppercase tracking-widest px-3 py-2 rounded-lg bg-[rgb(var(--accent-blue))] text-white hover:bg-[rgb(var(--accent-blue-hover))] transition-colors shadow-glow-sm"
                              >
                                Settle
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  
                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs text-text-muted/60 font-sans">
                        No invoices match your active filters or searches.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </SectionReveal>

        {/* Informative Security Panel */}
        <SectionReveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            <div className="bg-surface-1/20 border border-border-strong/20 rounded-3xl p-8 flex gap-5 items-start">
              <div className="w-10 h-10 rounded-xl bg-[rgba(6,148,148,0.1)] border border-[rgba(6,148,148,0.2)] flex items-center justify-center text-[rgb(var(--accent-blue))] shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-base font-sans font-black text-text-primary uppercase tracking-tight mb-2">Automated ABN & GST Protocols</h3>
                <p className="text-text-muted text-xs leading-relaxed opacity-80 font-sans">
                  All accounts generated utilize standard Australian Tax Office rules including registered GST tracking (10% standard rate). Secure digital ledgers synchronize automatically upon sandbox simulations.
                </p>
              </div>
            </div>

            <div className="bg-surface-1/20 border border-border-strong/20 rounded-3xl p-8 flex gap-5 items-start">
              <div className="w-10 h-10 rounded-xl bg-[rgba(6,148,148,0.1)] border border-[rgba(6,148,148,0.2)] flex items-center justify-center text-[rgb(var(--accent-blue))] shrink-0">
                <HelpCircle size={20} />
              </div>
              <div>
                <h3 className="text-base font-sans font-black text-text-primary uppercase tracking-tight mb-2">Need project updates?</h3>
                <p className="text-text-muted text-xs leading-relaxed opacity-80 font-sans">
                  If there are adjustments to your scope parameters, get in touch with your dedicated engineering lead directly or submit a project query through our dashboard channels.
                </p>
              </div>
            </div>

          </div>
        </SectionReveal>

      </main>

      {/* CREATE INVOICE MODAL / DRAWER */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-surface-1 border border-border-strong/50 rounded-[28px] overflow-hidden shadow-2xl p-6 md:p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[9px] font-black tracking-[0.3em] text-[rgb(var(--accent-blue))] uppercase font-mono">SANDBOX BUILDER</span>
                  <h3 className="text-xl font-sans font-black text-text-primary uppercase tracking-tight mt-1">Create Sandbox Invoice</h3>
                </div>
                <button 
                  onClick={() => setIsCreating(false)}
                  className="w-8 h-8 rounded-full border border-border-strong/30 flex items-center justify-center hover:bg-background/20 text-text-muted hover:text-text-primary transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleCreateInvoice} className="space-y-5">
                
                {/* Project scope input */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Project Name / Scope</label>
                  <select 
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-sans"
                  >
                    <option value="AI Discovery Audit & Architecture">AI Discovery Audit & Architecture</option>
                    <option value="Done-For-You Implementation Phase 1">Done-For-You Implementation Phase 1</option>
                    <option value="Done-For-You Implementation Phase 2">Done-For-You Implementation Phase 2</option>
                    <option value="Monthly AI Retainer & Support">Monthly AI Retainer & Support</option>
                    <option value="Tailored Team Training Workshop">Tailored Team Training Workshop</option>
                  </select>
                </div>

                {/* Scope line item details */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Primary Task Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Production n8n + Make Workflow Deployment"
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-sans"
                  />
                </div>

                {/* Amount */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Rate (AUD, excl. GST)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-text-muted font-bold">$</span>
                    <input
                      type="number"
                      required
                      min={100}
                      value={newItemRate}
                      onChange={(e) => setNewItemRate(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-mono"
                    />
                  </div>
                </div>

                {/* Visual calculation details preview */}
                <div className="p-4 rounded-xl bg-background/50 border border-border-strong/20 space-y-2 text-xs">
                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal</span>
                    <span className="font-mono">${newItemRate.toLocaleString()} AUD</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>GST (10%)</span>
                    <span className="font-mono">${(newItemRate * 0.1).toLocaleString()} AUD</span>
                  </div>
                  <div className="flex justify-between font-black text-text-primary border-t border-border-strong/20 pt-2">
                    <span>Total (incl. GST)</span>
                    <span className="font-mono text-[rgb(var(--accent-blue))]">${(newItemRate * 1.1).toLocaleString()} AUD</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-5 py-3 rounded-xl border border-border-strong/30 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[rgb(var(--accent-blue))] hover:bg-[rgb(var(--accent-blue-hover))] text-white text-xs font-black uppercase tracking-widest transition-colors shadow-glow-sm"
                  >
                    Generate Invoice
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAILED INVOICE MODAL DRAWER */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInvoice(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-surface-1 border border-border-strong/50 rounded-[28px] overflow-hidden shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            >
              
              {/* Detailed Invoice Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[9px] font-black tracking-[0.35em] text-[rgb(var(--accent-blue))] uppercase font-mono">TAX INVOICE</span>
                  <h3 className="text-2xl font-sans font-black text-text-primary uppercase tracking-tight mt-1">{selectedInvoice.id}</h3>
                </div>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="w-8 h-8 rounded-full border border-border-strong/30 flex items-center justify-center hover:bg-background/20 text-text-muted hover:text-text-primary transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              {/* PDF Mock Visual Layout */}
              <div className="p-6 md:p-8 bg-background border border-border-strong/40 rounded-2xl space-y-6">
                
                {/* Branding row */}
                <div className="flex justify-between items-start gap-4 pb-6 border-b border-border-strong/20">
                  <div>
                    <span className="font-sans font-black text-lg text-text-primary tracking-tighter">
                      NETRIQ<span className="text-[rgb(var(--accent-blue))] italic">AI</span>
                    </span>
                    <p className="text-[8px] text-text-muted tracking-widest uppercase font-mono mt-1">Melbourne, Victoria, Australia</p>
                    <p className="text-[8px] text-text-muted tracking-widest uppercase font-mono">ABN: 48 641 706 767</p>
                  </div>
                  <div className="text-right">
                    <span className={clsx(
                      "inline-flex px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider",
                      selectedInvoice.status === 'paid' && "bg-[rgba(6,148,148,0.1)] text-[rgb(var(--accent-blue))] border border-[rgba(6,148,148,0.2)]",
                      selectedInvoice.status === 'unpaid' && "bg-amber-500/10 text-amber-500 border border-amber-500/20",
                      selectedInvoice.status === 'overdue' && "bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse"
                    )}>
                      {selectedInvoice.status}
                    </span>
                  </div>
                </div>

                {/* Billed to metadata */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-[9px] font-black text-text-muted/60 uppercase tracking-widest font-mono mb-1">Billed To</p>
                    <p className="font-bold text-text-primary">Netriq Enterprise Client</p>
                    <p className="text-text-muted">Collins St, Melbourne, VIC 3000</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-text-muted/60 uppercase tracking-widest font-mono mb-1">Billing Summary</p>
                    <p className="text-text-muted"><span className="font-bold text-text-primary">Issued:</span> {selectedInvoice.date}</p>
                    <p className="text-text-muted"><span className="font-bold text-text-primary">Due Date:</span> {selectedInvoice.dueDate}</p>
                  </div>
                </div>

                {/* Invoice line items table */}
                <div className="border-t border-border-strong/20 pt-4">
                  <div className="grid grid-cols-12 pb-2 text-[8px] font-black uppercase tracking-widest text-text-muted/60 font-mono">
                    <span className="col-span-6">Description</span>
                    <span className="col-span-2 text-center">QTY</span>
                    <span className="col-span-2 text-right">Rate</span>
                    <span className="col-span-2 text-right">Total</span>
                  </div>
                  <div className="divide-y divide-border-strong/10">
                    {selectedInvoice.items.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-12 py-3 text-xs font-sans text-text-primary">
                        <span className="col-span-6 font-bold">{item.description}</span>
                        <span className="col-span-2 text-center font-mono">{item.quantity}</span>
                        <span className="col-span-2 text-right font-mono">${item.rate.toLocaleString()}</span>
                        <span className="col-span-2 text-right font-mono">${item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final calculations section */}
                <div className="border-t border-border-strong/20 pt-4 flex justify-end">
                  <div className="w-[200px] space-y-2 text-xs">
                    <div className="flex justify-between text-text-muted">
                      <span>Subtotal</span>
                      <span className="font-mono">${selectedInvoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-text-muted">
                      <span>GST (10%)</span>
                      <span className="font-mono">${selectedInvoice.gst.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-black text-text-primary border-t border-border-strong/20 pt-2">
                      <span>Total (AUD)</span>
                      <span className="font-mono text-[rgb(var(--accent-blue))]">${selectedInvoice.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Actions row */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mt-6">
                
                {/* Print/Download button */}
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-border-strong/30 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary flex items-center justify-center gap-2 transition-colors"
                >
                  <Download size={14} /> Print / Save Invoice
                </button>

                {/* Payment button */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-background/50 border border-border-strong/20 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors text-center"
                  >
                    Close
                  </button>
                  {selectedInvoice.status !== 'paid' && (
                    <button
                      onClick={() => {
                        setPayingInvoice(selectedInvoice);
                      }}
                      className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[rgb(var(--accent-blue))] hover:bg-[rgb(var(--accent-blue-hover))] text-white text-xs font-black uppercase tracking-widest transition-colors shadow-glow-sm text-center"
                    >
                      Settle Balance
                    </button>
                  )}
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOCK CREDIT CARD PAYMENT DIALOG */}
      <AnimatePresence>
        {payingInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isProcessing) setPayingInvoice(null);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-surface-1 border border-border-strong/50 rounded-[28px] overflow-hidden shadow-2xl p-6 md:p-8"
            >
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[9px] font-black tracking-[0.3em] text-[rgb(var(--accent-blue))] uppercase font-mono">SECURE SETTLEMENT</span>
                  <h3 className="text-xl font-sans font-black text-text-primary uppercase tracking-tight mt-1">Settle Project Account</h3>
                </div>
                {!isProcessing && (
                  <button 
                    onClick={() => setPayingInvoice(null)}
                    className="w-8 h-8 rounded-full border border-border-strong/30 flex items-center justify-center hover:bg-background/20 text-text-muted hover:text-text-primary transition-all"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {paymentSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1, 1.2, 1], opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 rounded-full bg-[rgba(6,148,148,0.1)] border border-[rgba(6,148,148,0.4)] flex items-center justify-center text-[rgb(var(--accent-blue))] shadow-glow-sm"
                  >
                    <CheckCircle2 size={32} />
                  </motion.div>
                  <h4 className="text-lg font-sans font-black text-text-primary uppercase tracking-tight">Invoice Fully Settled</h4>
                  <p className="text-text-muted text-xs max-w-xs font-sans leading-relaxed">
                    The ledger has been synchronized. Thank you for utilizing the Netriq project simulation environment!
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePayment} className="space-y-4">
                  
                  {/* Summary amount banner */}
                  <div className="p-4 rounded-xl bg-background/50 border border-border-strong/20 flex justify-between items-center text-xs">
                    <div>
                      <p className="text-[8px] font-black text-text-muted/60 uppercase tracking-widest font-mono">Invoice</p>
                      <p className="font-bold text-text-primary">{payingInvoice.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-text-muted/60 uppercase tracking-widest font-mono">Amount Due</p>
                      <p className="font-black text-[rgb(var(--accent-blue))] font-mono text-sm">${payingInvoice.total.toLocaleString()} AUD</p>
                    </div>
                  </div>

                  {/* Card holder */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      disabled={isProcessing}
                      placeholder="e.g. Sarah Mitchell"
                      className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-sans"
                    />
                  </div>

                  {/* Card number */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Card Number</label>
                    <div className="relative">
                      <CreditCard size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/60" />
                      <input
                        type="text"
                        required
                        disabled={isProcessing}
                        placeholder="•••• •••• •••• ••••"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        className="w-full pl-10 pr-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-mono"
                      />
                    </div>
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Expiry Date</label>
                      <input
                        type="text"
                        required
                        disabled={isProcessing}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                        className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-mono text-center"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">CVV</label>
                      <input
                        type="password"
                        required
                        disabled={isProcessing}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-mono text-center"
                      />
                    </div>
                  </div>

                  {/* Alert prompt on security */}
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-2 border border-border-strong/30 text-[9px] text-text-muted font-sans">
                    <Layers size={14} className="text-[rgb(var(--accent-blue))]" />
                    <span>Secure simulated Stripe payments. Credentials are handled locally.</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 justify-end pt-3">
                    {!isProcessing && (
                      <button
                        type="button"
                        onClick={() => setPayingInvoice(null)}
                        className="px-5 py-3 rounded-xl border border-border-strong/30 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-6 py-3 rounded-xl bg-[rgb(var(--accent-blue))] hover:bg-[rgb(var(--accent-blue-hover))] text-white text-xs font-black uppercase tracking-widest transition-colors shadow-glow-sm flex-1 text-center flex items-center justify-center gap-2"
                    >
                      {isProcessing ? 'Processing Settle...' : `Settle $${payingInvoice.total.toLocaleString()}`}
                    </button>
                  </div>

                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
