import AdminClient from './AdminClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administration Control Center — Netriq AI',
  description:
    'Manage real-time customer ledgers, custom neural automation project deployments, invoice records, and billing settings securely.',
};

export default function AdminPage() {
  return <AdminClient />;
}
