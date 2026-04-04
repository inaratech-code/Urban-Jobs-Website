import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobListingMinimal from "@/components/JobListingMinimal";
import JobsFilters from "./JobsFilters";
import { getJobs } from "@/lib/firestore";
import { serializeJobForClient } from "@/lib/utils";

export const metadata = {
  title: "Jobs – Urban Jobs",
  description: "Browse teaching, hotel, reception, accounting and IT jobs in Dhangadhi.",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ category?: string; location?: string; search?: string }>;
}

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  let allJobs: Awaited<ReturnType<typeof getJobs>> = [];
  try {
    allJobs = await getJobs();
  } catch {
    allJobs = [];
  }

  const categoryCounts = allJobs.reduce<Record<string, number>>((acc, j) => {
    const key = j.category || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const filteredJobs = allJobs
    .filter((j) => (params.category ? j.category === params.category : true))
    .filter((j) =>
      params.location
        ? j.location?.toLowerCase().includes(params.location.toLowerCase())
        : true
    )
    .filter((j) => {
      if (!params.search) return true;
      const s = params.search.toLowerCase();
      return (
        j.title?.toLowerCase().includes(s) ||
        j.category?.toLowerCase().includes(s)
      );
    });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-6 sm:py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
          <div className="rounded-2xl mb-6 sm:mb-8 bg-gradient-to-r from-cta-job via-primary to-cta-hire p-6 sm:p-8 md:p-10 text-white shadow-md border border-white/10">
            <p className="font-display font-bold text-xl sm:text-2xl md:text-3xl">Find a job in Dhangadhi</p>
            <p className="text-white/90 text-sm sm:text-base mt-2 max-w-xl">
              Browse open roles by category. Updated listings from local employers.
            </p>
          </div>
          <h1 className="sr-only">Jobs in Dhangadhi</h1>

          <Suspense fallback={<div className="h-14" />}>
            <JobsFilters />
          </Suspense>

          <div className="mt-6 bg-white rounded-2xl shadow-soft border border-slate-100 p-4 sm:p-5">
            <div className="flex flex-wrap gap-3">
              <a
                href="/jobs"
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  !params.category
                    ? "bg-cta-job text-white border-cta-job"
                    : "bg-white text-slate-700 border-slate-200 hover:border-cta-job hover:text-cta-job"
                }`}
              >
                All {allJobs.length}
              </a>
              {Object.entries(categoryCounts)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([cat, count]) => {
                  const active = params.category === cat;
                  const url = `/jobs?category=${encodeURIComponent(cat)}${
                    params.location ? `&location=${encodeURIComponent(params.location)}` : ""
                  }${params.search ? `&search=${encodeURIComponent(params.search)}` : ""}`;
                  return (
                    <a
                      key={cat}
                      href={url}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                        active
                          ? "bg-cta-job text-white border-cta-job"
                          : "bg-white text-slate-700 border-slate-200 hover:border-cta-job hover:text-cta-job"
                      }`}
                    >
                      {cat} {count}
                    </a>
                  );
                })}
            </div>
          </div>

          <div className="mt-6 sm:mt-8 space-y-3 max-w-3xl md:max-w-4xl">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobListingMinimal key={job.id} job={serializeJobForClient(job)} />
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-soft border border-slate-100">
                <p className="text-slate-600">No jobs match your filters.</p>
                <a href="/jobs" className="mt-2 inline-block text-primary font-medium hover:underline">
                  Clear filters
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
