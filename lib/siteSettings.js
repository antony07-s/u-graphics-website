import { connectDB } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { siteConfig } from "@/lib/siteConfig";
export async function getSiteSettings() { try { await connectDB(); const saved = await SiteSettings.findOne({ key: "primary" }).lean(); return saved ? { ...siteConfig, ...JSON.parse(JSON.stringify(saved)) } : siteConfig; } catch { return siteConfig; } }
