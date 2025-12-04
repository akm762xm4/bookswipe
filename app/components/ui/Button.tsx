"use client";
import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "destructive";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const base =
  "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-700/30",
  secondary:
    "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700",
  ghost:
    "bg-transparent text-slate-100 hover:bg-slate-800/60 border border-transparent",
  destructive:
    "bg-red-600 text-white hover:bg-red-500",
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}