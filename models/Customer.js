import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, maxlength: 50 },
    address: { type: String, required: true, trim: true, maxlength: 250 },
    city: { type: String, required: true, trim: true, maxlength: 80 },
    state: { type: String, required: true, trim: true, maxlength: 80 },
    postalCode: { type: String, required: true, trim: true, maxlength: 20 },
    country: { type: String, required: true, trim: true, maxlength: 80 },
  },
  { _id: true }
);

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    phone: { type: String, trim: true, maxlength: 30 },
    // Only required for email/password accounts. Google sign-in accounts
    // authenticate via googleId instead and have no password at all.
    passwordHash: {
      type: String,
      select: false,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: { type: String, unique: true, sparse: true, index: true },
    emailVerifiedAt: { type: Date, default: null },
    addresses: { type: [AddressSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
