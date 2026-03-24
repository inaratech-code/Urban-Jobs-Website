"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signIn, isAdminEmail, getDemoCredentials } from "@/lib/auth";
import { HiOutlineLockClosed, HiOutlineEnvelope } from "react-icons/hi2";

export default function AdminLoginPage() {
  const router = useRouter();
  const demo = getDemoCredentials();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!isAdminEmail(email)) {
        setError("Access denied. Admin only.");
        return;
      }
      await signIn(email, password);
      router.replace("/admin");
    } catch (err: unknown) {
      setError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-soft-lg border border-slate-100 p-8"
      >
        <h1 className="font-display text-2xl font-bold text-slate-800 text-center">
          Admin login
        </h1>
        <p className="text-slate-600 text-sm text-center mt-1">
            Urban Jobs dashboard
          </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <div className="relative">
              <HiOutlineEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        {demo && (
          <p className="mt-4 p-3 rounded-xl bg-slate-50 text-slate-600 text-sm text-center">
            <strong>Demo admin:</strong><br />
            {demo.email} / {demo.password}
          </p>
        )}
        <p className="mt-6 text-center">
          <a href="/" className="text-sm text-slate-500 hover:text-primary">
            ← Back to site
          </a>
        </p>
      </motion.div>
    </div>
  );
}
