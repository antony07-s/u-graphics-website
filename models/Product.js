import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({ name: { type: String, required: true, trim: true, maxlength: 80 }, value: { type: String, required: true, trim: true, maxlength: 120 } }, { _id: false });
const PriceTierSchema = new mongoose.Schema({ minQuantity: { type: Number, required: true, min: 1 }, price: { type: Number, required: true, min: 0 } }, { _id: false });

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 180, index: true },
  slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
  subcategory: { type: String, trim: true, maxlength: 80, index: true },
  shortDescription: { type: String, trim: true, maxlength: 350 },
  description: { type: String, trim: true, maxlength: 10000 },
  image: { type: String, trim: true },
  gallery: [{ type: String, trim: true }],
  variants: { type: [VariantSchema], default: [] },
  priceTiers: { type: [PriceTierSchema], required: true, validate: [(tiers) => tiers.length > 0, "At least one price tier is required"] },
  minimumOrderQuantity: { type: Number, default: 1, min: 1 },
  stock: { type: Number, default: 0, min: 0 },
  isFeatured: { type: Boolean, default: false, index: true },
  isBestseller: { type: Boolean, default: false, index: true },
}, { timestamps: true });

ProductSchema.index({ category: 1, createdAt: -1 });
ProductSchema.index({ title: "text", slug: "text" });
export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
