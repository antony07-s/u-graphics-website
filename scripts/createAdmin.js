/**
 * Run this ONCE to create your first admin login.
 * Usage:  node scripts/createAdmin.js
 *
 * Reads MONGODB_URI from .env.local automatically.
 * Provide ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in .env.local.
 */
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const NAME = process.env.ADMIN_NAME;
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI not found — check your .env.local file.");
    process.exit(1);
  }
  if (!NAME || !EMAIL || !PASSWORD || PASSWORD.length < 12) {
    console.error("Set ADMIN_NAME, ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters in .env.local.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const AdminUserSchema = new mongoose.Schema(
    {
      name: String,
      email: { type: String, unique: true },
      passwordHash: String,
      role: { type: String, default: "admin" },
    },
    { timestamps: true }
  );
  const AdminUser =
    mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);

  const existing = await AdminUser.findOne({ email: EMAIL.toLowerCase() });
  if (existing) {
    console.log(`An admin with email ${EMAIL} already exists. Nothing to do.`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  await AdminUser.create({
    name: NAME,
    email: EMAIL.toLowerCase().trim(),
    passwordHash,
    role: "admin",
  });

  console.log("✅ Admin user created successfully!");
  console.log(`   Email: ${EMAIL}`);
  console.log("   Log in at /admin/login.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to create admin:", err);
  process.exit(1);
});
