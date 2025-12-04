import React from "react";

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur ${className}`}>
      {children}
    </div>
  );
}