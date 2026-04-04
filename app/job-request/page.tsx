"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createJobRequest } from "@/lib/firestore";

export default function JobRequestPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [desiredRole, setDesiredRole] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim() || !phone.trim() || !desiredRole.trim()) {
      setError("Please fill name, phone, and desired role.");
      return;
    }
    setSubmitting(true);
    try {
      await createJobRequest({
        fullName: fullName.trim(),
        phone: phone.trim(),
        desiredRole: desiredRole.trim(),
        message: message.trim() || undefined,
      });
      setDone(true);
      setFullName("");
      setPhone("");
      setDesiredRole("");
      setMessage("");
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 sm:py-14 px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-800">
            Request a job
          </h1>
          <p className="mt-2 text-slate-600 text-sm leading-relaxed">
            If you do not see your role on our listings, tell us what you are looking for. We will follow up when something matches.
          </p>

          {done ? (
            <div className="mt-8 rounded-2xl border border-primary/25 bg-primary/5 px-4 py-6 text-slate-800 text-sm">
              Thank you. We received your request and will contact you soon.
              <div className="mt-4">
                <Link href="/jobs" className="font-medium text-primary hover:underline">
                  Browse jobs
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
              <div>
                <label htmlFor="jr-name" className="block text-sm font-medium text-slate-700 mb-1">
                  Full name
                </label>
                <input
                  id="jr-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="jr-phone" className="block text-sm font-medium text-slate-700 mb-1">
                  Mobile number
                </label>
                <input
                  id="jr-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  autoComplete="tel"
                />
              </div>
              <div>
                <label htmlFor="jr-role" className="block text-sm font-medium text-slate-700 mb-1">
                  Desired role
                </label>
                <input
                  id="jr-role"
                  value={desiredRole}
                  onChange={(e) => setDesiredRole(e.target.value)}
                  placeholder="e.g. Waiter, Graphics designer"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label htmlFor="jr-msg" className="block text-sm font-medium text-slate-700 mb-1">
                  Message (optional)
                </label>
                <textarea
                  id="jr-msg"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-y min-h-[80px]"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-primary text-white font-medium py-3 shadow-soft hover:bg-primary/90 disabled:opacity-60 transition-colors"
              >
                {submitting ? "Sending…" : "Submit request"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
