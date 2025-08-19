import { Category, Product } from "./types";
import { randomUUID } from "crypto";

// Simple in-memory fallback store. Replace later with MongoDB.
// Data lives across requests during the same server runtime via global.

type Store = {
  categories: Category[];
  products: Product[];
};

declare global {
  // eslint-disable-next-line no-var
  var __PWS_STORE__: Store | undefined;
}

function now() {
  return new Date().toISOString();
}

function uuid() {
  // node >= 19 exposes crypto.randomUUID
  // fallback for older environments
  try {
    return typeof randomUUID === 'function' ? randomUUID() : (Math.random().toString(36).slice(2) + Date.now().toString(36));
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

export function getStore(): Store {
  if (!global.__PWS_STORE__) {
    global.__PWS_STORE__ = { categories: [], products: [] };
  }
  return global.__PWS_STORE__!;
}

export const CategoryRepo = {
  list(): Category[] {
    return getStore().categories;
  },
  create(input: Partial<Category>): Category {
    const c: Category = {
      _id: uuid(),
      label: String(input.label || "Untitled"),
      slug: String(input.slug || "cat-" + Math.random().toString(36).slice(2, 7)),
      imageUrl: input.imageUrl,
      createdAt: now(),
      updatedAt: now(),
    };
    getStore().categories.push(c);
    return c;
  },
  update(id: string, patch: Partial<Category>): Category | null {
    const arr = getStore().categories;
    const idx = arr.findIndex((x) => x._id === id);
    if (idx === -1) return null;
    arr[idx] = { ...arr[idx], ...patch, updatedAt: now() };
    return arr[idx];
  },
  remove(id: string): boolean {
    const arr = getStore().categories;
    const len = arr.length;
    global.__PWS_STORE__!.categories = arr.filter((x) => x._id !== id);
    return getStore().categories.length !== len;
  },
};

export const ProductRepo = {
  list(): Product[] {
    return getStore().products;
  },
  create(input: Partial<Product>): Product {
    const p: Product = {
      _id: uuid(),
      name: String(input.name || "New Product"),
      slug: String(input.slug || "prod-" + Math.random().toString(36).slice(2, 7)),
      categorySlug: String(input.categorySlug || "uncategorized"),
      price: Number(input.price || 0),
      imageUrl: input.imageUrl,
      description: input.description,
      featured: Boolean(input.featured || false),
      createdAt: now(),
      updatedAt: now(),
    };
    getStore().products.push(p);
    return p;
  },
  update(id: string, patch: Partial<Product>): Product | null {
    const arr = getStore().products;
    const idx = arr.findIndex((x) => x._id === id);
    if (idx === -1) return null;
    arr[idx] = { ...arr[idx], ...patch, updatedAt: now() };
    return arr[idx];
  },
  remove(id: string): boolean {
    const arr = getStore().products;
    const len = arr.length;
    global.__PWS_STORE__!.products = arr.filter((x) => x._id !== id);
    return getStore().products.length !== len;
  },
};
