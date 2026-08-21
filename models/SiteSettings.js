import mongoose from "mongoose";
import { defaultEnquiryRecipient } from "@/lib/enquiryConfig";

const SiteSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: "primary" },
  email: { type: String, required: true },
  // Private notification inbox used by the enquiry API. It is not returned
  // to public site-settings consumers.
  enquiryRecipientEmail: { type: String, required: true, default: defaultEnquiryRecipient },
  indiaAddress: { type: String, required: true },
  indiaPhone: { type: String },
  malaysiaAddress: { type: String, required: true },
  malaysiaPhone: { type: String, required: true },
  whatsapp: { type: String, required: true },
  homepageStats: [{
    label: { type: String, required: true, maxlength: 80 },
    value: { type: Number, required: true, min: 0 },
    suffix: { type: String, default: "+", maxlength: 10 },
  }],
  socialLinks: {
    instagram: { type: String },
    telegram: { type: String },
    facebook: { type: String },
  },
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);
