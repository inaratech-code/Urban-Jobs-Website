import HomeContent from "@/components/HomeContent";
import { getJobs } from "@/lib/firestore";
import { summarizeJobsByCategory } from "@/lib/job-summaries";
import type { Job } from "@/types";

export const metadata = {
  title: "Urban Jobs – Find Jobs in Dhangadhi",
  description:
    "Connecting Talent with Opportunity. Find teaching jobs, hotel management, reception, accounting and IT roles in Dhangadhi, Nepal.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let jobs: (Job & { id: string })[] = [];
  try {
    jobs = await getJobs();
  } catch {
    jobs = [];
  }
  const categorySummaries = summarizeJobsByCategory(jobs);
  const totalJobs = jobs.length;

  return (
    <HomeContent categorySummaries={categorySummaries} totalJobs={totalJobs} />
  );
}
