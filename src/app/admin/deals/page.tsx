"use client";

import React, { useMemo, useState } from "react";
import { useDeals } from "@/context/DealsContext";
import type { Deal } from "@/lib/types";

export default function AdminDealsPage() {
  const { deals, addDeal, updateDeal, deleteDeal } = useDeals();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Deal, "_id">>({
    title: "",
    description: "",
    category: "",
    expires: "",
  });

  const [confirm, setConfirm] = useState<{ open: boolean; ids: string[] }>({ open: false, ids: [] });
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const rows = useMemo(() => deals ?? [], [deals]);

  const resetForm = () => {
    setForm({ title: "", description: "", category: "", expires: "" });
    setEditingId(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editingId) {
      updateDeal(editingId, form);
    } else {
      addDeal(form);
    }
    resetForm();
  };

  const beginEdit = (d: Deal) => {
    setEditingId(d._id);
    setForm({ title: d.title, description: d.description, category: d.category, expires: d.expires });
  };

  const askDelete = (ids: string[]) => setConfirm({ open: true, ids });
  const doDelete = () => {
    confirm.ids.forEach((id) => deleteDeal(id));
    setConfirm({ open: false, ids: [] });
    setSelected({});
  };

  const toggleAll = (checked: boolean) => {
    const next: Record<string, boolean> = {};
    rows.forEach((d) => (next[d._id] = checked));
    setSelected(next);
  };

  const bulkIds = Object.entries(selected)
    .filter(([, v]) => v)
    .map(([k]) => k);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin • Limited-time Offers</h1>

      {/* Create / Edit Form */}
      <form onSubmit={onSubmit} className="card p-4 space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-muted-token">Title</span>
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              placeholder="Deal title"
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-muted-token">Category</span>
            <input
              className="input"
              value={form.category}
              onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
              placeholder="e.g., Electronics"
            />
          </label>
          <label className="md:col-span-2 flex flex-col gap-1">
            <span className="text-sm text-muted-token">Description</span>
            <textarea
              className="input min-h-24"
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              placeholder="Short description"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-muted-token">Expires</span>
            <input
              className="input"
              value={form.expires}
              onChange={(e) => setForm((s) => ({ ...s, expires: e.target.value }))}
              placeholder="ISO date (2025-12-31) or text (e.g., in 3 days)"
            />
          </label>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-accent px-4 py-2 rounded-md">
            {editingId ? "Update Deal" : "Add Deal"}
          </button>
          {editingId && (
            <button type="button" className="px-4 py-2 rounded-md border border-token" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="card p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Deals ({rows.length})</div>
          {bulkIds.length > 0 && (
            <button
              className="px-3 py-1.5 rounded-md border border-token hover:bg-white/5"
              onClick={() => askDelete(bulkIds)}
            >
              Delete selected ({bulkIds.length})
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-token">
                <th className="py-2 px-2"><input type="checkbox" onChange={(e) => toggleAll(e.target.checked)} /></th>
                <th className="py-2 px-2">Title</th>
                <th className="py-2 px-2">Category</th>
                <th className="py-2 px-2">Expires</th>
                <th className="py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d._id} className="border-b border-token">
                  <td className="py-2 px-2 align-top">
                    <input
                      type="checkbox"
                      checked={!!selected[d._id]}
                      onChange={(e) => setSelected((s) => ({ ...s, [d._id]: e.target.checked }))}
                    />
                  </td>
                  <td className="py-2 px-2 align-top">
                    <div className="font-medium">{d.title}</div>
                    <div className="text-xs text-muted-token line-clamp-2">{d.description}</div>
                  </td>
                  <td className="py-2 px-2 align-top">{d.category}</td>
                  <td className="py-2 px-2 align-top">{d.expires}</td>
                  <td className="py-2 px-2 align-top whitespace-nowrap">
                    <button className="text-[var(--accent)] mr-3" onClick={() => beginEdit(d)}>Edit</button>
                    <button className="text-red-400" onClick={() => askDelete([d._id])}>Delete</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-token">No deals yet. Add your first one above.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirm.open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
          <div className="card p-6 max-w-md w-full">
            <div className="text-lg font-semibold mb-2">Confirm Delete</div>
            <p className="text-sm text-muted-token mb-4">
              Are you sure you want to delete {confirm.ids.length} deal{confirm.ids.length > 1 ? "s" : ""}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 rounded-md border border-token" onClick={() => setConfirm({ open: false, ids: [] })}>
                Cancel
              </button>
              <button className="px-4 py-2 rounded-md bg-red-500 text-white" onClick={doDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
