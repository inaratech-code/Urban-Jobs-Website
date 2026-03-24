"use client";

import { useEffect, useState } from "react";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";
import { deleteCandidate, getCandidates } from "@/lib/firestore";
import type { Candidate } from "@/types";
import { toDate } from "@/lib/utils";
import { HiOutlineTrash } from "react-icons/hi2";

export default function AdminCandidatesPage() {
  const [list, setList] = useState<(Candidate & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
      <h1 className="font-display text-2xl font-bold text-slate-800">Candidate management</h1>
      <p className="mt-1 text-slate-600">View candidates in table format and manage records.</p>
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
          ) : (
            <table className="w-full bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left py-4 px-4 text-sm font-medium text-slate-700">Name</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-slate-700">Phone</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-slate-700">Email</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-slate-700">Preferred Job</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-slate-700">Document ID</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-slate-700">Passport</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-slate-700">Certificates</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-slate-700">Created</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">{c.fullName}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{c.phone}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{c.email}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{c.preferredJob || "—"}</td>
                    <td className="py-3 px-4 text-sm">
                      {c.documentIdURL ? (
                        <a href={c.documentIdURL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          View
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {c.passportPhotoURL ? (
                        <a href={c.passportPhotoURL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          View
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {c.certificateURLs?.length || 0}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {toDate(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
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
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
