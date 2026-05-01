"use client";

import { useEffect, useMemo, useState } from "react";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";
import type { Employer, EmployerJobPipelineStatus, Job } from "@/types";
import { EMPLOYER_JOB_PIPELINE_OPTIONS } from "@/lib/workflow-options";
import { adminGetEmployers } from "@/lib/admin-api";
import { adminDeleteJob, adminFetchJobs, adminUpdateJob } from "@/lib/admin-jobs-api";
import { HiOutlineTrash } from "react-icons/hi2";

export default function AdminEmployerJobsPage() {
  const [jobs, setJobs] = useState<(Job & { id: string })[]>([]);
  const [employers, setEmployers] = useState<(Employer & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [filterEmployerTag, setFilterEmployerTag] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterJobCategory, setFilterJobCategory] = useState("");

  const load = () => {
    Promise.all([adminFetchJobs(), adminGetEmployers()])
      .then(([j, e]) => {
        setJobs(j as (Job & { id: string })[]);
        setEmployers(e as (Employer & { id: string })[]);
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
      await adminUpdateJob(id, { pipelineStatus } as Partial<Job>);
      load();
    } catch {
      alert("Could not update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete job "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await adminDeleteJob(id);
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setDeletingId(null);
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
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden min-w-[1400px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-700">Job ID</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-700">Company</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-700">Contact person</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-700">Phone</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-700">Email</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-700">Title</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-700">Category</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-700">Location</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-700">Salary</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-700">Description</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-700">Requirements</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-700">Pipeline</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-slate-700">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => {
                    const emp = employerById.get(job.employerId);
                    const pipeline =
                      job.pipelineStatus ?? ("New" as EmployerJobPipelineStatus);
                    const disabled = updatingId === job.id || deletingId === job.id;
                    return (
                      <tr
                        key={job.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 align-top"
                      >
                        <td className="py-3 px-4 text-xs font-mono text-slate-600 max-w-[140px] truncate" title={job.id}>
                          {job.id}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-800">
                          <div className="font-medium">{job.companyName || emp?.companyName || "—"}</div>
                          {emp?.employerTagId?.trim() && (
                            <div className="text-xs text-primary font-medium">{emp.employerTagId}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-700">
                          {emp?.contactPerson || "—"}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-700">
                          {emp?.phone || "—"}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-700 max-w-[220px] truncate" title={emp?.email || ""}>
                          {emp?.email || "—"}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-slate-800 max-w-[220px]" title={job.title}>
                          <div className="line-clamp-2">{job.title}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-700 max-w-[180px]" title={String(job.category || "")}>
                          <div className="line-clamp-2">{job.category || "—"}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-700 max-w-[160px]" title={job.location}>
                          <div className="line-clamp-2">{job.location || "—"}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-700 max-w-[180px]" title={job.salary}>
                          <div className="line-clamp-2">{job.salary || "—"}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-700 max-w-[320px]" title={job.description}>
                          <div className="line-clamp-3 whitespace-pre-wrap">{job.description || "—"}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-700 max-w-[320px]" title={job.requirements}>
                          <div className="line-clamp-3 whitespace-pre-wrap">{job.requirements || "—"}</div>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={pipeline}
                            disabled={disabled}
                            onChange={(e) =>
                              handlePipeline(job.id, e.target.value as EmployerJobPipelineStatus)
                            }
                            className="w-full min-w-[180px] rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:opacity-60"
                          >
                            {EMPLOYER_JOB_PIPELINE_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDelete(job.id, job.title)}
                            disabled={deletingId === job.id}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                            title="Delete job"
                          >
                            <HiOutlineTrash className="h-5 w-5" />
                            {deletingId === job.id ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
