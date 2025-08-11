"use client";
import { useState } from "react";

export default function PromoStrip({
  message = "Free local delivery over $150 & up • New arrivals weekly • Best value in Toronto",
}: {
  message?: string;
}) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="bg-[var(--accent)]/15 text-[var(--accent)] border-b border-[var(--accent)]/30">
      <div className="mx-auto max-w-6xl px-4 py-2 text-sm flex items-center justify-between gap-4">
        <div className="truncate">{message}</div>
        <button
          aria-label="Dismiss promo"
          className="h-6 w-6 grid place-items-center rounded bg-black/10 text-[var(--accent)]/90"
          onClick={() => setVisible(false)}
        >
          ×
        </button>
      </div>
    </div>
  );
}
