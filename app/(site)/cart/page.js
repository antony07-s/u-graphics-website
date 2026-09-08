"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    const response = await fetch("/api/cart");
    if (response.status === 401) return setCart({ items: [] });
    const data = await response.json();
    setCart(data.cart);
  };

  useEffect(() => { load(); }, []);

  const change = async (id, quantity) => {
    if (quantity < 1) return;
    const response = await fetch(`/api/cart/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ quantity }) });
    if (!response.ok) setError((await response.json()).error);
    else { window.dispatchEvent(new Event("cart-changed")); load(); }
  };

  const remove = async (id) => {
    await fetch(`/api/cart/${id}`, { method: "DELETE" });
    window.dispatchEvent(new Event("cart-changed"));
    load();
  };

  if (!cart) {
    return (
      <section className="section">
        <div className="container-page">
          <div className="animate-pulse text-ink/40">Loading cart…</div>
        </div>
      </section>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.quantity * item.priceAtAddTime, 0);

  return (
    <section className="section bg-surface-muted min-h-[70vh]">
      <div className="container-page">
        <h1 className="font-heading text-3xl font-bold text-ink">Your Cart</h1>
        <p className="mt-1 text-sm text-ink/60">{cart.items.length} item{cart.items.length !== 1 ? "s" : ""} in your cart</p>

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        {cart.items.length ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <article key={item.id} className="flex gap-4 rounded-card border border-ink/10 bg-white p-4 shadow-sm">
                  {item.product?.image && (
                    <Image src={item.product.image} alt="" width={96} height={96} className="h-24 w-24 flex-shrink-0 rounded-lg object-cover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <Link href={`/products/${item.product?.slug}`} className="font-heading font-semibold text-ink hover:text-primary">
                      {item.product?.title}
                    </Link>
                    {item.selectedVariants.length > 0 && (
                      <p className="mt-0.5 text-sm text-ink/50">
                        {item.selectedVariants.map((variant) => `${variant.name}: ${variant.value}`).join(", ")}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-ink/60">{money(item.priceAtAddTime)} each</p>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center rounded-lg border border-ink/15">
                        <button onClick={() => change(item.id, item.quantity - 1)} className="px-3 py-1.5 text-ink/60 hover:text-primary" aria-label="Decrease quantity">−</button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => change(item.id, item.quantity + 1)} className="px-3 py-1.5 text-ink/60 hover:text-primary" aria-label="Increase quantity">+</button>
                      </div>
                      <button onClick={() => remove(item.id)} className="text-sm text-red-500 hover:underline">Remove</button>
                    </div>
                  </div>
                  <strong className="font-heading text-ink">{money(item.quantity * item.priceAtAddTime)}</strong>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-card bg-white p-6 shadow-card">
              <h2 className="font-heading text-lg font-semibold text-ink">Order Summary</h2>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-ink/60">Subtotal</span>
                <strong className="text-ink">{money(subtotal)}</strong>
              </div>
              <p className="mt-2 text-xs text-ink/50">Shipping is calculated securely at checkout.</p>
              <Link href="/checkout" className="btn-primary mt-5 block text-center">Proceed to Checkout</Link>
              <Link href="/products" className="mt-3 block text-center text-sm text-primary hover:underline">Continue shopping</Link>
            </aside>
          </div>
        ) : (
          <div className="mt-10 rounded-card border border-dashed border-ink/15 bg-white p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-ink/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="mt-4 text-ink/60">Your cart is empty.</p>
            <Link href="/products" className="btn-primary mt-4 inline-flex">Browse products</Link>
          </div>
        )}
      </div>
    </section>
  );
}
