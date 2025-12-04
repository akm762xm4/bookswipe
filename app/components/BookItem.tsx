"use client";

// import { Link } from "lucide-react";

export function BookItem({ book }: { book: any }) {
  return (
    <>
      <div className="aspect-[3/4] rounded-xl bg-slate-800 overflow-hidden mb-2">
        {book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            No Image
          </div>
        )}
      </div>
      <div className="text-sm font-medium">{book.title}</div>
      <div className="text-xs text-slate-400">{book.author}</div>
    </>
  );
}
