import { Inbox } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="rounded-full bg-surface-muted p-4">
        <Inbox className="text-ink/40" size={28} />
      </div>
      <h3 className="font-heading text-lg font-semibold text-ink">{title}</h3>
      {message && <p className="max-w-sm text-sm text-ink/60">{message}</p>}
    </div>
  );
}
