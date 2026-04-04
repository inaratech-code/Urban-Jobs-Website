"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MultiStepCandidateForm } from "@/components/application";

function CandidateContent() {
  const searchParams = useSearchParams();
  const applyJobId = searchParams.get("apply");

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gradient-to-br from-white via-primary/5 to-primary/10">
      <Navbar />
      <main className="flex-1 flex flex-col px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 md:py-12">
        <div className="max-w-6xl w-full mx-auto flex flex-col flex-1">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#2561c2]">Urban Jobs</p>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                {applyJobId ? "Job application" : "Candidate profile form"}
              </h1>
            </div>
            <Link
              href="/"
              className="text-sm font-semibold text-slate-500 hover:text-slate-800 px-3 py-2 rounded-xl hover:bg-white/60 backdrop-blur-sm transition-colors"
            >
              Save & exit
            </Link>
          </div>

          {applyJobId && (
            <div className="mb-6 rounded-2xl border border-[#2561c2]/20 bg-[#2561c2]/5 backdrop-blur-sm px-4 py-3 text-sm text-slate-700">
              You’re applying for a specific job — we’ll attach this profile to your application when you submit.
            </div>
          )}

          <div className="flex-1 flex flex-col items-center justify-center">
            <MultiStepCandidateForm applyJobId={applyJobId} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CandidatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex flex-col bg-gradient-to-br from-white via-primary/5 to-primary/10">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="h-10 w-10 border-2 border-[#2561c2]/30 border-t-[#2561c2] rounded-full animate-spin" />
          </main>
          <Footer />
        </div>
      }
    >
      <CandidateContent />
    </Suspense>
  );
}
