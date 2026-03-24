"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CandidateForm from "@/components/CandidateForm";
import { createCandidate, createApplication } from "@/lib/firestore";
import type { CandidateFormValues } from "@/components/CandidateForm";
import { HiOutlineDocumentText } from "react-icons/hi2";

function withTimeout<T>(promise: Promise<T>, ms = 15000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Request timeout. Please check internet/Firebase and try again."));
    }, ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function CandidateContent() {
  const searchParams = useSearchParams();
  const applyJobId = searchParams.get("apply");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const createdIdRef = useRef<string | null>(null);

  const handleSubmit = async (
    data: CandidateFormValues,
    documentIdFile: File,
    passportPhotoFile: File,
    certificates?: File[]
  ) => {
    setLoading(true);
    try {
      const id = await withTimeout(
        createCandidate(
          data,
          documentIdFile,
          passportPhotoFile,
          certificates?.length ? certificates : undefined
        )
      );
      createdIdRef.current = id;
      if (applyJobId) {
        await withTimeout(createApplication(applyJobId, id));
      }
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
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HiOutlineDocumentText className="h-6 w-6" />
              </span>
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-800">
                  Fill the form
                </h1>
                <p className="text-slate-600 text-sm">
                  Fill this form so employers in Dhangadhi can contact you
                </p>
              </div>
            </div>

            {applyJobId && (
              <p className="mb-6 p-3 rounded-xl bg-primary/10 text-primary text-sm">
                {"You're applying for a job."} After submitting your resume, your application will be sent.
              </p>
            )}

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
                  Form submitted!
                </h2>
                <p className="mt-2 text-slate-600">
                  {applyJobId
                    ? "Your application has been sent. Employers may contact you soon."
                    : "Employers can now find you. Good luck!"}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/jobs"
                    className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90"
                  >
                    Browse jobs
                  </Link>
                  <Link
                    href="/"
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
                  >
                    Home
                  </Link>
                </div>
              </motion.div>
            ) : (
              <CandidateForm onSubmit={handleSubmit} isLoading={loading} />
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CandidatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-8 sm:py-12 flex items-center justify-center">
          <div className="animate-pulse text-slate-500">Loading...</div>
        </main>
        <Footer />
      </div>
    }>
      <CandidateContent />
    </Suspense>
  );
}
