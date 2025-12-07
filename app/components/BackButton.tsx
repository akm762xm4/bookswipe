"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";

export function BackButton({ className = "", title = "Go back" }: { className?: string; title?: string }) {
  const router = useRouter();
  return (
    <button
      title={title}
      onClick={() => router.back()}
      className={className}
    >
      <ChevronLeftIcon />
    </button>
  );
}
