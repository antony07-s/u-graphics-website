import SectionHeading from "@/components/ui/SectionHeading";

// Temporary placeholder logos — replace with real client logos later
// (upload to Cloudinary "u-graphics/clients/" folder and swap URLs below).
const clientLogos = [
  { name: "Client One", logo: "https://placehold.co/160x80/f5f6f8/1a1a1a?text=Client+1" },
  { name: "Client Two", logo: "https://placehold.co/160x80/f5f6f8/1a1a1a?text=Client+2" },
  { name: "Client Three", logo: "https://placehold.co/160x80/f5f6f8/1a1a1a?text=Client+3" },
  { name: "Client Four", logo: "https://placehold.co/160x80/f5f6f8/1a1a1a?text=Client+4" },
  { name: "Client Five", logo: "https://placehold.co/160x80/f5f6f8/1a1a1a?text=Client+5" },
  { name: "Client Six", logo: "https://placehold.co/160x80/f5f6f8/1a1a1a?text=Client+6" },
];

export default function TrustedByClients() {
  return (
    <section className="section section-alt">
      <div className="container-page">
        <SectionHeading eyebrow="Trusted By" title="Our Clients" />
        <div className="mt-10 -mx-4 flex gap-6 overflow-x-auto px-4 pb-2 scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 md:grid-cols-6">
          {clientLogos.map((client) => (
            <div
              key={client.name}
              className="flex w-32 shrink-0 items-center justify-center rounded-card border border-black/5 bg-white p-4 grayscale transition hover:grayscale-0 sm:w-auto"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="h-10 w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
