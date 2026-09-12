import mongoose from "mongoose";

const EmailOtpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  purpose: { type: String, required: true, enum: ["register", "reset"] },
  codeHash: { type: String, required: true, select: false },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  attempts: { type: Number, default: 0, min: 0 },
  lastSentAt: { type: Date, required: true },
  name: { type: String, trim: true, maxlength: 100 },
  phone: { type: String, trim: true, maxlength: 30 },
  passwordHash: { type: String, select: false },
}, { timestamps: true });

EmailOtpSchema.index({ email: 1, purpose: 1 }, { unique: true });
export default mongoose.models.EmailOtp || mongoose.model("EmailOtp", EmailOtpSchema);
