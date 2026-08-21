"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";

const fields = [
  ["email", "Public contact email"],
  ["enquiryRecipientEmail", "Enquiry notification inbox"],
  ["indiaAddress", "India address"],
  ["indiaPhone", "India phone"],
  ["malaysiaAddress", "Malaysia address"],
  ["malaysiaPhone", "Malaysia phone"],
  ["whatsapp", "WhatsApp digits (country code included)"],
  ["instagram", "Instagram profile URL"],
  ["telegram", "Telegram profile URL"],
  ["facebook", "Facebook profile URL"],
];

const optionalFields = ["instagram", "telegram", "facebook"];

export default function SiteSettingsForm() {
  const [settings, setSettings] = useState(siteConfig);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/site-settings?admin=true")
      .then((response) => response.json())
      .then(({ settings: saved }) => setSettings({
        ...siteConfig,
        ...saved,
        ...(saved.socialLinks || {}),
        socialLinks: { ...(siteConfig.socialLinks || {}), ...(saved.socialLinks || {}) },
        homepageStats: saved.homepageStats?.length ? saved.homepageStats : siteConfig.homepageStats,
      }))
      .catch(() => {});
  }, []);

  const updateStat = (index, field, value) => {
    const homepageStats = settings.homepageStats.map((stat, statIndex) =>
      statIndex === index
        ? { ...stat, [field]: field === "value" ? Number(value) : value }
        : stat
    );
    setSettings({ ...settings, homepageStats });
  };

  const save = async (event) => {
    event.preventDefault();
    setStatus("Saving...");
    const socialLinks = {
      instagram: settings.instagram || "",
      telegram: settings.telegram || "",
      facebook: settings.facebook || "",
    };
    const response = await fetch("/api/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...settings, socialLinks }),
    });
    setStatus(response.ok ? "Saved." : "Unable to save settings.");
  };

  return (
    <form onSubmit={save} className="max-w-3xl rounded-card bg-white p-6 shadow-card">
      <h1 className="font-heading text-2xl font-bold">Site Settings</h1>
      <p className="mt-1 text-sm text-ink/60">Manage public contact details, the enquiry inbox, and homepage content.</p>

      <div className="mt-6 grid gap-4">
        {fields.map(([name, label]) => (
          <label key={name} className="text-sm font-medium">
            {label}
            <textarea
              required={!optionalFields.includes(name)}
              name={name}
              rows={name.includes("Address") ? 3 : 1}
              value={settings[name] || ""}
              onChange={(event) => setSettings({ ...settings, [name]: event.target.value })}
              className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2"
            />
          </label>
        ))}
      </div>

      <section className="mt-8 border-t border-ink/10 pt-6">
        <h2 className="font-heading text-lg font-semibold">Homepage Statistics</h2>
        <p className="mt-1 text-sm text-ink/60">These four figures appear in the statistics section on the homepage.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {settings.homepageStats?.map((stat, index) => (
            <div key={`${stat.label}-${index}`} className="rounded-card border border-ink/10 p-4">
              <label className="block text-sm font-medium">Label
                <input required value={stat.label} onChange={(event) => updateStat(index, "label", event.target.value)} className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2" />
              </label>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="text-sm font-medium">Number
                  <input required min="0" type="number" value={stat.value} onChange={(event) => updateStat(index, "value", event.target.value)} className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2" />
                </label>
                <label className="text-sm font-medium">Suffix
                  <input value={stat.suffix || ""} onChange={(event) => updateStat(index, "suffix", event.target.value)} className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2" placeholder="+" />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 flex items-center gap-4">
        <button className="btn-primary">Save settings</button>
        <span className="text-sm text-ink/60">{status}</span>
      </div>
    </form>
  );
}
