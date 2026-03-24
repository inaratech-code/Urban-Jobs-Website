import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
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
        j.companyName?.toLowerCase().includes(s) ||
        j.description?.toLowerCase().includes(s)
      );
    });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold text-slate-800">
            Jobs in Dhangadhi
          </h1>
          <p className="mt-1 text-slate-600">
            Find your next opportunity from local employers.
          </p>

          <Suspense fallback={<div className="h-14" />}>
            <JobsFilters />
          </Suspense>

          <div className="mt-6 bg-white rounded-2xl shadow-soft border border-slate-100 p-4 sm:p-5">
            <div className="flex flex-wrap gap-3">
              <a
                href="/jobs"
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  !params.category
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-slate-700 border-slate-200 hover:border-primary hover:text-primary"
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
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-slate-700 border-slate-200 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {cat} {count}
                    </a>
                  );
                })}
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, i) => (
                <JobCard key={job.id} job={serializeJobForClient(job)} index={i} />
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-soft border border-slate-100">
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
