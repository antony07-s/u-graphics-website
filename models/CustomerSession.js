import mongoose from "mongoose";

const CustomerSessionSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
  sessionHash: { type: String, required: true, unique: true, select: false },
  device: { type: String, required: true, maxlength: 40 },
  browser: { type: String, required: true, maxlength: 40 },
  platform: { type: String, required: true, maxlength: 40 },
  createdAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now, index: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  revokedAt: { type: Date, default: null },
}, { versionKey: false });

CustomerSessionSchema.index({ customer: 1, revokedAt: 1, expiresAt: 1 });
export default mongoose.models.CustomerSession || mongoose.model("CustomerSession", CustomerSessionSchema);
