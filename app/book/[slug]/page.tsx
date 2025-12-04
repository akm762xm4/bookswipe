import { notFound } from "next/navigation";
import { Book } from "@/models/Book";
import { connectDB } from "@/lib/mongodb";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  await connectDB();

  let book: any = null;
  try {
    book = await Book.findOne({ slug }).lean();
  } catch (e) {
    book = null;
  }

  if (!book) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-start gap-6">
        <div className="w-48 h-64 rounded-2xl bg-slate-800 overflow-hidden border border-slate-700">
          {book.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">No Image</div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-1">{book.title}</h1>
          <div className="text-sm text-slate-400 mb-3">by {book.author}</div>
          <div className="text-lg font-medium mb-4">₹{book.price}</div>
          <p className="text-sm text-slate-300 leading-6">{book.description}</p>
        </div>
      </div>
    </div>
  );
}
