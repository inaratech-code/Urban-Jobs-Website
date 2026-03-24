"use client";

import { useEffect, useState } from "react";
import DashboardStats from "@/components/DashboardStats";
import { DashboardSkeleton } from "@/components/admin/AdminSkeleton";
import { getCandidates, getEmployers, getJobsForAdmin, getApplications } from "@/lib/firestore";
import { toDate } from "@/lib/utils";

type ActivityItem = {
  type: "candidate" | "employer" | "job" | "application";
  label: string;
  createdAt: Date;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    candidates: 0,
    employers: 0,
    jobs: 0,
    applications: 0,
    activeJobs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getCandidates(),
      getEmployers(),
      getJobsForAdmin(),
      getApplications(),
    ])
      .then(([candidates, employers, jobs, applications]) => {
        if (cancelled) return;
        const activeJobs = jobs.filter((j) => j.status === "active").length;
        setStats({
          candidates: candidates.length,
          employers: employers.length,
          jobs: jobs.length,
          applications: applications.length,
          activeJobs,
        });

        const items: ActivityItem[] = [
          ...candidates.slice(0, 6).map((c) => ({
            type: "candidate" as const,
            label: `${c.fullName || "Candidate"} submitted profile`,
            createdAt: toDate(c.createdAt),
          })),
          ...employers.slice(0, 6).map((e) => ({
            type: "employer" as const,
            label: `${e.companyName || "Employer"} joined`,
            createdAt: toDate(e.createdAt),
          })),
          ...jobs.slice(0, 6).map((j) => ({
            type: "job" as const,
            label: `${j.title || "Job"} posted`,
            createdAt: toDate(j.createdAt),
          })),
          ...applications.slice(0, 10).map((a) => ({
            type: "application" as const,
            label: `New application (${a.status})`,
            createdAt: toDate(a.createdAt as any),
          })),
        ]
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, 10);

        setActivity(items);
      })
      .catch(() => {
        if (!cancelled) setStats({ candidates: 0, employers: 0, jobs: 0, applications: 0, activeJobs: 0 });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-800">Dashboard</h1>
      <p className="mt-1 text-slate-600">Overview of your recruitment platform.</p>
      {loading ? (
        <div className="mt-8">
          <DashboardSkeleton />
        </div>
      ) : (
        <>
          <div className="mt-8">
            <DashboardStats
              totalCandidates={stats.candidates}
              totalEmployers={stats.employers}
              activeJobs={stats.activeJobs}
              applications={stats.applications}
            />
          </div>
          <section className="mt-6 bg-white rounded-2xl p-6 shadow-soft border border-slate-100">
            <h2 className="font-display font-semibold text-slate-800">Recent activity</h2>
            <div className="mt-4 space-y-3">
              {activity.length === 0 ? (
                <p className="text-sm text-slate-500">No recent activity yet.</p>
              ) : (
                activity.map((item, idx) => (
                  <div key={`${item.type}-${idx}`} className="flex items-center justify-between text-sm">
                    <p className="text-slate-700">{item.label}</p>
                    <p className="text-slate-500 tabular-nums">
                      {item.createdAt.toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
