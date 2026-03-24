"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobForm, { type JobFormValues } from "@/components/JobForm";
import { createJobAsGuest } from "@/lib/firestore";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

export default function EmployerPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: JobFormValues) => {
    setLoading(true);
    try {
      await createJobAsGuest(data);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HiOutlineBuildingOffice2 className="h-6 w-6" />
              </span>
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-800">
                  Post a job
                </h1>
                <p className="text-slate-600 text-sm">
                  Reach local talent in Dhangadhi
                </p>
              </div>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-display text-xl font-semibold text-slate-800">
                  Job posted!
                </h2>
                <p className="mt-2 text-slate-600">
                  Thanks — we received your listing. An admin will review it shortly. It will appear on the site after approval.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a
                    href="/jobs"
                    className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90"
                  >
                    Browse jobs
                  </a>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
                  >
                    Post another
                  </button>
                </div>
              </motion.div>
            ) : (
              <JobForm onSubmit={handleSubmit} isLoading={loading} />
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
