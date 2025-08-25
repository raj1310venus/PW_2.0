"use client";

import { useEffect, useRef } from "react";
import { useDeals } from "@/context/DealsContext";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";

// A compact horizontal banner carousel for deals/offers
// - small height, full width
// - auto-scrolls, with prev/next controls
// - matches project theme (dark surface, accent highlights)
export default function DealsBannerStrip() {
  const { deals } = useDeals();
  const ref = useRef<HTMLDivElement | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const formatExpires = (val: string) => {
    const d = new Date(val);
    return isNaN(d.getTime()) ? val : d.toLocaleDateString();
  };

  const scrollByAmount = () => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const dx = card ? card.offsetWidth + 12 : 260; // card width + gap
    el.scrollBy({ left: dx, behavior: "smooth" });
  };

  useEffect(() => {
    // Auto-scroll every 5s
    timer.current = setInterval(scrollByAmount, 5000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  if (!deals || deals.length === 0) return null;

  return (
    <section aria-label="Deals banner" className="relative">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold inline-flex items-center gap-2">
          <Tag className="size-4 text-[var(--accent)]" /> Limited-time Offers
        </h3>
        <div className="flex items-center gap-2">
          <button
            aria-label="Previous"
            className="h-8 w-8 grid place-items-center rounded-md bg-black/30 border border-token hover:bg-black/40"
            onClick={() => ref.current?.scrollBy({ left: -320, behavior: "smooth" })}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            aria-label="Next"
            className="h-8 w-8 grid place-items-center rounded-md bg-black/30 border border-token hover:bg-black/40"
            onClick={() => ref.current?.scrollBy({ left: 320, behavior: "smooth" })}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="no-scrollbar overflow-x-auto scroll-smooth"
      >
        <div className="flex gap-3">
          {deals.map((d) => (
            <article
              key={d._id}
              data-card
              className="min-w-[280px] max-w-[320px] flex-1 rounded-lg border border-token bg-[var(--surface)]/80 backdrop-blur hover:border-[var(--accent)]/50 transition-colors p-4"
            >
              <div className="text-sm text-muted-token">{formatExpires(d.expires)}</div>
              <div className="font-semibold mt-1 line-clamp-1">{d.title}</div>
              <p className="text-sm text-muted-token mt-1 line-clamp-2">{d.description}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-token">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-token">{d.category}</span>
                <Link href="/deals" className="text-[var(--accent)] hover:underline">View</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
