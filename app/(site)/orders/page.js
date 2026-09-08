"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);

const statusStyles = {
  placed: "bg-blue-100 text-blue-700",
  shipped: "bg-amber-100 text-amber-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    fetch("/api/orders").then((r) => r.ok ? r.json() : null).then((data) => setOrders(data?.orders || []));
  }, []);

  return (
    <section className="section bg-surface-muted min-h-[70vh]">
      <div className="container-page max-w-3xl">
        <h1 className="font-heading text-3xl font-bold text-ink">Your Orders</h1>

        {orders === null ? (
          <div className="mt-6 text-ink/40">Loading…</div>
        ) : orders.length ? (
          <div className="mt-6 space-y-3">
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/order-confirmation/${order.orderNumber}`}
                className="flex items-center justify-between rounded-card border border-ink/10 bg-white p-5 shadow-sm transition hover:border-primary hover:shadow-card"
              >
                <div>
                  <strong className="font-heading text-ink">{order.orderNumber}</strong>
                  {order.createdAt && (
                    <p className="mt-0.5 text-xs text-ink/50">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[order.orderStatus] || "bg-ink/10 text-ink/60"}`}>
                    {order.orderStatus}
                  </span>
                  <strong className="text-ink">{money(order.total)}</strong>
                  <svg className="h-4 w-4 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-card border border-dashed border-ink/15 bg-white p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-ink/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4 text-ink/60">No orders yet.</p>
            <Link href="/products" className="btn-primary mt-4 inline-flex">Browse products</Link>
          </div>
        )}
      </div>
    </section>
  );
}
