"use client";

import { useEffect, useState } from "react";
import { getEmployers, updateEmployer } from "@/lib/firestore";
import type { Employer } from "@/types";
import { HiOutlineCheck, HiOutlineNoSymbol } from "react-icons/hi2";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";

export default function AdminEmployersPage() {
  const [list, setList] = useState<(Employer & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getEmployers()
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id: string) => {
    await updateEmployer(id, { approved: true, disabled: false });
    load();
  };

  const handleDisable = async (id: string) => {
    await updateEmployer(id, { disabled: true });
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-800">Employer management</h1>
      <p className="mt-1 text-slate-600">Approve or disable employer accounts.</p>
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
                  Company
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">
                  Contact
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">
                  Email / Phone
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">
                  Status
                </th>
                <th className="text-right py-4 px-6 text-sm font-medium text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                  <td className="py-4 px-6 font-medium text-slate-800">{e.companyName}</td>
                  <td className="py-4 px-6 text-slate-600">{e.contactPerson}</td>
                  <td className="py-4 px-6 text-slate-600 text-sm">
                    {e.email} / {e.phone}
                  </td>
                  <td className="py-4 px-6">
                    {e.disabled ? (
                      <span className="text-amber-600 text-sm">Disabled</span>
                    ) : e.approved !== false ? (
                      <span className="text-green-600 text-sm">Approved</span>
                    ) : (
                      <span className="text-slate-500 text-sm">Pending</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      {e.approved !== false && !e.disabled && (
                        <button
                          type="button"
                          onClick={() => handleDisable(e.id)}
                          className="p-2 rounded-lg text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                          title="Disable"
                        >
                          <HiOutlineNoSymbol className="h-5 w-5" />
                        </button>
                      )}
                      {(e.approved === false || e.disabled) && (
                        <button
                          type="button"
                          onClick={() => handleApprove(e.id)}
                          className="p-2 rounded-lg text-slate-500 hover:bg-green-50 hover:text-green-600"
                          title="Approve"
                        >
                          <HiOutlineCheck className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && (
            <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-12 text-center text-slate-500">
              No employers yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
