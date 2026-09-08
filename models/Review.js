import mongoose from "mongoose";
const ReviewSchema = new mongoose.Schema({ product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true }, customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, index: true }, customerName: { type: String, required: true, trim: true, maxlength: 100 }, rating: { type: Number, required: true, min: 1, max: 5 }, comment: { type: String, required: true, trim: true, minlength: 3, maxlength: 1500 }, isApproved: { type: Boolean, default: false, index: true } }, { timestamps: true });
ReviewSchema.index({ product: 1, customer: 1 }, { unique: true });
ReviewSchema.index({ product: 1, isApproved: 1, createdAt: -1 });
export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
