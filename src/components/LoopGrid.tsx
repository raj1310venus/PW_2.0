"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

export type LoopItem = {
  id: string;
  name: string;
  imageUrl?: string | null;
  price?: number;
  href?: string;
};

export default function LoopGrid({ title, items = [] as LoopItem[] }: { title?: string; items: LoopItem[] }) {
  const display = useMemo(() => {
    // Duplicate items to create an infinite-like loop illusion
    const base = items.length ? items : [];
    return [...base, ...base];
  }, [items]);

  return (
    <section className="space-y-4">
      {title ? <h2 className="text-2xl font-semibold">{title}</h2> : null}
      <div className="relative">
        <div className="group overflow-hidden rounded-lg border border-white/10 bg-white/5">
          <div className="flex gap-4 whitespace-nowrap will-change-transform animate-marquee group-hover:[animation-play-state:paused]">
            {display.map((it, idx) => (
              <Link
                key={`${it.id}-${idx}`}
                href={it.href || "#"}
                className="inline-flex w-[220px] shrink-0 flex-col rounded-md bg-black/30 hover:bg-black/40 border border-white/10 transition p-3"
              >
                <div className="relative h-[140px] w-full overflow-hidden rounded">
                  <Image
                    src={it.imageUrl || "https://source.unsplash.com/300x200/?item"}
                    alt={it.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="mt-2 line-clamp-2 text-sm font-medium">{it.name}</div>
                {typeof it.price === "number" ? (
                  <div className="mt-1 text-[var(--accent)] font-semibold">${it.price.toFixed(2)}</div>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        @media (max-width: 640px) {
          .animate-marquee { animation-duration: 35s; }
        }
      `}</style>
    </section>
  );
}
