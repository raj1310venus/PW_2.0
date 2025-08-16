"use client";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";

export type ProductCardProps = {
  id: string; // stable id: _id or slug
  name: string;
  price?: number;
  imageUrl?: string;
  featured?: boolean;
  description?: string;
};

export default function ProductCard({ id, name, price, imageUrl, featured, description }: ProductCardProps) {
  const { add } = useCart();
  return (
    <div className="card p-3 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-all">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
        ) : (
          <div className="h-full w-full" />
        )}
        {featured && (
          <span className="absolute top-2 left-2 text-[10px] px-2 py-1 rounded bg-[var(--accent)]/90 text-black font-semibold">
            Featured
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <div className="font-medium leading-tight line-clamp-2">{name}</div>
        {price !== undefined && (
          <div className="text-[13px] text-[var(--accent)] font-semibold">${price.toFixed(2)}</div>
        )}
        {description && (
          <div className="text-xs text-white/60 line-clamp-2">{description}</div>
        )}
        <div className="pt-2">
          <button
            className="btn-accent px-3 py-1.5 rounded text-sm"
            onClick={() => {
              add({ id, name, price, imageUrl });
              try { window.dispatchEvent(new CustomEvent('pws-cart:add', { detail: { id, name } })); } catch {}
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
