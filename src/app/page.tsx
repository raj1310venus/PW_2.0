import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { categories } from "@/lib/catalog";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import ChatbotLoader from '@/components/ChatbotLoader';
import { MapPin, Phone, Mail, Sparkles } from 'lucide-react';

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
  const sectionPlaceholders = {
    'household-appliances': '/images/product-gallery/HouseHold Appliances Product Gallery.png',
    'clothing': '/images/product-gallery/Clothing Product gallery.png',
    'bath-linen': '/images/product-gallery/Bath and linen Prodct Gallery.png',
    'luggage': '/images/product-gallery/Luggage Product Gallery.png',
    'utensils': '/images/product-gallery/Utensils Product Gallery.png',
    'carpets': '/images/product-gallery/Carpet Product Gallery.png',
    'default': 'https://source.unsplash.com/1200x900/?product,item',
  };
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
              title: "Refresh Your Wardrobe",
              subtitle: "Explore the latest trends in fashion for the whole family. Quality apparel at prices you'll love.",
              cta: { label: "Explore Fashion", href: "/products?category=clothing" },
              imageUrl: "/images/banners/carousel slider 2.png",
            },
            {
              title: "Transform Your Living Space",
              subtitle: "From stylish decor to essential appliances, find everything you need to create your dream home.",
              cta: { label: "Shop Home Goods", href: "/products?category=household-appliances" },
              imageUrl: "/images/banners/carousel slider 3.png",
            },
            {
              title: "Unbeatable Deals Every Day",
              subtitle: "Discover massive savings on electronics, furniture, and more. Your one-stop shop for value.",
              cta: { label: "Shop All Deals", href: "/products" },
              imageUrl: "/images/banners/carousel slider 1.png",
            },
          ]}
        />
      </section>

      {/* Info Row */}
      <section className="grid md:grid-cols-4 gap-4" aria-label="Store info">
        <a
          href="https://www.google.com/maps/search/?api=1&query=644+Danforth+Ave+%26+Pape+Ave,+Toronto,+ON"
          target="_blank"
          rel="noopener noreferrer"
          className="card p-4 flex items-start gap-3 group transition-colors hover:bg-gradient-to-br from-white/10 to-white/5"
        >
          <MapPin className="size-5 mt-0.5 text-white/60 transition-transform group-hover:scale-110 group-hover:text-accent" />
          <div>
            <div className="text-sm text-white/60">Address</div>
            <div className="font-medium">644 Danforth Ave & Pape Ave, Toronto, ON</div>
          </div>
        </a>
        <a href="tel:+1-123-456-7890" className="card p-4 flex items-start gap-3 group transition-colors hover:bg-gradient-to-br from-white/10 to-white/5">
          <Phone className="size-5 mt-0.5 text-white/60 transition-transform group-hover:animate-shake group-hover:text-accent" />
          <div>
            <div className="text-sm text-white/60">Phone</div>
            <div className="font-medium">(123) 456-7890</div>
          </div>
        </a>
        <a href="mailto:info@pricewarstore.com" className="card p-4 flex items-start gap-3 group transition-colors hover:bg-gradient-to-br from-white/10 to-white/5">
          <Mail className="size-5 mt-0.5 text-white/60 transition-transform group-hover:-translate-y-0.5 group-hover:text-accent" />
          <div>
            <div className="text-sm text-white/60">Email</div>
            <div className="font-medium">info@pricewarstore.com</div>
          </div>
        </a>
        <div className="card p-4 flex items-start gap-3 group transition-colors hover:bg-gradient-to-br from-white/10 to-white/5">
          <Sparkles className="size-5 mt-0.5 text-white/60 transition-transform group-hover:scale-110 group-hover:text-accent" />
          <div>
            <div className="text-sm text-white/60">Tagline</div>
            <div className="font-medium">Where value meets variety.</div>
          </div>
        </div>
      </section>

      {/* Product Gallery */}
      <section id="gallery" className="space-y-4">
        <h2 className="text-2xl font-semibold">Product Gallery</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Clothing', slug: 'clothing', imageUrl: '/images/product-gallery/Clothig Product gallery.png' },
            { name: 'Luggage', slug: 'luggage', imageUrl: '/images/product-gallery/Luggage Product Gallery.png' },
            { name: 'Bath & Linen', slug: 'bath-linen', imageUrl: '/images/product-gallery/Bath and linen Prodct Gallery.png' },
            { name: 'Household Appliances', slug: 'household-appliances', imageUrl: '/images/product-gallery/HouseHold Appliances Product Gallery.png' },
            { name: 'Utensils', slug: 'utensils', imageUrl: '/images/product-gallery/Utensils Product Gallery.png' },
            { name: 'Bath Mats, Rugs & Carpets', slug: 'bath-mats-rugs-carpets', imageUrl: '/images/product-gallery/Carpet Product Gallery.png' },
          ].map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="card p-3 hover:border-[var(--accent)]/60 transition group"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                <Image
                  src={c.imageUrl}
                  alt={c.name}
                  fill
                  className="object-contain transition-transform duration-500 ease-in-out group-hover:scale-110"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="mt-3 text-center font-medium transition-all duration-300 group-hover:bg-black/20 group-hover:backdrop-blur-sm group-hover:py-2 group-hover:px-4 group-hover:rounded-lg">{c.name}</div>
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
          {(gadgets.length ? gadgets : Array.from({ length: 6 }).map((_, i) => ({
            _id: `gadget-placeholder-${i}`,
            name: `Appliance ${i + 1}`,
            price: 29.99 + i * 10,
            imageUrl: sectionPlaceholders['household-appliances'],
            featured: true,
            description: "Latest tech picks",
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
          {(fashion.length ? fashion : Array.from({ length: 6 }).map((_, i) => ({
            _id: `fashion-placeholder-${i}`,
            name: `Fashion Item ${i + 1}`,
            price: 19.99 + i * 5,
            imageUrl: sectionPlaceholders['clothing'],
            featured: true,
            description: "Latest trends",
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
          {(decor.length ? decor : Array.from({ length: 6 }).map((_, i) => ({
            _id: `decor-placeholder-${i}`,
            name: `Decor Item ${i + 1}`,
            price: 9.99 + i * 3,
            imageUrl: sectionPlaceholders['bath-linen'],
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
          {(furniture.length ? furniture : Array.from({ length: 6 }).map((_, i) => ({
            _id: `furniture-placeholder-${i}`,
            name: `Furniture ${i + 1}`,
            price: 49.99 + i * 10,
            imageUrl: sectionPlaceholders['luggage'], // Using luggage as placeholder
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
          {(clearance.length ? clearance : Array.from({ length: 6 }).map((_, i) => ({
            _id: `clearance-placeholder-${i}`,
            name: `Clearance ${i + 1}`,
            price: 5.99 + i * 2,
            imageUrl: sectionPlaceholders['utensils'], // Using utensils as placeholder
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
          {(souvenirs.length ? souvenirs : Array.from({ length: 6 }).map((_, i) => ({
            _id: `souvenir-placeholder-${i}`,
            name: `Souvenir ${i + 1}`,
            price: 7.99 + i * 2,
            imageUrl: sectionPlaceholders['carpets'], // Using carpets as placeholder
            featured: true,
            description: "Canada keepsake",
          }))).map((p: any) => (
            <ProductCard key={p._id || p.slug || p.name} id={(p._id || p.slug || p.name) as string} name={p.name} price={p.price} imageUrl={p.imageUrl} featured={p.featured} description={p.description} />
          ))}
        </div>
      </section>

      <ChatbotLoader />
    </div>
  );
}
