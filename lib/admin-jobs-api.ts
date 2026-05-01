"use client";

import type { Job } from "@/types";
import { auth } from "@/lib/firebase";
import { hasDemoSession } from "@/lib/auth";

async function getIdTokenOrThrow(): Promise<string> {
  if (hasDemoSession()) {
    throw new Error("Demo admin cannot manage live data. Sign in with a real Firebase Admin account.");
  }
  const user = auth?.currentUser;
  if (!user) throw new Error("Not signed in.");
  return user.getIdToken();
}

export async function adminFetchJobs(): Promise<(Job & { id: string })[]> {
  const token = await getIdTokenOrThrow();
  const res = await fetch("/api/admin/jobs", {
    headers: { authorization: `Bearer ${token}` },
  });
  const json = (await res.json()) as { jobs?: (Job & { id: string })[]; error?: string };
  if (!res.ok) throw new Error(json.error || "Failed to load jobs.");
  return json.jobs || [];
}

export async function adminUpdateJob(id: string, data: Partial<Job>): Promise<void> {
  const token = await getIdTokenOrThrow();
  const res = await fetch("/api/admin/jobs", {
    method: "PATCH",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({ id, data }),
  });
  const json = (await res.json()) as { error?: string };
  if (!res.ok) throw new Error(json.error || "Failed to update job.");
}

export async function adminDeleteJob(id: string): Promise<void> {
  const token = await getIdTokenOrThrow();
  const res = await fetch("/api/admin/jobs", {
    method: "DELETE",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({ id }),
  });
  const json = (await res.json()) as { error?: string };
  if (!res.ok) throw new Error(json.error || "Failed to delete job.");
}

