import Link from "next/link";

export const metadata = {
  title: "Admin | PriceWar",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Admin</h1>
      <nav className="mb-6 flex flex-wrap gap-2">
        <Link href="/admin" className="btn-secondary">Dashboard</Link>
        <Link href="/admin/products" className="btn-accent">Products</Link>
        <Link href="/admin/categories" className="btn-secondary">Categories</Link>
      </nav>
      <div>{children}</div>
    </div>
  );
}
