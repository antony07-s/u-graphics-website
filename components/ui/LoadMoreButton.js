import { Loader2 } from "lucide-react";

export default function LoadMoreButton({ onClick, loading, hasMore }) {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        disabled={loading}
        className="btn-outline flex items-center gap-2 disabled:opacity-60"
      >
        {loading && <Loader2 className="animate-spin" size={16} />}
        {loading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
}
