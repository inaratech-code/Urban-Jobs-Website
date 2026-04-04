"use client";

import { useEffect, useMemo, useState } from "react";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";
import {
  getEmployers,
  getJobsForAdmin,
  updateJob,
} from "@/lib/firestore";
import type { Employer, EmployerJobPipelineStatus, Job } from "@/types";
import { EMPLOYER_JOB_PIPELINE_OPTIONS } from "@/lib/workflow-options";

export default function AdminEmployerJobsPage() {
  const [jobs, setJobs] = useState<(Job & { id: string })[]>([]);
  const [employers, setEmployers] = useState<(Employer & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [filterEmployerTag, setFilterEmployerTag] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterJobCategory, setFilterJobCategory] = useState("");

  const load = () => {
    Promise.all([getJobsForAdmin(), getEmployers()])
      .then(([j, e]) => {
        setJobs(j);
        setEmployers(e);
      })
      .catch(() => {
        setJobs([]);
        setEmployers([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const employerById = useMemo(() => {
    const m = new Map<string, Employer & { id: string }>();
    employers.forEach((e) => m.set(e.id, e));
    return m;
  }, [employers]);

  const industryOptions = useMemo(() => {
    const s = new Set<string>();
    employers.forEach((e) => {
      if (e.industryCategory?.trim()) s.add(e.industryCategory.trim());
    });
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [employers]);

  const jobCategoryOptions = useMemo(() => {
    const s = new Set<string>();
    jobs.forEach((j) => {
      if (j.category?.trim()) s.add(j.category.trim());
    });
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  const employerTagOptions = useMemo(() => {
    const rows: { id: string; label: string }[] = employers.map((e) => ({
      id: e.id,
      label: e.employerTagId?.trim()
        ? `${e.employerTagId} — ${e.companyName}`
        : `${e.companyName} (${e.id.slice(0, 6)}…)`,
    }));
    return rows.sort((a, b) => a.label.localeCompare(b.label));
  }, [employers]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const emp = employerById.get(job.employerId);
      if (filterEmployerTag && job.employerId !== filterEmployerTag) {
        return false;
      }
      if (filterIndustry) {
        if (!emp || emp.industryCategory !== filterIndustry) return false;
      }
      if (filterJobCategory && job.category !== filterJobCategory) {
        return false;
      }
      return true;
    });
  }, [
    jobs,
    employerById,
    filterEmployerTag,
    filterIndustry,
    filterJobCategory,
  ]);

  const handlePipeline = async (id: string, pipelineStatus: EmployerJobPipelineStatus) => {
    setUpdatingId(id);
    try {
      await updateJob(id, { pipelineStatus });
      load();
    } catch {
      alert("Could not update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-800">
        Employer jobs
      </h1>
      <p className="mt-1 text-slate-600">
        Manage pipeline status per job. Filter by employer tag, industry, or job category.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Employer (tag / ID)
          </label>
          <select
            value={filterEmployerTag}
            onChange={(e) => setFilterEmployerTag(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="">All employers</option>
            {employerTagOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Industry category
          </label>
          <select
            value={filterIndustry}
            onChange={(e) => setFilterIndustry(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="">All industries</option>
            {industryOptions.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Preferred job type (category)
          </label>
          <select
            value={filterJobCategory}
            onChange={(e) => setFilterJobCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="">All categories</option>
            {jobCategoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="mt-8">
          <TableSkeleton rows={6} />
        </div>
      ) : (
        <div className="mt-8">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-12 text-center text-slate-500">
              No jobs match the filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map((job) => {
                const emp = employerById.get(job.employerId);
                const pipeline =
                  job.pipelineStatus ?? ("New" as EmployerJobPipelineStatus);
                return (
                  <article
                    key={job.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-3"
                  >
                    <div>
                      <p className="text-xs font-mono text-slate-500 truncate" title={job.id}>
                        {job.id}
                      </p>
                      <h2 className="font-display font-semibold text-slate-800 mt-1 line-clamp-2">
                        {job.title}
                      </h2>
                      {emp && (
                        <p className="text-xs text-slate-500 mt-1">
                          {emp.employerTagId ? (
                            <span className="font-medium text-primary">
                              {emp.employerTagId}
                            </span>
                          ) : (
                            <span>Employer: {emp.companyName}</span>
                          )}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Status
                      </label>
                      <select
                        value={pipeline}
                        disabled={updatingId === job.id}
                        onChange={(e) =>
                          handlePipeline(
                            job.id,
                            e.target.value as EmployerJobPipelineStatus
                          )
                        }
                        className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      >
                        {EMPLOYER_JOB_PIPELINE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
