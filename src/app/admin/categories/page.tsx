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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

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

  // Cloudinary unsigned upload support for category image (optional)
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const canUpload = !!cloudName && !!uploadPreset;
  const uploadImage = async (file: File, onUrl: (u: string) => void) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset as string);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, { method: "POST", body: fd });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    onUrl(String(data.secure_url || data.url));
  };

  // Inline edit helpers
  const startEdit = (row: any) => {
    const id = String(row._id || row.slug || "");
    setEditingId(id);
    setEditForm({ label: row.label || "", slug: row.slug || "", imageUrl: row.imageUrl || "" });
  };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };
  const saveEdit = async (id: string) => {
    setLoading(true); setError(null); setSuccess(null);
    try {
      const payload = {
        label: String(editForm.label || "").trim(),
        slug: editForm.slug ? String(editForm.slug).trim() : undefined,
        imageUrl: editForm.imageUrl ? String(editForm.imageUrl).trim() : undefined,
      };
      const res = await fetch(`/api/admin/categories/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setItems((prev) => prev.map((it: any) => (String(it._id || it.slug) === String(id) ? updated : it)));
      setSuccess("Category updated");
      cancelEdit();
    } catch (e: any) {
      setError(e?.message || "Failed to update category");
    } finally { setLoading(false); }
  };
  const removeItem = async (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm('Delete this category?')) return;
    setLoading(true); setError(null); setSuccess(null);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      setItems((prev) => prev.filter((it: any) => String(it._id || it.slug) !== String(id)));
      setSuccess('Category deleted');
    } catch (e: any) {
      setError(e?.message || 'Failed to delete category');
    } finally { setLoading(false); }
  };

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
          <div className="flex gap-2">
            <input className="input flex-1" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
            {canUpload && (
              <label className="btn-secondary shrink-0 cursor-pointer">
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const f = e.target.files?.[0]; if (!f) return;
                  try { setLoading(true); await uploadImage(f, (u) => setForm((p) => ({ ...p, imageUrl: u }))); }
                  catch (err: any) { setError(err?.message || 'Upload failed'); }
                  finally { setLoading(false); }
                }} />
              </label>
            )}
          </div>
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
                <th className="py-2 pr-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => {
                const id = String(it._id || it.slug);
                const isEditing = editingId === id;
                return (
                  <tr key={id} className="border-t border-white/10 align-top">
                    <td className="py-2 pr-3">
                      {isEditing ? (
                        <input className="input" value={editForm.label || ''} onChange={(e) => setEditForm({ ...editForm, label: e.target.value })} />
                      ) : (
                        it.label
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      {isEditing ? (
                        <input className="input" value={editForm.slug || ''} onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })} />
                      ) : (
                        it.slug
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
                          <button className="btn-secondary" onClick={() => removeItem(id)} type="button">Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr>
                  <td className="py-3 text-white/60" colSpan={4}>No categories yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
