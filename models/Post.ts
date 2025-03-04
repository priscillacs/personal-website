import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  coverImage: { type: String },
  category: {
    type: String,
    required: [true, "Please specify a category for this post."],
  },
  tags: [{ type: String }],
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: { type: Date },
});

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default Post;
