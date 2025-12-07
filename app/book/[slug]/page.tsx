import { notFound } from "next/navigation";
import { Book } from "@/models/Book";
import { connectDB } from "@/lib/mongodb";
import { BackButton } from "@/app/components/BackButton";

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
      <div className="flex flex-col md:flex-row md:items-start md:gap-6">
        <div className="relative w-full aspect-[3/4] md:w-48 md:h-64 rounded-2xl bg-slate-800 overflow-hidden border border-slate-700">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-full object-cover z-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              No Image
            </div>
          )}
          {/* Back button */}
          <BackButton className="absolute top-2 left-2 z-20 inline-flex items-center justify-center w-8 h-8 rounded-md bg-/65 text-white font-semibold ow-black  shadow-[0_8px_30px_rgb(255,255,255,0.05)] border border-white/20 bg-[rgba(255,255,255,0.15)] backdrop-blur-2xl" />
        </div>

        <div className="flex-1 mt-4 md:mt-0">
          <h1 className="text-xl md:text-2xl font-semibold mb-1">
            {book.title}
          </h1>
          <div className="text-xs md:text-sm text-slate-400 mb-3">
            by {book.author}
          </div>
          <div className="text-base md:text-lg font-medium mb-4">
            ₹{book.price}
          </div>
          <p className="text-sm text-slate-300 leading-6">{book.description}</p>
        </div>
      </div>
    </div>
  );
}
