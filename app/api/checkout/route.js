import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { readCustomerId } from "@/lib/customerAuth";
import Customer from "@/models/Customer";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { priceFor, validVariants } from "@/lib/commerce";

const schema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254), phone: z.string().trim().min(5).max(30), shippingAddress: z.object({ address: z.string().trim().min(5).max(250), city: z.string().trim().min(2).max(80), state: z.string().trim().min(2).max(80), postalCode: z.string().trim().min(3).max(20), country: z.string().trim().min(2).max(80) }) });
const shippingFor = (subtotal) => subtotal >= 2000 ? 0 : 150;

export async function POST(request) {
  const customerId = readCustomerId();
  if (!customerId) return NextResponse.json({ error: "Please sign in before checkout." }, { status: 401 });
  const decremented = [];
  try {
    const input = schema.parse(await request.json()); await connectDB();
    const [customer, cart] = await Promise.all([Customer.findById(customerId), Cart.findOne({ customer: customerId })]);
    if (!customer || !cart?.items.length) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    const products = await Product.find({ _id: { $in: cart.items.map((item) => item.product) } }); const byId = new Map(products.map((product) => [product.id, product])); const items = [];
    for (const cartItem of cart.items) { const product = byId.get(cartItem.product.toString()); if (!product || cartItem.quantity < product.minimumOrderQuantity || !validVariants(product, cartItem.selectedVariants)) return NextResponse.json({ error: "One or more cart items are no longer available." }, { status: 400 }); const price = priceFor(product, cartItem.quantity); if (price === null) return NextResponse.json({ error: "Unable to calculate a current price." }, { status: 400 }); items.push({ product: product._id, name: product.title, image: product.image || "", quantity: cartItem.quantity, variants: cartItem.selectedVariants, price, subtotal: price * cartItem.quantity }); }
    const stockNeeded = new Map(); for (const item of items) stockNeeded.set(item.product.toString(), (stockNeeded.get(item.product.toString()) || 0) + item.quantity);
    for (const [productId, quantity] of stockNeeded) { const result = await Product.updateOne({ _id: productId, stock: { $gte: quantity } }, { $inc: { stock: -quantity } }); if (!result.modifiedCount) throw new Error("INSUFFICIENT_STOCK"); decremented.push({ productId, quantity }); }
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0); const shippingCost = shippingFor(subtotal);
    const order = await Order.create({ customer: customerId, orderNumber: `UG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, customerInformation: { name: input.name, email: input.email.toLowerCase(), phone: input.phone }, shippingAddress: input.shippingAddress, items, subtotal, shippingCost, total: subtotal + shippingCost, paymentStatus: "pending", orderStatus: "placed" });
    // Future Razorpay capture belongs after the order has been created; payment is deliberately not processed in this phase.
    await Cart.updateOne({ _id: cart._id }, { $set: { items: [] } });
    return NextResponse.json({ order: { id: order.id, orderNumber: order.orderNumber, total: order.total, paymentStatus: order.paymentStatus, orderStatus: order.orderStatus } }, { status: 201 });
  } catch (error) {
    if (decremented.length) await Promise.all(decremented.map(({ productId, quantity }) => Product.updateOne({ _id: productId }, { $inc: { stock: quantity } }))).catch(() => {});
    return NextResponse.json({ error: error.message === "INSUFFICIENT_STOCK" ? "One or more items are out of stock." : "Please check your checkout details." }, { status: 400 });
  }
}
