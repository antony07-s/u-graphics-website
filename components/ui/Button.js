import Link from "next/link";

const variants = {
  primary: "bg-accent text-white hover:bg-accent-dark shadow-card hover:shadow-cardHover",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  outlineLight: "border-2 border-white text-white hover:bg-white hover:text-primary",
  ghost: "text-primary hover:bg-surface-muted",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

/**
 * Shared Button component.
 * Renders a <Link> if `href` is provided, otherwise a <button>.
 */
export default function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-card font-heading font-semibold transition ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
