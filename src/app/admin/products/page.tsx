"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

// Category options requested by user
const CATEGORY_OPTIONS = [
  { label: "Electronics", slug: "electronics" },
  { label: "Hardware", slug: "hardware" },
  { label: "Clothing", slug: "clothing" },
  { label: "Luggage", slug: "luggage" },
  { label: "Bath & Linen", slug: "bath-linen" },
  { label: "Household Appliances", slug: "household-appliances" },
  { label: "Utensils", slug: "utensils" },
  { label: "Bath Mats, Rugs & Carpets", slug: "bath-mats-rugs-carpets" },
];

export default function AdminProductsPage() {
  const admin = requireAdmin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    categorySlug: CATEGORY_OPTIONS[0].slug,
    price: "",
    imageUrl: "",
    description: "",
    featured: false,
  });

  const canSubmit = useMemo(() => {
    return form.name.trim().length > 0 && form.categorySlug.trim().length > 0;
  }, [form.name, form.categorySlug]);

  useEffect(() => {
    if (!admin.ok) return;
    const load = async () => {
      try {
        const res = await fetch("/api/admin/products", { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        console.warn("Failed to load products", e?.message || e);
      }
    };
    load();
  }, [admin.ok]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        categorySlug: form.categorySlug,
        price: Number(form.price) || 0,
        imageUrl: form.imageUrl.trim() || undefined,
        description: form.description.trim() || undefined,
        featured: !!form.featured,
      };
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const created = await res.json();
      setSuccess("Product created");
      setItems((prev) => [created, ...prev]);
      setForm({
        name: "",
        slug: "",
        categorySlug: CATEGORY_OPTIONS[0].slug,
        price: "",
        imageUrl: "",
        description: "",
        featured: false,
      });
    } catch (e: any) {
      setError(e?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  if (!admin.ok) {
    return (
      <div className="max-w-md">
        <h2 className="text-xl font-semibold mb-2">Admin access required</h2>
        <p className="text-white/70 mb-3">Go to Admin and sign in with your token.</p>
        <Link href="/admin" className="btn-accent">Go to Admin</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Products</h1>
        <p className="text-white/70">Create products for any of your categories.</p>
      </div>

      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="block text-sm mb-1">Name</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Slug (optional)</label>
          <input className="input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="e.g. airpods-pro" />
        </div>
        <div>
          <label className="block text-sm mb-1">Category</label>
          <select className="input" value={form.categorySlug} onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Price (in cents)</label>
          <input className="input" type="number" inputMode="numeric" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. 12999" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm mb-1">Image URL</label>
          <input className="input" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
        </div>
        <div className="sm:col-span-2 md:col-span-3">
          <label className="block text-sm mb-1">Description</label>
          <textarea className="input min-h-[80px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          <span className="text-sm">Featured</span>
        </label>
        <div className="sm:col-span-2 md:col-span-3 flex gap-2">
          <button className="btn-accent" type="submit" disabled={!canSubmit || loading}>{loading ? "Saving..." : "Save product"}</button>
          {error && <span className="text-red-400 text-sm">{error}</span>}
          {success && <span className="text-green-400 text-sm">{success}</span>}
        </div>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-3">Existing products</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-white/70">
              <tr>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Price</th>
                <th className="py-2 pr-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it._id || it.slug} className="border-t border-white/10">
                  <td className="py-2 pr-3">{it.name}</td>
                  <td className="py-2 pr-3">{it.categorySlug}</td>
                  <td className="py-2 pr-3">${((it.price || 0) / 100).toFixed(2)}</td>
                  <td className="py-2 pr-3">{it.updatedAt}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className="py-3 text-white/60" colSpan={4}>No products yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
