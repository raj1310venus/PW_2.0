"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo, useCallback } from "react";

export type Slide = {
  title: string;
  subtitle?: string;
  cta?: { label: string; href: string };
  imageUrl?: string;
};

export default function HeroCarousel({ slides, interval = 4500 }: { slides: Slide[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = slides.length;
  const clamp = useCallback((i: number) => ((i % count) + count) % count, [count]);

  const next = useCallback(() => setIndex((i) => clamp(i + 1)), [clamp]);
  const prev = useCallback(() => setIndex((i) => clamp(i - 1)), [clamp]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [paused, count, next, interval]);

  const trackStyle = useMemo(() => ({ transform: `translateX(-${index * 100}%)` }), [index]);

  return (
    <div
      className="relative h-[220px] md:h-[360px] overflow-hidden rounded-lg bg-[var(--surface)] border border-white/10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Sliding track */}
      <div className="relative w-full h-full">
        <div
          className="flex h-full w-full transition-transform duration-700 ease-out"
          style={trackStyle}
        >
          {slides.map((s, i) => (
            <div key={i} className="relative w-full shrink-0 h-full">
              {/* Image background */}
              {s.imageUrl && (
                <Image
                  src={s.imageUrl}
                  alt={s.title}
                  fill
                  priority={i === index}
                  sizes="(max-width: 768px) 100vw, 1024px"
                  className="object-cover opacity-60"
                />
              )}

              {/* Content */}
              <div className="relative p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-semibold mb-2">{s.title}</h2>
                {s.subtitle && <p className="text-white/80 mb-4 max-w-xl">{s.subtitle}</p>}
                {s.cta && (
                  <Link href={s.cta.href} className="inline-block btn-accent px-4 py-2 rounded-md">
                    {s.cta.label}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev/Next controls */}
      {count > 1 && (
        <>
          <button
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center"
            onClick={prev}
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center"
            onClick={next}
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-[var(--accent)]" : "w-3 bg-white/40"}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
