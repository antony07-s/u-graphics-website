import { Quote } from "lucide-react";

export default function TestimonialCard({ quote, name, company }) {
  return (
    <div className="rounded-card bg-white p-6 shadow-card">
      <Quote className="text-accent" size={28} />
      <p className="mt-3 text-sm text-ink/75">{quote}</p>
      <div className="mt-4 border-t pt-3">
        <p className="font-heading text-sm font-semibold text-ink">{name}</p>
        {company && <p className="text-xs text-ink/50">{company}</p>}
      </div>
    </div>
  );
}
