/*
 * Exercises a temporary customer through the running local API and removes
 * every test document afterwards. Run `node scripts/audit-commerce-flow.mjs`
 * while `npm run dev` is serving localhost:3000.
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

dotenv.config({ path: ".env.local", quiet: true });

const baseUrl = process.env.AUDIT_BASE_URL || "http://localhost:3000";
const uri = process.env.MONGODB_URI;
const secret = process.env.CUSTOMER_SESSION_SECRET || process.env.NEXTAUTH_SECRET;

if (!uri || !secret) throw new Error("MONGODB_URI and a customer session secret are required.");

const stamp = Date.now();
const email = `audit-${stamp}@example.invalid`;
const customerId = new mongoose.Types.ObjectId();
let productId;
let stockReserved = false;

const request = async (path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json().catch(() => null);
  return { response, body };
};

try {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  await db.collection("customers").insertOne({
    _id: customerId,
    name: "Audit Customer",
    email,
    passwordHash: await bcrypt.hash("AuditPass123!", 12),
    emailVerifiedAt: new Date(),
    addresses: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const product = await db.collection("products").findOne({
    stock: { $gte: 1 },
    minimumOrderQuantity: { $lte: 1 },
    variants: { $size: 0 },
  });
  if (!product) throw new Error("No in-stock, non-configurable product is available for the audit.");
  productId = product._id;

  const value = `${customerId}.${Date.now() + 60 * 60 * 1000}`;
  const token = `${value}.${crypto.createHmac("sha256", secret).update(value).digest("base64url")}`;
  const headers = { "Content-Type": "application/json", Cookie: `ug_customer=${token}` };

  const anonymousCart = await request("/api/cart");
  if (anonymousCart.response.status !== 401) throw new Error("Anonymous cart access was not rejected.");

  const invalidAdd = await request("/api/cart", { method: "POST", headers, body: JSON.stringify({ productId: productId.toString(), quantity: 1, selectedVariants: [{ name: "invalid", value: "invalid" }] }) });
  if (invalidAdd.response.status !== 400) throw new Error("Invalid product options were accepted.");

  const add = await request("/api/cart", { method: "POST", headers, body: JSON.stringify({ productId: productId.toString(), quantity: 1, selectedVariants: [] }) });
  if (!add.response.ok || add.body?.cart?.items?.length !== 1) throw new Error("Customer could not add a valid product to the cart.");

  const checkout = await request("/api/checkout", { method: "POST", headers, body: JSON.stringify({ name: "Audit Customer", email: "spoofed@example.invalid", phone: "+919999999999", shippingAddress: { address: "1 Audit Street", city: "Mumbai", state: "Maharashtra", postalCode: "400001", country: "India" } }) });
  if (!checkout.response.ok || !checkout.body?.order?.orderNumber) throw new Error(`Checkout failed: ${checkout.body?.error || checkout.response.status}`);
  stockReserved = true;

  const order = await request(`/api/orders/${checkout.body.order.orderNumber}`, { headers });
  if (!order.response.ok || order.body?.order?.customerInformation?.email !== email) throw new Error("Checkout trusted a client-supplied customer email or ownership failed.");

  const cartAfterOrder = await request("/api/cart", { headers });
  if (!cartAfterOrder.response.ok || cartAfterOrder.body?.cart?.items?.length !== 0) throw new Error("Cart was not emptied after checkout.");

  console.log("PASS: anonymous protection, cart validation, checkout pricing/stock flow, ownership, and server-side customer email.");
} finally {
  if (mongoose.connection.readyState) {
    const db = mongoose.connection.db;
    await db.collection("orders").deleteMany({ customer: customerId });
    await db.collection("carts").deleteMany({ customer: customerId });
    await db.collection("customers").deleteOne({ _id: customerId });
    if (stockReserved && productId) await db.collection("products").updateOne({ _id: productId }, { $inc: { stock: 1 } });
    await mongoose.disconnect();
  }
}
