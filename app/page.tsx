import HomeContent from "@/components/HomeContent";
import { getJobs, isJobFeaturedOnHome } from "@/lib/firestore";
import { serializeJobForClient } from "@/lib/utils";
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
  const featuredJobs = jobs
    .filter((j) => isJobFeaturedOnHome(j))
    .slice(0, 6)
    .map(serializeJobForClient);

  return <HomeContent featuredJobs={featuredJobs} />;
}
