import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    group: {
      type: String,
      enum: ["signage", "web-design", "signboards", "digital-printing"],
      required: true,
    },
    // Storefront catalogue placement. This is intentionally separate from the
    // legacy `group` field used by existing service/admin functionality.
    section: {
      type: String,
      enum: ["signboards", "digital-printing", "general"],
      default: "general",
      index: true,
    },
    description: { type: String },
    icon: { type: String }, // lucide-react icon name or image URL
    image: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CategorySchema.index({ section: 1, order: 1, name: 1 });

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
