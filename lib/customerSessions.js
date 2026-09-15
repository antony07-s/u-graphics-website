import crypto from "crypto";
import CustomerSession from "@/models/CustomerSession";

const hash = (value) => crypto.createHash("sha256").update(value).digest("base64url");
const describe = (userAgent = "") => ({
  device: /mobile|android|iphone/i.test(userAgent) ? "Mobile" : /ipad|tablet/i.test(userAgent) ? "Tablet" : "Desktop",
  browser: /edg\//i.test(userAgent) ? "Edge" : /chrome\//i.test(userAgent) ? "Chrome" : /firefox\//i.test(userAgent) ? "Firefox" : /safari\//i.test(userAgent) ? "Safari" : "Browser",
  platform: /windows/i.test(userAgent) ? "Windows" : /android/i.test(userAgent) ? "Android" : /iphone|ipad|mac os/i.test(userAgent) ? "Apple" : /linux/i.test(userAgent) ? "Linux" : "Unknown platform",
});

export async function recordCustomerSession(customerId, sessionId, expiresAt, userAgent) {
  const metadata = describe(userAgent);
  await CustomerSession.create({ customer: customerId, sessionHash: hash(sessionId), expiresAt, ...metadata });
}
export async function activeOtherSession(customerId, sessionId) {
  const query = { customer: customerId, revokedAt: null, expiresAt: { $gt: new Date() } };
  if (sessionId) query.sessionHash = { $ne: hash(sessionId) };
  const session = await CustomerSession.findOne(query).sort({ lastActiveAt: -1 }).select("device browser platform lastActiveAt").lean();
  return session ? { device: session.device, browser: session.browser, platform: session.platform, lastActiveAt: session.lastActiveAt } : null;
}
export async function touchCustomerSession(sessionId) { if (sessionId) await CustomerSession.updateOne({ sessionHash: hash(sessionId), revokedAt: null, expiresAt: { $gt: new Date() } }, { $set: { lastActiveAt: new Date() } }); }
export async function revokeCustomerSession(sessionId) { if (sessionId) await CustomerSession.updateOne({ sessionHash: hash(sessionId) }, { $set: { revokedAt: new Date() } }); }
