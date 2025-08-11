import Link from "next/link";
import ProductCard from "@/components/ProductCard";

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Params }) {
  const title = `${decodeURIComponent(params.slug).replace(/-/g, " ")}`;
  return { title: `${title} | Price War Store` };
}

type Product = {
  _id?: string;
  name: string;
  slug: string;
  categorySlug: string;
  price?: number;
  imageUrl?: string;
  description?: string;
};

export default async function CategoryPage({ params }: { params: Params }) {
  const title = decodeURIComponent(params.slug).replace(/-/g, " ");
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/products?category=${encodeURIComponent(params.slug)}`,
    { cache: "no-store", next: { revalidate: 0 } }
  ).catch(() => null as any);
  let products: Product[] = [];
  try {
    if (res?.ok) products = await res.json();
  } catch {}
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <Link href="/products" className="text-sm hover:text-[var(--accent)]">Back to Products</Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <ProductCard
            key={p.slug}
            id={(p._id || p.slug) as string}
            name={p.name}
            price={p.price}
            imageUrl={p.imageUrl}
            featured={false}
            description={p.description}
          />
        ))}
        {!products.length && (
          <div className="text-white/60">No products in this category yet. Add some in the Admin dashboard.</div>
        )}
      </div>
    </div>
  );
}
