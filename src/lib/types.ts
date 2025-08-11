export type Category = {
  _id: string;
  label: string;
  slug: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  categorySlug: string;
  price: number;
  imageUrl?: string;
  description?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
};
