"use client";

import { useEffect, useState } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Plus, X } from "lucide-react";

const empty = {
  title: "",
  slug: "",
  category: "",
  subcategory: "",
  shortDescription: "",
  description: "",
  image: "",
  gallery: [],
  variants: [],
  priceTiers: [{ minQuantity: 1, price: 0 }],
  minimumOrderQuantity: 1,
  stock: 0,
  isFeatured: false,
  isBestseller: false,
};

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingSlug, setEditingSlug] = useState(null);
  const [status, setStatus] = useState("");
  const [productToRemove, setProductToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);

  const load = () => {
    fetch("/api/products?limit=100")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setStatus("Unable to load products."));
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : ["minimumOrderQuantity", "stock"].includes(name)
          ? Number(value)
          : value,
    });
  };

  // Price tier row helpers
  const updateTier = (i, field, value) => {
    const tiers = [...form.priceTiers];
    tiers[i] = { ...tiers[i], [field]: Number(value) };
    setForm({ ...form, priceTiers: tiers });
  };
  const addTier = () =>
    setForm({
      ...form,
      priceTiers: [...form.priceTiers, { minQuantity: 1, price: 0 }],
    });
  const removeTier = (i) =>
    setForm({
      ...form,
      priceTiers: form.priceTiers.filter((_, idx) => idx !== i),
    });

  // Variant row helpers
  const updateVariant = (i, field, value) => {
    const variants = [...form.variants];
    variants[i] = { ...variants[i], [field]: value };
    setForm({ ...form, variants });
  };
  const addVariant = () =>
    setForm({ ...form, variants: [...form.variants, { name: "", value: "" }] });
  const removeVariant = (i) =>
    setForm({ ...form, variants: form.variants.filter((_, idx) => idx !== i) });

  const submit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    const url = editingSlug ? `/api/products/${editingSlug}` : "/api/products";
    const response = await fetch(url, {
      method: editingSlug ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error || "Unable to save. Check the details and try again.");
      return;
    }
    setForm(empty);
    setEditingSlug(null);
    setStatus("Saved.");
    load();
  };

  const edit = (product) => {
    setEditingSlug(product.slug);
    setForm({
      ...empty,
      ...product,
      category: product.category?._id || product.category || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async () => {
    if (!productToRemove?.slug) return;
    setRemoving(true);
    try {
      const response = await fetch(`/api/products/${productToRemove.slug}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      setStatus("Deleted.");
      setProductToRemove(null);
      load();
    } catch {
      setStatus("Unable to delete product.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div>
      <div>
        <h1 className="font-heading text-2xl font-bold">Manage Products</h1>
        <p className="mt-1 text-sm text-ink/60">
          Individual products shown to customers with pricing, stock, and images.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="mt-6 grid gap-4 rounded-card bg-white p-5 shadow-card sm:grid-cols-2"
      >
        <h2 className="font-heading text-lg font-semibold sm:col-span-2">
          {editingSlug ? "Edit product" : "Add product"}
        </h2>

        <label className="text-sm font-medium">
          Title
          <input
            required
            name="title"
            value={form.title}
            onChange={change}
            className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2"
          />
        </label>

        <label className="text-sm font-medium">
          URL slug
          <input
            required
            name="slug"
            value={form.slug}
            onChange={change}
            placeholder="e.g. 3d-led-signboard-small"
            className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2"
          />
        </label>

        <label className="text-sm font-medium">
          Category
          <select
            required
            name="category"
            value={form.category}
            onChange={change}
            className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium">
          Subcategory (optional)
          <input
            name="subcategory"
            value={form.subcategory || ""}
            onChange={change}
            className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2"
          />
        </label>

        <div className="sm:col-span-2">
          <ImageUploadField
            label="Main image"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            folder="ugraphics/products"
          />
        </div>

        <label className="text-sm font-medium sm:col-span-2">
          Short description
          <input
            name="shortDescription"
            value={form.shortDescription || ""}
            onChange={change}
            className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2"
          />
        </label>

        <label className="text-sm font-medium sm:col-span-2">
          Full description
          <textarea
            name="description"
            value={form.description || ""}
            onChange={change}
            rows="4"
            className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2"
          />
        </label>

        {/* Price tiers */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Price tiers (quantity-based)</span>
            <button
              type="button"
              onClick={addTier}
              className="flex items-center gap-1 text-sm text-primary"
            >
              <Plus size={14} /> Add tier
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {form.priceTiers.map((tier, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={tier.minQuantity}
                  onChange={(e) => updateTier(i, "minQuantity", e.target.value)}
                  placeholder="Min qty"
                  className="w-28 rounded-card border border-ink/15 px-3 py-2 text-sm"
                />
                <span className="text-xs text-ink/50">pcs @ ₹</span>
                <input
                  type="number"
                  min="0"
                  value={tier.price}
                  onChange={(e) => updateTier(i, "price", e.target.value)}
                  placeholder="Price"
                  className="w-28 rounded-card border border-ink/15 px-3 py-2 text-sm"
                />
                {form.priceTiers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTier(i)}
                    className="text-danger"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Variants */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Variants (optional, e.g. Size: Small)
            </span>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-1 text-sm text-primary"
            >
              <Plus size={14} /> Add variant
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {form.variants.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={v.name}
                  onChange={(e) => updateVariant(i, "name", e.target.value)}
                  placeholder="Name (e.g. Size)"
                  className="w-40 rounded-card border border-ink/15 px-3 py-2 text-sm"
                />
                <input
                  value={v.value}
                  onChange={(e) => updateVariant(i, "value", e.target.value)}
                  placeholder="Value (e.g. Small)"
                  className="w-40 rounded-card border border-ink/15 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="text-danger"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <label className="text-sm font-medium">
          Minimum order quantity
          <input
            type="number"
            min="1"
            name="minimumOrderQuantity"
            value={form.minimumOrderQuantity}
            onChange={change}
            className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2"
          />
        </label>

        <label className="text-sm font-medium">
          Stock quantity
          <input
            type="number"
            min="0"
            name="stock"
            value={form.stock}
            onChange={change}
            className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2"
          />
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="isFeatured"
            checked={Boolean(form.isFeatured)}
            onChange={change}
          />
          Featured product
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="isBestseller"
            checked={Boolean(form.isBestseller)}
            onChange={change}
          />
          Bestseller
        </label>

        <div className="flex gap-3 sm:col-span-2">
          <button className="btn-primary" type="submit">
            {editingSlug ? "Save changes" : "Add product"}
          </button>
          {editingSlug && (
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setForm(empty);
                setEditingSlug(null);
              }}
            >
              Cancel
            </button>
          )}
          <span className="self-center text-sm text-ink/60">{status}</span>
        </div>
      </form>

      <div className="mt-8 overflow-x-auto rounded-card bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-muted text-xs uppercase text-ink/50">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">From</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t border-ink/5">
                <td className="p-4 font-medium">{product.title}</td>
                <td className="p-4">{product.category?.name || "-"}</td>
                <td className="p-4">
                  ₹{Math.min(...(product.priceTiers || []).map((t) => t.price))}
                </td>
                <td className="p-4">
                  {product.stock > 0 ? product.stock : (
                    <span className="text-danger">Out of stock</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <button
                    className="mr-3 text-primary"
                    onClick={() => edit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-danger"
                    onClick={() => setProductToRemove(product)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={Boolean(productToRemove)}
        loading={removing}
        title="Delete product?"
        description={`Delete "${productToRemove?.title}"? This cannot be undone.`}
        confirmLabel="Delete permanently"
        onConfirm={remove}
        onClose={() => setProductToRemove(null)}
      />
    </div>
  );
}
