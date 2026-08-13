import mongoose from "mongoose";

const BlogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String },
    content: { type: String, required: true }, // rich text / HTML / markdown
    coverImage: { type: String },
    author: { type: String, default: "U Graphics Team" },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost ||
  mongoose.model("BlogPost", BlogPostSchema);
