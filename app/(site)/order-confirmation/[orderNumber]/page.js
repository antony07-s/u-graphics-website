"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);

export default function ConfirmationPage({ params }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`/api/orders/${params.orderNumber}`).then((r) => r.ok ? r.json() : null).then((data) => setOrder(data?.order || false));
  }, [params.orderNumber]);

  if (order === null) {
    return <section className="section"><div className="container-page text-ink/40">Loading confirmation…</div></section>;
  }
  if (!order) {
    return <section className="section"><div className="container-page">Order not found.</div></section>;
  }

  return (
    <section className="section bg-surface-muted min-h-[70vh]">
      <div className="container-page max-w-2xl">
        <div className="rounded-card bg-white p-8 shadow-card">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <p className="font-medium text-green-600">Order placed successfully</p>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-bold text-ink">Thank you, {order.customerInformation.name}</h1>
          <p className="mt-2 text-ink/60">Order reference: <strong className="text-ink">{order.orderNumber}</strong></p>

          <div className="mt-4 flex gap-2">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">Payment: Pending</span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">Status: Placed</span>
          </div>

          <div className="mt-6 divide-y divide-ink/10 rounded-lg border border-ink/10">
            {order.items.map((item) => (
              <div key={item.product} className="flex justify-between px-4 py-3 text-sm">
                <span className="text-ink">{item.name} × {item.quantity}</span>
                <span className="font-medium text-ink">{money(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between font-heading text-xl font-bold text-ink">
            <span>Total</span>
            <span>{money(order.total)}</span>
          </div>

          <div className="mt-8 flex gap-4">
            <Link href="/products" className="btn-primary">Continue Shopping</Link>
            <Link href="/orders" className="btn-outline">View Orders</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
