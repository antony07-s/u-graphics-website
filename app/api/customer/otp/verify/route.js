import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import EmailOtp from "@/models/EmailOtp";
import { customerCookie, makeCustomerToken } from "@/lib/customerAuth";

const schema = z.object({ purpose: z.enum(["register", "reset"]), email: z.string().trim().email().max(254), code: z.string().regex(/^\d{6}$/), password: z.string().min(8).max(128).optional() });
export async function POST(request) {
  try {
    const input = schema.parse(await request.json());
    if (input.purpose === "reset" && !input.password) return NextResponse.json({ error: "A new password is required." }, { status: 400 });
    const email = input.email.toLowerCase(); await connectDB();
    const otp = await EmailOtp.findOne({ email, purpose: input.purpose }).select("+codeHash +passwordHash name phone expiresAt attempts");
    if (!otp || otp.expiresAt < new Date() || otp.attempts >= 5) return NextResponse.json({ error: "This code has expired or is no longer valid." }, { status: 400 });
    if (!(await bcrypt.compare(input.code, otp.codeHash))) { await EmailOtp.updateOne({ _id: otp._id }, { $inc: { attempts: 1 } }); return NextResponse.json({ error: "Invalid verification code." }, { status: 400 }); }
    let customer;
    if (input.purpose === "register") {
      customer = await Customer.create({ name: otp.name, email, phone: otp.phone || "", passwordHash: otp.passwordHash, emailVerifiedAt: new Date() });
    } else {
      customer = await Customer.findOneAndUpdate({ email }, { $set: { passwordHash: await bcrypt.hash(input.password, 12), emailVerifiedAt: new Date() } }, { new: true }).select("name email");
    }
    await EmailOtp.deleteOne({ _id: otp._id });
    const response = NextResponse.json({ customer: { id: customer.id, name: customer.name, email: customer.email } });
    response.cookies.set(customerCookie(makeCustomerToken(customer.id)));
    return response;
  } catch (error) { return NextResponse.json({ error: error?.code === 11000 ? "This email is already registered." : "Unable to verify this code." }, { status: 400 }); }
}
