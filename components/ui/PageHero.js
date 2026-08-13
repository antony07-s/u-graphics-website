import Breadcrumb from "./Breadcrumb";

/**
 * Smaller hero banner used on inner pages (not the homepage).
 * Keeps consistent brand-blue background with a breadcrumb trail.
 */
export default function PageHero({ title, subtitle, crumbs }) {
  return (
    <section className="bg-gradient-to-br from-primary to-primary-dark py-16 text-white">
      <div className="container-page">
        {crumbs && <Breadcrumb items={crumbs} light />}
        <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-xl text-white/75">{subtitle}</p>}
      </div>
    </section>
  );
}
