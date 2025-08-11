export default function LoadingCategory() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-56 bg-white/10 rounded" />
        <div className="h-4 w-24 bg-white/10 rounded" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-3 animate-pulse">
            <div className="h-40 w-full rounded-md bg-white/5" />
            <div className="mt-3 space-y-2">
              <div className="h-4 w-2/3 bg-white/10 rounded" />
              <div className="h-3 w-1/3 bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
