"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { categories } from "@/lib/catalog";
import { useCart } from "@/contexts/CartContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/deals", label: "Deals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const categoryLinks = [
  { href: "/category/electronics", label: "Electronics" },
  { href: "/category/hardware", label: "Hardware" },
  { href: "/category/clothing", label: "Clothing" },
  { href: "/category/luggage", label: "Luggage" },
  { href: "/category/bath-linen", label: "Bath & Linen" },
  { href: "/category/household-appliances", label: "Household Appliances" },
  { href: "/category/utensils", label: "Utensils" },
  { href: "/category/bath-mats-rugs-carpets", label: "Bath Mats, Rugs & Carpets" },
];

export default function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const { items, count, total, setQty, remove, clear } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false); // close menu on route change
    setCartOpen(false);
  }, [pathname]);

  // Auto-open cart when an item is added
  useEffect(() => {
    const onAdd = () => setCartOpen(true);
    // @ts-ignore - CustomEvent type
    window.addEventListener('pws-cart:add', onAdd as EventListener);
    return () => {
      // @ts-ignore - CustomEvent type
      window.removeEventListener('pws-cart:add', onAdd as EventListener);
    };
  }, []);

  // Lock body scroll while cart is open and close on Escape
  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    if (cartOpen) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = prevOverflow || '';
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCartOpen(false);
    };
    if (cartOpen) window.addEventListener('keydown', onKey);
    return () => {
      body.style.overflow = prevOverflow || '';
      window.removeEventListener('keydown', onKey);
    };
  }, [cartOpen]);

  const submitSearch = () => {
    const query = q.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  // Initialize theme + auto-sync with system if mode === 'auto'
  useEffect(() => {
    const storedMode = (localStorage.getItem('pws-theme-mode') as "auto" | "manual") || 'auto';
    setMode(storedMode);
    const apply = (val: "light" | "dark") => {
      document.documentElement.setAttribute('data-theme', val);
      setTheme(val);
    };
    if (storedMode === 'auto') {
      const mq = window.matchMedia('(prefers-color-scheme: light)');
      apply(mq.matches ? 'light' : 'dark');
      const onChange = (e: MediaQueryListEvent) => {
        if ((localStorage.getItem('pws-theme-mode') || 'auto') === 'auto') {
          apply(e.matches ? 'light' : 'dark');
        }
      };
      mq.addEventListener?.('change', onChange);
      return () => mq.removeEventListener?.('change', onChange);
    } else {
      const current = (document.documentElement.getAttribute('data-theme') as "light" | "dark") || (localStorage.getItem('pws-theme') as any) || 'dark';
      apply(current);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('pws-theme', next);
      localStorage.setItem('pws-theme-mode', 'manual');
    } catch {}
    setMode('manual');
    setTheme(next);
  };

  const NavLinks = ({ className = "" }: { className?: string }) => (
    <nav className={`flex items-center gap-8 lg:gap-10 text-sm ${className}`}>
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`relative group px-1.5 py-0.5 transition-colors ${
              active ? "text-[var(--accent)]" : "hover:text-[var(--accent)]"
            }`}
          >
            {l.label}
            <span
              className={`pointer-events-none absolute -bottom-2 left-0 right-0 h-[2px] bg-[var(--accent)] rounded origin-left transition-transform duration-300 ease-out ${
                active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className={`border-b border-white/10 bg-[var(--surface)]/90 backdrop-blur ${scrolled ? "shadow-[0_2px_12px_rgba(0,0,0,0.25)]" : ""}`}>
      <div className="mx-auto max-w-6xl px-4 py-3 grid items-center gap-3 md:gap-4" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
        {/* Left: Logo */}
        <div className="justify-self-start shrink-0">
          <Link href="/" className="text-2xl font-semibold tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
            PriceWar
          </Link>
        </div>

        {/* Center: Nav (desktop) */}
        <div className="hidden md:flex items-center gap-8 xl:gap-12 justify-center min-w-0 overflow-x-auto no-scrollbar">
          <NavLinks />
        </div>

        {/* Right: Search + Theme + Cart + Mobile toggle */}
        <div className="justify-self-end flex items-center gap-2 min-w-0">
          <div className="flex-1 min-w-0 sm:flex items-center gap-2 bg-black/20 border border-white/10 rounded-md px-2 py-1 md:min-w-[200px] max-w-full">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-70"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/></svg>
            <input
              aria-label="Search for products, categories"
              placeholder="Search for products, categories"
              className="bg-transparent outline-none text-sm placeholder-white/50 w-full min-w-0"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submitSearch(); }}
            />
            <button
              className="hidden md:inline-flex btn-accent px-3 py-1 rounded text-sm"
              onClick={submitSearch}
            >
              Search
            </button>
          </div>
          {/* Cart button */}
          <button
            title="Cart"
            aria-label="Open cart"
            className="relative h-8 w-8 grid place-items-center rounded-md bg-black/20 border border-white/10 shrink-0"
            onClick={() => setCartOpen(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6h15l-1.5 9h-12L6 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 6 5 3H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="20" r="1.5" fill="currentColor"/><circle cx="18" cy="20" r="1.5" fill="currentColor"/></svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--accent)] text-black text-[11px] grid place-items-center font-semibold">
                {count}
              </span>
            )}
          </button>
          <button title={mode === 'auto' ? 'Theme: auto (system)' : 'Theme: manual'} aria-label="Toggle theme" aria-pressed={theme === 'light'} onClick={toggleTheme} className="h-8 w-8 grid place-items-center rounded-md bg-black/20 border border-white/10 shrink-0">
            {theme === 'light' ? (
              // Moon icon for switching to dark
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
            ) : (
              // Sun icon for switching to light
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.66-7.66-1.41 1.41M7.76 16.24l-1.41 1.41m0-11.31 1.41 1.41m9.49 9.49 1.41 1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            )}
          </button>
          <button aria-label="Open menu" className="md:hidden h-8 w-8 grid place-items-center rounded-md bg-black/20 border border-white/10 shrink-0" onClick={() => setOpen((v) => !v)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {/* Category strip */}
      <div className="mx-auto max-w-6xl px-4 pb-2 hidden md:block">
        <nav className="flex items-center gap-4 text-sm overflow-x-auto no-scrollbar min-w-0">
          {categoryLinks.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="shrink-0 px-2 py-1 rounded hover:text-[var(--accent)] hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
            >
              {c.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu (animated collapse) */}
      <div
        className={`md:hidden border-t border-white/10 px-4 transition-all duration-300 ease-out overflow-hidden ${
          open ? "max-h-64 opacity-100 pb-4" : "max-h-0 opacity-0 pb-0"
        }`}
        aria-hidden={!open}
      >
        <NavLinks className="flex flex-col gap-4 pt-3" />
      </div>

      {/* Cart Drawer */}
      <div
        className={`fixed inset-0 z-[100] ${cartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!cartOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${cartOpen ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setCartOpen(false)}
        />
        {/* Panel */}
        <aside
          className={`absolute right-0 top-0 h-full w-full sm:w-[90%] md:w-[420px] lg:w-[500px] bg-[var(--surface)] border-l border-white/10 shadow-xl transition-transform duration-300 ease-out ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}
          role="dialog"
          aria-label="Shopping cart"
        >
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="text-lg font-semibold">Your Cart</div>
            <button aria-label="Close cart" className="h-8 w-8 grid place-items-center rounded-md bg-black/20 border border-white/10" onClick={() => setCartOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-180px)]">
            {items.length === 0 ? (
              <div className="text-white/70 text-sm">Your cart is empty.</div>
            ) : (
              items.map((it) => (
                <div key={it.id} className="flex items-center gap-3">
                  <div className="size-14 rounded bg-white/5 overflow-hidden flex items-center justify-center">
                    {it.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.imageUrl} alt={it.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-xs text-white/40">No image</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{it.name}</div>
                    <div className="text-xs text-white/60">${(it.price || 0).toFixed(2)}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <button className="px-2 py-1 rounded bg-white/10" onClick={() => setQty(it.id, Math.max(1, it.qty - 1))} aria-label="Decrease quantity">-</button>
                      <span className="text-sm w-6 text-center">{it.qty}</span>
                      <button className="px-2 py-1 rounded bg-white/10" onClick={() => setQty(it.id, it.qty + 1)} aria-label="Increase quantity">+</button>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">${(((it.price || 0) * it.qty).toFixed(2))}</div>
                  <button className="h-8 w-8 grid place-items-center rounded-md bg-black/20 border border-white/10" aria-label="Remove item" onClick={() => remove(it.id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-white/10 bg-[var(--surface)]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-white/70">Subtotal</div>
              <div className="text-base font-semibold">${total.toFixed(2)}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex-1 btn-accent px-3 py-2 rounded text-sm" onClick={() => setCartOpen(false)}>Checkout</button>
              {items.length > 0 && (
                <button className="px-3 py-2 rounded text-sm bg-white/10 border border-white/10" onClick={clear}>Clear</button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
