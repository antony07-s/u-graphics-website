import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "ug_customer";
const SESSION_LIFETIME = 1000 * 60 * 60 * 24 * 14;
const secret = () => process.env.CUSTOMER_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
const sign = (value) => {
  const key = secret();
  if (!key) throw new Error("Customer sessions are not configured.");
  return crypto.createHmac("sha256", key).update(value).digest("base64url");
};
export function makeCustomerToken(id, sessionId = crypto.randomBytes(24).toString("base64url")) { const value = `${id}.${Date.now() + SESSION_LIFETIME}.${sessionId}`; return `${value}.${sign(value)}`; }
export function readCustomerSession() { const token = cookies().get(COOKIE)?.value; if (!token) return null; const parts = token.split("."); const modern = parts.length === 4; const [id, expires, sessionId, signature] = modern ? parts : [parts[0], parts[1], null, parts[2]]; const value = modern ? `${id}.${expires}.${sessionId}` : `${id}.${expires}`; const expected = sign(value); if (!id || !expires || !signature || !Number.isFinite(Number(expires)) || Number(expires) < Date.now() || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null; return { id, sessionId, expiresAt: new Date(Number(expires)) }; }
export function readCustomerId() { return readCustomerSession()?.id || null; }
export function customerCookie(token) { return { name: COOKIE, value: token, httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_LIFETIME / 1000 }; }
export function clearCustomerCookie() { return { name: COOKIE, value: "", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 }; }
