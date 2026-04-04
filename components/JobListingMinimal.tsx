import type { Job } from "@/types";

interface JobListingMinimalProps {
  job: Job & { id: string };
}

export default function JobListingMinimal({ job }: JobListingMinimalProps) {
  const openings = job.openings;
  return (
    <article className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <h2 className="font-display font-semibold text-slate-800 text-base leading-snug">
        {job.title}
      </h2>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {job.category}
        </span>
        {openings != null && openings > 0 && (
          <span className="text-slate-500">
            {openings} {openings === 1 ? "opening" : "openings"}
          </span>
        )}
      </div>
    </article>
  );
}
