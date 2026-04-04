import type { Job } from "@/types";

/** Aggregate public jobs by category for home / featured summary. */
export function summarizeJobsByCategory(jobs: (Job & { id: string })[]) {
  const acc: Record<string, number> = {};
  for (const j of jobs) {
    const key = j.category?.trim() || "Other";
    acc[key] = (acc[key] || 0) + 1;
  }
  return Object.entries(acc)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
