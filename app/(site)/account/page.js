"use client";
import { useRouter, useSearchParams } from "next/navigation";
// import { useState } from "react";
import { useState, Suspense } from "react";

function AccountForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [register, setRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const response = await fetch(`/api/customer/${register ? "register" : "login"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(register ? values : { email: values.email, password: values.password }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return setError(data.error || "Unable to continue.");
    router.replace(params.get("next")?.startsWith("/") ? params.get("next") : "/orders");
  };

  return (
    <section className="section bg-surface-muted min-h-[70vh] flex items-center">
      <div className="container-page max-w-md">
        <div className="rounded-card border border-ink/10 bg-white p-8 shadow-card">
          <div className="mb-6 text-center">
            <h1 className="font-heading text-2xl font-bold text-ink">
              {register ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-1 text-sm text-ink/60">
              {register ? "Sign up to track orders and checkout faster" : "Log in to view orders and manage your account"}
            </p>
          </div>

          <div className="mb-6 flex rounded-full bg-surface-muted p-1">
            <button
              type="button"
              onClick={() => setRegister(false)}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                !register ? "bg-white text-primary shadow-sm" : "text-ink/50"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setRegister(true)}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                register ? "bg-white text-primary shadow-sm" : "text-ink/50"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {register && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">Full name</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <input
                      required
                      value={values.name}
                      onChange={(e) => setValues({ ...values, name: e.target.value })}
                      className="w-full rounded-lg border border-ink/15 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">Phone</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <input
                      value={values.phone}
                      onChange={(e) => setValues({ ...values, phone: e.target.value })}
                      className="w-full rounded-lg border border-ink/15 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Email</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  required
                  type="email"
                  value={values.email}
                  onChange={(e) => setValues({ ...values, email: e.target.value })}
                  className="w-full rounded-lg border border-ink/15 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Password</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  minLength="8"
                  value={values.password}
                  onChange={(e) => setValues({ ...values, password: e.target.value })}
                  className="w-full rounded-lg border border-ink/15 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

                       <button disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? "Please wait…" : register ? "Create account" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="section"><div className="container-page text-ink/40">Loading…</div></div>}>
      <AccountForm />
    </Suspense>
  );
}
