"use client";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";
export function useSiteSettings() { const [settings, setSettings] = useState(siteConfig); useEffect(() => { fetch("/api/site-settings").then((response) => response.json()).then(({ settings: saved }) => setSettings((current) => ({ ...current, ...saved }))).catch(() => {}); }, []); return settings; }
