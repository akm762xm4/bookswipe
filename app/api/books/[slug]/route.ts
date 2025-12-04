import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Book } from "@/models/Book";

export async function GET(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  await connectDB();
  const book = await Book.findOne({ slug });
  if (!book) {
    return new Response(JSON.stringify({ message: "Book not found" }), { status: 404 });
  }
  return new Response(JSON.stringify(book), { status: 200 });
}

export async function PUT(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const payload = await req.json();
  await connectDB();
  const updated = await Book.findOneAndUpdate({ slug }, payload, { new: true });
  if (!updated) {
    return new Response(JSON.stringify({ message: "Book not found" }), { status: 404 });
  }
  return new Response(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  await connectDB();
  const deleted = await Book.findOneAndDelete({ slug });
  if (!deleted) {
    return new Response(JSON.stringify({ message: "Book not found" }), { status: 404 });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
