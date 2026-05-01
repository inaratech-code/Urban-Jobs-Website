"use client";

import { useEffect, useState } from "react";
import type { Application, ApplicationStatus } from "@/types";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";
import { adminGetApplications, adminUpdateApplication } from "@/lib/admin-api";

const STATUS_OPTIONS: ApplicationStatus[] = [
  "Applied",
  "Shortlisted",
  "Rejected",
  "Hired",
];

type AppWithDetails = Application & {
  id: string;
  jobTitle?: string;
  candidateName?: string;
  companyName?: string;
};

export default function AdminApplicationsPage() {
  const [list, setList] = useState<AppWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const apps = await adminGetApplications();
      setList(apps as AppWithDetails[]);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    await adminUpdateApplication(id, { status });
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-800">Applications</h1>
      <p className="mt-1 text-slate-600">Track and update application status.</p>
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
                  Candidate
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">
                  Job / Company
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">
                  Status
                </th>
                <th className="text-right py-4 px-6 text-sm font-medium text-slate-700">
                  Update
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr key={a.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                  <td className="py-4 px-6 font-medium text-slate-800">
                    {a.candidateName || a.candidateId}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    <div>{a.jobTitle || a.jobId}</div>
                    {a.companyName && (
                      <div className="text-sm text-slate-500">{a.companyName}</div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${
                        a.status === "Hired"
                          ? "bg-primary/10 text-primary"
                          : a.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : a.status === "Shortlisted"
                              ? "bg-primary/10 text-primary"
                              : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <select
                      value={a.status}
                      onChange={(e) =>
                        handleStatusChange(a.id, e.target.value as ApplicationStatus)
                      }
                      className="text-sm rounded-lg border border-slate-200 px-3 py-1.5 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && (
            <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-12 text-center text-slate-500">
              No applications yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
