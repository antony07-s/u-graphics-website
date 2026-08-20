"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, AlertCircle, LockKeyhole, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | error
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      setStatus("error");
      setErrorMsg("Invalid email or password.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-sm rounded-card bg-white p-8 shadow-card">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <LockKeyhole size={24} />
          </div>
          <h1 className="mt-4 font-heading text-xl font-bold text-ink">
            Admin Login
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            U Graphics content management
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-ink"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-card border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-primary"
              placeholder="admin@ugraphics.in"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-ink"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-card border border-black/10 px-4 py-2.5 pr-11 text-sm outline-none focus:border-primary"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {status === "error" && (
            <div className="flex items-center gap-2 rounded-card bg-red-50 px-4 py-3 text-sm text-danger">
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn-primary mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {status === "submitting" && (
              <Loader2 size={16} className="animate-spin" />
            )}
            {status === "submitting" ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}