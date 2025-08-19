'use client';

import { useDeals } from '@/context/DealsContext';

export default function DealsPageClient() {
  const { deals } = useDeals();

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-16 animate-fade-in-down">
        <h1 className="text-5xl font-bold tracking-tight">Today's Hottest Deals</h1>
        <p className="mt-4 text-lg text-white/80 max-w-3xl mx-auto">
          Don't miss out on these limited-time offers. New deals are added daily, so check back often!
        </p>
      </header>

      <main>
        {deals && deals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((deal, i) => (
              <div
                key={deal._id}
                className="card p-6 flex flex-col group animate-fade-in-up"
                style={{ '--animation-delay': `${i * 150}ms` } as React.CSSProperties}>
                <div className="flex-grow">
                  <div className="text-sm text-accent font-semibold mb-2">{deal.category}</div>
                  <h3 className="text-xl font-bold mb-3">{deal.title}</h3>
                  <p className="text-white/70 text-sm">{deal.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 text-xs text-white/60">
                  Expires: {deal.expires}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-white/70">No deals available at the moment. Please check back later!</p>
          </div>
        )}
      </main>
    </div>
  );
}
