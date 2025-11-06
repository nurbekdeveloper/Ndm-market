"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    if (!username || !password) {
      setError("Please enter your username and password.");
      setIsSubmitting(false);
      return;
    }

    const response = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl: "/admin/dashboard",
    });

    if (response?.error) {
      setError("Invalid credentials. Please try again.");
      setIsSubmitting(false);
      return;
    }

    if (response?.url) {
      window.location.href = response.url;
    } else {
      setIsSubmitting(false);
    }
  };

  const callbackError = searchParams.get("error");

  return (
    <div className="flex min-h-screen items-center justify-center bg-subtle/40 px-4">
      <div className="w-full max-w-md space-y-8 rounded-[var(--radius-lg)] border border-subtle/80 bg-surface p-10 shadow-xl shadow-primary/10">
        <div className="space-y-2 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-white">
            N
          </div>
          <h1 className="text-2xl font-semibold text-ink">NDM Market Admin</h1>
          <p className="text-sm text-muted">Secure access for content management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-semibold text-muted">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none transition-colors focus:border-primary"
              placeholder="admin"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold text-muted">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-full border border-subtle/80 bg-surface px-4 py-3 text-sm font-medium text-ink outline-none transition-colors focus:border-primary"
              placeholder="••••••••"
            />
          </div>

          {(error || callbackError) && (
            <div className="rounded-[var(--radius-sm)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error ?? "Authentication required"}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminLoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-subtle/40 px-4">
      <div className="w-full max-w-md space-y-6 rounded-[var(--radius-lg)] border border-subtle/80 bg-surface p-10 text-center text-sm text-muted shadow-xl shadow-primary/10">
        Loading sign-in form...
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<AdminLoginFallback />}>
      <AdminLoginForm />
    </Suspense>
  );
}
