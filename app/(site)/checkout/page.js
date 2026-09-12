"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MapPin, Check } from "lucide-react";

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);

const fieldConfig = [
  { key: "name", label: "Full name", span: 1 },
  { key: "email", label: "Email", span: 1 },
  { key: "phone", label: "Phone", span: 1 },
  { key: "address", label: "Address", span: 2 },
  { key: "city", label: "City", span: 1 },
  { key: "state", label: "State", span: 1 },
  { key: "postalCode", label: "Postal code", span: 1 },
  { key: "country", label: "Country", span: 1 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [values, setValues] = useState({ country: "India" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    fetch("/api/customer/session").then((r) => r.json()).then(({ customer }) => {
      if (!customer) router.replace("/account?next=/checkout");
      else setValues((v) => ({ ...v, name: customer.name, email: customer.email, phone: customer.phone || "" }));
    });
    fetch("/api/cart").then((r) => r.ok ? r.json() : null).then((data) => setCart(data?.cart || { items: [] }));
    // Load saved addresses so the customer can pick one instead of retyping
    fetch("/api/customer/addresses").then((r) => r.ok ? r.json() : null).then((data) => setSavedAddresses(data?.addresses || []));
  }, [router]);

  const selectAddress = (addr) => {
    setSelectedAddressId(addr._id);
    setValues((v) => ({
      ...v,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
    }));
  };

  const subtotal = cart?.items?.reduce((sum, item) => sum + item.quantity * item.priceAtAddTime, 0) || 0;
  const shipping = subtotal >= 2000 ? 0 : 150;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name, email: values.email, phone: values.phone,
        shippingAddress: { address: values.address, city: values.city, state: values.state, postalCode: values.postalCode, country: values.country },
      }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return setStatus(data.error || "Unable to place your order.");
    window.dispatchEvent(new Event("cart-changed"));
    router.push(`/order-confirmation/${data.order.orderNumber}`);
  };

  return (
    <section className="section bg-surface-muted min-h-[70vh]">
      <div className="container-page">
        <h1 className="font-heading text-3xl font-bold text-ink">Checkout</h1>
        <p className="mt-1 text-sm text-ink/60">Enter your shipping details to complete your order</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <div className="rounded-card border border-ink/10 bg-white p-6 shadow-card">
            {savedAddresses.length > 0 && (
              <div className="mb-6">
                <p className="mb-2 text-sm font-medium text-ink">Choose a saved address</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {savedAddresses.map((addr) => (
                    <button
                      type="button"
                      key={addr._id}
                      onClick={() => selectAddress(addr)}
                      className={`relative rounded-lg border p-3 text-left text-sm transition ${
                        selectedAddressId === addr._id
                          ? "border-primary bg-primary/5"
                          : "border-ink/15 hover:border-primary/50"
                      }`}
                    >
                      {selectedAddressId === addr._id && (
                        <Check size={16} className="absolute right-2 top-2 text-primary" />
                      )}
                      <div className="flex items-center gap-1.5 font-medium text-ink">
                        <MapPin size={13} className="text-ink/40" />
                        {addr.label || "Address"}
                      </div>
                      <p className="mt-1 text-xs text-ink/60">
                        {addr.address}, {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                    </button>
                  ))}
                </div>
                <div className="my-4 flex items-center gap-3 text-xs font-medium text-ink/40">
                  <span className="h-px flex-1 bg-ink/10" />
                  OR ENTER A NEW ADDRESS BELOW
                  <span className="h-px flex-1 bg-ink/10" />
                </div>
              </div>
            )}

            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
              {fieldConfig.map((field) => (
                <label key={field.key} className={field.span === 2 ? "sm:col-span-2" : ""}>
                  <span className="mb-1 block text-sm font-medium text-ink">{field.label}</span>
                  <input
                    required
                    value={values[field.key] || ""}
                    onChange={(event) => {
                      setSelectedAddressId(null);
                      setValues({ ...values, [field.key]: event.target.value });
                    }}
                    className="w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </label>
              ))}

              {status && <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{status}</p>}

              <button disabled={loading} className="btn-primary sm:col-span-2 disabled:opacity-60">
                {loading ? "Placing order..." : "Place order"}
              </button>
            </form>
          </div>

          <aside className="h-fit rounded-card bg-white p-6 shadow-card">
            <h2 className="font-heading text-lg font-semibold text-ink">Order Summary</h2>
            {cart?.items?.length ? (
              <div className="mt-4 space-y-3">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-ink/70">{item.product?.title} × {item.quantity}</span>
                    <span className="font-medium text-ink">{money(item.quantity * item.priceAtAddTime)}</span>
                  </div>
                ))}
                <div className="border-t border-ink/10 pt-3 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-ink/60">Subtotal</span>
                    <span className="text-ink">{money(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink/60">Shipping</span>
                    <span className="text-ink">{shipping === 0 ? "Free" : money(shipping)}</span>
                  </div>
                  <div className="flex justify-between border-t border-ink/10 pt-2 font-heading font-semibold text-ink">
                    <span>Total</span>
                    <span>{money(subtotal + shipping)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-ink/50">Your cart is empty.</p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
