export type Category = {
  _id?: string;
  label: string;
  slug: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  _id?: string;
  name: string;
  slug: string;
  categorySlug: string;
  price: number;
  imageUrl?: string;
  description?: string;
  featured?: boolean;
  limitedTime?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Deal = {
  _id: string;
  title: string;
  description: string;
  category: string;
  expires: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number; // unit amount in minor units (e.g., cents)
  quantity: number;
  imageUrl?: string;
};

export type Order = {
  _id?: string;
  items: OrderItem[];
  currency: string; // e.g., 'cad'
  amountSubtotal: number; // in minor units
  amountTotal: number; // in minor units
  status: 'pending' | 'paid' | 'failed';
  stripeSessionId?: string;
  customerEmail?: string;
  createdAt: string;
  updatedAt: string;
};
