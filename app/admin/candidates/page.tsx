"use client";

import { useEffect, useMemo, useState } from "react";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";
import {
  deleteCandidate,
  getCandidates,
  updateCandidate,
} from "@/lib/firestore";
import type { Candidate, CandidateWorkflowStatus } from "@/types";
import { CANDIDATE_WORKFLOW_OPTIONS } from "@/lib/workflow-options";
import { toDate } from "@/lib/utils";
import { HiOutlineTrash } from "react-icons/hi2";

export default function AdminCandidatesPage() {
  const [list, setList] = useState<(Candidate & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchId, setSearchId] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const DELETE_PASSWORD =
    process.env.NEXT_PUBLIC_ADMIN_DELETE_PASSWORD ||
    process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ||
    "Demo@123";

  const load = () => {
    getCandidates()
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let rows = list;
    const idQ = searchId.trim().toLowerCase();
    const phoneQ = searchPhone.trim().replace(/\s/g, "");
    if (idQ) {
      rows = rows.filter((c) => c.id.toLowerCase().includes(idQ));
    }
    if (phoneQ) {
      rows = rows.filter((c) =>
        (c.phone || "").replace(/\s/g, "").includes(phoneQ)
      );
    }
    return rows;
  }, [list, searchId, searchPhone]);

  const handleStatus = async (
    id: string,
    workflowStatus: CandidateWorkflowStatus
  ) => {
    setUpdatingId(id);
    try {
      await updateCandidate(id, { workflowStatus });
      load();
    } catch {
      alert("Could not update status. Try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmDelete = confirm(`Delete candidate "${name}"?`);
    if (!confirmDelete) return;

    const input = prompt("Enter admin password to confirm delete:");
    if (!input) return;
    if (input !== DELETE_PASSWORD) {
      alert("Invalid admin password.");
      return;
    }

    setDeletingId(id);
    try {
      await deleteCandidate(id);
      load();
    } catch {
      alert("Delete failed. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-800">
        Candidate management
      </h1>
      <p className="mt-1 text-slate-600">
        Search by ID or mobile, update workflow status, or remove records.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
        <input
          type="search"
          placeholder="Candidate ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
        />
        <input
          type="search"
          placeholder="Mobile number"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
        />
      </div>

      {loading ? (
        <div className="mt-8">
          <TableSkeleton rows={6} />
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          {list.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-12 text-center text-slate-500">
              No candidates yet.
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-12 text-center text-slate-500">
              No candidates match your search.
            </div>
          ) : (
            <table className="w-full bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left py-3 px-3 text-xs font-medium text-slate-700">
                    ID
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-slate-700">
                    Name
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-slate-700">
                    Phone
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-slate-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-slate-700">
                    Preferred Job
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-slate-700">
                    Action
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-slate-700">
                    Created
                  </th>
                  <th className="text-right py-3 px-3 text-xs font-medium text-slate-700">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const status =
                    c.workflowStatus ?? ("New" as CandidateWorkflowStatus);
                  return (
                    <tr
                      key={c.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                    >
                      <td className="py-2 px-3 text-xs font-mono text-slate-600 max-w-[100px] truncate" title={c.id}>
                        {c.id}
                      </td>
                      <td className="py-2 px-3 text-sm font-medium text-slate-800">
                        {c.fullName}
                      </td>
                      <td className="py-2 px-3 text-sm text-slate-600">
                        {c.phone}
                      </td>
                      <td className="py-2 px-3 text-sm text-slate-600 max-w-[140px] truncate">
                        {c.email}
                      </td>
                      <td className="py-2 px-3 text-sm text-slate-600 max-w-[120px] truncate">
                        {c.preferredJob || "—"}
                      </td>
                      <td className="py-2 px-3">
                        <select
                          value={status}
                          disabled={updatingId === c.id}
                          onChange={(e) =>
                            handleStatus(
                              c.id,
                              e.target.value as CandidateWorkflowStatus
                            )
                          }
                          className="w-full min-w-[180px] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        >
                          {CANDIDATE_WORKFLOW_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-3 text-xs text-slate-600 whitespace-nowrap">
                        {toDate(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id, c.fullName)}
                          disabled={deletingId === c.id}
                          className="inline-flex p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50"
                          title="Delete candidate"
                        >
                          <HiOutlineTrash className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
