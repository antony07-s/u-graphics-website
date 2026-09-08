"use client";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export const productStartingPrice = (product) =>
  Math.min(...(product.priceTiers || []).map((tier) => tier.price));

export default function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const add = async () => {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product._id || product.id,
        quantity: product.minimumOrderQuantity || 1,
        selectedVariants: [],
      }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error || "Unable to add to cart.");
      return;
    }
    window.dispatchEvent(new CustomEvent("cart-changed", { detail: data.cart }));
    setMessage("Added to cart");
  };

  return (
    // flex + h-full: makes every card in a grid row stretch to match the
    // tallest card, so buttons line up even when titles wrap to 2 lines
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-ink/10 bg-white shadow-card">
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square bg-surface-muted">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-sm text-ink/40">
              Image coming soon
            </span>
          )}
        </div>

        {/* flex-1: this content area grows/shrinks to fill remaining space,
            keeping the button row below aligned across all cards */}
        <div className="flex flex-1 flex-col p-4 pb-2">
          <h3 className="font-heading font-semibold text-ink">{product.title}</h3>
          <p className="mt-1 text-sm text-ink/60">
            From {money(productStartingPrice(product))}
          </p>
          <p
            className={
              product.stock > 0
                ? "mt-2 text-xs text-success"
                : "mt-2 text-xs text-danger"
            }
          >
            {product.stock > 0 ? "In stock" : "Out of stock"}
          </p>
        </div>
      </Link>

      {/* mt-auto: pins this button block to the bottom of the card,
          regardless of how much space the content above takes up */}
      <div className="mt-auto px-4 pb-4">
        <button
          disabled={loading || !product.stock || (product.variants || []).length > 0}
          onClick={add}
          className="btn-primary flex w-full items-center justify-center gap-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart size={16} />
          {loading ? "Adding..." : "Add to cart"}
        </button>
        {(product.variants || []).length > 0 && (
          <p className="mt-2 text-xs text-ink/55">Choose options on product page</p>
        )}
        {message && <p role="status" className="mt-2 text-xs text-ink/70">{message}</p>}
      </div>
    </article>
  );
}
