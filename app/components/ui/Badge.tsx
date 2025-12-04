import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  color?: "default" | "success" | "warning" | "error";
  className?: string;
};

const styles = {
  default: "bg-slate-800 text-slate-200",
  success: "bg-emerald-700 text-emerald-100",
  warning: "bg-amber-700 text-amber-100",
  error: "bg-red-700 text-red-100",
};

export function Badge({ children, color = "default", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ${styles[color]} ${className}`}>
      {children}
    </span>
  );
}