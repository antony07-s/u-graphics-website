import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    group: {
      type: String,
      enum: ["signage", "web-design"],
      required: true,
    },
    description: { type: String },
    icon: { type: String }, // lucide-react icon name or image URL
    image: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
