"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { FormInput, FormTextarea, FormSelect } from "@/components/ui/FormFields";

const serviceOptions = [
  { value: "3d-led-signage", label: "3D LED Signage" },
  { value: "acrylic-lightbox", label: "Acrylic / Lightbox Signage" },
  { value: "vehicle-branding", label: "Vehicle & Truck Branding" },
  { value: "web-design", label: "Web Design & Development" },
  { value: "other", label: "Other / Not Sure Yet" },
];

/**
 * status: "idle" | "submitting" | "success" | "error"
 * Used on both /contact and /get-a-quote (with slightly different copy via props).
 */
export default function EnquiryForm({
  submitLabel = "Send Enquiry",
  successMessage = "Thanks — we've received your enquiry and will get back to you shortly.",
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur" });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data) => {
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card bg-green-50 p-8 text-center">
        <CheckCircle2 className="text-green-600" size={40} />
        <p className="font-medium text-ink">{successMessage}</p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm font-medium text-primary hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormInput
          id="name"
          label="Full Name *"
          placeholder="Your name"
          error={errors.name?.message}
          {...register("name", { required: "Name is required", minLength: { value: 2, message: "Enter at least 2 characters" } })}
        />
        <FormInput
          id="phone"
          label="Phone Number *"
          placeholder="e.g. 9876543210"
          error={errors.phone?.message}
          {...register("phone", { required: "Phone number is required", pattern: { value: /^[0-9+()\-\s]{7,20}$/, message: "Enter a valid phone number" } })}
        />
      </div>

      <FormInput
        id="email"
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email", { pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" } })}
      />

      <FormSelect
        id="serviceCategory"
        label="What are you interested in?"
        options={serviceOptions}
        {...register("serviceCategory")}
      />

      <FormTextarea
        id="message"
        label="Message"
        placeholder="Tell us a bit about what you need..."
        error={errors.message?.message}
        {...register("message", { maxLength: { value: 2000, message: "Message must be under 2,000 characters" } })}
      />

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-card bg-red-50 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {status === "submitting" && <Loader2 size={16} className="animate-spin" />}
        {status === "submitting" ? "Sending..." : submitLabel}
      </button>
    </form>
  );
}
