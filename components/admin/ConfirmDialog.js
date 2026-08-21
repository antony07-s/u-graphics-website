"use client";

import { useEffect } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

export default function ConfirmDialog({ open, title = "Confirm action", description, confirmLabel = "Confirm", onConfirm, onClose, loading = false, destructive = true }) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 p-4" role="presentation" onMouseDown={() => !loading && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title" className="w-full max-w-md rounded-card bg-white p-6 shadow-cardHover" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${destructive ? "bg-red-50 text-danger" : "bg-primary/10 text-primary"}`}><AlertTriangle size={22} /></div>
          <button type="button" onClick={onClose} disabled={loading} aria-label="Close confirmation dialog" className="text-ink/50 hover:text-ink disabled:opacity-40"><X size={20} /></button>
        </div>
        <h2 id="confirm-dialog-title" className="mt-4 font-heading text-xl font-semibold text-ink">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-ink/65">{description}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} disabled={loading} className="btn-outline justify-center disabled:opacity-50">Cancel</button>
          <button type="button" onClick={onConfirm} disabled={loading} className={`${destructive ? "bg-danger text-white hover:bg-danger/90" : "btn-primary"} inline-flex items-center justify-center gap-2 rounded-card px-4 py-2.5 text-sm font-medium disabled:opacity-50`}>
            {loading && <Loader2 size={16} className="animate-spin" />}{loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
