import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { toDate } from "@/lib/utils";
import Footer from "@/components/Footer";
import ApplyButton from "./ApplyButton";
import { getJob, isJobPublicVisible } from "@/lib/firestore";
import { HiOutlineMapPin, HiOutlineCurrencyDollar, HiOutlineBuildingOffice2 } from "react-icons/hi2";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const job = await getJob(id);
    if (!job || !isJobPublicVisible(job)) return { title: "Job not found – Urban Jobs" };
    return {
      title: `${job.title} – Urban Jobs`,
      description: job.description?.slice(0, 160),
    };
  } catch {
    return { title: "Job – Urban Jobs" };
  }
}

export const dynamic = "force-dynamic";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let job: Awaited<ReturnType<typeof getJob>> = null;
  try {
    job = await getJob(id);
  } catch {
    job = null;
  }
  if (!job || !isJobPublicVisible(job)) notFound();

  const createdAt = toDate(job.createdAt);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/jobs"
            className="text-sm text-slate-600 hover:text-primary mb-6 inline-block"
          >
            ← Back to jobs
          </Link>
          <article className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
            <div className="p-6 sm:p-8">
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {job.category}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 mt-3">
                {job.title}
              </h1>
              <p className="mt-2 text-slate-600 flex items-center gap-2">
                <HiOutlineBuildingOffice2 className="h-5 w-5 flex-shrink-0" />
                {job.companyName || "Company"}
              </p>
              <div className="flex flex-wrap gap-4 mt-4 text-slate-600">
                <span className="flex items-center gap-1">
                  <HiOutlineMapPin className="h-4 w-4" />
                  {job.location}
                </span>
                {job.salary && (
                  <span className="flex items-center gap-1">
                    <HiOutlineCurrencyDollar className="h-4 w-4" />
                    {job.salary}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 mt-2">
                Posted {createdAt.toLocaleDateString()}
              </p>

              <div className="mt-8 border-t border-slate-100 pt-8">
                <h2 className="font-display font-semibold text-slate-800">Description</h2>
                <div className="mt-2 text-slate-600 whitespace-pre-wrap">
                  {job.description}
                </div>
              </div>
              {job.requirements && (
                <div className="mt-6">
                  <h2 className="font-display font-semibold text-slate-800">
                    Requirements
                  </h2>
                  <div className="mt-2 text-slate-600 whitespace-pre-wrap">
                    {job.requirements}
                  </div>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-slate-100">
                <ApplyButton jobId={id} jobTitle={job.title} />
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
