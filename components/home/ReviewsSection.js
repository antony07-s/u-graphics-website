import SectionHeading from "@/components/ui/SectionHeading";
import TestimonialCard from "@/components/ui/TestimonialCard";

// Temporary placeholder reviews — replace with real customer reviews later
// (e.g. once the Review model/admin moderation from Phase 10 is connected
// to this section instead of static data).
const placeholderReviews = [
  {
    quote:
      "Really happy with the signboard quality and how quickly it was installed. Highly professional team.",
    name: "Arun K",
    company: "Google Review",
  },
  {
    quote:
      "Great experience getting our business cards and brochures printed. The colors came out exactly right.",
    name: "Kavi Raj",
    company: "Google Review",
  },
  {
    quote:
      "U Graphics handled our shop signage from design to install. Would recommend to anyone needing signage work.",
    name: "Edward Joseph",
    company: "Google Review",
  },
];

export default function ReviewsSection() {
  return (
    <section className="section">
      <div className="container-page">
        <SectionHeading
          eyebrow="What Customers Say"
          title="Reviews"
          subtitle="4.8 average rating from verified customers"
        />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {placeholderReviews.map((review, i) => (
            <TestimonialCard key={i} {...review} />
          ))}
        </div>
      </div>
    </section>
  );
}
