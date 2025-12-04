import { connectDB } from "./lib/mongodb";

// This hook runs once when the Next.js server starts (per process).
// It ensures the MongoDB connection is established up-front, so
// individual route handlers and pages don't call connectDB repeatedly.
export async function register() {
  try {
    await connectDB();
    if (process.env.NODE_ENV !== "production") {
      console.log("[BookSwipe] MongoDB connected at server start");
    }
  } catch (err) {
    console.error("[BookSwipe] Failed to connect to MongoDB at server start:", err);
  }
}