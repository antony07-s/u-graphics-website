"use client";

import { useCallback, useEffect, useState } from "react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/reviews", { cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to load reviews.");
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load reviews.");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const change = async (id, isApproved) => {
    setSavingId(id);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/reviews", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, isApproved }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to update review.");
      setMessage("Review updated.");
      await load();
    } catch (changeError) {
      setError(changeError.message || "Unable to update review.");
    } finally {
      setSavingId("");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this review? This cannot be undone.")) return;
    setSavingId(id);
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/admin/reviews?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to delete review.");
      setMessage("Review deleted.");
      await load();
    } catch (removeError) {
      setError(removeError.message || "Unable to delete review.");
    } finally {
      setSavingId("");
    }
  };

  return <div>
    <h1 className="font-heading text-2xl font-bold">Reviews</h1>
    {message && <p className="mt-4 text-sm text-success" role="status">{message}</p>}
    {error && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-card border border-red-200 bg-red-50 p-3 text-sm text-danger" role="alert"><span>{error}</span><button onClick={load} className="font-semibold underline">Try again</button></div>}
    <div className="mt-6 space-y-3">
      {loading && <p className="rounded-card bg-white p-8 text-center text-ink/55">Loading reviews…</p>}
      {!loading && reviews.map((review) => <article key={review._id} className="rounded-card bg-white p-5 shadow-card"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold">{review.customerName} · {review.rating}/5</p><p className="mt-1 text-sm text-ink/55">{review.product?.title || "Removed product"}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${review.isApproved ? "bg-green-50 text-success" : "bg-orange-50 text-accent"}`}>{review.isApproved ? "Approved" : "Pending"}</span></div><p className="mt-3 whitespace-pre-wrap break-words text-sm text-ink/75">{review.comment}</p><div className="mt-4 flex flex-wrap gap-3"><button disabled={savingId === review._id} onClick={() => change(review._id, !review.isApproved)} className="text-sm font-medium text-primary disabled:cursor-wait disabled:opacity-50">{review.isApproved ? "Hide" : "Approve"}</button><button disabled={savingId === review._id} onClick={() => remove(review._id)} className="text-sm font-medium text-danger disabled:cursor-wait disabled:opacity-50">Delete</button></div></article>)}
      {!loading && !reviews.length && <p className="rounded-card bg-white p-8 text-center text-ink/55">No reviews yet.</p>}
    </div>
  </div>;
}
