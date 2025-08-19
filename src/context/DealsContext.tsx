'use client';

import { createContext, useContext, useState, ReactNode, useRef } from 'react';
import type { Deal } from '@/lib/types';

interface DealsContextType {
  deals: Deal[];
  addDeal: (deal: Omit<Deal, '_id'>) => void;
  setDeals: (deals: Deal[]) => void;
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

export const DealsProvider = ({ children, initialDeals = [] }: { children: ReactNode, initialDeals?: Deal[] }) => {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);

  // To prevent hydration issues, we can also ensure state is initialized once.
  const isInitialized = useRef(false);
  if (!isInitialized.current && initialDeals.length > 0) {
    setDeals(initialDeals);
    isInitialized.current = true;
  }

  const addDeal = (deal: Omit<Deal, '_id'>) => {
    const newDeal = { ...deal, _id: new Date().getTime().toString() }; // More robust ID
    setDeals(prevDeals => [...prevDeals, newDeal]);
  };

  return (
    <DealsContext.Provider value={{ deals, addDeal, setDeals: (next) => setDeals(next) }}>
      {children}
    </DealsContext.Provider>
  );
};

export const useDeals = () => {
  const context = useContext(DealsContext);
  if (context === undefined) {
    throw new Error('useDeals must be used within a DealsProvider');
  }
  return context;
};
