"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export default function AdminCategoriesPage() {
  const admin = requireAdmin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);

  const [form, setForm] = useState({
    label: "",
    slug: "",
    imageUrl: "",
  });

  const canSubmit = useMemo(() => form.label.trim().length > 0, [form.label]);

  useEffect(() => {
    if (!admin.ok) return;
    const load = async () => {
      try {
        const res = await fetch("/api/admin/categories", { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        console.warn("Failed to load categories", e?.message || e);
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
        label: form.label.trim(),
        slug: form.slug.trim() || undefined,
        imageUrl: form.imageUrl.trim() || undefined,
      };
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const created = await res.json();
      setSuccess("Category created");
      setItems((prev) => [created, ...prev]);
      setForm({ label: "", slug: "", imageUrl: "" });
    } catch (e: any) {
      setError(e?.message || "Failed to create category");
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
        <h1 className="text-2xl font-semibold mb-2">Categories</h1>
        <p className="text-white/70">Create and view categories.</p>
      </div>

      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="block text-sm mb-1">Label</label>
          <input className="input" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Slug (optional)</label>
          <input className="input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="e.g. electronics" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm mb-1">Image URL</label>
          <input className="input" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
        </div>
        <div className="sm:col-span-2 md:col-span-3 flex gap-2">
          <button className="btn-accent" type="submit" disabled={!canSubmit || loading}>{loading ? "Saving..." : "Save category"}</button>
          {error && <span className="text-red-400 text-sm">{error}</span>}
          {success && <span className="text-green-400 text-sm">{success}</span>}
        </div>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-3">Existing categories</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-white/70">
              <tr>
                <th className="py-2 pr-3">Label</th>
                <th className="py-2 pr-3">Slug</th>
                <th className="py-2 pr-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it._id || it.slug} className="border-t border-white/10">
                  <td className="py-2 pr-3">{it.label}</td>
                  <td className="py-2 pr-3">{it.slug}</td>
                  <td className="py-2 pr-3">{it.updatedAt}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className="py-3 text-white/60" colSpan={3}>No categories yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
