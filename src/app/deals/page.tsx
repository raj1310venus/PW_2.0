import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deals | Price War Store',
  description: 'Check out the latest deals and promotions at the Price War Store.',
};

const deals = [
  {
    title: '50% Off All Electronics',
    description: 'Upgrade your tech with half-price deals on laptops, headphones, and more. Limited time only!',
    category: 'Electronics',
    expires: 'in 3 days',
  },
  {
    title: 'Buy One Get One Free on T-Shirts',
    description: 'Stock up on your favorite styles. Mix and match any two t-shirts and get one for free.',
    category: 'Apparel',
    expires: 'this week',
  },
  {
    title: '$100 Off Home Appliances',
    description: 'From blenders to vacuums, save big on essential home appliances.',
    category: 'Home Goods',
    expires: 'in 5 days',
  },
  {
    title: 'Clearance on All Winter Gear',
    description: 'Get ready for next year with up to 70% off on all winter jackets, boots, and accessories.',
    category: 'Seasonal',
    expires: 'while supplies last',
  },
  {
    title: '20% Off All Groceries',
    description: 'Fill your pantry and save. Discount applied at checkout.',
    category: 'Groceries',
    expires: 'today only',
  },
  {
    title: 'Special Bundle: Gaming Console + 2 Games',
    description: 'Get the latest gaming console bundled with two blockbuster titles for one low price.',
    category: 'Gaming',
    expires: 'in 2 days',
  },
];

export default function DealsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-16 animate-fade-in-down">
        <h1 className="text-5xl font-bold tracking-tight">Today's Hottest Deals</h1>
        <p className="mt-4 text-lg text-white/80 max-w-3xl mx-auto">
          Don't miss out on these limited-time offers. New deals are added daily, so check back often!
        </p>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal, i) => (
            <div
              key={i}
              className="card p-6 flex flex-col group animate-fade-in-up opacity-0"
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
      </main>
    </div>
  );
}
