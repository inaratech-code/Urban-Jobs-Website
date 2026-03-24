"use client";

import Link from "next/link";

export default function ApplyButton({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle: string;
}) {
  const applyHref = `/candidate?apply=${jobId}`;
  return (
    <Link
      href={applyHref}
      className="inline-flex w-full sm:w-auto justify-center px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 shadow-soft transition-colors"
    >
      Apply for this job
    </Link>
  );
}
