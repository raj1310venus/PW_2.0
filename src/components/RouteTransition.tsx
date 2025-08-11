"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // Trigger enter animation on mount of each route
    const id = requestAnimationFrame(() => setEntered(true));
    return () => {
      cancelAnimationFrame(id);
      setEntered(false);
    };
  }, [pathname]);

  return (
    <div
      key={pathname}
      className={`duration-300 ease-out transition-all ${
        entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
      }`}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </div>
  );
}
