"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/ai";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (data.token) {
        setToken(data.token);
      }

      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <p className="text-sm opacity-50">SKILLFORGE</p>

          <h1 className="text-4xl font-black mt-2">Welcome back.</h1>

          <p className="mt-3 opacity-60">Continue forging your career.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border rounded-3xl p-7 space-y-5"
        >
          <div>
            <label className="text-sm">Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-2 border rounded-xl px-4 py-3 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm">Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-2 border rounded-xl px-4 py-3 outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl border font-semibold disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm opacity-60">
          Don't have an account?{" "}
          <a href="/signup" className="underline">
            Create one
          </a>
        </p>
      </div>
    </main>
  );
}
