"use client";
import { useState } from "react";

export default function LoginForm() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Login failed");
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-4">
      <div>
        <label className="block text-sm text-white/70 mb-1" htmlFor="token">Admin Token</label>
        <input
          id="token"
          className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-[var(--accent)]"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter admin token"
          required
        />
      </div>
      {error && <div className="text-sm text-red-400">{error}</div>}
      <button disabled={loading} className="btn-accent px-4 py-2 rounded-md disabled:opacity-60">
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
