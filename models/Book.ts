// models/Book.ts
import { Schema, model, models } from "mongoose";

const BookSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    coverUrl: { type: String },
    category: { type: String },
    language: { type: String },
    tags: [String],
  },
  { timestamps: true }
);

export const Book = models.Book || model("Book", BookSchema);
