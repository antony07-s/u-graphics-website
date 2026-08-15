import mongoose from "mongoose";

const SiteSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: "primary" },
  email: { type: String, required: true },
  indiaAddress: { type: String, required: true },
  malaysiaAddress: { type: String, required: true },
  malaysiaPhone: { type: String, required: true },
  whatsapp: { type: String, required: true },
  socialLinks: {
    instagram: { type: String },
    telegram: { type: String },
    facebook: { type: String },
  },
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);
