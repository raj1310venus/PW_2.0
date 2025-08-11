export const metadata = {
  title: "Deals | Price War Store",
};

export default function DealsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Featured Deals</h1>
      <p className="text-white/70">
        Promotions and weekly savings. Admin will control these cards from the dashboard later.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card p-4">
            <div className="h-32 bg-white/5 rounded mb-3" />
            <div className="font-medium">Deal #{i}</div>
            <div className="text-sm text-white/60">Short description goes here.</div>
          </div>
        ))}
      </div>
    </div>
  );
}
