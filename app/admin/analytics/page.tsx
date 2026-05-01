"use client";

import { useEffect, useMemo, useState } from "react";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";
import type { ApplicationStatus, Job } from "@/types";
import { toDate } from "@/lib/utils";
import { adminGetAnalytics } from "@/lib/admin-api";

function BarRow({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="grid grid-cols-12 gap-3 items-center">
      <div className="col-span-4 sm:col-span-3 text-sm text-slate-700 font-medium truncate">
        {label}
      </div>
      <div className="col-span-6 sm:col-span-7">
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-2 rounded-full bg-primary"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="col-span-2 text-right text-sm text-slate-600 tabular-nums">
        {value}
      </div>
    </div>
  );
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function dayKey(d: Date) {
  const x = startOfDay(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
}

/** Paths excluded from “Web analytics” (admin, forms, job details, home & jobs index). */
function isExcludedFromWebAnalytics(path: string) {
  const raw = (path || "/").split("?")[0] || "/";
  const p = raw.startsWith("/") ? raw : `/${raw}`;
  if (p === "/" || p === "/jobs") return true;
  if (p.startsWith("/admin")) return true;
  if (p === "/candidate" || p.startsWith("/candidate/")) return true;
  if (p === "/employer" || p.startsWith("/employer/")) return true;
  if (p.startsWith("/jobs/") && p.length > "/jobs/".length) return true;
  return false;
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<(Job & { id: string })[]>([]);
  const [applications, setApplications] = useState<{ status: ApplicationStatus; createdAt: unknown }[]>([]);
  const [webViews, setWebViews] = useState<{ path: string; createdAt: unknown }[]>([]);

  useEffect(() => {
    let cancelled = false;
    adminGetAnalytics()
      .then(({ jobs: j, applications: a, webViews: w }) => {
        if (cancelled) return;
        setJobs(j);
        setApplications(a as unknown as { status: ApplicationStatus; createdAt: unknown }[]);
        setWebViews(w as unknown as { path: string; createdAt: unknown }[]);
      })
      .catch(() => {
        if (cancelled) return;
        setJobs([]);
        setApplications([]);
        setWebViews([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const jobCategoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const j of jobs) {
      const k = j.category || "Other";
      map.set(k, (map.get(k) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [jobs]);

  const applicationStatusCounts = useMemo(() => {
    const base: Record<ApplicationStatus, number> = {
      Applied: 0,
      Shortlisted: 0,
      Rejected: 0,
      Hired: 0,
    };
    for (const a of applications) {
      base[a.status] = (base[a.status] || 0) + 1;
    }
    return base;
  }, [applications]);

  const last7Days = useMemo(() => {
    const today = startOfDay(new Date());
    const days: Date[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    const candidateMap: Record<string, number> = {};
    const jobMap: Record<string, number> = {};
    const appMap: Record<string, number> = {};

    for (const d of days) {
      candidateMap[dayKey(d)] = 0;
      jobMap[dayKey(d)] = 0;
      appMap[dayKey(d)] = 0;
    }

    for (const j of jobs) {
      const k = dayKey(toDate(j.createdAt as any));
      if (k in jobMap) jobMap[k] += 1;
    }
    for (const a of applications) {
      const k = dayKey(toDate(a.createdAt as any));
      if (k in appMap) appMap[k] += 1;
    }

    return days.map((d) => {
      const k = dayKey(d);
      return {
        label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        jobs: jobMap[k] || 0,
        applications: appMap[k] || 0,
      };
    });
  }, [jobs, applications]);

  const maxCategory = Math.max(0, ...jobCategoryCounts.map(([, c]) => c));
  const maxStatus = Math.max(0, ...Object.values(applicationStatusCounts));
  const maxActivity = Math.max(0, ...last7Days.flatMap((d) => [d.jobs, d.applications]));

  const publicWebViews = useMemo(
    () => webViews.filter((v) => !isExcludedFromWebAnalytics(v.path)),
    [webViews]
  );

  const webViewsByPath = useMemo(() => {
    const map = new Map<string, number>();
    for (const v of publicWebViews) {
      const p = v.path || "/";
      map.set(p, (map.get(p) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [publicWebViews]);

  const todayViews = useMemo(() => {
    const today = startOfDay(new Date()).getTime();
    return publicWebViews.filter(
      (v) => startOfDay(toDate(v.createdAt as any)).getTime() === today
    ).length;
  }, [publicWebViews]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-800">Analytics</h1>
      <p className="mt-1 text-slate-600">Quick insights about jobs and applications.</p>

      {loading ? (
        <div className="mt-8">
          <TableSkeleton rows={6} />
        </div>
      ) : (
        <>
          <section className="mt-8 bg-white rounded-2xl p-6 shadow-soft border border-slate-100">
            <h2 className="font-display font-semibold text-slate-800">Web analytics</h2>
            <p className="mt-1 text-sm text-slate-500">
              Excludes admin, forms, job detail pages, home (<code className="text-slate-600">/</code>), and jobs listing (
              <code className="text-slate-600">/jobs</code>).
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-100 p-4">
                <p className="text-sm text-slate-500">Total page views</p>
                <p className="text-2xl font-display font-bold text-slate-800 mt-1 tabular-nums">{publicWebViews.length}</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-4">
                <p className="text-sm text-slate-500">Today views</p>
                <p className="text-2xl font-display font-bold text-slate-800 mt-1 tabular-nums">{todayViews}</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-4">
                <p className="text-sm text-slate-500">Top path</p>
                <p className="text-sm font-medium text-slate-800 mt-2 truncate">
                  {webViewsByPath[0]?.[0] || "—"}
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {webViewsByPath.length ? (
                webViewsByPath.map(([path, count]) => (
                  <BarRow
                    key={path}
                    label={path}
                    value={count}
                    max={webViewsByPath[0][1]}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-500">No page-view data yet.</p>
              )}
            </div>
          </section>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <section className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100">
              <h2 className="font-display font-semibold text-slate-800">Jobs by category</h2>
              <div className="mt-4 space-y-3">
                {jobCategoryCounts.length ? (
                  jobCategoryCounts.map(([label, value]) => (
                    <BarRow key={label} label={label} value={value} max={maxCategory} />
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No job data yet.</p>
                )}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100">
              <h2 className="font-display font-semibold text-slate-800">Applications by status</h2>
              <div className="mt-4 space-y-3">
                {(["Applied", "Shortlisted", "Rejected", "Hired"] as ApplicationStatus[]).map((s) => (
                  <BarRow
                    key={s}
                    label={s}
                    value={applicationStatusCounts[s] || 0}
                    max={maxStatus}
                  />
                ))}
              </div>
            </section>
          </div>

          <section className="mt-4 bg-white rounded-2xl p-6 shadow-soft border border-slate-100">
            <h2 className="font-display font-semibold text-slate-800">Last 7 days activity</h2>
            <p className="mt-1 text-sm text-slate-500">Jobs posted vs applications.</p>
            <div className="mt-4 space-y-3">
              {last7Days.map((d) => (
                <div key={d.label} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-3 text-sm text-slate-700 font-medium">{d.label}</div>
                  <div className="col-span-7">
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${maxActivity ? Math.round((d.applications / maxActivity) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2 text-right text-sm text-slate-600 tabular-nums">
                    {d.applications}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

