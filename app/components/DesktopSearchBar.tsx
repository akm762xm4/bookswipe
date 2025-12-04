"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function DesktopSearchBar() {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  return (
    <div className="flex items-center gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") router.push(`/explore?q=${encodeURIComponent(q)}`);
        }}
        placeholder="Search books..."
        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm placeholder:text-white/50 focus:outline-none"
      />
      <button
        onClick={() => router.push(`/explore?q=${encodeURIComponent(q)}`)}
        className="px-4 py-3 rounded-xl bg-white/15 border border-white/25 text-sm"
      >
        Search
      </button>
    </div>
  );
}