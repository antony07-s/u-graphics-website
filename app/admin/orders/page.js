"use client";

import { useCallback, useEffect, useState } from "react";

const statuses = ["placed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to load orders.");
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = async (orderNumber, orderStatus) => {
    setUpdatingOrder(orderNumber);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, orderStatus }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to update order.");
      setMessage("Order status updated.");
      await load();
    } catch (updateError) {
      setError(updateError.message || "Unable to update order.");
    } finally {
      setUpdatingOrder("");
    }
  };

  return <div>
    <h1 className="font-heading text-2xl font-bold">Orders</h1>
    <p className="mt-1 text-sm text-ink/60">Manage customer order status. Payments remain pending in this phase.</p>
    {message && <p className="mt-4 text-sm text-success" role="status">{message}</p>}
    {error && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-card border border-red-200 bg-red-50 p-3 text-sm text-danger" role="alert"><span>{error}</span><button onClick={load} className="font-semibold underline">Try again</button></div>}
    <div className="mt-6 overflow-x-auto rounded-card bg-white shadow-card">
      <table className="min-w-[720px] w-full text-left text-sm">
        <thead className="bg-surface-muted text-ink/60"><tr><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Total</th><th className="p-4">Payment</th><th className="p-4">Status</th></tr></thead>
        <tbody>{loading ? <tr><td colSpan="5" className="p-8 text-center text-ink/55">Loading orders…</td></tr> : orders.map((order) => <tr key={order._id} className="border-t border-ink/10"><td className="p-4 font-medium">{order.orderNumber}</td><td className="p-4">{order.customerInformation?.name || "—"}<br /><span className="text-xs text-ink/55">{order.customerInformation?.email || "—"}</span></td><td className="p-4">₹{Number(order.total || 0).toLocaleString("en-IN")}</td><td className="p-4 capitalize">{order.paymentStatus}</td><td className="p-4"><select aria-label={`Order status for ${order.orderNumber}`} value={order.orderStatus} disabled={updatingOrder === order.orderNumber} onChange={(event) => update(order.orderNumber, event.target.value)} className="rounded border border-ink/20 px-2 py-1 disabled:cursor-wait disabled:opacity-60">{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select></td></tr>)}{!loading && !orders.length && <tr><td colSpan="5" className="p-8 text-center text-ink/55">No orders yet.</td></tr>}</tbody>
      </table>
    </div>
  </div>;
}
