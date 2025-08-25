'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import type { Deal } from '@/lib/types';

interface DealsContextType {
  deals: Deal[];
  addDeal: (deal: Omit<Deal, '_id'>) => void;
  updateDeal: (id: string, patch: Partial<Omit<Deal, '_id'>>) => void;
  deleteDeal: (id: string) => void;
  setDeals: (deals: Deal[]) => void;
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

const STORAGE_KEY = 'pws-deals';

export const DealsProvider = ({ children, initialDeals = [] }: { children: ReactNode, initialDeals?: Deal[] }) => {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);

  // One-time hydration from localStorage, then fallback to initialDeals
  const isHydrated = useRef(false);
  useEffect(() => {
    if (isHydrated.current) return;
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as Deal[];
        if (Array.isArray(parsed)) {
          setDeals(parsed);
        }
      } else if (initialDeals && initialDeals.length) {
        setDeals(initialDeals);
      }
    } catch {}
    isHydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
      }
    } catch {}
  }, [deals]);

  const addDeal = (deal: Omit<Deal, '_id'>) => {
    const newDeal: Deal = { ...deal, _id: crypto?.randomUUID?.() || String(Date.now()) } as Deal;
    setDeals(prev => [...prev, newDeal]);
  };

  const updateDeal = (id: string, patch: Partial<Omit<Deal, '_id'>>) => {
    setDeals(prev => prev.map(d => (d._id === id ? { ...d, ...patch } : d)));
  };

  const deleteDeal = (id: string) => {
    setDeals(prev => prev.filter(d => d._id !== id));
  };

  const value = useMemo(() => ({ deals, addDeal, updateDeal, deleteDeal, setDeals }), [deals]);

  return (
    <DealsContext.Provider value={value}>
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
