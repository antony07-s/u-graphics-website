import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "ug_customer";
const secret = () => process.env.CUSTOMER_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
const sign = (value) => crypto.createHmac("sha256", secret() || "development-only-secret").update(value).digest("base64url");
export function makeCustomerToken(id) { const value = `${id}.${Date.now() + 1000 * 60 * 60 * 24 * 14}`; return `${value}.${sign(value)}`; }
export function readCustomerId() { const token = cookies().get(COOKIE)?.value; if (!token) return null; const [id, expires, signature] = token.split("."); const expected = sign(`${id}.${expires}`); if (!id || !expires || !signature || Number(expires) < Date.now() || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null; return id; }
export function customerCookie(token) { return { name: COOKIE, value: token, httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 14 }; }
export function clearCustomerCookie() { return { name: COOKIE, value: "", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 }; }
