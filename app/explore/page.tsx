import { Book } from "@/models/Book";
import Link from "next/link";
import { BookItem } from "../components/BookItem";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const category = params.category || "";
  const page = parseInt(params.page || "1", 10);
  const limit = 12;
  const offset = (page - 1) * limit;

  let items: any[] = [];
  try {
    const filter: any = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
      ];
    }
    if (category) filter.category = category;

    items = await Book.find(filter).skip(offset).limit(limit).lean();
  } catch (e) {
    items = [];
  }

  // Convert to client-safe plain objects to avoid ObjectId/Date in client components
  const itemsClient = items.map((b: any) => ({
    _id: typeof b._id === "string" ? b._id : b._id?.toString?.(),
    title: b.title ?? "",
    author: b.author ?? "",
    coverUrl: b.coverUrl ?? null,
    slug: b.slug ?? "",
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Explore</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {itemsClient.map((b) => (
          <Link
            key={b._id}
            href={`/book/${b.slug}`}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-3 hover:border-slate-700"
          >
            <BookItem book={b} />
          </Link>
        ))}
        {itemsClient.length === 0 && (
          <div className="text-slate-400">No books available.</div>
        )}
      </div>
    </div>
  );
}
