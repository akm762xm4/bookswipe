"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeftIcon, Search } from "lucide-react";

export default function MobileNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isBookDetail = pathname?.startsWith("/book/") ?? false;

  const title = React.useMemo(() => {
    if (!pathname || pathname === "/") return "";
    if (pathname.startsWith("/book/")) return "Book";
    const map: Record<string, string> = {
      "/explore": "Explore",
      "/cart": "Cart",
      "/wishlist": "Wishlist",
      "/profile": "Profile",
      "/orders": "Orders",
      "/admin": "Admin",
    };
    const found = Object.entries(map).find(([key]) => pathname.startsWith(key));
    return found ? found[1] : "";
  }, [pathname]);

  return (
    <div className="md:hidden sticky top-0 z-40 h-14 flex items-center justify-between px-4 backdrop-blur-md bg-gradient-to-b from-black/10 to-black/0 border-b border-white/10">
      {/* Left: Logo or Back */}
      <button
        aria-label={isBookDetail ? "Go back" : "Home"}
        onClick={() => (isBookDetail ? router.back() : router.push("/"))}
        className="flex items-center gap-2"
      >
        {isBookDetail ? (
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-white/15 border border-white/20 text-white font-semibold">
            <ChevronLeftIcon />
          </span>
        ) : (
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-white/15 border border-white/20 text-white font-semibold">
            B
          </span>
        )}
      </button>

      {/* Center: Title (empty on home) */}
      <div className="flex-1 text-center">
        <span className="text-sm font-medium text-white/90">{title}</span>
      </div>

      {/* Right: Search */}
      <button
        aria-label="Search"
        onClick={() => router.push("/explore")}
        className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-white/20 bg-white/10 text-white hover:bg-white/20 transition"
      >
        <span role="img" aria-label="Search" className="text-base">
          <Search className="w-4 h-4" />
        </span>
      </button>
    </div>
  );
}
