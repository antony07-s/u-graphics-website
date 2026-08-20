"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { signboards, digitalPrinting } from "@/lib/serviceCatalog";
import ImageUploadField from "@/components/admin/ImageUploadField";

const serviceOptions = [...signboards, ...digitalPrinting];

/**
 * initialData: existing project (for edit mode) or null (for create mode)
 * projectId: required when editing, used to build the PUT url
 */
export default function ProjectForm({ initialData = null, projectId = null }) {
  const router = useRouter();
  const isEditMode = Boolean(projectId);

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category?._id || initialData?.category || "",
    serviceSlug: initialData?.serviceSlug || "",
    coverImage: initialData?.coverImage || "",
    gallery: (initialData?.gallery || []).join(", "),
    description: initialData?.description || "",
    location: initialData?.location || "",
    clientName: initialData?.clientName || "",
    isFeatured: initialData?.isFeatured || false,
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // Auto-generate a slug from the title if the user hasn't typed one manually.
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm((f) => ({
      ...f,
      title,
      slug:
        f.slug === "" || f.slug === slugify(f.title)
          ? slugify(title)
          : f.slug,
    }));
  };

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const payload = {
      ...form,
      gallery: form.gallery
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch(
        isEditMode ? `/api/portfolio/${projectId}` : "/api/portfolio",
        {
          method: isEditMode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong.");
      }

      router.push("/admin/portfolio");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Related Service
        </label>
        <select
          name="serviceSlug"
          value={form.serviceSlug}
          onChange={handleChange}
          className="w-full rounded-card border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
        >
          <option value="">General portfolio project</option>
          {serviceOptions.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.type} — {service.title}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-ink/50">
          Selecting a service displays this project on that service&apos;s detail page.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Title *
        </label>
        <input
          name="title"
          required
          value={form.title}
          onChange={handleTitleChange}
          className="w-full rounded-card border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-primary"
          placeholder="e.g. 3D LED Signboard for XYZ Shop"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Slug * (used in the URL, auto-generated from title)
        </label>
        <input
          name="slug"
          required
          value={form.slug}
          onChange={handleChange}
          className="w-full rounded-card border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-primary"
          placeholder="e.g. 3d-led-signboard-xyz-shop"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Category *
        </label>
        <select
          name="category"
          required
          value={form.category}
          onChange={handleChange}
          className="w-full rounded-card border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
        >
          <option value="">Select a category...</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        {categories.length === 0 && (
          <p className="mt-1 text-xs text-ink/50">
            No categories found yet — add one in MongoDB first.
          </p>
        )}
      </div>

      <ImageUploadField
        label="Cover Image *"
        value={form.coverImage}
        onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))}
        folder="ugraphics/portfolio"
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Gallery Images (comma-separated URLs, optional)
        </label>
        <textarea
          name="gallery"
          rows={2}
          value={form.gallery}
          onChange={handleChange}
          className="w-full rounded-card border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-primary"
          placeholder="https://image1.jpg, https://image2.jpg"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          className="w-full rounded-card border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Location
          </label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full rounded-card border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-primary"
            placeholder="e.g. Klang, Selangor"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Client Name
          </label>
          <input
            name="clientName"
            value={form.clientName}
            onChange={handleChange}
            className="w-full rounded-card border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          name="isFeatured"
          checked={form.isFeatured}
          onChange={handleChange}
          className="h-4 w-4 rounded border-black/20"
        />
        Feature this project on the homepage
      </label>

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-card bg-red-50 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {status === "submitting" && (
            <Loader2 size={16} className="animate-spin" />
          )}
          {status === "submitting"
            ? "Saving..."
            : isEditMode
            ? "Save Changes"
            : "Create Project"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/portfolio")}
          className="btn-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}