"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { categories } from "@/lib/catalog";
import { useCart } from "@/contexts/CartContext";
import { Home, Package, Tag, Info, Phone, ShoppingCart, Search as SearchIcon, Sun, Moon, Menu as MenuIcon, X } from "lucide-react";

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
  const { data: session } = useSession();

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

  // Close cart on Escape key or click outside
  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCartOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      const cartButton = (e.target as HTMLElement).closest('[aria-label="Open cart"]');
      const cartPanel = (e.target as HTMLElement).closest('[aria-label="Shopping cart"]');
      if (!cartButton && !cartPanel) {
        setCartOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
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

  type NavLinksProps = { className?: string; variant?: "desktop" | "mobile" };
  const NavLinks = ({ className = "", variant = "desktop" }: NavLinksProps) => {
    const pathname = usePathname();
    return (
      <nav
        className={`${
          variant === "desktop"
            ? "hidden md:flex items-center gap-1"
            : "flex flex-col"
        } ${className}`}
      >
        {links.map((l) => {
          const active = pathname === l.href;
          const Icon =
            l.href === "/" ? Home :
            l.href === "/products" ? Package :
            l.href === "/deals" ? Tag :
            l.href === "/about" ? Info :
            l.href === "/contact" ? Phone :
            Home;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`relative rounded-md transition-colors group ${
                variant === "desktop" ? "px-3 py-2 text-sm" : "px-2 py-2 text-base"
              } ${
                active
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {l.label}
              </span>
              {variant === "desktop" && (
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-accent transition-all duration-300 ease-out ${
                    active
                      ? "w-[calc(100%-1.5rem)]"
                      : "w-0 group-hover:w-[calc(100%-1.5rem)]"
                  }`}
                />
              )}
            </Link>
          );
        })}
      </nav>
    );
  };

  return (
    <div className={`sticky top-0 z-50 border-b border-white/10 bg-[var(--surface)] backdrop-blur ${scrolled ? "shadow-[0_2px_12px_rgba(0,0,0,0.25)]" : ""}`}>
      <div className="mx-auto max-w-6xl px-4 py-3 grid items-center gap-3 md:gap-4" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
        {/* Left: Logo */}
        <div className="justify-self-start shrink-0">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-semibold tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
            <span className="relative inline-block h-[16px] w-[24px] rounded-sm overflow-hidden ring-1 ring-white/40">
              <Image src="/flags/ca.svg" alt="Canada" fill sizes="24px" className="object-cover" />
            </span>
            <span>PriceWar</span>
          </Link>
        </div>

        {/* Center: Nav (desktop) */}
        <div className="hidden md:flex items-center gap-8 xl:gap-12 justify-center min-w-0 overflow-x-auto no-scrollbar">
          <NavLinks />
        </div>

        {/* Right: Search + Auth + Theme + Cart + Mobile toggle */}
        <div className="justify-self-end flex items-center gap-2 min-w-0">
          <div className="flex-1 min-w-0 sm:flex items-center gap-2 bg-black/20 border border-white/10 rounded-md px-2 py-1 md:min-w-[200px] max-w-full">
            <SearchIcon size={16} className="opacity-70" />
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
          {/* Cart button and dropdown */}
          <div className="relative">
            <button
              title="Cart"
              aria-label="Open cart"
              className="relative h-8 w-8 grid place-items-center rounded-md bg-black/20 border border-white/10 shrink-0"
              onClick={() => setCartOpen(v => !v)}
            >
              <ShoppingCart size={16} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--accent)] text-black text-[11px] grid place-items-center font-semibold">
                  {count}
                </span>
              )}
            </button>

            {/* Cart Dropdown Panel */}
            <div
              className={`absolute top-full right-0 mt-2 w-80 md:w-96 bg-[var(--surface)] border border-white/10 rounded-lg shadow-xl z-50 origin-top-right transition-all duration-200 ease-out ${cartOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
              role="dialog"
              aria-label="Shopping cart"
              aria-hidden={!cartOpen}
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="text-lg font-semibold">Your Cart</div>
                <button aria-label="Close cart" className="h-8 w-8 grid place-items-center rounded-md bg-black/20 border border-white/10" onClick={() => setCartOpen(false)}>
                  <X size={16} />
                </button>
              </div>
              <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
                {items.length === 0 ? (
                  <div className="text-white/70 text-sm">Your cart is empty.</div>
                ) : (
                  items.map((it) => (
                    <div key={it.id} className="flex items-center gap-3">
                      <div className="size-14 rounded bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
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
                      <button className="h-8 w-8 grid place-items-center rounded-md bg-black/20 border border-white/10 shrink-0" aria-label="Remove item" onClick={() => remove(it.id)}>
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
              {items.length > 0 && (
                <div className="p-4 border-t border-white/10 bg-[var(--surface)]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-white/70">Subtotal</div>
                    <div className="text-base font-semibold">${total.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={clear} className="flex-1 btn-secondary">Clear Cart</button>
                    <button onClick={() => router.push('/checkout')} className="flex-1 btn-accent">Checkout</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Auth */}
          {session ? (
            <button
              onClick={() => signOut()}
              className="px-3 h-8 rounded-md bg-white/90 text-black border border-white/10 text-sm shrink-0"
              title={`Signed in as ${session.user?.email || session.user?.name || ''}`}
            >
              Sign out
            </button>
          ) : (
            <Link href="/signin" className="px-3 h-8 grid place-items-center rounded-md bg-white/10 border border-white/10 text-sm shrink-0">
              Sign in
            </Link>
          )}

          <button title={mode === 'auto' ? 'Theme: auto (system)' : 'Theme: manual'} aria-label="Toggle theme" aria-pressed={theme === 'light'} onClick={toggleTheme} className="h-8 w-8 grid place-items-center rounded-md bg-black/20 border border-white/10 shrink-0">
            {theme === 'light' ? (
              <Moon size={16} />
            ) : (
              <Sun size={16} />
            )}
          </button>
          <button
            aria-label="Open menu"
            aria-expanded={open}
            className="md:hidden h-8 w-8 grid place-items-center rounded-md bg-black/20 border border-white/10 shrink-0"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={16} /> : <MenuIcon size={16} />}
          </button>
        </div>
      </div>

      {/* Category strip (desktop) */}
      <div className="mx-auto max-w-6xl px-4 pb-2 hidden md:block">
        <nav className="flex items-center gap-4 text-sm overflow-x-auto no-scrollbar min-w-0">
          {categoryLinks.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="text-[var(--muted)] shrink-0 px-2 py-1 rounded hover:text-[var(--accent)] hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
            >
              {c.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Category strip (mobile) */}
      <div className="mx-auto max-w-6xl px-4 pb-2 md:hidden">
        <nav className="flex items-center gap-3 text-sm overflow-x-auto no-scrollbar min-w-0">
          {categoryLinks.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="text-[var(--muted)] shrink-0 px-2 py-1 rounded border border-white/10 hover:text-[var(--accent)] hover:bg-white/5 transition-colors"
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
        <NavLinks className="gap-2 pt-3" variant="mobile" />
      </div>
    </div>
  );
}
