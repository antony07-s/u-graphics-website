"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Pencil, Trash2, X } from "lucide-react";

const emptyForm = { label: "", address: "", city: "", state: "", postalCode: "", country: "India" };

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const load = () =>
    fetch("/api/customer/addresses")
      .then((r) => {
        if (r.status === 401) {
          router.replace("/account?next=/account/addresses");
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then((data) => data && setAddresses(data.addresses || []))
      .catch(() => setStatus("Unable to load addresses."));

  useEffect(() => {
    load();
  }, []);

  const change = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (address) => {
    setForm({
      label: address.label || "",
      address: address.address,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    });
    setEditingId(address._id);
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const url = editingId ? `/api/customer/addresses/${editingId}` : "/api/customer/addresses";
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save address.");
      setAddresses(data.addresses);
      setShowForm(false);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this address?")) return;
    const response = await fetch(`/api/customer/addresses/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (response.ok) setAddresses(data.addresses);
  };

  return (
    <section className="section min-h-[60vh] bg-surface-muted">
      <div className="container-page max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-ink">Saved Addresses</h1>
          <button onClick={openAddForm} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} /> Add Address
          </button>
        </div>

        {addresses === null ? (
          <p className="mt-8 text-ink/40">Loading...</p>
        ) : addresses.length === 0 ? (
          <div className="mt-8 rounded-card border border-dashed border-ink/15 bg-white p-10 text-center">
            <MapPin className="mx-auto text-ink/25" size={32} />
            <p className="mt-3 text-ink/60">No saved addresses yet.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {addresses.map((addr) => (
              <div key={addr._id} className="flex items-start justify-between rounded-card border border-ink/10 bg-white p-4 shadow-sm">
                <div>
                  {addr.label && <p className="text-xs font-semibold uppercase text-primary">{addr.label}</p>}
                  <p className="mt-1 text-sm text-ink">{addr.address}</p>
                  <p className="text-sm text-ink/60">{addr.city}, {addr.state} {addr.postalCode}</p>
                  <p className="text-sm text-ink/60">{addr.country}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditForm(addr)} className="text-ink/40 hover:text-primary" aria-label="Edit">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => remove(addr._id)} className="text-ink/40 hover:text-danger" aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={() => setShowForm(false)}>
            <div className="w-full max-w-md rounded-card bg-white p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold">{editingId ? "Edit Address" : "Add Address"}</h2>
                <button onClick={() => setShowForm(false)} aria-label="Close"><X size={20} /></button>
              </div>
              <form onSubmit={submit} className="mt-4 space-y-3">
                <input placeholder="Label (e.g. Home, Office) - optional" value={form.label} onChange={change("label")} className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" />
                <input required placeholder="Address" value={form.address} onChange={change("address")} className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <input required placeholder="City" value={form.city} onChange={change("city")} className="rounded-lg border border-ink/15 px-3 py-2 text-sm" />
                  <input required placeholder="State" value={form.state} onChange={change("state")} className="rounded-lg border border-ink/15 px-3 py-2 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input required placeholder="Postal Code" value={form.postalCode} onChange={change("postalCode")} className="rounded-lg border border-ink/15 px-3 py-2 text-sm" />
                  <input required placeholder="Country" value={form.country} onChange={change("country")} className="rounded-lg border border-ink/15 px-3 py-2 text-sm" />
                </div>
                {status && <p className="text-sm text-danger">{status}</p>}
                <button disabled={loading} className="btn-primary w-full disabled:opacity-60">
                  {loading ? "Saving..." : editingId ? "Save Changes" : "Add Address"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
