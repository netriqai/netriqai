import { NextResponse } from 'next/server';
import { 
  getCustomers, getInvoices, addCustomer, addInvoice, settleInvoice, supabase,
  updateCustomer, deleteCustomer, updateInvoice, deleteInvoice,
  bulkDeleteInvoices, bulkSettleInvoices, bulkDeleteCustomers, seedDummyDatabase
} from '@/lib/db';

async function checkAuth(request: Request): Promise<boolean> {
  if (!supabase) return true; // Offline local sandbox bypass
  
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) return false;
  if (token === 'localSandbox') return true; // Bypass validation for local developer passcode session
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return false;
    return true;
  } catch (err) {
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized access.' }, { status: 401 });
    }

    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    const isSandbox = false;

    const customers = await getCustomers(isSandbox, token);
    const invoices = await getInvoices(isSandbox, token);
    return NextResponse.json({ success: true, customers, invoices });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized access.' }, { status: 401 });
    }

    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    const isSandbox = false;

    const body = await request.json();
    const { action } = body;

    // --- CUSTOMER CRUD ---

    if (action === 'create_customer') {
      const { name, email, abn, address, activeProjects } = body;
      if (!name || !email) {
        return NextResponse.json({ success: false, error: 'Name and email are required fields.' }, { status: 400 });
      }
      const customer = await addCustomer({
        name,
        email,
        abn: abn || '',
        address: address || '',
        activeProjects: activeProjects || []
      }, isSandbox, token);
      return NextResponse.json({ success: true, customer });
    }

    if (action === 'update_customer') {
      const { id, name, email, abn, address, activeProjects } = body;
      if (!id) {
        return NextResponse.json({ success: false, error: 'Customer ID is required.' }, { status: 400 });
      }
      const customer = await updateCustomer(id, {
        name,
        email,
        abn,
        address,
        activeProjects
      }, isSandbox, token);
      return NextResponse.json({ success: true, customer });
    }

    if (action === 'delete_customer') {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ success: false, error: 'Customer ID is required.' }, { status: 400 });
      }
      await deleteCustomer(id, isSandbox, token);
      return NextResponse.json({ success: true });
    }

    // --- INVOICE CRUD ---

    if (action === 'create_invoice') {
      const { customerId, project, date, dueDate, items, status, gstIncluded } = body;
      if (!customerId || !project || !items || items.length === 0) {
        return NextResponse.json({ success: false, error: 'Customer ID, Project name, and items are required fields.' }, { status: 400 });
      }
      const invoice = await addInvoice({
        customerId,
        project,
        date: date || new Date().toISOString().split('T')[0],
        dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items,
        status: status || 'unpaid',
        gstIncluded
      }, isSandbox, token);
      return NextResponse.json({ success: true, invoice });
    }

    if (action === 'update_invoice') {
      const { id, project, date, dueDate, items, status, gstIncluded } = body;
      if (!id) {
        return NextResponse.json({ success: false, error: 'Invoice ID is required.' }, { status: 400 });
      }
      const invoice = await updateInvoice(id, {
        project,
        date,
        dueDate,
        items,
        status,
        gstIncluded
      }, isSandbox, token);
      return NextResponse.json({ success: true, invoice });
    }

    if (action === 'delete_invoice') {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ success: false, error: 'Invoice ID is required.' }, { status: 400 });
      }
      await deleteInvoice(id, isSandbox, token);
      return NextResponse.json({ success: true });
    }

    if (action === 'settle_invoice') {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ success: false, error: 'Invoice ID is required.' }, { status: 400 });
      }
      const success = await settleInvoice(id, isSandbox, token);
      if (!success) {
        return NextResponse.json({ success: false, error: 'Invoice not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }

    // --- BULK OPERATIONS ---

    if (action === 'bulk_delete_invoices') {
      const { ids } = body;
      if (!ids || !Array.isArray(ids)) {
        return NextResponse.json({ success: false, error: 'Invoice IDs array is required.' }, { status: 400 });
      }
      await bulkDeleteInvoices(ids, isSandbox, token);
      return NextResponse.json({ success: true });
    }

    if (action === 'bulk_settle_invoices') {
      const { ids } = body;
      if (!ids || !Array.isArray(ids)) {
        return NextResponse.json({ success: false, error: 'Invoice IDs array is required.' }, { status: 400 });
      }
      await bulkSettleInvoices(ids, isSandbox, token);
      return NextResponse.json({ success: true });
    }

    if (action === 'bulk_delete_customers') {
      const { ids } = body;
      if (!ids || !Array.isArray(ids)) {
        return NextResponse.json({ success: false, error: 'Customer IDs array is required.' }, { status: 400 });
      }
      await bulkDeleteCustomers(ids, isSandbox, token);
      return NextResponse.json({ success: true });
    }

    // --- SEED DATABASE ---

    if (action === 'seed_database') {
      await seedDummyDatabase(isSandbox, token);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid admin action requested.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
