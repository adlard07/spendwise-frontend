"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMyContext } from "@/useContext/myContext";
import { decodeAccessToken } from "@/lib/globalHelpers";
import Link from "next/link";
import { initCsrf, login } from "@/auth/auth";

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export default function LoginPage() {
  const { user, ready, setUser } = useMyContext();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (!ready) return;

    const token = localStorage.getItem("access_token");
    if (token && !isTokenExpired(token) && user) {
      router.replace("/dashboard");
    } else {
      localStorage.removeItem("access_token"); // clear expired token
      setChecking(false);
    }
  }, [router, ready, user]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await initCsrf();
      const { access_token } = await login(form);
      localStorage.setItem("access_token", access_token);
      setUser(decodeAccessToken(access_token));
      router.push("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to log in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (checking) return null;

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <div className="w-full rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              Welcome back
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
              Log in
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Sign in to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-stone-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-3 text-sm outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-stone-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-xs font-medium text-stone-500 hover:text-stone-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-3 text-sm outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <label className="flex items-center gap-2 text-sm text-stone-600">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => updateField("remember", e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-300"
                />
                Remember me
              </label>

              <button
                type="button"
                className="text-sm font-medium text-stone-500 hover:text-stone-800"
              >
                Forgot password?
              </button>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-stone-900 hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
