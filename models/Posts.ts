// models/Posts.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  category: string;
  tags?: string[];
  published: boolean;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String },
  content: { type: String, required: true },
  coverImage: { type: String },
  // Use String type without enum to be more flexible
  category: {
    type: String,
    required: true,
    default: "software-development",
  },
  tags: { type: [String] },
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: { type: Date, default: null },
});

// Create a model safeguard in case the model is already defined (for Next.js hot reloading)
const Post = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
