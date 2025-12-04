"use client";

import {
  House,
  Package,
  Search,
  ShieldCheck,
  ShoppingCart,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function DesktopSidebar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [hasUser, setHasUser] = React.useState(false);

  React.useEffect(() => {
    // Fetch user role to conditionally show Admin/Profile links
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return;
        const data = await res.json();
        setHasUser(Boolean(data?.id));
        setIsAdmin(data?.role === "ADMIN");
      } catch (_) {}
    })();
  }, []);

  const linkClass = (href: string) => {
    const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
    return `flex items-center gap-2 px-3 py-2 rounded-xl transition ${
      active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
    }`;
  };

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 p-4 border-r border-white/10 bg-gradient-to-b from-white/5 to-transparent">
      <div className="flex items-center gap-2 mb-6">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-white/15 border border-white/20 text-white font-semibold">
          B
        </span>
        <span className="text-sm font-medium text-white/90">BookSwipe</span>
      </div>
      <nav className="flex flex-col gap-1">
        <Link href="/" className={linkClass("/")}>
          <House className="w-4 h-4" /> Home
        </Link>
        <Link href="/explore" className={linkClass("/explore")}>
          <Search className="w-4 h-4" /> Explore
        </Link>
        <Link href="/cart" className={linkClass("/cart")}>
          <ShoppingCart className="w-4 h-4" /> Cart
        </Link>
        {hasUser && (
          <Link href="/profile" className={linkClass("/profile")}>
            <User className="w-4 h-4" /> Profile
          </Link>
        )}
        <Link href="/orders" className={linkClass("/orders")}>
          <Package className="w-4 h-4" /> Orders
        </Link>
        {isAdmin && (
          <Link href="/admin" className={linkClass("/admin")}>
            <ShieldCheck className="w-4 h-4" /> Admin
          </Link>
        )}
      </nav>
    </aside>
  );
}
