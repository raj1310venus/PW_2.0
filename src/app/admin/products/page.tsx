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
  const [filterCat, setFilterCat] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [confirm, setConfirm] = useState<{ open: boolean; ids: string[]; message: string }>({ open: false, ids: [], message: "" });

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

  // Derived: filtered list by category
  const filteredItems = useMemo(() => {
    if (!filterCat) return items;
    return items.filter((it: any) => String(it.categorySlug) === String(filterCat));
  }, [items, filterCat]);

  // Pagination derived
  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredItems.length / pageSize)), [filteredItems.length]);
  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);

  // Cloudinary unsigned upload support (optional)
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const canUpload = !!cloudName && !!uploadPreset;

  const uploadImage = async (file: File, onUrl: (u: string) => void) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset as string);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    onUrl(String(data.secure_url || data.url));
  };

  // Inline edit helpers
  const startEdit = (row: any) => {
    const id = String(row._id || row.slug || "");
    setEditingId(id);
    setEditForm({
      name: row.name || "",
      slug: row.slug || "",
      categorySlug: row.categorySlug || CATEGORY_OPTIONS[0].slug,
      price: String(row.price ?? ""),
      imageUrl: row.imageUrl || "",
      description: row.description || "",
      featured: !!row.featured,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        name: String(editForm.name || "").trim(),
        slug: (editForm.slug ? String(editForm.slug).trim() : undefined) as string | undefined,
        categorySlug: String(editForm.categorySlug || ""),
        price: Number(editForm.price) || 0,
        imageUrl: editForm.imageUrl ? String(editForm.imageUrl).trim() : undefined,
        description: editForm.description ? String(editForm.description).trim() : undefined,
        featured: !!editForm.featured,
      };
      const res = await fetch(`/api/admin/products/${id}` ,{
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setItems((prev) => prev.map((it: any) => (String(it._id || it.slug) === String(id) ? updated : it)));
      setSuccess("Product updated");
      cancelEdit();
    } catch (e: any) {
      setError(e?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const doDelete = async (ids: string[]) => {
    setLoading(true); setError(null); setSuccess(null);
    try {
      for (const id of ids) {
        const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(await res.text());
      }
      setItems((prev) => prev.filter((it: any) => !ids.includes(String(it._id || it.slug))));
      setSelected([]);
      setSuccess(ids.length > 1 ? "Products deleted" : "Product deleted");
    } catch (e: any) {
      setError(e?.message || "Failed to delete product");
    } finally { setLoading(false); setConfirm({ open: false, ids: [], message: "" }); }
  };
  const confirmDelete = (ids: string[]) => {
    setConfirm({ open: true, ids, message: ids.length > 1 ? `Delete ${ids.length} products?` : "Delete this product?" });
  };
  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const toggleSelectAllCurrentPage = () => {
    const ids = pagedItems.map((it) => String(it._id || it.slug));
    const allSelected = ids.every((id) => selected.includes(id));
    setSelected((prev) => (allSelected ? prev.filter((id) => !ids.includes(id)) : Array.from(new Set([...prev, ...ids]))));
  };

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

      {confirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-zinc-900 p-5 rounded-md w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">Confirm</h3>
            <p className="text-white/80">{confirm.message}</p>
            <div className="flex gap-2 justify-end">
              <button className="btn-secondary" onClick={() => setConfirm({ open: false, ids: [], message: '' })} type="button">Cancel</button>
              <button className="btn-accent" onClick={() => doDelete(confirm.ids)} type="button" disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}

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
          <div className="flex gap-2">
            <input className="input flex-1" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
            {canUpload && (
              <label className="btn-secondary shrink-0 cursor-pointer">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    try {
                      setLoading(true);
                      await uploadImage(f, (u) => setForm((prev) => ({ ...prev, imageUrl: u })));
                    } catch (err: any) {
                      setError(err?.message || "Upload failed");
                    } finally {
                      setLoading(false);
                    }
                  }}
                />
              </label>
            )}
          </div>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <h2 className="text-xl font-semibold">Existing products</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm">Filter:</label>
              <select className="input" value={filterCat} onChange={(e) => { setFilterCat(e.target.value); setPage(1); }}>
                <option value="">All</option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.label}</option>
                ))}
              </select>
            </div>
            {selected.length > 0 && (
              <button className="btn-secondary" type="button" onClick={() => confirmDelete(selected)} disabled={loading}>
                Delete selected ({selected.length})
              </button>
            )}
            <div className="text-sm text-white/70">Page {page} / {totalPages}</div>
            <div className="flex gap-2">
              <button className="btn-secondary" type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
              <button className="btn-secondary" type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-white/70">
              <tr>
                <th className="py-2 pr-3">
                  <input type="checkbox" onChange={toggleSelectAllCurrentPage} checked={pagedItems.length > 0 && pagedItems.every((it) => selected.includes(String(it._id || it.slug)))} />
                </th>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Price</th>
                <th className="py-2 pr-3">Updated</th>
                <th className="py-2 pr-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedItems.map((it) => {
                const id = String(it._id || it.slug);
                const isEditing = editingId === id;
                return (
                  <tr key={id} className="border-t border-white/10 align-top">
                    <td className="py-2 pr-3">
                      <input type="checkbox" checked={selected.includes(id)} onChange={() => toggleSelect(id)} />
                    </td>
                    <td className="py-2 pr-3">
                      {isEditing ? (
                        <input className="input" value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                      ) : (
                        it.name
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      {isEditing ? (
                        <select className="input" value={editForm.categorySlug || CATEGORY_OPTIONS[0].slug} onChange={(e) => setEditForm({ ...editForm, categorySlug: e.target.value })}>
                          {CATEGORY_OPTIONS.map((c) => (
                            <option key={c.slug} value={c.slug}>{c.label}</option>
                          ))}
                        </select>
                      ) : (
                        it.categorySlug
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      {isEditing ? (
                        <input className="input" type="number" value={editForm.price || ""} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                      ) : (
                        `$${((it.price || 0) / 100).toFixed(2)}`
                      )}
                    </td>
                    <td className="py-2 pr-3">{it.updatedAt}</td>
                    <td className="py-2 pr-3">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button className="btn-accent" onClick={() => saveEdit(id)} disabled={loading}>Save</button>
                          <button className="btn-secondary" onClick={cancelEdit} type="button">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button className="btn-secondary" onClick={() => startEdit(it)} type="button">Edit</button>
                          <button className="btn-secondary" onClick={() => confirmDelete([id])} type="button">Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr>
                  <td className="py-3 text-white/60" colSpan={6}>No products yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
