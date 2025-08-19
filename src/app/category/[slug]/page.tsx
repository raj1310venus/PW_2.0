import Link from "next/link";
import ProductCard from "@/components/ProductCard";

interface Params { slug: string }

const electronicsProducts = [
  { name: "Laptop", slug: "laptop", categorySlug: "electronics", price: 1200, imageUrl: "/images/laptop.png", description: "A high-performance laptop." },
  { name: "Smartphone", slug: "smartphone", categorySlug: "electronics", price: 800, imageUrl: "/images/smartphone.png", description: "A latest model smartphone." },
  { name: "Headphones", slug: "headphones", categorySlug: "electronics", price: 150, imageUrl: "/images/headphones.png", description: "Noise-cancelling headphones." },
];

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
  // Use relative URL for server-side fetching since we're on the same server
  const apiUrl = `/api/products?category=${encodeURIComponent(params.slug)}`;
  console.log('Fetching products from:', apiUrl);
  
  const res = await fetch(`http://localhost:4000${apiUrl}`, { cache: "no-store", next: { revalidate: 0 } }).catch((error) => {
    console.error('Fetch error:', error);
    return null as any;
  });
  
  let products: Product[] = [];
  try {
    if (res?.ok) {
      products = await res.json();
      console.log('Fetched products:', products);
    } else {
      console.log('API response not ok:', res?.status, res?.statusText);
    }
  } catch (error) {
    console.error('JSON parse error:', error);
  }

  console.log('Final products for category', params.slug, ':', products);

  if (params.slug === 'electronics' && !products.length) {
    console.log('Using fallback electronics products');
    products = electronicsProducts;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <div className="flex items-center gap-4">
          <Link href="/products" className="text-sm hover:text-[var(--accent)]">Back to Products</Link>
        </div>
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
