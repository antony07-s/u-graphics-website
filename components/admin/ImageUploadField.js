"use client";

import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, X } from "lucide-react";

/**
 * label: field label text
 * value: current image URL (string)
 * onChange: (url: string) => void
 * folder: Cloudinary folder to upload into, e.g. "ugraphics/portfolio"
 */
export default function ImageUploadField({
  label = "Image",
  value,
  onChange,
  folder = "ugraphics/misc",
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink">
        {label}
      </label>

      {value ? (
        <div className="relative mb-3 h-40 w-full overflow-hidden rounded-card bg-surface-muted">
          <Image src={value} alt="" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            aria-label="Remove image"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <div className="mb-3 flex h-40 w-full items-center justify-center rounded-card border-2 border-dashed border-black/10 text-sm text-ink/40">
          No image selected
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <CldUploadWidget
          uploadPreset="ugraphics_uploads"
          options={{ folder, sources: ["local", "camera", "url"] }}
          onSuccess={(result) => {
            if (result?.info?.secure_url) {
              onChange(result.info.secure_url);
            }
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="btn-outline flex items-center gap-2 text-sm"
            >
              <ImagePlus size={16} />
              {value ? "Replace Image" : "Upload Image"}
            </button>
          )}
        </CldUploadWidget>

        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="or paste an image URL directly"
          className="min-w-[220px] flex-1 rounded-card border border-black/10 px-3 py-2 text-xs text-ink/70 outline-none focus:border-primary"
        />
      </div>
    </div>
  );
}