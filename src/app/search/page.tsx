import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";

export const metadata = {
  title: "Search | Price War Store",
};

async function searchProducts(q: string) {
  if (!q) return [] as any[];
  const sp = new URLSearchParams({ q });
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const res = await fetch(`${base}/api/products?${sp.toString()}`, { cache: "no-store", next: { revalidate: 0 } }).catch(() => null as any);
  if (!res?.ok) return [] as any[];
  return (await res.json()) as any[];
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams?.q || "").trim();
  const results = await searchProducts(q);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Search</h1>
          <p className="text-white/70">{q ? `Results for "${q}"` : "Type a search in the navbar to begin."}</p>
        </div>
        <Link href="/products" className="text-sm hover:text-[var(--accent)]">Browse categories</Link>
      </div>

      {!q && (
        <div className="text-white/60">Try searching for clothing, luggage, towels, utensils, or appliances.</div>
      )}

      {!!q && (
        <div>
          {results.length === 0 ? (
            <div className="text-white/60">No products found. Try a different search.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((p: any) => (
                <ProductCard key={p._id || p.slug} id={(p._id || p.slug) as string} name={p.name} price={p.price} imageUrl={p.imageUrl} featured={p.featured} description={p.description} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
