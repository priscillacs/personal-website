// lib/mongodb.ts
import mongoose from "mongoose";

// Clean the MongoDB URI to remove trailing ? or & and any empty parameters
function cleanMongoURI(uri: string): string {
  // Replace any empty parameters like "appName=" or "&appName="
  let cleanedURI = uri.replace(/([?&])([\w]+)=(?=&|$)/g, "");

  // Remove trailing ? or &
  cleanedURI = cleanedURI.replace(/[?&]$/g, "");

  return cleanedURI;
}

// Define types for the global variable
declare global {
  let mongoose:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/priscilla-website";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Clean the URI before using it
const cleanedURI = cleanMongoURI(MONGODB_URI);

// Global is used here to maintain a cached connection across hot reloads
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Use optimized connection options for better performance
    cached.promise = mongoose
      .connect(cleanedURI, {
        bufferCommands: false,
        maxPoolSize: 10, // Add connection pooling
        socketTimeoutMS: 30000, // Add timeout
        connectTimeoutMS: 30000, // Add connection timeout
        serverSelectionTimeoutMS: 5000, // Faster server selection
        heartbeatFrequencyMS: 10000, // Reduced heartbeat frequency
      })
      .then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null; // Reset the promise on error
    throw error;
  }
}

export default connectToDatabase;
