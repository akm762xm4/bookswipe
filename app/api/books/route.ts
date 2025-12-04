import { NextResponse } from "next/server";
import { Book } from "@/models/Book";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  const category = url.searchParams.get("category") || "";
  const limit = Math.max(0, parseInt(url.searchParams.get("limit") || "12", 10));
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const offsetParam = url.searchParams.get("offset");
  const offset = offsetParam !== null ? Math.max(0, parseInt(offsetParam, 10)) : (page - 1) * limit;

  try {
    const filter: any = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
      ];
    }
    if (category) {
      filter.category = category;
    }

    const [items, total] = await Promise.all([
      Book.find(filter).skip(offset).limit(limit).lean(),
      Book.countDocuments(filter),
    ]);

    return NextResponse.json({ items, total, limit, offset, page });
  } catch (e) {
    // Missing DB in dev or connection issue: return empty list for GET
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const book = await Book.create(body);
    return NextResponse.json(book, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: "Database not available" }, { status: 503 });
  }
}
