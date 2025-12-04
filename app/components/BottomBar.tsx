"use client";

import { House, ShoppingCart, User, Search, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const tabs = [
  { href: "/", label: "Home", icon: <House className="w-4 h-4" /> },
  { href: "/explore", label: "Explore", icon: <Search className="w-4 h-4" /> },
  { href: "/cart", label: "Cart", icon: <ShoppingCart className="w-4 h-4" /> },
  { href: "/wishlist", label: "Wishlist", icon: <Heart className="w-4 h-4" /> },
  { href: "/profile", label: "Profile", icon: <User className="w-4 h-4" /> },
];

export function BottomBar() {
  const pathname = usePathname();
  const [activeKey, setActiveKey] = React.useState<string>(pathname || "/");

  React.useEffect(() => {
    setActiveKey(pathname || "/");
  }, [pathname]);

  return (
    <div className="md:hidden fixed left-1/2 -translate-x-1/2 bottom-4 w-[92%] max-w-md z-50">
      <div className="rounded-3xl px-4 py-2 flex justify-between items-end shadow-[0_8px_30px_rgb(255,255,255,0.05)] border border-white/20 bg-[rgba(255,255,255,0.15)] backdrop-blur-2xl">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(tab.href);
          const iconClass = active
            ? "scale-110 opacity-100 animate-tab-pop"
            : "opacity-60";
          const labelClass = active
            ? "text-[10px] mt-1 opacity-100"
            : "text-[10px] mt-1 opacity-60";

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center text-[11px] transition-transform ease-out"
            >
              <span className={`text-xl ${iconClass}`}>{tab.icon}</span>
              <span className={labelClass}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
