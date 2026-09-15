import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { makeCustomerToken, customerCookie } from "@/lib/customerAuth";
import { activeOtherSession, recordCustomerSession } from "@/lib/customerSessions";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request) {
  try {
    const { credential } = await request.json();
    if (!credential) {
      return NextResponse.json({ error: "Missing Google credential." }, { status: 400 });
    }

    // Verifies the token was really issued by Google for OUR app - this is
    // the critical security check, never trust a token without verifying it.
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email) {
      return NextResponse.json({ error: "Google account has no email." }, { status: 400 });
    }

    await connectDB();
    const email = payload.email.toLowerCase();

    // Find by googleId first, then fall back to matching an existing
    // email/password account (so someone who signed up normally can also
    // use Google sign-in later, without creating a duplicate account).
    let customer = await Customer.findOne({ googleId: payload.sub });
    if (!customer) {
      customer = await Customer.findOne({ email });
      if (customer && !customer.googleId) {
        customer.googleId = payload.sub;
        if (!customer.emailVerifiedAt) customer.emailVerifiedAt = new Date();
        await customer.save();
      }
    }

    if (!customer) {
      customer = await Customer.create({
        name: payload.name || email.split("@")[0],
        email,
        googleId: payload.sub,
        emailVerifiedAt: new Date(),
      });
    }

    const sessionId = crypto.randomBytes(24).toString("base64url");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);
    const otherSession = await activeOtherSession(customer.id);
    await recordCustomerSession(customer.id, sessionId, expiresAt, request.headers.get("user-agent"));
    const token = makeCustomerToken(customer.id, sessionId);
    const response = NextResponse.json({
      customer: { id: customer.id, name: customer.name, email: customer.email },
      otherSession,
    });
    response.cookies.set(customerCookie(token));
    return response;
  } catch (error) {
    console.error("Google sign-in error:", error);
    return NextResponse.json({ error: "Unable to sign in with Google." }, { status: 500 });
  }
}
