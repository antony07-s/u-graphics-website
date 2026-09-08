import mongoose from "mongoose";
const CartItemSchema = new mongoose.Schema({ product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, quantity: { type: Number, required: true, min: 1 }, selectedVariants: { type: [{ name: String, value: String }], default: [] }, priceAtAddTime: { type: Number, required: true, min: 0 } }, { _id: true });
const CartSchema = new mongoose.Schema({ customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, unique: true, index: true }, items: { type: [CartItemSchema], default: [] } }, { timestamps: true });
CartSchema.index({ customer: 1, updatedAt: -1 });
export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
