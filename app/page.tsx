import Link from "next/link";
import { Book } from "@/models/Book";
import { BookItem } from "./components/BookItem";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function HomePage() {
  let books: any[] = [];
  try {
    books = await Book.find({}, null, { limit: 8 }).lean();
  } catch (e) {
    books = [];
  }

  // Prepare client-safe data (avoid ObjectId/Date serialization issues)
  const booksClient = books.map((b: any) => ({
    _id: typeof b._id === "string" ? b._id : b._id?.toString?.(),
    title: b.title ?? "",
    author: b.author ?? "",
    coverUrl: b.coverUrl ?? null,
    slug: b.slug ?? "",
  }));

  // Detect admin role from session cookie
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value || null;
  const payload = token ? verifyToken(token) : null;
  const isAdmin = payload?.role === "ADMIN";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">BookSwipe</h1>
        {!isAdmin && (
          <Link
            href="/admin"
            className="rounded-xl bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-500"
          >
            Admin Login
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {booksClient?.map((b) => (
          <Link
            key={b._id}
            href={`/book/${b.slug}`}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-3 hover:border-slate-700"
          >
            <BookItem book={b} />
          </Link>
        ))}
        {booksClient.length === 0 && (
          <div className="text-slate-400">No books available.</div>
        )}
      </div>
    </div>
  );
}
