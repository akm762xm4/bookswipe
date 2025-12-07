"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function routeTitle(pathname: string | null): string {
  if (!pathname || pathname === "/") return "Home";
  const map: Record<string, string> = {
    "/cart": "Cart",
    "/wishlist": "Wishlist",
    "/orders": "Orders",
    "/profile": "Profile",
    "/admin": "Admin",
    "/admin/books": "Manage Books",
    "/admin/orders": "Manage Orders",
    "/book/": "Book",
    "/explore": "Explore",
  };
  const found = Object.keys(map).find((key) =>
    key === "/book/" ? pathname.startsWith(key) : pathname.startsWith(key)
  );
  return found ? map[found] : "";
}

export default function PageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = React.useState<"ADMIN" | "USER">("USER");
  const [q, setQ] = React.useState<string>(params.get("q") || "");

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const j = await res.json();
          setRole(j.role === "ADMIN" ? "ADMIN" : "USER");
        }
      } catch {}
    })();
  }, []);

  const title = routeTitle(pathname);
  const showSearchOnHome = pathname === "/" && role === "USER";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    const url = query ? `/explore?q=${encodeURIComponent(query)}` : "/explore";
    router.push(url);
  };

  return (
    <div className="px-6 md:px-6 px-4 md:py-4 py-3 border-b border-white/10 bg-gradient-to-b from-black/10 to-transparent sticky top-0 z-30 md:static">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-sm md:text-base font-medium text-white/90">{title}</span>
        </div>
        {showSearchOnHome && (
          <form onSubmit={submit} className="mt-3 flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search books..."
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm placeholder:text-white/50 focus:outline-none"
            />
            <button type="submit" className="px-4 py-2 rounded-xl bg-white/15 border border-white/25 text-sm">Search</button>
          </form>
        )}
      </div>
    </div>
  );
}

