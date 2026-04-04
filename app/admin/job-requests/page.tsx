"use client";

import { useEffect, useState } from "react";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";
import { getJobRequests } from "@/lib/firestore";
import type { JobRequest } from "@/types";
import { toDate } from "@/lib/utils";

export default function AdminJobRequestsPage() {
  const [list, setList] = useState<(JobRequest & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobRequests()
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-800">
        Job requests
      </h1>
      <p className="mt-1 text-slate-600">
        Submissions from users who could not find a matching role on the site.
      </p>

      {loading ? (
        <div className="mt-8">
          <TableSkeleton rows={6} />
        </div>
      ) : list.length === 0 ? (
        <div className="mt-8 bg-white rounded-2xl shadow-soft border border-slate-100 p-12 text-center text-slate-500">
          No requests yet.
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                  Phone
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                  Desired role
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                  Message
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                >
                  <td className="py-3 px-4 text-sm font-medium text-slate-800">
                    {r.fullName}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{r.phone}</td>
                  <td className="py-3 px-4 text-sm text-slate-800">
                    {r.desiredRole}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 max-w-xs truncate" title={r.message}>
                    {r.message || "—"}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 whitespace-nowrap">
                    {toDate(r.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
