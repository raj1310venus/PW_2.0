"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutPage() {
  const { items, total, setQty, remove, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      if (items.length === 0) return;
      const payload = {
        currency: "cad",
        items: items.map((it) => ({
          productId: it.id,
          name: it.name,
          // Convert dollars to cents (fallback to 0 if price missing)
          price: Math.round(((it.price || 0) as number) * 100),
          quantity: it.qty,
          imageUrl: it.imageUrl,
        })),
      };

      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to create checkout session");
      }
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No redirect URL returned by server");
      }
    } catch (e: any) {
      setError(e?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

      {items.length === 0 ? (
        <div className="text-[var(--muted)]">Your cart is empty.</div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-3 p-4 border border-white/10 rounded-lg">
                <div className="size-16 rounded bg-white/5 overflow-hidden flex items-center justify-center">
                  {it.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.imageUrl} alt={it.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-xs text-white/40">No image</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{it.name}</div>
                  <div className="text-sm text-white/70">${(it.price || 0).toFixed(2)}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <button className="px-2 py-1 rounded bg-white/10" onClick={() => setQty(it.id, Math.max(1, it.qty - 1))} aria-label="Decrease quantity">-</button>
                    <span className="text-sm w-6 text-center">{it.qty}</span>
                    <button className="px-2 py-1 rounded bg-white/10" onClick={() => setQty(it.id, it.qty + 1)} aria-label="Increase quantity">+</button>
                    <button className="ml-2 text-red-400 hover:text-red-300" onClick={() => remove(it.id)}>Remove</button>
                  </div>
                </div>
                <div className="text-sm font-semibold">${(((it.price || 0) * it.qty).toFixed(2))}</div>
              </div>
            ))}
          </div>

          <div className="p-4 border border-white/10 rounded-lg flex items-center justify-between">
            <div className="text-lg font-semibold">Total: ${total.toFixed(2)}</div>
            <div className="flex gap-2">
              <button className="btn-secondary" onClick={clear}>Clear Cart</button>
              <button className="btn-accent" onClick={startCheckout} disabled={loading}>
                {loading ? "Processing..." : "Pay with Stripe"}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 text-red-400">{error}</div>
          )}
        </>
      )}
    </div>
  );
}
