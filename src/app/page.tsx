import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { categories } from "@/lib/catalog";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";

async function fetchSection(params: { category?: string; featured?: boolean; limit?: number }) {
  const sp = new URLSearchParams();
  if (params.category) sp.set("category", params.category);
  if (params.featured) sp.set("featured", "1");
  if (params.limit) sp.set("limit", String(params.limit));
  const envBase = process.env.NEXT_PUBLIC_BASE_URL;
  let url: string;
  if (envBase) {
    url = `${envBase}/api/products?${sp.toString()}`;
  } else {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
    const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
    const base = `${proto}://${host}`;
    url = `${base}/api/products?${sp.toString()}`;
  }
  const res = await fetch(url, { cache: "no-store", next: { revalidate: 0 } }).catch(() => null as any);
  if (!res?.ok) return [] as any[];
  return (await res.json()) as any[];
}

export default async function Home() {
  const placeholderImages = [
    "https://source.unsplash.com/1200x900/?electronics,gadgets",
    "https://source.unsplash.com/1200x900/?fashion,clothes",
    "https://source.unsplash.com/1200x900/?home,deco",
    "https://source.unsplash.com/1200x900/?furniture,interior",
    "https://source.unsplash.com/1200x900/?sale,shopping",
    "https://source.unsplash.com/1200x900/?canada,souvenir",
  ];
  // Preload key sections in parallel for performance
  const [gadgets, fashion, decor, furniture, clearance, souvenirs] = await Promise.all([
    fetchSection({ category: "household-appliances", featured: true, limit: 6 }),
    fetchSection({ category: "clothing", featured: true, limit: 6 }),
    fetchSection({ category: "bath-linen", featured: true, limit: 6 }),
    fetchSection({ category: "furniture", featured: true, limit: 6 }), // may be empty until added
    fetchSection({ featured: true, limit: 6 }),
    fetchSection({ category: "canada-souvenir", featured: true, limit: 6 }), // may be empty until added
  ]);

  return (
    <div className="space-y-10">
      {/* Hero Carousel */}
      <section>
        <HeroCarousel
          slides={[
            {
              title: "Featured Deals",
              subtitle:
                "Where value meets variety. Discover weekly savings across Clothing, Luggage, Bath & Linen, Appliances, Utensils, and more.",
              cta: { label: "Shop Now", href: "#gallery" },
              imageUrl: categories.find(c => c.imageUrl)?.imageUrl,
            },
            ...categories.slice(0, 2).map((c) => ({
              title: c.label,
              subtitle: "Browse our latest arrivals and essentials.",
              cta: { label: "Explore", href: `/category/${c.slug}` },
              imageUrl: c.imageUrl,
            })),
          ]}
        />
      </section>

      {/* Info Row */}
      <section className="grid md:grid-cols-4 gap-4" aria-label="Store info">
        <div className="card p-4">
          <div className="text-sm text-white/60">Address</div>
          <div className="font-medium">644 Danforth Ave & Pape Ave, Toronto, ON</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-white/60">Phone</div>
          <div className="font-medium">(123) 456-7890</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-white/60">Email</div>
          <div className="font-medium">info@pricewarstore.com</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-white/60">Tagline</div>
          <div className="font-medium">Where value meets variety.</div>
        </div>
      </section>

      {/* Product Gallery */}
      <section id="gallery" className="space-y-4">
        <h2 className="text-2xl font-semibold">Product Gallery</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((item) => (
            <Link
              key={item.slug}
              href={`/category/${item.slug}`}
              className="card p-3 hover:border-[var(--accent)]/60 transition">
              {item.imageUrl ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                  <Image
                    src={item.imageUrl}
                    alt={item.label}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-white/5 rounded-md flex items-center justify-center text-6xl">
                  <span aria-hidden>{item.emoji}</span>
                </div>
              )}
              <div className="mt-3 text-center font-medium">{item.label}</div>
            </Link>
          ))}
        </div>
      </section>

      

      {/* Curated Sections */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Trending Gadgets & Appliances</h2>
          <Link href="/products" className="text-sm hover:text-[var(--accent)]">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(gadgets.length ? gadgets : placeholderImages.map((img, i) => ({
            _id: `gadgets-placeholder-${i}`,
            name: `Gadget ${i + 1}`,
            price: 19.99 + i * 5,
            imageUrl: img,
            featured: true,
            description: "Limited time offer",
          }))).map((p: any) => (
            <ProductCard key={p._id || p.slug || p.name} id={(p._id || p.slug || p.name) as string} name={p.name} price={p.price} imageUrl={p.imageUrl} featured={p.featured} description={p.description} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Fashion's Top Deals</h2>
          <Link href="/products" className="text-sm hover:text-[var(--accent)]">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(fashion.length ? fashion : placeholderImages.map((img, i) => ({
            _id: `fashion-placeholder-${i}`,
            name: `Fashion Deal ${i + 1}`,
            price: 14.99 + i * 4,
            imageUrl: img,
            featured: true,
            description: "Hot pick this week",
          }))).map((p: any) => (
            <ProductCard key={p._id || p.slug || p.name} id={(p._id || p.slug || p.name) as string} name={p.name} price={p.price} imageUrl={p.imageUrl} featured={p.featured} description={p.description} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Home Decor & Furnishings</h2>
          <Link href="/products" className="text-sm hover:text-[var(--accent)]">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(decor.length ? decor : placeholderImages.map((img, i) => ({
            _id: `decor-placeholder-${i}`,
            name: `Decor Item ${i + 1}`,
            price: 9.99 + i * 3,
            imageUrl: img,
            featured: true,
            description: "Refresh your space",
          }))).map((p: any) => (
            <ProductCard key={p._id || p.slug || p.name} id={(p._id || p.slug || p.name) as string} name={p.name} price={p.price} imageUrl={p.imageUrl} featured={p.featured} description={p.description} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Furniture Deals</h2>
          <Link href="/products" className="text-sm hover:text-[var(--accent)]">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(furniture.length ? furniture : placeholderImages.map((img, i) => ({
            _id: `furniture-placeholder-${i}`,
            name: `Furniture ${i + 1}`,
            price: 49.99 + i * 10,
            imageUrl: img,
            featured: true,
            description: "Style meets comfort",
          }))).map((p: any) => (
            <ProductCard key={p._id || p.slug || p.name} id={(p._id || p.slug || p.name) as string} name={p.name} price={p.price} imageUrl={p.imageUrl} featured={p.featured} description={p.description} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Clearance Deals</h2>
          <Link href="/products" className="text-sm hover:text-[var(--accent)]">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(clearance.length ? clearance : placeholderImages.map((img, i) => ({
            _id: `clearance-placeholder-${i}`,
            name: `Clearance ${i + 1}`,
            price: 5.99 + i * 2,
            imageUrl: img,
            featured: true,
            description: "Last chance deal",
          }))).map((p: any) => (
            <ProductCard key={p._id || p.slug || p.name} id={(p._id || p.slug || p.name) as string} name={p.name} price={p.price} imageUrl={p.imageUrl} featured={p.featured} description={p.description} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Canada Souvenir</h2>
          <Link href="/products" className="text-sm hover:text-[var(--accent)]">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(souvenirs.length ? souvenirs : placeholderImages.map((img, i) => ({
            _id: `souvenir-placeholder-${i}`,
            name: `Souvenir ${i + 1}`,
            price: 7.99 + i * 2,
            imageUrl: img,
            featured: true,
            description: "Canada keepsake",
          }))).map((p: any) => (
            <ProductCard key={p._id || p.slug || p.name} id={(p._id || p.slug || p.name) as string} name={p.name} price={p.price} imageUrl={p.imageUrl} featured={p.featured} description={p.description} />
          ))}
        </div>
      </section>

    </div>
  );
}
