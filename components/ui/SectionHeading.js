export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <span
          className={`mb-2 inline-block font-heading text-xs font-semibold uppercase tracking-wider ${
            light ? "text-accent" : "text-accent"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-heading text-3xl font-bold sm:text-4xl ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-base ${light ? "text-white/75" : "text-ink/70"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
