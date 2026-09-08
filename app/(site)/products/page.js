import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard from "@/components/products/ProductCard";

export const metadata = { title: "Products", description: "Custom printing, signage and branding products from U Graphics." };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export default async function ProductsPage({ searchParams }) {
  await connectDB();

  const q = typeof searchParams.q === "string" ? searchParams.q.trim().slice(0, 80) : "";
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const query = q ? { $or: [{ title: { $regex: escaped, $options: "i" } }, { slug: { $regex: escaped, $options: "i" } }] } : {};

  const page = Math.max(1, parseInt(searchParams.page, 10) || 1);

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Product.countDocuments(query),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageHref = (p) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  return (
    <section className="section">
      <div className="container-page">
        <p className="text-sm font-medium text-accent">U Graphics Store</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-ink">
          {q ? `Search results for "${q}"` : "All Products"}
        </h1>
        <p className="mt-1 text-sm text-ink/60">{total} product{total !== 1 ? "s" : ""} found</p>

        {products.length ? (
          <>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
                <Link
                  href={pageHref(Math.max(1, page - 1))}
                  aria-disabled={page === 1}
                  className={`rounded-lg border border-ink/15 px-3 py-2 text-sm ${page === 1 ? "pointer-events-none opacity-40" : "hover:border-primary hover:text-primary"}`}
                >
                  Previous
                </Link>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) =>
                    p === "…" ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-ink/40">…</span>
                    ) : (
                      <Link
                        key={p}
                        href={pageHref(p)}
                        className={`rounded-lg px-3.5 py-2 text-sm font-medium ${
                          p === page ? "bg-primary text-white" : "border border-ink/15 text-ink hover:border-primary hover:text-primary"
                        }`}
                      >
                        {p}
                      </Link>
                    )
                  )}

                <Link
                  href={pageHref(Math.min(totalPages, page + 1))}
                  aria-disabled={page === totalPages}
                  className={`rounded-lg border border-ink/15 px-3 py-2 text-sm ${page === totalPages ? "pointer-events-none opacity-40" : "hover:border-primary hover:text-primary"}`}
                >
                  Next
                </Link>
              </nav>
            )}
          </>
        ) : (
          <div className="mt-10 rounded-card border border-dashed border-ink/15 bg-white p-12 text-center">
            <p className="text-ink/60">No products found{q ? ` for "${q}"` : ""}.</p>
          </div>
        )}
      </div>
    </section>
  );
}
