import PortalClient from './PortalClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Operations & Invoice Portal — Netriq AI',
  description:
    'Manage your custom neural automation project deployments, invoice records, and billing settings in real-time.',
};

export default function PortalPage() {
  return <PortalClient />;
}
