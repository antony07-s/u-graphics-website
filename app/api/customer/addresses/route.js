import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { readCustomerId } from "@/lib/customerAuth";

const addressSchema = z.object({
  label: z.string().trim().max(50).optional(),
  address: z.string().trim().min(5).max(250),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().min(3).max(20),
  country: z.string().trim().min(2).max(80),
});

// GET /api/customer/addresses -> list the logged-in customer's own addresses
export async function GET() {
  const customerId = readCustomerId();
  if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const customer = await Customer.findById(customerId).select("addresses");
  return NextResponse.json({ addresses: customer?.addresses || [] });
}

// POST /api/customer/addresses -> add a new address for the logged-in customer
export async function POST(request) {
  const customerId = readCustomerId();
  if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = addressSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in all required address fields." }, { status: 400 });
  }

  await connectDB();
  const customer = await Customer.findById(customerId);
  if (!customer) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  customer.addresses.push(parsed.data);
  await customer.save();

  return NextResponse.json({ addresses: customer.addresses }, { status: 201 });
}
