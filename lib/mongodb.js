import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

/**
 * Cache the connection across hot reloads in development
 * to avoid creating a new connection on every API route call.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        // Fail promptly when Atlas/the network is unavailable instead of
        // holding every SSR request for the driver's 30-second default.
        serverSelectionTimeoutMS: 10_000,
        connectTimeoutMS: 10_000,
      })
      .then((connection) => connection)
      .catch((error) => {
        // A rejected cached promise permanently poisoned later requests.
        // Clear it so the next request can reconnect after a transient DNS,
        // firewall, or Atlas availability failure.
        cached.promise = null;
        cached.conn = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}
