import mongoose from "mongoose";

const AdminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor"], default: "admin" },
  },
  { timestamps: true }
);

export default mongoose.models.AdminUser ||
  mongoose.model("AdminUser", AdminUserSchema);
