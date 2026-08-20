"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default function BlogPostForm({ initialData = null, postId = null }) {
  const router = useRouter();
  const isEditMode = Boolean(postId);

  const [form, setForm] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    coverImage: initialData?.coverImage || "",
    author: initialData?.author || "U Graphics Team",
    tags: (initialData?.tags || []).join(", "),
    isPublished: initialData?.isPublished || false,
  });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm((f) => ({
      ...f,
      title,
      slug:
        f.slug === "" || f.slug === slugify(f.title) ? slugify(title) : f.slug,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      publishedAt: form.isPublished
        ? initialData?.publishedAt || new Date().toISOString()
        : null,
    };

    try {
      const res = await fetch(
        isEditMode ? `/api/blog/${postId}` : "/api/blog",
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

      router.push("/admin/blog");
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
          Title *
        </label>
        <input
          name="title"
          required
          value={form.title}
          onChange={handleTitleChange}
          className="w-full rounded-card border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Slug * (used in the URL)
        </label>
        <input
          name="slug"
          required
          value={form.slug}
          onChange={handleChange}
          className="w-full rounded-card border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Excerpt (short summary shown on the blog list)
        </label>
        <textarea
          name="excerpt"
          rows={2}
          value={form.excerpt}
          onChange={handleChange}
          className="w-full rounded-card border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Content * (the full post)
        </label>
        <textarea
          name="content"
          required
          rows={10}
          value={form.content}
          onChange={handleChange}
          className="w-full rounded-card border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <ImageUploadField
        label="Cover Image"
        value={form.coverImage}
        onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))}
        folder="ugraphics/blog"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Author
          </label>
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            className="w-full rounded-card border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Tags (comma-separated)
          </label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full rounded-card border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-primary"
            placeholder="signage, led, klang"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          name="isPublished"
          checked={form.isPublished}
          onChange={handleChange}
          className="h-4 w-4 rounded border-black/20"
        />
        Publish this post (visible on the public site)
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
            : "Create Post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="btn-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}