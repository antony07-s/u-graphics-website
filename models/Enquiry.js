import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    serviceCategory: { type: String }, // free text or category slug
    message: { type: String },
    attachmentUrl: { type: String },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
    source: { type: String, default: "website" }, // website, whatsapp, etc.
  },
  { timestamps: true }
);

export default mongoose.models.Enquiry ||
  mongoose.model("Enquiry", EnquirySchema);
