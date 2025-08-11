"use client";
import { useEffect, useState } from "react";
import type { Category, Product } from "@/lib/types";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="card p-4 space-y-4">{children}</div>
    </section>
  );
}

export default function AdminDashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [catForm, setCatForm] = useState({ label: "", slug: "", imageUrl: "" });
  const [prodForm, setProdForm] = useState({ name: "", slug: "", categorySlug: "", price: "", imageUrl: "" });

  async function load() {
    const [catsRes, prodsRes] = await Promise.all([
      fetch("/api/admin/categories"),
      fetch("/api/admin/products"),
    ]);
    const cats = await catsRes.json();
    const prods = await prodsRes.json();
    setCategories(cats);
    setProducts(prods);
  }

  useEffect(() => { load(); }, []);

  async function createCategory() {
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(catForm),
    });
    setCatForm({ label: "", slug: "", imageUrl: "" });
    load();
  }

  async function deleteCategory(id: string) {
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    load();
  }

  async function createProduct() {
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...prodForm, price: Number(prodForm.price || 0) }),
    });
    setProdForm({ name: "", slug: "", categorySlug: "", price: "", imageUrl: "" });
    load();
  }

  async function deleteProduct(id: string) {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-8">
      <Section title="Categories">
        <div className="grid md:grid-cols-4 gap-3">
          <input placeholder="Label" className="input" value={catForm.label} onChange={(e) => setCatForm({ ...catForm, label: e.target.value })} />
          <input placeholder="Slug" className="input" value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} />
          <input placeholder="Image URL" className="input md:col-span-2" value={catForm.imageUrl} onChange={(e) => setCatForm({ ...catForm, imageUrl: e.target.value })} />
        </div>
        <button className="btn-accent px-4 py-2 rounded-md" onClick={createCategory}>Add Category</button>

        <div className="divide-y divide-white/10 mt-4">
          {categories.map((c) => (
            <div key={c._id} className="py-3 flex items-center justify-between gap-3 text-sm">
              <div>
                <div className="font-medium">{c.label}</div>
                <div className="text-white/60">slug: {c.slug}</div>
              </div>
              <div className="flex items-center gap-2">
                <a className="underline text-white/70" href={`/category/${c.slug}`} target="_blank">View</a>
                <button className="px-3 py-1 rounded bg-white/10 hover:bg-white/15" onClick={() => deleteCategory(c._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Products">
        <div className="grid md:grid-cols-5 gap-3">
          <input placeholder="Name" className="input" value={prodForm.name} onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })} />
          <input placeholder="Slug" className="input" value={prodForm.slug} onChange={(e) => setProdForm({ ...prodForm, slug: e.target.value })} />
          <input placeholder="Category Slug" className="input" value={prodForm.categorySlug} onChange={(e) => setProdForm({ ...prodForm, categorySlug: e.target.value })} />
          <input placeholder="Price" className="input" value={prodForm.price} onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })} />
          <input placeholder="Image URL" className="input" value={prodForm.imageUrl} onChange={(e) => setProdForm({ ...prodForm, imageUrl: e.target.value })} />
        </div>
        <button className="btn-accent px-4 py-2 rounded-md" onClick={createProduct}>Add Product</button>

        <div className="divide-y divide-white/10 mt-4">
          {products.map((p) => (
            <div key={p._id} className="py-3 flex items-center justify-between gap-3 text-sm">
              <div>
                <div className="font-medium">{p.name} <span className="text-white/60">(${p.price.toFixed(2)})</span></div>
                <div className="text-white/60">slug: {p.slug} • category: {p.categorySlug}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 rounded bg-white/10 hover:bg-white/15" onClick={() => deleteProduct(p._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
