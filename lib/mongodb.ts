// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string | undefined;

// Prevent command buffering which can hang if no connection is available
mongoose.set("bufferCommands", false);

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached = (global as any).mongoose as MongooseCache;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  // Gracefully handle missing env in development so the app can still run
  if (!MONGODB_URI) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MONGODB_URI environment variable is required in production");
    }
    // In dev, skip connecting so pages can render placeholders
    return null as unknown as typeof mongoose;
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
