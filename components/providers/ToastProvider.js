"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, LoaderCircle, X } from "lucide-react";

const ToastContext = createContext(null);
const icons = { success: CheckCircle2, error: AlertCircle, warning: AlertTriangle, info: Info, loading: LoaderCircle };
const styles = { success: "border-success/20", error: "border-danger/20", warning: "border-accent/30", info: "border-primary/20", loading: "border-primary/20" };

export function ToastProvider({ children }) {
  const [active, setActive] = useState(null);
  const queue = useRef([]);
  const timer = useRef(null);

  const clearTimer = () => { if (timer.current) window.clearTimeout(timer.current); timer.current = null; };
  const showNext = useCallback(() => {
    setActive(queue.current.shift() || null);
  }, []);
  const dismiss = useCallback((id) => {
    clearTimer();
    setActive((current) => {
      if (!current || (id && current.id !== id)) return current;
      window.setTimeout(showNext, 140);
      return null;
    });
  }, [showNext]);
  const notify = useCallback((type, title, message = "", options = {}) => {
    const item = { id: crypto.randomUUID(), type, title, message, duration: options.duration ?? (type === "error" ? 6000 : 4000) };
    setActive((current) => { if (current) queue.current.push(item); else return item; return current; });
    return item.id;
  }, []);
  const update = useCallback((id, type, title, message = "", options = {}) => {
    setActive((current) => current?.id === id ? { ...current, type, title, message, duration: options.duration ?? (type === "loading" ? 0 : 4000) } : current);
    queue.current = queue.current.map((item) => item.id === id ? { ...item, type, title, message, duration: options.duration ?? item.duration } : item);
  }, []);

  useEffect(() => {
    clearTimer();
    if (active?.duration > 0) timer.current = window.setTimeout(() => dismiss(active.id), active.duration);
    return clearTimer;
  }, [active, dismiss]);

  const toast = useMemo(() => ({
    success: (title, message, options) => notify("success", title, message, options),
    error: (title, message, options) => notify("error", title, message, options),
    warning: (title, message, options) => notify("warning", title, message, options),
    info: (title, message, options) => notify("info", title, message, options),
    loading: (title = "Processing…", message = "Please wait") => notify("loading", title, message, { duration: 0 }),
    update,
    dismiss,
  }), [dismiss, notify, update]);
  const Icon = active ? icons[active.type] || Info : null;

  return <ToastContext.Provider value={toast}>{children}
    <div aria-live="polite" aria-atomic="true" className="pointer-events-none fixed inset-x-3 bottom-20 z-[100] mx-auto w-auto max-w-sm sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[min(24rem,calc(100vw-2.5rem))]">
      {active && <div role="status" className={`pointer-events-auto relative overflow-hidden rounded-card border bg-white p-4 pr-11 shadow-card motion-safe:animate-[toast-in_.2s_ease-out] ${styles[active.type]}`}>
        <div className="flex gap-3"><Icon size={20} className={`mt-0.5 shrink-0 ${active.type === "error" ? "text-danger" : active.type === "warning" ? "text-accent" : "text-primary"} ${active.type === "loading" ? "animate-spin" : ""}`} />
          <div className="min-w-0"><p className="text-sm font-semibold text-ink">{active.title}</p>{active.message && <p className="mt-0.5 break-words text-sm leading-5 text-ink/65">{active.message}</p>}</div>
        </div>
        <button type="button" onClick={() => dismiss(active.id)} className="absolute right-3 top-3 rounded p-1 text-ink/45 hover:bg-surface-muted hover:text-ink" aria-label="Dismiss notification"><X size={16} /></button>
        {active.duration > 0 && <span className="absolute bottom-0 left-0 h-0.5 bg-primary/70 motion-safe:animate-[toast-progress_var(--toast-duration)_linear_forwards]" style={{ "--toast-duration": `${active.duration}ms` }} />}
      </div>}
    </div>
  </ToastContext.Provider>;
}

export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error("useToast must be used inside ToastProvider.");
  return toast;
}
