"use client";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { BookPlus, ChevronLeft, Plus } from "lucide-react";

type FormData = {
  _id?: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  coverUrl?: string;
  category?: string;
  language?: string;
  tags?: string; // comma separated
};

export default function AdminBooksPage() {
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [books, setBooks] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [listError, setListError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<any | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: { stock: 0 },
  });

  const loadBooks = async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const res = await fetch("/api/books?limit=100");
      const j = await res.json();
      const items = Array.isArray(j) ? j : j.items;
      setBooks(items || []);
    } catch (e: any) {
      setListError(e.message || "Failed to load books");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const startCreate = () => {
    setSuccess(null);
    setServerError(null);
    setPreviewUrl(null);
    reset({ stock: 0 });
    setMode("create");
  };

  const startEdit = (book: any) => {
    setSuccess(null);
    setServerError(null);
    setPreviewUrl(book.coverUrl || null);
    setOriginalSlug(book.slug);
    reset({
      _id: book._id,
      title: book.title,
      slug: book.slug,
      author: book.author,
      description: book.description,
      price: book.price,
      stock: book.stock || 0,
      coverUrl: book.coverUrl || "",
      category: book.category || "",
      language: book.language || "",
      tags: (book.tags || []).join(","),
    });
    setMode("edit");
  };

  const backToList = () => {
    setMode("list");
    setSuccess(null);
    setServerError(null);
    setPreviewUrl(null);
    setOriginalSlug(null);
  };

  const handleCoverUpload = async (file: File) => {
    setServerError(null);
    setSuccess(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.message || "Upload failed");
      setValue("coverUrl", j.url);
      setPreviewUrl(j.url);
      setSuccess("Cover image uploaded.");
    } catch (e: any) {
      setServerError(e.message);
    }
  };

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    setSuccess(null);
    const payload = {
      title: data.title.trim(),
      slug: data.slug.trim().toLowerCase(),
      author: data.author.trim(),
      description: data.description.trim(),
      price: Number(data.price),
      stock: Number(data.stock) || 0,
      coverUrl: data.coverUrl?.trim() || undefined,
      category: data.category?.trim() || undefined,
      language: data.language?.trim() || undefined,
      tags: (data.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    } as any;

    try {
      let res: Response;
      if (mode === "edit" && originalSlug) {
        res = await fetch(`/api/books/${encodeURIComponent(originalSlug)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.message || "Failed to save book");
      setSuccess(
        mode === "edit"
          ? "Book updated successfully."
          : "Book created successfully."
      );
      await loadBooks();
      backToList();
    } catch (e: any) {
      setServerError(e.message);
    }
  };

  const onDelete = async (book: any) => {
    setServerError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/books/${encodeURIComponent(book.slug)}`, {
        method: "DELETE",
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.message || "Delete failed");
      setSuccess("Book deleted.");
      await loadBooks();
    } catch (e: any) {
      setServerError(e.message);
    }
  };
  const requestDelete = (book: any) => {
    setPendingDelete(book);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await onDelete(pendingDelete);
    setShowDeleteModal(false);
    setPendingDelete(null);
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPendingDelete(null);
  };

  if (mode === "list") {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Manage Books</h1>
          <Button onClick={startCreate}>
            <BookPlus className="w-4 h-4" />
          </Button>
        </div>

        {listError && (
          <div className="text-sm text-red-400 mb-2">{listError}</div>
        )}

        {books.length !== 0 && (
          <div className="text-sm text-slate-400 mb-2">No books found.</div>
        )}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto" data-swipe-lock="true">
            <table className="min-w-[760px] w-full text-sm">
              <thead className="bg-slate-800 text-slate-300">
                <tr>
                  <th className="text-left px-4 py-2">Title</th>
                  <th className="text-left px-4 py-2">Author</th>
                  <th className="text-left px-4 py-2">Price</th>
                  <th className="text-left px-4 py-2">Stock</th>
                  <th className="text-left px-4 py-2">Language</th>
                  <th className="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr
                    key={b._id}
                    className="border-t border-slate-800 hover:bg-slate-900"
                  >
                    <td className="px-4 py-2">
                      <div className="font-medium">{b.title}</div>
                      <div className="text-xs text-slate-400">{b.slug}</div>
                    </td>
                    <td className="px-4 py-2">{b.author}</td>
                    <td className="px-4 py-2">₹{b.price}</td>
                    <td className="px-4 py-2">{b.stock || 0}</td>
                    <td className="px-4 py-2">{b.language || "-"}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => startEdit(b)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="secondary"
                          className="bg-red-600 hover:bg-red-500 text-white"
                          onClick={() => requestDelete(b)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={cancelDelete}
            />
            <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 w-[90%] max-w-sm">
              <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
              <p className="text-sm text-white/70 mb-4">
                Delete {pendingDelete?.title}?
              </p>
              <div className="flex gap-2 justify-end">
                <Button onClick={cancelDelete} variant="secondary">
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-500 text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          {mode === "edit" ? "Edit Book" : "Create New Book"}
        </h1>
        <Button variant="secondary" onClick={backToList}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      <Card className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <span className="text-[11px] text-red-400">
                {errors.title.message}
              </span>
            )}

            <Input
              label="Slug"
              placeholder="lowercase-with-dashes"
              {...register("slug", {
                required: "Slug is required",
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message: "Use lowercase letters, numbers and dashes",
                },
              })}
            />
            {errors.slug && (
              <span className="text-[11px] text-red-400">
                {errors.slug.message}
              </span>
            )}

            <Input
              label="Author"
              {...register("author", { required: "Author is required" })}
            />
            {errors.author && (
              <span className="text-[11px] text-red-400">
                {errors.author.message}
              </span>
            )}

            <Input label="Category" {...register("category")} />

            <Input label="Language" {...register("language")} />

            {/* Cover Image Upload */}
            <label className="block space-y-1">
              <span className="text-xs text-slate-400">Cover Image</span>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-white hover:file:bg-indigo-500"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCoverUpload(file);
                }}
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Cover preview"
                  className="mt-2 h-32 w-auto rounded-xl border border-slate-700"
                />
              )}
              <input type="hidden" {...register("coverUrl")} />
            </label>

            <Input
              label="Price (₹)"
              type="number"
              step="0.01"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Must be ≥ 0" },
                valueAsNumber: true,
              })}
            />
            {errors.price && (
              <span className="text-[11px] text-red-400">
                {errors.price.message}
              </span>
            )}

            <Input
              label="Stock"
              type="number"
              {...register("stock", {
                min: { value: 0, message: "Must be ≥ 0" },
                valueAsNumber: true,
                validate: (v) => Number.isInteger(v) || "Must be an integer",
              })}
            />
            {errors.stock && (
              <span className="text-[11px] text-red-400">
                {errors.stock.message}
              </span>
            )}

            <Input
              label="Tags (comma separated)"
              placeholder="bestseller,new"
              {...register("tags")}
            />
          </div>

          <label className="block space-y-1">
            <span className="text-xs text-slate-400">Description</span>
            <textarea
              className="w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
              {...register("description", {
                required: "Description is required",
                minLength: { value: 20, message: "At least 20 characters" },
              })}
            />
            {errors.description && (
              <span className="text-[11px] text-red-400">
                {errors.description.message}
              </span>
            )}
          </label>

          {serverError && (
            <div className="text-sm text-red-400">{serverError}</div>
          )}
          {success && <div className="text-sm text-emerald-400">{success}</div>}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? mode === "edit"
                  ? "Updating..."
                  : "Creating..."
                : mode === "edit"
                ? "Update Book"
                : "Create Book"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => reset({ stock: 0 })}
            >
              Reset
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
