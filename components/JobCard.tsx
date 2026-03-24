"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineMapPin, HiOutlineCurrencyDollar } from "react-icons/hi2";
import type { Job } from "@/types";

interface JobCardProps {
  job: Job & { id: string };
  index?: number;
}

export default function JobCard({ job, index = 0 }: JobCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg border border-slate-100 transition-all duration-300"
    >
      <div className="flex flex-col h-full">
        <span className="inline-flex w-fit px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3">
          {job.category}
        </span>
        <h3 className="font-display font-semibold text-lg text-slate-800 group-hover:text-primary transition-colors line-clamp-2">
          {job.title}
        </h3>
        <p className="text-slate-600 text-sm mt-1">{job.companyName || "Company"}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <HiOutlineMapPin className="h-4 w-4 flex-shrink-0" />
            {job.location}
          </span>
          {job.salary && (
            <span className="flex items-center gap-1">
              <HiOutlineCurrencyDollar className="h-4 w-4 flex-shrink-0" />
              {job.salary}
            </span>
          )}
        </div>
        <p className="text-slate-600 text-sm mt-3 line-clamp-2 flex-1">
          {job.description}
        </p>
        <Link
          href={`/jobs/${job.id}`}
          className="mt-4 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 shadow-soft hover:shadow-soft-lg transition-all duration-200 w-full sm:w-auto"
        >
          View & Apply
        </Link>
      </div>
    </motion.article>
  );
}
