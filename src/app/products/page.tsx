export const metadata = {
  title: "Products | Price War Store",
};

type Category = { _id?: string; label: string; slug: string; imageUrl?: string };
import CategoryCard from "@/components/CategoryCard";

export default async function ProductsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/categories`, {
    // In dev without NEXT_PUBLIC_BASE_URL, relative fetch works in Node runtime
    cache: "no-store",
    next: { revalidate: 0 },
  }).catch(() => null as any);
  let categories: Category[] = [];
  try {
    if (res?.ok) categories = await res.json();
  } catch {}

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">All Products</h1>
      <p className="text-white/70">Browse categories and featured deals.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <CategoryCard key={c.slug} label={c.label} slug={c.slug} imageUrl={c.imageUrl} />
        ))}
        {!categories.length && (
          <div className="text-white/60">No categories yet. Add some in the Admin dashboard.</div>
        )}
      </div>
    </div>
  );
}
