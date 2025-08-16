import ContactPageClient from '@/components/ContactPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Price War Store',
  description: 'Get in touch with the Price War Store. Find our location, hours, and contact information.',
};

export default function ContactPage() {
  return <ContactPageClient />;
}
