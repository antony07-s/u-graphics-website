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

// PUT /api/customer/addresses/[addressId] -> edit one of the logged-in
// customer's OWN addresses. Ownership is enforced by only ever looking
// inside THIS customer's own addresses array - never a global lookup.
export async function PUT(request, { params }) {
  const customerId = readCustomerId();
  if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = addressSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in all required address fields." }, { status: 400 });
  }

  await connectDB();
  const customer = await Customer.findById(customerId);
  if (!customer) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  const address = customer.addresses.id(params.addressId);
  if (!address) return NextResponse.json({ error: "Address not found." }, { status: 404 });

  address.set(parsed.data);
  await customer.save();

  return NextResponse.json({ addresses: customer.addresses });
}

// DELETE /api/customer/addresses/[addressId]
export async function DELETE(_request, { params }) {
  const customerId = readCustomerId();
  if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const customer = await Customer.findById(customerId);
  if (!customer) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  const address = customer.addresses.id(params.addressId);
  if (!address) return NextResponse.json({ error: "Address not found." }, { status: 404 });

  address.deleteOne();
  await customer.save();

  return NextResponse.json({ addresses: customer.addresses });
}
