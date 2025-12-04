"use client";
import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export function Input({ label, hint, className = "", ...props }: InputProps) {
  return (
    <label className="block space-y-1">
      {label && <span className="text-xs text-slate-400">{label}</span>}
      <input
        className={`w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
        {...props}
      />
      {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
    </label>
  );
}