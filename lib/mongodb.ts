import mongoose from "mongoose";

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

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// Define the cached type explicitly
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Initialize cached with proper type checking
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// Set the global cache
if (!global.mongoose) {
  global.mongoose = cached;
}

// async function connectToDatabase() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       return mongoose;
//     });
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }
async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Use minimal options to avoid conflicts
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
export default connectToDatabase;
