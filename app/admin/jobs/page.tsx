"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Job } from "@/types";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineXCircle } from "react-icons/hi2";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";
import { adminDeleteJob, adminFetchJobs, adminUpdateJob } from "@/lib/admin-jobs-api";

export default function AdminJobsPage() {
  const [list, setList] = useState<(Job & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusVal, setStatusVal] = useState<"active" | "closed">("active");

  const load = () => {
    setError(null);
    adminFetchJobs()
      .then(setList)
      .catch((e: unknown) => {
        setList([]);
        setError(e instanceof Error ? e.message : "Failed to load jobs.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const approvalLabel = (j: Job & { id: string }) =>
    j.adminApproved === false ? "Pending" : "Approved";

  const handleApprove = async (id: string) => {
    await adminUpdateJob(id, { adminApproved: true } as Partial<Job>);
    load();
  };

  const handleToggleFeatured = async (id: string, current: boolean | undefined) => {
    await adminUpdateJob(id, { featured: !current } as Partial<Job>);
    load();
  };

  const handleClose = async (id: string) => {
    await adminUpdateJob(id, { status: "closed" } as Partial<Job>);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job? This cannot be undone.")) return;
    await adminDeleteJob(id);
    load();
  };

  const handleStatusChange = async (id: string) => {
    await adminUpdateJob(id, { status: statusVal } as Partial<Job>);
    setEditingId(null);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-800">Job management</h1>
      <p className="mt-1 text-slate-600">
        Approve new listings before they appear on the site. Use <span className="font-medium">Featured</span> to mark
        roles for optional highlight use.
      </p>
      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}
      {loading ? (
        <div className="mt-8">
          <TableSkeleton rows={6} />
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">
                  Title
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">
                  Company
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">
                  Category
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">
                  Approval
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">
                  Featured
                </th>
                <th className="text-right py-4 px-6 text-sm font-medium text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((j) => (
                <tr key={j.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                  <td className="py-4 px-6 font-medium text-slate-800">{j.title}</td>
                  <td className="py-4 px-6 text-slate-600">{j.companyName || "—"}</td>
                  <td className="py-4 px-6 text-slate-600 text-sm">{j.category}</td>
                  <td className="py-4 px-6">
                    {editingId === j.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={statusVal}
                          onChange={(e) => setStatusVal(e.target.value as "active" | "closed")}
                          className="text-sm rounded-lg border border-slate-200 px-2 py-1"
                        >
                          <option value="active">Active</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(j.id)}
                          className="text-sm text-primary font-medium"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-sm text-slate-500"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span
                        className={
                          j.status === "active"
                            ? "text-primary text-sm"
                            : "text-slate-500 text-sm"
                        }
                      >
                        {j.status}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={
                        j.adminApproved === false
                          ? "text-slate-600 text-sm font-medium"
                          : "text-primary text-sm"
                      }
                    >
                      {approvalLabel(j)}
                    </span>
                    {j.adminApproved === false && j.status === "active" && (
                      <button
                        type="button"
                        onClick={() => handleApprove(j.id)}
                        className="ml-2 text-xs font-medium text-primary hover:underline"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {j.adminApproved === false ? (
                      <span className="text-slate-400 text-sm">—</span>
                    ) : (
                      <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={j.featured === true}
                          onChange={() => handleToggleFeatured(j.id, j.featured === true)}
                          className="rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        Home page
                      </label>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      {j.adminApproved === false ? (
                        <span
                          className="p-2 rounded-lg text-slate-300 cursor-not-allowed text-sm"
                          title="Approve the job to open the public page"
                        >
                          View
                        </span>
                      ) : (
                        <Link
                          href={`/jobs/${j.id}`}
                          target="_blank"
                          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                          title="View public page"
                        >
                          View
                        </Link>
                      )}
                      {editingId !== j.id && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(j.id);
                              setStatusVal(j.status === "active" ? "active" : "closed");
                            }}
                            className="p-2 rounded-lg text-slate-500 hover:bg-primary/10 hover:text-primary"
                            title="Edit status"
                          >
                            <HiOutlinePencil className="h-5 w-5" />
                          </button>
                          {j.status === "active" && (
                            <button
                              type="button"
                              onClick={() => handleClose(j.id)}
                              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                              title="Close"
                            >
                              <HiOutlineXCircle className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(j.id)}
                            className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <HiOutlineTrash className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && (
            <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-12 text-center text-slate-500">
              No jobs yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
