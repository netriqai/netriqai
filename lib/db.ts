import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

// Interface Schemas
export interface Customer {
  id: string;
  name: string;
  email: string;
  abn: string;
  address: string;
  activeProjects: string[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
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
  gstIncluded?: boolean;
}

interface DatabaseSchema {
  customers: Customer[];
  invoices: Invoice[];
}

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || supabaseKey;

export const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false
      }
    })
  : null;

export const getSupabaseClient = (token?: string) => {
  if (!supabaseUrl || !supabaseServiceKey) return null;
  // Use the service key to bypass RLS. No need to forward the user token anymore.
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false }
  });
};

// Default seeds (used only if local db.json does not exist)
const defaultCustomers: Customer[] = [
  {
    id: "cust_001",
    name: "ASR Space & Interiors",
    email: "billing@asrinteriors.com.au",
    abn: "12 345 678 910",
    address: "Level 14, 385 Bourke St, Melbourne VIC 3000",
    activeProjects: [
      "Aura Office Space Renovation Design",
      "Subcontractor AI Verification Engine"
    ]
  },
  {
    id: "cust_002",
    name: "Taxbud Accounts",
    email: "finance@taxbud.com.au",
    abn: "98 765 432 109",
    address: "45 William St, Melbourne VIC 3000",
    activeProjects: [
      "Tax Document OCR Pipeline Integration"
    ]
  },
  {
    id: "cust_003",
    name: "Finvue Systems",
    email: "accounts@finvue.io",
    abn: "45 678 123 098",
    address: "Collins Square, 727 Collins St, Melbourne VIC 3008",
    activeProjects: [
      "Wealth Projection Core Optimization Retainer"
    ]
  }
];

const defaultInvoices: Invoice[] = [
  {
    id: "NTQ-2026-004",
    customerId: "cust_003",
    project: "AI Discovery Audit & Architecture",
    date: "2026-05-10",
    dueDate: "2026-05-24",
    items: [
      { description: "Workflow Bottleneck Mapping Session", quantity: 1, rate: 1200, amount: 1200 },
      { description: "AI Opportunity Roadmap Document (32 pages)", quantity: 1, rate: 800, amount: 800 },
      { description: "Technical ROI Projection Report", quantity: 1, rate: 500, amount: 500 }
    ],
    subtotal: 2500,
    gst: 250,
    total: 2750,
    status: "paid"
  },
  {
    id: "NTQ-2026-005",
    customerId: "cust_001",
    project: "Done-For-You Implementation Phase 1",
    date: "2026-05-15",
    dueDate: "2026-05-29",
    items: [
      { description: "Custom Neural Pipeline Custom Build", quantity: 1, rate: 4500, amount: 4500 },
      { description: "API Integrations & Webhook Architecture (Shopify + Xero)", quantity: 1, rate: 2500, amount: 2500 },
      { description: "Secure Database Synchronization Setup", quantity: 1, rate: 1000, amount: 1000 }
    ],
    subtotal: 8000,
    gst: 800,
    total: 8800,
    status: "unpaid"
  },
  {
    id: "NTQ-2026-006",
    customerId: "cust_002",
    project: "Monthly AI Retainer & Support",
    date: "2026-05-01",
    dueDate: "2026-05-15",
    items: [
      { description: "Continuous 24/7 Monitoring Retainer", quantity: 1, rate: 1000, amount: 1000 },
      { description: "Automations Upgrades & Performance Tweaks", quantity: 1, rate: 500, amount: 500 }
    ],
    subtotal: 1500,
    gst: 150,
    total: 1650,
    status: "overdue"
  }
];

// Utility to read the local JSON DB with safe fallbacks
export function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(dbPath)) {
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const initialData: DatabaseSchema = { customers: defaultCustomers, invoices: defaultInvoices };
      fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(dbPath, 'utf-8').trim();
    if (!raw) {
      // File exists but is empty (mid-write race condition) — return defaults
      return { customers: defaultCustomers, invoices: defaultInvoices };
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading JSON database:', error);
    return { customers: defaultCustomers, invoices: defaultInvoices };
  }
}

// Utility to write to the local JSON DB safely and atomically
export function writeDb(data: DatabaseSchema): boolean {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempPath = `${dbPath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, dbPath);
    return true;
  } catch (error) {
    console.error('Error writing JSON database:', error);
    return false;
  }
}

// Fetch all customers (with sandbox logic)
export async function getCustomers(isSandbox?: boolean, token?: string): Promise<Customer[]> {
  const localDb = readDb();
  const client = getSupabaseClient(token);
  if (isSandbox || !client) return localDb.customers;

  try {
    const { data, error } = await client
      .from('customers')
      .select('*');

    if (error) {
      console.warn('Supabase query failed, falling back to JSON:', error.message);
      return localDb.customers;
    }

    if (!data) return [];

    return data.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      abn: row.abn,
      address: row.address,
      activeProjects: Array.isArray(row.active_projects)
        ? row.active_projects
        : Array.isArray(row.activeProjects)
        ? row.activeProjects
        : JSON.parse(row.active_projects || '[]')
    }));
  } catch (err) {
    console.error('Failed to get customers from Supabase:', err);
    return localDb.customers;
  }
}

// Fetch all invoices (with sandbox logic)
export async function getInvoices(isSandbox?: boolean, token?: string): Promise<(Invoice & { customer?: Customer })[]> {
  const localDb = readDb();
  const client = getSupabaseClient(token);
  const customersList = await getCustomers(isSandbox, token);
  
  if (isSandbox || !client) {
    return localDb.invoices.map(inv => ({
      ...inv,
      customer: customersList.find(c => c.id === inv.customerId)
    }));
  }

  try {
    const { data, error } = await client
      .from('invoices')
      .select('*');

    if (error) {
      console.warn('Supabase query failed, falling back to JSON:', error.message);
      return localDb.invoices.map(inv => ({
        ...inv,
        customer: customersList.find(c => c.id === inv.customerId)
      }));
    }

    if (!data) return [];

    return data.map(row => {
      const customerId = row.customer_id || row.customerId;
      return {
        id: row.id,
        customerId,
        project: row.project,
        date: row.date,
        dueDate: row.due_date || row.dueDate,
        items: Array.isArray(row.items) ? row.items : JSON.parse(row.items || '[]'),
        subtotal: Number(row.subtotal),
        gst: Number(row.gst),
        total: Number(row.total),
        status: row.status,
        customer: customersList.find(c => c.id === customerId)
      };
    });
  } catch (err) {
    console.error('Failed to get invoices from Supabase:', err);
    return localDb.invoices.map(inv => ({
      ...inv,
      customer: customersList.find(c => c.id === inv.customerId)
    }));
  }
}

// Add Customer
export async function addCustomer(customer: Omit<Customer, 'id'>, isSandbox?: boolean, token?: string): Promise<Customer> {
  const localDb = readDb();
  const client = getSupabaseClient(token);
  const id = `cust_${Date.now()}`;
  const newCustomer: Customer = { ...customer, id };

  localDb.customers.push(newCustomer);
  writeDb(localDb);

  if (!isSandbox && client) {
    try {
      const { error } = await client.from('customers').insert({
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
        abn: newCustomer.abn,
        address: newCustomer.address,
        active_projects: newCustomer.activeProjects
      });
      if (error) {
        console.error('Supabase customer insertion error response:', error);
      }
    } catch (err) {
      console.error('Supabase customer insertion error:', err);
    }
  }

  return newCustomer;
}

// Add Invoice
export async function addInvoice(invoice: Omit<Invoice, 'id' | 'subtotal' | 'gst' | 'total'>, isSandbox?: boolean, token?: string): Promise<Invoice> {
  const localDb = readDb();
  const client = getSupabaseClient(token);
  
  const baseSum = invoice.items.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
  const gst = invoice.gstIncluded ? baseSum / 11 : baseSum * 0.1;
  const subtotal = invoice.gstIncluded ? baseSum - gst : baseSum;
  const total = invoice.gstIncluded ? baseSum : baseSum + gst;

  const id = `NTQ-2026-0${localDb.invoices.length + 4}`;
  const newInvoice: Invoice = {
    ...invoice,
    id,
    subtotal,
    gst,
    total
  };

  localDb.invoices.push(newInvoice);
  writeDb(localDb);

  if (!isSandbox && client) {
    try {
      await client.from('invoices').insert({
        id: newInvoice.id,
        customer_id: newInvoice.customerId,
        project: newInvoice.project,
        date: newInvoice.date,
        due_date: newInvoice.dueDate,
        items: newInvoice.items,
        subtotal: newInvoice.subtotal,
        gst: newInvoice.gst,
        total: newInvoice.total,
        status: newInvoice.status
      });
    } catch (err) {
      console.error('Supabase invoice insertion error:', err);
    }
  }

  return newInvoice;
}

// Settle Invoice status
export async function settleInvoice(invoiceId: string, isSandbox?: boolean, token?: string): Promise<boolean> {
  const localDb = readDb();
  const client = getSupabaseClient(token);
  const invoice = localDb.invoices.find(inv => inv.id === invoiceId);
  if (invoice) {
    invoice.status = 'paid';
    writeDb(localDb);
  }

  if (!isSandbox && client) {
    try {
      await client
        .from('invoices')
        .update({ status: 'paid' })
        .eq('id', invoiceId);
    } catch (err) {
      console.error('Supabase settle invoice error:', err);
    }
  }

  return true;
}

// UPDATE CUSTOMER
export async function updateCustomer(id: string, customer: Partial<Customer>, isSandbox?: boolean, token?: string): Promise<Customer | null> {
  const localDb = readDb();
  const client = getSupabaseClient(token);
  const index = localDb.customers.findIndex(c => c.id === id);
  if (index === -1) return null;

  localDb.customers[index] = {
    ...localDb.customers[index],
    ...customer
  };
  writeDb(localDb);

  if (!isSandbox && client) {
    try {
      const updateData: any = {};
      if (customer.name !== undefined) updateData.name = customer.name;
      if (customer.email !== undefined) updateData.email = customer.email;
      if (customer.abn !== undefined) updateData.abn = customer.abn;
      if (customer.address !== undefined) updateData.address = customer.address;
      if (customer.activeProjects !== undefined) updateData.active_projects = customer.activeProjects;

      await client.from('customers').update(updateData).eq('id', id);
    } catch (err) {
      console.error('Supabase customer update error:', err);
    }
  }

  return localDb.customers[index];
}

// DELETE CUSTOMER
export async function deleteCustomer(id: string, isSandbox?: boolean, token?: string): Promise<boolean> {
  const localDb = readDb();
  const client = getSupabaseClient(token);
  localDb.customers = localDb.customers.filter(c => c.id !== id);
  localDb.invoices = localDb.invoices.filter(i => i.customerId !== id);
  writeDb(localDb);

  if (!isSandbox && client) {
    try {
      await client.from('invoices').delete().eq('customer_id', id);
      await client.from('customers').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase customer delete error:', err);
    }
  }
  return true;
}

// UPDATE INVOICE
export async function updateInvoice(id: string, invoice: Partial<Invoice>, isSandbox?: boolean, token?: string): Promise<Invoice | null> {
  const localDb = readDb();
  const client = getSupabaseClient(token);
  const index = localDb.invoices.findIndex(i => i.id === id);
  if (index === -1) return null;

  const currentInvoice = localDb.invoices[index];
  
  let subtotal = currentInvoice.subtotal;
  let gst = currentInvoice.gst;
  let total = currentInvoice.total;

  if (invoice.items !== undefined || invoice.gstIncluded !== undefined) {
    const isIncluded = invoice.gstIncluded !== undefined ? invoice.gstIncluded : currentInvoice.gstIncluded;
    const itemsToSum = invoice.items !== undefined ? invoice.items : currentInvoice.items;
    const baseSum = itemsToSum.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
    
    gst = isIncluded ? baseSum / 11 : baseSum * 0.1;
    subtotal = isIncluded ? baseSum - gst : baseSum;
    total = isIncluded ? baseSum : baseSum + gst;
  }

  localDb.invoices[index] = {
    ...currentInvoice,
    ...invoice,
    subtotal,
    gst,
    total
  };
  writeDb(localDb);

  if (!isSandbox && client) {
    try {
      const updateData: any = {};
      if (invoice.project !== undefined) updateData.project = invoice.project;
      if (invoice.date !== undefined) updateData.date = invoice.date;
      if (invoice.dueDate !== undefined) updateData.due_date = invoice.dueDate;
      if (invoice.items !== undefined) {
        updateData.items = invoice.items;
        updateData.subtotal = subtotal;
        updateData.gst = gst;
        updateData.total = total;
      }
      if (invoice.status !== undefined) updateData.status = invoice.status;

      await client.from('invoices').update(updateData).eq('id', id);
    } catch (err) {
      console.error('Supabase invoice update error:', err);
    }
  }

  return localDb.invoices[index];
}

// DELETE INVOICE
export async function deleteInvoice(id: string, isSandbox?: boolean, token?: string): Promise<boolean> {
  const localDb = readDb();
  const client = getSupabaseClient(token);
  localDb.invoices = localDb.invoices.filter(i => i.id !== id);
  writeDb(localDb);

  if (!isSandbox && client) {
    try {
      await client.from('invoices').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase invoice delete error:', err);
    }
  }
  return true;
}

// BULK DELETE INVOICES
export async function bulkDeleteInvoices(ids: string[], isSandbox?: boolean, token?: string): Promise<boolean> {
  const localDb = readDb();
  const client = getSupabaseClient(token);
  localDb.invoices = localDb.invoices.filter(i => !ids.includes(i.id));
  writeDb(localDb);

  if (!isSandbox && client) {
    try {
      await client.from('invoices').delete().in('id', ids);
    } catch (err) {
      console.error('Supabase bulk delete invoices error:', err);
    }
  }
  return true;
}

// BULK SETTLE INVOICES
export async function bulkSettleInvoices(ids: string[], isSandbox?: boolean, token?: string): Promise<boolean> {
  const localDb = readDb();
  const client = getSupabaseClient(token);
  localDb.invoices.forEach(inv => {
    if (ids.includes(inv.id)) {
      inv.status = 'paid';
    }
  });
  writeDb(localDb);

  if (!isSandbox && client) {
    try {
      await client.from('invoices').update({ status: 'paid' }).in('id', ids);
    } catch (err) {
      console.error('Supabase bulk settle invoices error:', err);
    }
  }
  return true;
}

// BULK DELETE CUSTOMERS
export async function bulkDeleteCustomers(ids: string[], isSandbox?: boolean, token?: string): Promise<boolean> {
  const localDb = readDb();
  const client = getSupabaseClient(token);
  localDb.customers = localDb.customers.filter(c => !ids.includes(c.id));
  localDb.invoices = localDb.invoices.filter(i => !ids.includes(i.customerId));
  writeDb(localDb);

  if (!isSandbox && client) {
    try {
      await client.from('invoices').delete().in('customer_id', ids);
      await client.from('customers').delete().in('id', ids);
    } catch (err) {
      console.error('Supabase bulk delete customers error:', err);
    }
  }
  return true;
}

// Manual database seeding function
export async function seedDummyDatabase(isSandbox?: boolean, token?: string): Promise<boolean> {
  const localDb = readDb();
  const client = getSupabaseClient(token);
  localDb.customers = defaultCustomers;
  localDb.invoices = defaultInvoices;
  writeDb(localDb);

  if (!isSandbox && client) {
    try {
      await client.from('invoices').delete().neq('id', 'placeholder_bypass');
      await client.from('customers').delete().neq('id', 'placeholder_bypass');

      for (const cust of defaultCustomers) {
        await client.from('customers').insert({
          id: cust.id,
          name: cust.name,
          email: cust.email,
          abn: cust.abn,
          address: cust.address,
          active_projects: cust.activeProjects
        });
      }
      for (const inv of defaultInvoices) {
        await client.from('invoices').insert({
          id: inv.id,
          customer_id: inv.customerId,
          project: inv.project,
          date: inv.date,
          due_date: inv.dueDate,
          items: inv.items,
          subtotal: inv.subtotal,
          gst: inv.gst,
          total: inv.total,
          status: inv.status
        });
      }
    } catch (err) {
      console.error('Supabase database manual seed error:', err);
    }
  }
  return true;
}
