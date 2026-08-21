"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

/**
 * apiPath: full API path to DELETE, e.g. `/api/portfolio/${id}`
 * itemLabel: human name shown in the confirm dialog, e.g. project.title
 */
export default function DeleteButton({ apiPath, itemLabel = "this item" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(apiPath, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setOpen(false);
      router.refresh();
    } catch {
      setError("Unable to delete this item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <button
      onClick={() => { setError(""); setOpen(true); }}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-card px-3 py-1.5 text-sm font-medium text-danger transition hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
      Delete
    </button>
    <ConfirmDialog
      open={open}
      loading={loading}
      title="Delete item?"
      description={error || `Delete "${itemLabel}"? This cannot be undone.`}
      confirmLabel="Delete permanently"
      onConfirm={handleDelete}
      onClose={() => setOpen(false)}
    />
    </>
  );
}
