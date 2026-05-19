'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, Plus, Filter, Download, CreditCard, CheckCircle2, 
  ArrowRight, X, Clock, HelpCircle, ShieldCheck, MapPin, DollarSign,
  TrendingUp, Award, Layers, Sparkles, KeyRound, Lock, LogOut, Check,
  Users, UserPlus, Building, Mail, FileCheck2, Calendar, Trash2, Edit3,
  RefreshCw, CheckSquare, Square, AlertTriangle, Eye
} from 'lucide-react';
import GlowButton from '@/components/ui/GlowButton';
import SectionReveal from '@/components/ui/SectionReveal';
import NeuralBackground from '@/components/ui/NeuralBackground';
import clsx from 'clsx';
import { generateInvoicePDF } from '@/lib/pdfUtils';
import Logo from '@/components/ui/Logo';

interface Customer {
  id: string;
  name: string;
  email: string;
  abn: string;
  address: string;
  phone: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  customerId: string;
  project: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  gst: number;
  total: number;
  status: 'paid' | 'unpaid' | 'pending' | 'overdue';
  customer?: Customer;
}

export default function AdminClient() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState('netriqai@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'invoices' | 'customers'>('customers');

  // DB State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'paid' | 'unpaid' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selection States for Bulk Actions
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  // Create Invoice Modal State
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [invoiceItemDesc, setInvoiceItemDesc] = useState('');
  const [invoiceItemRate, setInvoiceItemRate] = useState(1500);
  const [invoiceGstIncluded, setInvoiceGstIncluded] = useState(false);

  // Edit Invoice Modal State
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [editInvoiceProject, setEditInvoiceProject] = useState('');
  const [editInvoiceDate, setEditInvoiceDate] = useState('');
  const [editInvoiceDueDate, setEditInvoiceDueDate] = useState('');
  const [editInvoiceStatus, setEditInvoiceStatus] = useState<'paid' | 'unpaid' | 'pending' | 'overdue'>('unpaid');
  const [editInvoiceItemDesc, setEditInvoiceItemDesc] = useState('');
  const [editInvoiceItemRate, setEditInvoiceItemRate] = useState(1500);

  // Create Customer Modal State
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustAbn, setNewCustAbn] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  // Edit Customer Modal State
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editCustName, setEditCustName] = useState('');
  const [editCustEmail, setEditCustEmail] = useState('');
  const [editCustAbn, setEditCustAbn] = useState('');
  const [editCustAddress, setEditCustAddress] = useState('');
  const [editCustPhone, setEditCustPhone] = useState('');

  // Payment Modal State
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check auth on load
  useEffect(() => {
    const isAuth = localStorage.getItem('netriq_admin_auth') === 'true';
    setIsAdminAuthenticated(isAuth);
  }, []);

  // Fetch Database Data from API with Bearer Token
  const fetchDbData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('netriq_admin_token') || '';
      const res = await fetch('/api/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.status === 401) {
        handleLockPanel();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers || []);
        setInvoices(data.invoices || []);
      }
    } catch (err) {
      console.error('Error fetching admin db state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchDbData();
    }
  }, [isAdminAuthenticated]);

  // Set default customer selected project
  useEffect(() => {
    if (selectedCustomerId) {
      setSelectedProject('Custom Project Scope');
    }
  }, [selectedCustomerId]);

  // Handle Supabase Authentication Submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) return;

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword })
      });
      const data = await res.json();
      
      if (data.success) {
        setAuthSuccess(true);
        setAuthError(false);
        // Resolve the correct token — explicit token field wins, then sandbox flag, then Supabase session
        const resolvedToken = data.token || (data.localSandbox ? 'localSandbox' : data.session?.access_token) || 'localSandbox';
        setTimeout(() => {
          localStorage.setItem('netriq_admin_auth', 'true');
          localStorage.setItem('netriq_admin_token', resolvedToken);
          setIsAdminAuthenticated(true);
          setAuthSuccess(false);
          setAdminPassword('');
        }, 1000);
      } else {
        setAuthErrorMessage(data.error || 'Incorrect email credentials.');
        setAuthError(true);
        setTimeout(() => setAuthError(false), 3000);
      }
    } catch (err) {
      setAuthErrorMessage('Failed to connect to authentication backend.');
      setAuthError(true);
      setTimeout(() => setAuthError(false), 3000);
    }
  };


  // Sign out / Lock panel
  const handleLockPanel = () => {
    localStorage.removeItem('netriq_admin_auth');
    localStorage.removeItem('netriq_admin_token');
    setIsAdminAuthenticated(false);
    setSelectedInvoiceIds([]);
    setSelectedCustomerIds([]);
    setIsCreatingCustomer(false);
    setIsCreatingInvoice(false);
    setEditingCustomer(null);
    setEditingInvoice(null);
    setPayingInvoice(null);
  };

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
      const customerName = inv.customer?.name || '';
      const matchesSearch = 
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [invoices, activeFilter, searchQuery]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(cust => {
      return cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             cust.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
             cust.abn.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [customers, searchQuery]);

  // Handle manual database seeding
  const handleSeedDatabase = async () => {
    if (!window.confirm('This will wipe all active invoices & customers and seed high-fidelity demo records. Proceed?')) return;
    try {
      setSeeding(true);
      const token = localStorage.getItem('netriq_admin_token') || '';
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'seed_database' })
      });
      const data = await res.json();
      if (data.success) {
        fetchDbData();
      }
    } catch (err) {
      console.error('Failed to seed database:', err);
    } finally {
      setSeeding(false);
    }
  };

  // --- CUSTOMER CRUD ACTION HANDLERS ---

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustEmail) return;

    try {
      const token = localStorage.getItem('netriq_admin_token') || '';
      
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'create_customer',
          name: newCustName,
          email: newCustEmail,
          abn: newCustAbn,
          address: newCustAddress,
          phone: newCustPhone
        })
      });
      
      if (res.status === 401) {
        handleLockPanel();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setIsCreatingCustomer(false);
        setNewCustName('');
        setNewCustEmail('');
        setNewCustAbn('');
        setNewCustAddress('');
        setNewCustPhone('');
        fetchDbData();
      }
    } catch (err) {
      console.error('Failed to create customer:', err);
    }
  };

  const handleOpenEditCustomer = (cust: Customer) => {
    setEditingCustomer(cust);
    setEditCustName(cust.name);
    setEditCustEmail(cust.email);
    setEditCustAbn(cust.abn);
    setEditCustAddress(cust.address);
    setEditCustPhone(cust.phone || '');
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer || !editCustName || !editCustEmail) return;

    try {
      const token = localStorage.getItem('netriq_admin_token') || '';

      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'update_customer',
          id: editingCustomer.id,
          name: editCustName,
          email: editCustEmail,
          abn: editCustAbn,
          address: editCustAddress,
          phone: editCustPhone
        })
      });

      if (res.status === 401) {
        handleLockPanel();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setEditingCustomer(null);
        fetchDbData();
      }
    } catch (err) {
      console.error('Failed to update customer:', err);
    }
  };

  const handleDeleteCustomer = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? Deleting this customer will also permanently delete all invoices associated with them.`)) return;

    try {
      const token = localStorage.getItem('netriq_admin_token') || '';
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'delete_customer',
          id
        })
      });

      if (res.status === 401) {
        handleLockPanel();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setSelectedCustomerIds(prev => prev.filter(cId => cId !== id));
        fetchDbData();
      }
    } catch (err) {
      console.error('Failed to delete customer:', err);
    }
  };

  // --- INVOICE CRUD ACTION HANDLERS ---

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !selectedProject || !invoiceItemDesc) return;

    try {
      const token = localStorage.getItem('netriq_admin_token') || '';
      const items = [{
        description: invoiceItemDesc,
        quantity: 1,
        rate: invoiceItemRate,
        amount: invoiceItemRate
      }];

      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'create_invoice',
          customerId: selectedCustomerId,
          project: selectedProject,
          items,
          status: 'unpaid',
          gstIncluded: invoiceGstIncluded
        })
      });

      if (res.status === 401) {
        handleLockPanel();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setIsCreatingInvoice(false);
        setInvoiceItemDesc('');
        setInvoiceItemRate(1500);
        setInvoiceGstIncluded(false);
        fetchDbData();
      }
    } catch (err) {
      console.error('Failed to create invoice:', err);
    }
  };

  const handleOpenEditInvoice = (inv: Invoice) => {
    setEditingInvoice(inv);
    setEditInvoiceProject(inv.project);
    setEditInvoiceDate(inv.date);
    setEditInvoiceDueDate(inv.dueDate);
    setEditInvoiceStatus(inv.status);
    if (inv.items.length > 0) {
      setEditInvoiceItemDesc(inv.items[0].description);
      setEditInvoiceItemRate(inv.items[0].rate);
    } else {
      setEditInvoiceItemDesc('');
      setEditInvoiceItemRate(1500);
    }
  };

  const handleUpdateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;

    try {
      const token = localStorage.getItem('netriq_admin_token') || '';
      const items = [{
        description: editInvoiceItemDesc || 'Technical Project Deliverable',
        quantity: 1,
        rate: editInvoiceItemRate,
        amount: editInvoiceItemRate
      }];

      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'update_invoice',
          id: editingInvoice.id,
          project: editInvoiceProject,
          date: editInvoiceDate,
          dueDate: editInvoiceDueDate,
          status: editInvoiceStatus,
          items
        })
      });

      if (res.status === 401) {
        handleLockPanel();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setEditingInvoice(null);
        fetchDbData();
        if (selectedInvoice?.id === editingInvoice.id) {
          // Sync detail view if active
          setSelectedInvoice(data.invoice);
        }
      }
    } catch (err) {
      console.error('Failed to update invoice:', err);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete Invoice ${id}?`)) return;

    try {
      const token = localStorage.getItem('netriq_admin_token') || '';
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'delete_invoice',
          id
        })
      });

      if (res.status === 401) {
        handleLockPanel();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setSelectedInvoiceIds(prev => prev.filter(invId => invId !== id));
        if (selectedInvoice?.id === id) {
          setSelectedInvoice(null);
        }
        fetchDbData();
      }
    } catch (err) {
      console.error('Failed to delete invoice:', err);
    }
  };

  // --- BULK OPERATIONS ACTION HANDLERS ---

  const handleBulkDeleteInvoices = async () => {
    if (selectedInvoiceIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedInvoiceIds.length} selected invoices?`)) return;

    try {
      const token = localStorage.getItem('netriq_admin_token') || '';
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'bulk_delete_invoices',
          ids: selectedInvoiceIds
        })
      });

      if (res.status === 401) {
        handleLockPanel();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setSelectedInvoiceIds([]);
        fetchDbData();
      }
    } catch (err) {
      console.error('Bulk deletion of invoices failed:', err);
    }
  };

  const handleBulkSettleInvoices = async () => {
    if (selectedInvoiceIds.length === 0) return;
    if (!window.confirm(`Mark ${selectedInvoiceIds.length} selected invoices as PAID?`)) return;

    try {
      const token = localStorage.getItem('netriq_admin_token') || '';
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'bulk_settle_invoices',
          ids: selectedInvoiceIds
        })
      });

      if (res.status === 401) {
        handleLockPanel();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setSelectedInvoiceIds([]);
        fetchDbData();
      }
    } catch (err) {
      console.error('Bulk invoice settlement failed:', err);
    }
  };

  const handleBulkDeleteCustomers = async () => {
    if (selectedCustomerIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedCustomerIds.length} selected customers? Doing this will wipe all associated project invoices.`)) return;

    try {
      const token = localStorage.getItem('netriq_admin_token') || '';
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'bulk_delete_customers',
          ids: selectedCustomerIds
        })
      });

      if (res.status === 401) {
        handleLockPanel();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setSelectedCustomerIds([]);
        fetchDbData();
      }
    } catch (err) {
      console.error('Bulk customer deletion failed:', err);
    }
  };

  // --- ROW SELECTION HELPER LOGIC ---

  const handleSelectAllInvoices = () => {
    if (selectedInvoiceIds.length === filteredInvoices.length) {
      setSelectedInvoiceIds([]);
    } else {
      setSelectedInvoiceIds(filteredInvoices.map(i => i.id));
    }
  };

  const handleSelectInvoice = (id: string) => {
    setSelectedInvoiceIds(prev => 
      prev.includes(id) ? prev.filter(invId => invId !== id) : [...prev, id]
    );
  };

  const handleSelectAllCustomers = () => {
    if (selectedCustomerIds.length === filteredCustomers.length) {
      setSelectedCustomerIds([]);
    } else {
      setSelectedCustomerIds(filteredCustomers.map(c => c.id));
    }
  };

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerIds(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  // Handle real invoice settlement via card API
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvv || !payingInvoice) return;

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('netriq_admin_token') || '';
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'settle_invoice',
          id: payingInvoice.id
        })
      });

      if (res.status === 401) {
        handleLockPanel();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setPaymentSuccess(true);
        setTimeout(() => {
          setPayingInvoice(null);
          setCardNumber('');
          setCardExpiry('');
          setCardCvv('');
          setPaymentSuccess(false);
          if (selectedInvoice?.id === payingInvoice.id) {
            setSelectedInvoice(prev => prev ? { ...prev, status: 'paid' } : null);
          }
          fetchDbData(); // Refresh list from backend!
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to settle invoice:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleDownloadPDF = (invoice: Invoice) => {
    const customer = customers.find(c => c.id === invoice.customerId) || invoice.customer;
    if (!customer) return;
    const doc = generateInvoicePDF(invoice, customer);
    doc.save(`invoice-${invoice.id}.pdf`);
  };

  const handleEmailInvoice = async (invoice: Invoice) => {
    const customer = customers.find(c => c.id === invoice.customerId) || invoice.customer;
    if (!customer || !customer.email) {
      setEmailError('Customer has no email address.');
      setTimeout(() => setEmailError(''), 3000);
      return;
    }
    
    setIsSendingEmail(true);
    setEmailError('');
    try {
      const doc = generateInvoicePDF(invoice, customer);
      const pdfBase64 = doc.output('datauristring');
      
      const res = await fetch('/api/admin/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('netriq_admin_token')}`
        },
        body: JSON.stringify({
          to: customer.email,
          pdfBase64,
          invoiceId: invoice.id
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setEmailSuccess(true);
        setTimeout(() => setEmailSuccess(false), 3000);
      } else {
        setEmailError(data.error || 'Failed to send email.');
        setTimeout(() => setEmailError(''), 3000);
      }
    } catch (err) {
      setEmailError('Network error while sending email.');
      setTimeout(() => setEmailError(''), 3000);
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Wait for initial auth read to prevent UI flash
  if (isAdminAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative">
        <NeuralBackground />
        <div className="absolute inset-0 tech-grid opacity-[0.06] pointer-events-none" />
        <div className="w-8 h-8 border-4 border-[rgb(var(--accent-blue))] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Render Lock/Auth Screen if not authorized
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
        <NeuralBackground />
        <div className="absolute inset-0 tech-grid opacity-[0.06] pointer-events-none" />
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[rgba(6,148,148,0.04)] rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[rgba(6,148,148,0.04)] rounded-full blur-[80px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={clsx(
            "w-full max-w-md bg-surface-1/45 backdrop-blur-xl border rounded-[32px] overflow-hidden shadow-2xl p-8 relative transition-all duration-300",
            authError ? "border-rose-500/50 shadow-rose-500/10 shake-animation" : "border-border-strong/40",
            authSuccess && "border-[rgb(var(--accent-blue))]/50 shadow-[rgba(6,148,148,0.1)]"
          )}
        >
          {/* Header lock badge */}
          <div className="flex justify-center mb-6">
            <div className={clsx(
              "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500",
              authSuccess 
                ? "bg-[rgba(6,148,148,0.15)] border-[rgb(var(--accent-blue))]/40 text-[rgb(var(--accent-blue))]" 
                : "bg-surface-1/60 border-border-strong/30 text-text-muted"
            )}>
              {authSuccess ? <Check className="animate-scale" size={24} /> : <Lock size={22} />}
            </div>
          </div>

          <div className="text-center mb-8">
            <span className="text-[9px] font-black tracking-[0.3em] text-[rgb(var(--accent-blue))] uppercase font-mono">SECURE ACCESS INVOICE CORE</span>
            <h2 className="text-2xl font-sans font-black text-text-primary uppercase tracking-tight mt-1">Admin Panel Login</h2>
            <p className="text-text-secondary text-xs mt-2 opacity-80 max-w-[280px] mx-auto leading-relaxed">
              Ledger database operations require Supabase credential keys for authorization.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/60" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Security Password</label>
              <div className="relative">
                <KeyRound size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/60" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-sans"
                />
              </div>
            </div>

            {/* Error messaging */}
            <AnimatePresence>
              {authError && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-rose-500 font-sans font-bold text-[9px] tracking-wider uppercase text-center max-w-xs mx-auto"
                >
                  ⚠️ {authErrorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={authSuccess}
              className="w-full py-3.5 rounded-xl bg-[rgb(var(--accent-blue))] hover:bg-[rgb(var(--accent-blue-hover))] disabled:bg-[rgb(var(--accent-blue))]/60 text-white text-xs font-black uppercase tracking-widest transition-all shadow-glow flex items-center justify-center gap-2"
            >
              {authSuccess ? 'Decrypting Ledger...' : 'Access Administration'} <ArrowRight size={14} />
            </button>
          </form>

          {/* Clear stale session cache link */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('netriq_admin_auth');
                localStorage.removeItem('netriq_admin_token');
                window.location.reload();
              }}
              className="text-[9px] text-text-muted/50 hover:text-text-muted uppercase tracking-widest font-mono transition-colors"
            >
              Clear session cache &amp; reload
            </button>
          </div>

        </motion.div>
      </div>
    );
  }

  // Render Authorized Admin View
  return (
    <div className="min-h-screen bg-background pt-24 overflow-hidden relative pb-16">
      <NeuralBackground />
      <div className="absolute inset-0 tech-grid opacity-[0.06] pointer-events-none" />

      {/* Background radial soft light */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[rgba(6,148,148,0.05)] rounded-full blur-[100px] pointer-events-none" />

      {/* Admin Credentials Ribbon Header */}
      <div className="bg-[rgba(6,148,148,0.1)] border-b border-[rgba(6,148,148,0.25)] py-2.5 px-6 backdrop-blur-md relative z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] font-mono text-[rgb(var(--accent-blue))]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[rgb(var(--accent-blue))] animate-ping" />
            <span>SUPABASE SECURITY SYSTEM ONLINE: [{adminEmail}]</span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Manual Database Seeding controller */}
            <button
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="flex items-center gap-1 px-3 py-1 bg-surface-1 border border-[rgba(6,148,148,0.3)] hover:border-[rgb(var(--accent-blue))] rounded-md hover:bg-background transition-all duration-300 text-text-primary text-[8px] font-bold font-sans tracking-wider"
            >
              <RefreshCw size={9} className={clsx(seeding && "animate-spin")} /> {seeding ? 'SEEDING...' : 'SEED DEMO DATA'}
            </button>

            <button 
              onClick={handleLockPanel}
              className="flex items-center gap-1.5 px-3 py-1 bg-surface-1 border border-border-strong/20 rounded-md hover:bg-rose-500 hover:text-white hover:border-transparent transition-all duration-300 text-text-muted font-sans"
            >
              <LogOut size={10} /> LOCK PANEL
            </button>
          </div>
        </div>
      </div>

      <main className="section-container relative z-10 py-12">
        
        {/* Header Branding Panel */}
        <SectionReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="tech-badge rounded-full mb-4">
                SECURE DATABASE CRUD COMMAND COMMAND
              </div>
              <h1 className="text-4xl md:text-6xl font-sans font-black tracking-tight text-text-primary uppercase leading-[0.95] mb-4">
                Operations <br/>
                <span className="text-[rgb(var(--accent-blue))] font-black">Control.</span>
              </h1>
              <p className="text-text-secondary text-base md:text-lg max-w-xl opacity-80 leading-relaxed font-sans mt-2">
                Unified real customer database management, balance calculation matrices, and Stripe billing simulators running securely on persistent Supabase storage.
              </p>
            </div>
            
            <div className="flex gap-3 shrink-0">
              <GlowButton 
                onClick={() => {
                  if (customers.length > 0) {
                    setSelectedCustomerId(customers[0].id);
                  }
                  setIsCreatingInvoice(true);
                }} 
                variant="primary" 
                className="rounded-full shadow-2xl uppercase tracking-widest text-[10px]"
              >
                <Plus size={14} /> Create Invoice
              </GlowButton>
              <GlowButton 
                onClick={() => setIsCreatingCustomer(true)} 
                variant="ghost" 
                className="rounded-full shadow-2xl uppercase tracking-widest text-[10px]"
              >
                <UserPlus size={14} /> Add Customer
              </GlowButton>
            </div>
          </div>
        </SectionReveal>

        {/* Dashboard Financial Summary Cards */}
        <SectionReveal delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            {/* Settled Card */}
            <div className="bg-surface-1/40 backdrop-blur-md border border-border-strong/30 rounded-3xl p-6 relative overflow-hidden group hover:border-[rgb(var(--accent-blue))]/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(var(--accent-blue),0.02)] to-transparent pointer-events-none" />
              <p className="text-[9px] font-black text-text-muted/60 tracking-[0.3em] uppercase mb-1.5 font-mono">SETTLED BALANCES (PAID)</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-sans font-black text-text-primary tracking-tighter">
                  ${stats.paidTotal.toLocaleString()}
                </span>
                <span className="text-[10px] text-text-muted font-bold font-mono">AUD</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-[rgb(var(--accent-blue))] font-black tracking-wider uppercase font-sans">
                <CheckCircle2 size={12} /> database accounts perfectly balanced
              </div>
            </div>

            {/* Pending Card */}
            <div className="bg-surface-1/40 backdrop-blur-md border border-border-strong/30 rounded-3xl p-6 relative overflow-hidden group hover:border-[rgb(var(--accent-blue))]/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(var(--accent-blue),0.02)] to-transparent pointer-events-none" />
              <p className="text-[9px] font-black text-text-muted/60 tracking-[0.3em] uppercase mb-1.5 font-mono">PENDING BALANCE (UNPAID)</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-sans font-black text-text-primary tracking-tighter">
                  ${stats.unpaidTotal.toLocaleString()}
                </span>
                <span className="text-[10px] text-text-muted font-bold font-mono">AUD</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-amber-500 font-black tracking-wider uppercase font-sans">
                <Clock size={12} /> awaiting billing settlements
              </div>
            </div>

            {/* Overdue Card */}
            <div className="bg-surface-1/40 backdrop-blur-md border border-border-strong/30 rounded-3xl p-6 relative overflow-hidden group hover:border-[rgb(var(--accent-blue))]/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(var(--accent-blue),0.02)] to-transparent pointer-events-none" />
              <p className="text-[9px] font-black text-text-muted/60 tracking-[0.3em] uppercase mb-1.5 font-mono">OVERDUE BALANCE (DUE)</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-sans font-black text-text-primary tracking-tighter text-rose-500">
                  ${stats.overdueTotal.toLocaleString()}
                </span>
                <span className="text-[10px] text-text-muted font-bold font-mono">AUD</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-rose-500 font-black tracking-wider uppercase font-sans">
                <ShieldCheck size={12} className="animate-pulse" /> follow-up action required
              </div>
            </div>

          </div>
        </SectionReveal>

        {/* Unified Tab Switcher Navigation */}
        <SectionReveal delay={130}>
          <div className="flex gap-4 mb-6 border-b border-border-strong/20 pb-4">
            <button
              onClick={() => { setActiveTab('customers'); setSearchQuery(''); }}
              className={clsx(
                "pb-2 text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 relative",
                activeTab === 'customers' ? "text-text-primary font-sans" : "text-text-muted hover:text-text-primary font-sans"
              )}
            >
              <Users size={14} /> Customer Ledger
              {activeTab === 'customers' && (
                <motion.div layoutId="activeTabIndicator" className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-[rgb(var(--accent-blue))]" />
              )}
            </button>
            <button
              onClick={() => { setActiveTab('invoices'); setSearchQuery(''); }}
              className={clsx(
                "pb-2 text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 relative",
                activeTab === 'invoices' ? "text-text-primary font-sans" : "text-text-muted hover:text-text-primary font-sans"
              )}
            >
              <FileText size={14} /> Invoice Records
              {activeTab === 'invoices' && (
                <motion.div layoutId="activeTabIndicator" className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-[rgb(var(--accent-blue))]" />
              )}
            </button>
          </div>
        </SectionReveal>

        {/* Filters and List Block */}
        <SectionReveal delay={150}>
          <div className="bg-surface-1/30 backdrop-blur-xl border border-border-strong/40 rounded-[32px] overflow-hidden shadow-xl mb-12">
            
            {/* Filter and Search bar */}
            <div className="p-6 md:p-8 border-b border-border-strong/30 flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Category tabs */}
              <div className="flex gap-2 p-1 bg-background/50 border border-border-strong/40 rounded-2xl w-full md:w-auto overflow-x-auto scrollbar-hide">
                {activeTab === 'invoices' ? (
                  (['all', 'paid', 'unpaid', 'overdue'] as const).map(filter => (
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
                  ))
                ) : (
                  <div className="px-5 py-2 text-[9px] font-mono font-black text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                    <Building size={12} /> Managed Client Accounts
                  </div>
                )}
              </div>

              {/* Search tool */}
              <div className="relative w-full md:w-[320px]">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/60" />
                <input
                  type="text"
                  placeholder={activeTab === 'invoices' ? "Search project bills..." : "Search clients, emails..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background/40 border border-border-strong/30 rounded-2xl text-xs font-sans text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))]/60 transition-colors"
                />
              </div>

            </div>

            {loading ? (
              <div className="py-24 text-center">
                <div className="w-8 h-8 border-4 border-[rgb(var(--accent-blue))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xs text-text-muted font-sans uppercase tracking-widest font-mono">Synchronizing state with Supabase...</p>
              </div>
            ) : activeTab === 'invoices' ? (
              /* Invoice records list */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-strong/20 bg-background/10">
                      <th className="py-5 px-4 text-center w-12">
                        <button 
                          onClick={handleSelectAllInvoices}
                          className="text-text-muted hover:text-[rgb(var(--accent-blue))] transition-colors"
                        >
                          {selectedInvoiceIds.length === filteredInvoices.length && filteredInvoices.length > 0 ? (
                            <CheckSquare size={14} className="text-[rgb(var(--accent-blue))]" />
                          ) : (
                            <Square size={14} />
                          )}
                        </button>
                      </th>
                      <th className="py-5 px-6 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono">Invoice ID</th>
                      <th className="py-5 px-6 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono">Customer</th>
                      <th className="py-5 px-6 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono">Project Scope</th>
                      <th className="py-5 px-6 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono">Issue Date</th>
                      <th className="py-5 px-6 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono">Due Date</th>
                      <th className="py-5 px-6 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono text-right">Amount (AUD)</th>
                      <th className="py-5 px-6 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono">Status</th>
                      <th className="py-5 px-6 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono text-center">Actions</th>
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
                          className={clsx(
                            "group hover:bg-surface-1/40 transition-colors",
                            selectedInvoiceIds.includes(inv.id) && "bg-[rgba(6,148,148,0.04)]"
                          )}
                        >
                          {/* Selector */}
                          <td className="py-5 px-4 text-center">
                            <button
                              onClick={() => handleSelectInvoice(inv.id)}
                              className="text-text-muted/80 hover:text-[rgb(var(--accent-blue))] transition-colors"
                            >
                              {selectedInvoiceIds.includes(inv.id) ? (
                                <CheckSquare size={14} className="text-[rgb(var(--accent-blue))]" />
                              ) : (
                                <Square size={14} />
                              )}
                            </button>
                          </td>

                          {/* ID */}
                          <td className="py-5 px-6 text-xs font-black text-text-primary font-mono group-hover:text-[rgb(var(--accent-blue))] transition-colors">
                            {inv.id}
                          </td>

                          {/* Customer */}
                          <td className="py-5 px-6 text-xs font-black text-text-primary font-sans max-w-[150px] truncate">
                            {inv.customer?.name || 'Unknown Client'}
                          </td>
                          
                          {/* Project */}
                          <td className="py-5 px-6 text-xs font-medium text-text-muted/90 font-sans max-w-[200px] truncate">
                            {inv.project}
                          </td>

                          {/* Date */}
                          <td className="py-5 px-6 text-xs text-text-muted/80 font-mono">
                            {inv.date}
                          </td>

                          {/* Due Date */}
                          <td className="py-5 px-6 text-xs text-text-muted/80 font-mono">
                            {inv.dueDate}
                          </td>

                          {/* Total */}
                          <td className="py-5 px-6 text-xs font-black text-text-primary text-right font-mono">
                            ${inv.total.toLocaleString()}
                          </td>

                          {/* Status badge */}
                          <td className="py-5 px-6">
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
                          <td className="py-3 px-6 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setSelectedInvoice(inv)}
                                title="View Receipt"
                                className="p-2 rounded-lg bg-background border border-border-strong/30 text-text-muted hover:text-text-primary hover:border-border-strong transition-colors"
                              >
                                <Eye size={12} />
                              </button>
                              <button
                                onClick={() => handleOpenEditInvoice(inv)}
                                title="Edit Invoice"
                                className="p-2 rounded-lg bg-background border border-border-strong/30 text-text-muted hover:text-[rgb(var(--accent-blue))] hover:border-border-strong transition-colors"
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteInvoice(inv.id)}
                                title="Delete Invoice"
                                className="p-2 rounded-lg bg-background border border-border-strong/30 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    
                    {filteredInvoices.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-xs text-text-muted/60 font-sans">
                          No invoices match your active filters or searches.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Customers list table */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-strong/20 bg-background/10">
                      <th className="py-5 px-4 text-center w-12">
                        <button 
                          onClick={handleSelectAllCustomers}
                          className="text-text-muted hover:text-[rgb(var(--accent-blue))] transition-colors"
                        >
                          {selectedCustomerIds.length === filteredCustomers.length && filteredCustomers.length > 0 ? (
                            <CheckSquare size={14} className="text-[rgb(var(--accent-blue))]" />
                          ) : (
                            <Square size={14} />
                          )}
                        </button>
                      </th>
                      <th className="py-5 px-6 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono">Company Name</th>
                      <th className="py-5 px-6 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono">Billing Email</th>
                      <th className="py-5 px-6 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono">ABN</th>
                      <th className="py-5 px-6 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono">Billing Address</th>
                      <th className="py-5 px-6 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono">Phone Number</th>
                      <th className="py-5 px-6 text-[9px] font-black tracking-widest text-text-muted/60 uppercase font-mono text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-strong/10">
                    <AnimatePresence mode="popLayout">
                      {filteredCustomers.map((cust) => (
                        <motion.tr 
                          key={cust.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className={clsx(
                            "group hover:bg-surface-1/40 transition-colors",
                            selectedCustomerIds.includes(cust.id) && "bg-[rgba(6,148,148,0.04)]"
                          )}
                        >
                          {/* Selector */}
                          <td className="py-5 px-4 text-center">
                            <button
                              onClick={() => handleSelectCustomer(cust.id)}
                              className="text-text-muted/80 hover:text-[rgb(var(--accent-blue))] transition-colors"
                            >
                              {selectedCustomerIds.includes(cust.id) ? (
                                <CheckSquare size={14} className="text-[rgb(var(--accent-blue))]" />
                              ) : (
                                <Square size={14} />
                              )}
                            </button>
                          </td>

                          {/* Name */}
                          <td className="py-5 px-6 text-xs font-black text-text-primary font-sans group-hover:text-[rgb(var(--accent-blue))] transition-colors">
                            {cust.name}
                          </td>

                          {/* Email */}
                          <td className="py-5 px-6 text-xs font-bold text-text-muted/80 font-mono">
                            {cust.email}
                          </td>
                          
                          {/* ABN */}
                          <td className="py-5 px-6 text-xs text-text-primary/95 font-mono">
                            {cust.abn || '—'}
                          </td>

                          {/* Address */}
                          <td className="py-5 px-6 text-xs text-text-muted/80 font-sans max-w-[180px] truncate">
                            {cust.address || '—'}
                          </td>

                          {/* Phone Number */}
                          <td className="py-5 px-6 text-xs text-text-primary/90 font-mono">
                            {cust.phone || '—'}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-6 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedCustomerId(cust.id);
                                  setSelectedProject('Custom Project Scope');
                                  setIsCreatingInvoice(true);
                                }}
                                className="text-[8px] font-black uppercase tracking-widest px-2.5 py-2 rounded-lg bg-[rgb(var(--accent-blue))] text-white hover:bg-[rgb(var(--accent-blue-hover))] transition-colors shadow-glow-sm font-sans"
                              >
                                Invoice
                              </button>
                              <button
                                onClick={() => handleOpenEditCustomer(cust)}
                                title="Edit Customer"
                                className="p-2 rounded-lg bg-background border border-border-strong/30 text-text-muted hover:text-[rgb(var(--accent-blue))] hover:border-border-strong transition-colors"
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteCustomer(cust.id, cust.name)}
                                title="Delete Customer"
                                className="p-2 rounded-lg bg-background border border-border-strong/30 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    
                    {filteredCustomers.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-xs text-text-muted/60 font-sans">
                          No client profiles match your active search terms.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

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

      {/* FLOATING ACTION BAR FOR BULK ACTIONS */}
      <AnimatePresence>
        {((activeTab === 'invoices' && selectedInvoiceIds.length > 0) || 
          (activeTab === 'customers' && selectedCustomerIds.length > 0)) && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-surface-1/80 backdrop-blur-xl border border-[rgb(var(--accent-blue))]/30 shadow-2xl px-6 py-4 rounded-2xl flex items-center gap-6"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[rgb(var(--accent-blue))]/20 text-[rgb(var(--accent-blue))] flex items-center justify-center text-[10px] font-black font-mono">
                {activeTab === 'invoices' ? selectedInvoiceIds.length : selectedCustomerIds.length}
              </span>
              <span className="text-[10px] text-text-primary font-black uppercase tracking-widest font-sans">Selected</span>
            </div>

            <div className="h-4 w-[1px] bg-border-strong/20" />

            <div className="flex items-center gap-2">
              {activeTab === 'invoices' && (
                <button
                  onClick={handleBulkSettleInvoices}
                  className="px-4 py-2 rounded-xl bg-[rgb(var(--accent-blue))] hover:bg-[rgb(var(--accent-blue-hover))] text-white text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5 font-sans"
                >
                  <Check size={12} /> Mark Paid
                </button>
              )}
              <button
                onClick={activeTab === 'invoices' ? handleBulkDeleteInvoices : handleBulkDeleteCustomers}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5 font-sans"
              >
                <Trash2 size={12} /> Delete Selected
              </button>
              <button
                onClick={() => { setSelectedInvoiceIds([]); setSelectedCustomerIds([]); }}
                className="px-3 py-2 rounded-xl border border-border-strong/30 text-text-muted hover:text-text-primary text-[9px] font-black uppercase tracking-widest transition-colors font-sans"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE CUSTOMER MODAL */}
      <AnimatePresence>
        {isCreatingCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreatingCustomer(false)}
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
                  <span className="text-[9px] font-black tracking-[0.3em] text-[rgb(var(--accent-blue))] uppercase font-mono">LEDGER BUILDER</span>
                  <h3 className="text-xl font-sans font-black text-text-primary uppercase tracking-tight mt-1">Create Customer Profile</h3>
                </div>
                <button 
                  onClick={() => setIsCreatingCustomer(false)}
                  className="w-8 h-8 rounded-full border border-border-strong/30 flex items-center justify-center hover:bg-background/20 text-text-muted hover:text-text-primary transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleCreateCustomer} className="space-y-4">
                
                {/* Company Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Company / Client Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aura Space & Interiors"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-sans"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Billing Contact Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/60" />
                    <input
                      type="email"
                      required
                      placeholder="finance@company.com"
                      value={newCustEmail}
                      onChange={(e) => setNewCustEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-sans"
                    />
                  </div>
                </div>

                {/* ABN */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">ABN (Australian Business Number)</label>
                  <input
                    type="text"
                    placeholder="12 345 678 910"
                    value={newCustAbn}
                    onChange={(e) => setNewCustAbn(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-mono"
                  />
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Billing Address</label>
                  <input
                    type="text"
                    placeholder="Level 14, 385 Bourke St, Melbourne VIC 3000"
                    value={newCustAddress}
                    onChange={(e) => setNewCustAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-sans"
                  />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+61 412 345 678"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-sans"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setIsCreatingCustomer(false)}
                    className="px-5 py-3 rounded-xl border border-border-strong/30 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors font-sans"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[rgb(var(--accent-blue))] hover:bg-[rgb(var(--accent-blue-hover))] text-white text-xs font-black uppercase tracking-widest transition-colors shadow-glow-sm font-sans"
                  >
                    Create Profile
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT CUSTOMER MODAL */}
      <AnimatePresence>
        {editingCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingCustomer(null)}
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
                  <span className="text-[9px] font-black tracking-[0.3em] text-[rgb(var(--accent-blue))] uppercase font-mono">LEDGER EDITOR</span>
                  <h3 className="text-xl font-sans font-black text-text-primary uppercase tracking-tight mt-1">Edit Customer Profile</h3>
                </div>
                <button 
                  onClick={() => setEditingCustomer(null)}
                  className="w-8 h-8 rounded-full border border-border-strong/30 flex items-center justify-center hover:bg-background/20 text-text-muted hover:text-text-primary transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleUpdateCustomer} className="space-y-4">
                
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Company / Client Name</label>
                  <input
                    type="text"
                    required
                    value={editCustName}
                    onChange={(e) => setEditCustName(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-sans"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Billing Contact Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/60" />
                    <input
                      type="email"
                      required
                      value={editCustEmail}
                      onChange={(e) => setEditCustEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-sans"
                    />
                  </div>
                </div>

                {/* ABN */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">ABN (Australian Business Number)</label>
                  <input
                    type="text"
                    value={editCustAbn}
                    onChange={(e) => setEditCustAbn(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-mono"
                  />
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Billing Address</label>
                  <input
                    type="text"
                    value={editCustAddress}
                    onChange={(e) => setEditCustAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-sans"
                  />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Phone Number</label>
                  <input
                    type="text"
                    value={editCustPhone}
                    onChange={(e) => setEditCustPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-sans"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingCustomer(null)}
                    className="px-5 py-3 rounded-xl border border-border-strong/30 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors font-sans"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[rgb(var(--accent-blue))] hover:bg-[rgb(var(--accent-blue-hover))] text-white text-xs font-black uppercase tracking-widest transition-colors shadow-glow-sm font-sans"
                  >
                    Update Profile
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE INVOICE MODAL */}
      <AnimatePresence>
        {isCreatingInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreatingInvoice(false)}
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
                  <h3 className="text-xl font-sans font-black text-text-primary uppercase tracking-tight mt-1">Create Tax Invoice</h3>
                </div>
                <button 
                  onClick={() => setIsCreatingInvoice(false)}
                  className="w-8 h-8 rounded-full border border-border-strong/30 flex items-center justify-center hover:bg-background/20 text-text-muted hover:text-text-primary transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              {customers.length === 0 ? (
                <div className="py-8 text-center text-xs text-text-muted space-y-4">
                  <p>You must create a customer profile first before managing accounts!</p>
                  <GlowButton onClick={() => { setIsCreatingInvoice(false); setIsCreatingCustomer(true); }} variant="primary" className="mx-auto rounded-full uppercase tracking-widest text-[9px]">
                    Create Customer Profile
                  </GlowButton>
                </div>
              ) : (
                <form onSubmit={handleCreateInvoice} className="space-y-5">
                  
                  {/* Select Customer */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Target Customer</label>
                    <select 
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-sans"
                    >
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                      ))}
                    </select>
                  </div>

                  {/* Project scope select */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Project Scope</label>
                    <select 
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-sans"
                    >
                      <option value="Custom Project Scope">Custom Project Scope</option>
                      <option value="Custom Neural Automation Setup">Custom Neural Automation Setup</option>
                      <option value="Ongoing Operational Engineering Retainer">Ongoing Operational Engineering Retainer</option>
                    </select>
                  </div>

                  {/* Scope line item details */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Invoice Task / Line Item Description</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Workflow Bottleneck Mapping & Integration Retainer"
                      value={invoiceItemDesc}
                      onChange={(e) => setInvoiceItemDesc(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-sans"
                    />
                  </div>

                  {/* Amount and GST Toggle */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Rate (AUD)</label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">GST Included</span>
                        <div 
                          className={clsx(
                            "w-8 h-4 rounded-full relative transition-colors duration-200",
                            invoiceGstIncluded ? "bg-[rgb(var(--accent-blue))]" : "bg-border-strong/30"
                          )}
                          onClick={() => setInvoiceGstIncluded(!invoiceGstIncluded)}
                        >
                          <div className={clsx(
                            "w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform duration-200 shadow-sm",
                            invoiceGstIncluded ? "translate-x-4.5 right-0.5" : "translate-x-0.5 left-0"
                          )} />
                        </div>
                      </label>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-text-muted font-bold">$</span>
                      <input
                        type="number"
                        required
                        min={100}
                        value={invoiceItemRate}
                        onChange={(e) => setInvoiceItemRate(Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-mono"
                      />
                    </div>
                  </div>

                  {/* Visual calculation details preview */}
                  <div className="p-4 rounded-xl bg-background/50 border border-border-strong/20 space-y-2 text-xs">
                    <div className="flex justify-between text-text-muted">
                      <span>Subtotal (excl. GST)</span>
                      <span className="font-mono">${(invoiceGstIncluded ? invoiceItemRate - (invoiceItemRate / 11) : invoiceItemRate).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} AUD</span>
                    </div>
                    <div className="flex justify-between text-text-muted">
                      <span>GST (10%)</span>
                      <span className="font-mono">${(invoiceGstIncluded ? invoiceItemRate / 11 : invoiceItemRate * 0.1).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} AUD</span>
                    </div>
                    <div className="flex justify-between font-black text-text-primary border-t border-border-strong/20 pt-2 font-sans">
                      <span>Total (incl. GST)</span>
                      <span className="font-mono text-[rgb(var(--accent-blue))]">${(invoiceGstIncluded ? invoiceItemRate : invoiceItemRate * 1.1).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} AUD</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => setIsCreatingInvoice(false)}
                      className="px-5 py-3 rounded-xl border border-border-strong/30 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors font-sans"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-[rgb(var(--accent-blue))] hover:bg-[rgb(var(--accent-blue-hover))] text-white text-xs font-black uppercase tracking-widest transition-colors shadow-glow-sm font-sans"
                    >
                      Generate Invoice
                    </button>
                  </div>

                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT INVOICE MODAL */}
      <AnimatePresence>
        {editingInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingInvoice(null)}
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
                  <span className="text-[9px] font-black tracking-[0.3em] text-[rgb(var(--accent-blue))] uppercase font-mono">SANDBOX WRITER</span>
                  <h3 className="text-xl font-sans font-black text-text-primary uppercase tracking-tight mt-1">Edit Tax Invoice {editingInvoice.id}</h3>
                </div>
                <button 
                  onClick={() => setEditingInvoice(null)}
                  className="w-8 h-8 rounded-full border border-border-strong/30 flex items-center justify-center hover:bg-background/20 text-text-muted hover:text-text-primary transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleUpdateInvoice} className="space-y-4">
                
                {/* Project */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Project Name</label>
                  <input
                    type="text"
                    required
                    value={editInvoiceProject}
                    onChange={(e) => setEditInvoiceProject(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-sans"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Issue Date (YYYY-MM-DD)</label>
                    <input
                      type="text"
                      required
                      value={editInvoiceDate}
                      onChange={(e) => setEditInvoiceDate(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Due Date (YYYY-MM-DD)</label>
                    <input
                      type="text"
                      required
                      value={editInvoiceDueDate}
                      onChange={(e) => setEditInvoiceDueDate(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-mono"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Payment Status</label>
                  <select
                    value={editInvoiceStatus}
                    onChange={(e) => setEditInvoiceStatus(e.target.value as any)}
                    className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-sans"
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Task Line Item Description</label>
                  <input
                    type="text"
                    required
                    value={editInvoiceItemDesc}
                    onChange={(e) => setEditInvoiceItemDesc(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-sans"
                  />
                </div>

                {/* Rate */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-text-muted/80 uppercase tracking-widest font-mono">Rate (AUD, excl. GST)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-text-muted font-bold">$</span>
                    <input
                      type="number"
                      required
                      value={editInvoiceItemRate}
                      onChange={(e) => setEditInvoiceItemRate(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 bg-background border border-border-strong/30 rounded-xl text-xs text-text-primary focus:outline-none focus:border-[rgb(var(--accent-blue))] font-mono"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingInvoice(null)}
                    className="px-5 py-3 rounded-xl border border-border-strong/30 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors font-sans"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[rgb(var(--accent-blue))] hover:bg-[rgb(var(--accent-blue-hover))] text-white text-xs font-black uppercase tracking-widest transition-colors shadow-glow-sm font-sans"
                  >
                    Update Invoice
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
                  <span className="text-[9px] font-black tracking-[0.35em] text-[rgb(var(--accent-blue))] uppercase font-mono">TAX INVOICE RECORD</span>
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
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 text-text-primary flex-shrink-0">
                      <Logo />
                    </div>
                    <div>
                      <span className="font-sans font-black text-lg text-text-primary tracking-tighter">
                        NETRIQ<span className="text-[rgb(var(--accent-blue))] italic">AI</span>
                      </span>
                      <p className="text-[8px] text-text-muted tracking-widest uppercase font-mono mt-0.5">Melbourne, Victoria, Australia</p>
                      <p className="text-[8px] text-text-muted tracking-widest uppercase font-mono">ABN: 48 641 706 767</p>
                    </div>
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
                    <p className="font-black text-text-primary text-[13px]">{selectedInvoice.customer?.name || 'Unknown Client'}</p>
                    <p className="text-text-muted/90 font-mono text-[10px] mt-0.5">{selectedInvoice.customer?.email}</p>
                    {selectedInvoice.customer?.abn && (
                      <p className="text-text-muted/90 font-mono text-[10px]">ABN: {selectedInvoice.customer.abn}</p>
                    )}
                    {selectedInvoice.customer?.address && (
                      <p className="text-text-muted/80 max-w-[200px] leading-relaxed mt-1">{selectedInvoice.customer.address}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-text-muted/60 uppercase tracking-widest font-mono mb-1">Billing Summary</p>
                    <p className="text-text-muted"><span className="font-bold text-text-primary">Issued:</span> {selectedInvoice.date}</p>
                    <p className="text-text-muted"><span className="font-bold text-text-primary">Due Date:</span> {selectedInvoice.dueDate}</p>
                    <p className="text-text-muted"><span className="font-bold text-text-primary">Project:</span> {selectedInvoice.project}</p>
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
                    <div className="flex justify-between font-black text-text-primary border-t border-border-strong/20 pt-2 font-sans">
                      <span>Total (AUD)</span>
                      <span className="font-mono text-[rgb(var(--accent-blue))]">${selectedInvoice.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Actions row */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mt-6">
                
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleDownloadPDF(selectedInvoice)}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-border-strong/30 text-xs font-black uppercase tracking-widest text-text-muted hover:text-[rgb(var(--accent-blue))] flex items-center justify-center gap-2 transition-colors font-sans"
                  >
                    <Download size={14} /> Download PDF
                  </button>
                  
                  <button
                    onClick={() => handleEmailInvoice(selectedInvoice)}
                    disabled={isSendingEmail}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-border-strong/30 text-xs font-black uppercase tracking-widest text-text-muted hover:text-green-500 flex items-center justify-center gap-2 transition-colors font-sans disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Mail size={14} /> 
                    {isSendingEmail ? 'Sending...' : emailSuccess ? 'Sent!' : 'Email Invoice'}
                  </button>
                </div>
                
                {emailError && (
                  <div className="text-red-500 text-xs font-black uppercase tracking-widest mt-2 sm:mt-0 text-center flex-1">
                    {emailError}
                  </div>
                )}

                {/* Payment button */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-background/50 border border-border-strong/20 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors text-center font-sans"
                  >
                    Close
                  </button>
                  {selectedInvoice.status !== 'paid' && (
                    <button
                      onClick={() => {
                        setPayingInvoice(selectedInvoice);
                      }}
                      className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[rgb(var(--accent-blue))] hover:bg-[rgb(var(--accent-blue-hover))] text-white text-xs font-black uppercase tracking-widest transition-colors shadow-glow-sm text-center font-sans"
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
                        className="px-5 py-3 rounded-xl border border-border-strong/30 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors font-sans"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-6 py-3 rounded-xl bg-[rgb(var(--accent-blue))] hover:bg-[rgb(var(--accent-blue-hover))] text-white text-xs font-black uppercase tracking-widest transition-colors shadow-glow-sm flex-1 text-center flex items-center justify-center gap-2 font-sans"
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
