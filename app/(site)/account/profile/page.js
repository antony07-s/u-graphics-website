"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const blankAddress = () => ({ label: "", address: "", city: "", state: "", postalCode: "", country: "India" });

export default function AccountProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/customer/session", { cache: "no-store" }).then((response) => response.json()).then((data) => {
      if (!data.customer) router.replace("/account?next=/account/profile");
      else setProfile({ ...data.customer, addresses: data.customer.addresses || [] });
    }).catch(() => setStatus("Unable to load your account."));
  }, [router]);

  const update = (key, value) => setProfile((current) => ({ ...current, [key]: value }));
  const updateAddress = (index, key, value) => setProfile((current) => ({ ...current, addresses: current.addresses.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) }));
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setStatus("");
    try {
      const response = await fetch("/api/customer/session", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to update account.");
      setProfile(data.customer); setStatus("Your account has been saved.");
      window.dispatchEvent(new CustomEvent("customer-changed"));
    } catch (error) { setStatus(error.message || "Unable to update account."); } finally { setSaving(false); }
  };

  if (!profile) return <section className="section"><div className="container-page text-sm text-ink/50">Loading your account…</div></section>;
  return <section className="section min-h-[70vh] bg-surface-muted"><form onSubmit={save} className="container-page max-w-3xl"><div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="font-heading text-3xl font-bold">My Account</h1><p className="mt-1 text-sm text-ink/60">Manage your contact details and saved delivery addresses.</p></div><Link href="/orders" className="btn-outline px-4 py-2 text-sm">My Orders</Link></div><div className="mt-7 space-y-6"><section className="rounded-card bg-white p-5 shadow-card sm:p-6"><h2 className="font-heading text-xl font-semibold">Profile details</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Name<input required value={profile.name} onChange={(event) => update("name", event.target.value)} className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 font-normal" /></label><label className="text-sm font-medium">Phone<input value={profile.phone || ""} onChange={(event) => update("phone", event.target.value)} className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 font-normal" /></label><label className="text-sm font-medium sm:col-span-2">Email<input disabled value={profile.email} className="mt-1 w-full cursor-not-allowed rounded-lg border border-ink/10 bg-surface-muted px-3 py-2.5 font-normal text-ink/55" /></label></div></section><section className="rounded-card bg-white p-5 shadow-card sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-heading text-xl font-semibold">Saved addresses</h2><p className="mt-1 text-sm text-ink/60">Use a saved address during checkout.</p></div><button type="button" onClick={() => update("addresses", [...profile.addresses, blankAddress()])} className="btn-outline px-4 py-2 text-sm">Add address</button></div><div className="mt-5 space-y-5">{profile.addresses.map((address, index) => <fieldset key={address.id || index} className="rounded-lg border border-ink/10 p-4"><legend className="px-1 text-sm font-semibold">Address {index + 1}</legend><div className="grid gap-3 sm:grid-cols-2">{[["label", "Label (Home, Office)"], ["address", "Address"], ["city", "City"], ["state", "State"], ["postalCode", "Postal code"], ["country", "Country"]].map(([key, label]) => <label key={key} className={`text-sm ${key === "address" ? "sm:col-span-2" : ""}`}>{label}<input required={key !== "label"} value={address[key] || ""} onChange={(event) => updateAddress(index, key, event.target.value)} className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5" /></label>)}</div><button type="button" onClick={() => update("addresses", profile.addresses.filter((_, itemIndex) => itemIndex !== index))} className="mt-4 text-sm font-semibold text-danger hover:underline">Remove address</button></fieldset>)}{!profile.addresses.length && <p className="rounded-lg bg-surface-muted p-4 text-sm text-ink/60">No saved addresses yet.</p>}</div></section></div>{status && <p className={`mt-4 text-sm ${status.includes("saved") ? "text-success" : "text-danger"}`} role="status">{status}</p>}<button disabled={saving} className="btn-primary mt-6 disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button></form></section>;
}
