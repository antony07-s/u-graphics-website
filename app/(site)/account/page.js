"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User, Phone, Eye, EyeOff, ShieldCheck } from "lucide-react";
import GoogleSignInButton from "@/components/account/GoogleSignInButton";

function Field({ label, icon: Icon, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <div className="relative">
        {Icon && (
          <Icon size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
        )}
        <input
          required
          className={`w-full rounded-lg border border-ink/15 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary ${
            Icon ? "pl-10 pr-3" : "px-3"
          }`}
          {...props}
        />
      </div>
    </label>
  );
}

function PasswordField({ label, value, onChange, autoComplete }) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <div className="relative">
        <Lock size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
        <input
          required
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          minLength="8"
          className="w-full rounded-lg border border-ink/15 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </label>
  );
}

function AccountForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("form");
  const [values, setValues] = useState({ name: "", phone: "", email: "", password: "", code: "", newPassword: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (key) => (event) => setValues({ ...values, [key]: event.target.value });
  const destination = params.get("next")?.startsWith("/") ? params.get("next") : "/";

  const requestOtp = async (purpose) => {
    const payload =
      purpose === "register"
        ? { purpose, name: values.name, phone: values.phone, email: values.email, password: values.password }
        : { purpose, email: values.email };
    const response = await fetch("/api/customer/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to send code.");
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus("");
    setLoading(true);
    try {
      if (mode === "login") {
        const response = await fetch("/api/customer/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email, password: values.password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        window.dispatchEvent(new CustomEvent("customer-changed"));
        router.replace(destination);
        return;
      }
      if (step === "form") {
        await requestOtp(mode === "register" ? "register" : "reset");
        setStep("verify");
        setStatus("We sent a six-digit verification code to your email.");
        return;
      }
      const response = await fetch("/api/customer/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose: mode === "register" ? "register" : "reset",
          email: values.email,
          code: values.code,
          ...(mode === "reset" ? { password: values.newPassword } : {}),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      window.dispatchEvent(new CustomEvent("customer-changed"));
      router.replace(destination);
    } catch (error) {
      setStatus(error.message || "Unable to continue.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next) => {
    setMode(next);
    setStep("form");
    setStatus("");
  };

  const title =
    mode === "login"
      ? "Welcome back"
      : mode === "register"
      ? step === "verify"
        ? "Verify your email"
        : "Create your account"
      : step === "verify"
      ? "Set a new password"
      : "Reset your password";

  return (
    <section className="section min-h-[70vh] bg-surface-muted">
      <div className="container-page max-w-md">
        <div className="rounded-card border border-ink/10 bg-white p-6 shadow-card sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck size={22} />
            </div>
            <h1 className="mt-4 font-heading text-2xl font-bold text-ink">{title}</h1>
            <p className="mt-2 text-sm text-ink/60">
              {mode === "login"
                ? "Sign in to manage orders and checkout."
                : "Your account is protected with email verification."}
            </p>
          </div>

          {step === "form" && mode !== "reset" && (
            <div className="mt-6 flex rounded-lg bg-surface-muted p-1">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition ${
                  mode === "login" ? "bg-white text-primary shadow-sm" : "text-ink/55"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition ${
                  mode === "register" ? "bg-white text-primary shadow-sm" : "text-ink/55"
                }`}
              >
                Register
              </button>
            </div>
          )}

          {step === "verify" && (
            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-primary">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">✓</span>
              Details submitted
              <span className="mx-1 h-px w-6 bg-ink/15" />
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">2</span>
              Verify email
            </div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4">
            {step === "form" && mode === "register" && (
              <>
                <Field label="Full name" icon={User} value={values.name} onChange={update("name")} autoComplete="name" />
                <Field label="Phone" icon={Phone} value={values.phone} onChange={update("phone")} autoComplete="tel" />
              </>
            )}

            <Field
              label="Email"
              icon={Mail}
              type="email"
              value={values.email}
              onChange={update("email")}
              autoComplete="email"
            />

            {step === "form" && mode !== "reset" && (
              <PasswordField
                label="Password"
                value={values.password}
                onChange={update("password")}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            )}

            {step === "verify" && (
              <>
                <Field
                  label="Six-digit verification code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength="6"
                  value={values.code}
                  onChange={update("code")}
                  className="text-center text-lg tracking-[0.5em]"
                />
                <p className="text-xs text-ink/55">The code expires in 10 minutes. You have five attempts.</p>
                {mode === "reset" && (
                  <PasswordField
                    label="New password"
                    value={values.newPassword}
                    onChange={update("newPassword")}
                    autoComplete="new-password"
                  />
                )}
              </>
            )}

            {status && (
              <p role="status" className="rounded-lg bg-primary/5 px-3 py-2 text-sm text-primary">
                {status}
              </p>
            )}

            <button disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading
                ? "Please wait..."
                : step === "verify"
                ? "Verify and continue"
                : mode === "login"
                ? "Login"
                : mode === "register"
                ? "Send verification code"
                : "Send reset code"}
            </button>
          </form>

          {step === "form" && mode !== "reset" && (
            <>
              <div className="my-5 flex items-center gap-3 text-xs font-medium text-ink/40">
                <span className="h-px flex-1 bg-ink/10" />
                OR
                <span className="h-px flex-1 bg-ink/10" />
              </div>
              <GoogleSignInButton
                onSuccess={() => {
                  window.dispatchEvent(new CustomEvent("customer-changed"));
                  router.replace(destination);
                }}
                onError={(message) => setStatus(message)}
              />
            </>
          )}

          {step === "form" && mode === "login" && (
            <button
              type="button"
              onClick={() => switchMode("reset")}
              className="mt-4 w-full text-center text-sm font-medium text-primary hover:underline"
            >
              Forgot password?
            </button>
          )}

          {step === "verify" && (
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                requestOtp(mode === "register" ? "register" : "reset")
                  .then(() => setStatus("A new code has been sent."))
                  .catch((error) => setStatus(error.message))
              }
              className="mt-4 w-full text-center text-sm font-medium text-primary hover:underline"
            >
              Resend code
            </button>
          )}

          {mode === "reset" && step === "form" && (
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="mt-4 w-full text-center text-sm font-medium text-primary hover:underline"
            >
              Back to login
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <section className="section">
          <div className="container-page">Loading...</div>
        </section>
      }
    >
      <AccountForm />
    </Suspense>
  );
}


