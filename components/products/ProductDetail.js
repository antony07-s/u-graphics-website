"use client";
import Image from "next/image";
import { useState } from "react";
import { productStartingPrice } from "@/components/products/ProductCard";
import ProductReviews from "@/components/products/ProductReviews";

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);

export default function ProductDetail({ product }) {
  const [quantity, setQuantity] = useState(product.minimumOrderQuantity || 1);
  const [selected, setSelected] = useState([]);
  const [notice, setNotice] = useState("");
  const images = [product.image, ...(product.gallery || [])].filter(Boolean);
  const [activeImage, setActiveImage] = useState(images[0]);
  const price = [...(product.priceTiers || [])].filter((tier) => quantity >= tier.minQuantity).sort((a, b) => b.minQuantity - a.minQuantity)[0]?.price || productStartingPrice(product);
  const selectVariant = (name, value) => setSelected((current) => [...current.filter((item) => item.name !== name), { name, value }]);
  const addToCart = async () => {
    if (selected.length !== (product.variants || []).length) return setNotice("Please choose all product options.");
    const response = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product._id, quantity, selectedVariants: selected }) });
    const data = await response.json();
    if (!response.ok) return setNotice(data.error || "Unable to add to cart.");
    window.dispatchEvent(new CustomEvent("cart-changed", { detail: data.cart })); setNotice("Added to cart.");
  };
  return <><div className="grid gap-8 lg:grid-cols-2"><div><div className="relative aspect-square overflow-hidden rounded-card bg-surface-muted">{activeImage ? <Image src={activeImage} alt={product.title} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" /> : <span className="flex h-full items-center justify-center text-ink/40">Image coming soon</span>}</div>{images.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto">{images.map((image) => <button key={image} type="button" onClick={() => setActiveImage(image)} aria-label={`View ${product.title} image`} className={`relative h-16 w-16 shrink-0 overflow-hidden rounded border focus:outline-none focus:ring-2 focus:ring-primary ${activeImage === image ? "border-primary" : "border-ink/15"}`}><Image src={image} alt="" fill className="object-cover" /></button>)}</div>}</div><div><p className="text-sm font-medium text-primary">{product.category?.name || "U Graphics"}</p><h1 className="mt-1 font-heading text-3xl font-bold text-ink">{product.title}</h1><p className="mt-3 whitespace-pre-line text-ink/70">{product.description || product.shortDescription || "Contact U Graphics for a tailored specification."}</p><p className="mt-5 font-heading text-2xl font-bold text-primary">{money(price)} <span className="text-sm font-normal text-ink/55">per unit</span></p><p className="mt-1 text-sm text-ink/60">Minimum order: {product.minimumOrderQuantity || 1} · {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>{(product.variants || []).map((variant) => <fieldset key={variant.name} className="mt-5"><legend className="font-medium text-ink">{variant.name}</legend><button type="button" onClick={() => selectVariant(variant.name, variant.value)} className={`mt-2 rounded border px-4 py-2 text-sm ${selected.some((item) => item.name === variant.name && item.value === variant.value) ? "border-primary bg-primary/5 text-primary" : "border-ink/20"}`}>{variant.value}</button></fieldset>)}<label className="mt-5 block font-medium text-ink">Quantity<input type="number" min={product.minimumOrderQuantity || 1} max={product.stock} value={quantity} onChange={(event) => setQuantity(Math.max(product.minimumOrderQuantity || 1, Math.min(product.stock, Number(event.target.value) || 1)))} className="mt-2 block w-28 rounded border border-ink/20 px-3 py-2" /></label><button disabled={!product.stock} type="button" onClick={addToCart} className="btn-primary mt-6 disabled:opacity-50">Add to Cart</button>{notice && <p role="status" className="mt-3 text-sm text-ink/70">{notice}</p>}</div></div><ProductReviews slug={product.slug} /></>;
}
