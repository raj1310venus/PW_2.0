import type { Metadata } from 'next';
import DealsPageClient from '@/components/DealsPageClient';

export const metadata: Metadata = {
  title: 'Deals | Price War Store',
  description: 'Check out the latest deals and promotions at the Price War Store.',
};

export default function DealsPage() {
  return <DealsPageClient />;
}
