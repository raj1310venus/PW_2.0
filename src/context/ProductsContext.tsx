'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Product } from '@/lib/types';
import { dummyProducts } from '@/lib/initial-data';

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => void;
  removeProduct: (productId: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(dummyProducts);

  const addProduct = (product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      _id: `prod_${new Date().getTime()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  };

  const removeProduct = (productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, removeProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
