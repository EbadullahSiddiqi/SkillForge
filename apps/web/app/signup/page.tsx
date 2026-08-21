"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { setToken, setUser } from "@/lib/auth";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Hammer, ChevronRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiFetch<{
        token: string;
        user: { id: string; name: string; email: string };
      }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      if (data.token) setToken(data.token);
      if (data.user) setUser(data.user);

      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 text-cyan-400 flex items-center justify-center mx-auto mb-4">
              <Hammer className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-3xl font-mono font-bold uppercase tracking-tight">Forge your future</h1>
            <p className="text-xs text-zinc-550 font-mono mt-2 uppercase tracking-wide">
              Build a career path based on what you actually know
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-[#101012] border border-zinc-850 p-8 space-y-5 shadow-2xl"
          >
            <Input
              label="Full Name"
              value={name}
              onChange={setName}
              placeholder="Your name"
              required
              className="font-mono text-xs uppercase"
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              required
              className="font-mono text-xs uppercase"
            />
            <Input
              label="Password Key"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              required
              minLength={6}
              className="font-mono text-xs uppercase"
            />

            {error && (
              <p className="text-xs font-mono text-red-500 uppercase bg-red-950/20 border border-red-950 p-3">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full font-mono uppercase text-xs tracking-wider">
              {loading ? "Creating console credentials..." : "Register key"} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.form>

          <p className="text-center mt-6 text-xs font-mono text-zinc-500 uppercase">
            Already have an active console?{" "}
            <Link href="/login" className="text-cyan-400 hover:underline">
              Log in console
            </Link>
          </p>
        </div>
      </div>
    </AppShell>
  );
}
