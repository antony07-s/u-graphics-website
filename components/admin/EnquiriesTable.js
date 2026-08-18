"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteButton from "@/components/admin/DeleteButton";

const statusStyles = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-amber-50 text-amber-700",
  closed: "bg-green-50 text-green-700",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EnquiriesTable({ enquiries }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(null);

  const handleStatusChange = async (id, status) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/enquiry/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      alert("Failed to update status.");
    } finally {
      setUpdating(null);
    }
  };

  if (enquiries.length === 0) {
    return (
      <p className="p-8 text-center text-sm text-ink/50">
        No enquiries yet. Submissions from the Contact and Get a Quote forms
        will show up here.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {enquiries.map((enquiry) => (
        <div
          key={enquiry._id}
          className="rounded-card bg-white p-5 shadow-card"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-heading font-semibold text-ink">
                {enquiry.name}
              </p>
              <p className="text-sm text-ink/60">
                {enquiry.phone}
                {enquiry.email && ` · ${enquiry.email}`}
              </p>
              {enquiry.serviceCategory && (
                <p className="mt-1 text-xs text-ink/50">
                  Interested in: {enquiry.serviceCategory}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={enquiry.status}
                disabled={updating === enquiry._id}
                onChange={(e) =>
                  handleStatusChange(enquiry._id, e.target.value)
                }
                className={`rounded-full border-0 px-3 py-1 text-xs font-medium outline-none ${
                  statusStyles[enquiry.status] || "bg-surface-muted text-ink"
                }`}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
              <DeleteButton
                apiPath={`/api/enquiry/${enquiry._id}`}
                itemLabel={`enquiry from ${enquiry.name}`}
              />
            </div>
          </div>

          {enquiry.message && (
            <p className="mt-3 text-sm text-ink/70">{enquiry.message}</p>
          )}

          <p className="mt-3 text-xs text-ink/40">
            {formatDate(enquiry.createdAt)}
          </p>
        </div>
      ))}
    </div>
  );
}