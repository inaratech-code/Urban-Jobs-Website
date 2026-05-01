"use client";

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

async function adminFetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getIdTokenOrThrow();
  const res = await fetch(path, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      authorization: `Bearer ${token}`,
    },
  });
  const json = (await res.json()) as any;
  if (!res.ok) throw new Error(json?.error || "Request failed.");
  return json as T;
}

export async function adminGetCandidates() {
  const json = await adminFetchJson<{ candidates: any[] }>("/api/admin/candidates");
  return json.candidates;
}
export async function adminUpdateCandidate(id: string, data: Record<string, unknown>) {
  await adminFetchJson("/api/admin/candidates", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id, data }),
  });
}
export async function adminDeleteCandidate(id: string) {
  await adminFetchJson("/api/admin/candidates", {
    method: "DELETE",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

export async function adminGetEmployers() {
  const json = await adminFetchJson<{ employers: any[] }>("/api/admin/employers");
  return json.employers;
}
export async function adminUpdateEmployer(id: string, data: Record<string, unknown>) {
  await adminFetchJson("/api/admin/employers", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id, data }),
  });
}

export async function adminGetApplications() {
  const json = await adminFetchJson<{ applications: any[] }>("/api/admin/applications");
  return json.applications;
}
export async function adminUpdateApplication(id: string, data: Record<string, unknown>) {
  await adminFetchJson("/api/admin/applications", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id, data }),
  });
}

export async function adminGetAnalytics() {
  return adminFetchJson<{ jobs: any[]; applications: any[]; webViews: any[] }>("/api/admin/analytics");
}

export async function adminGetJobRequests() {
  const json = await adminFetchJson<{ requests: any[] }>("/api/admin/job-requests");
  return json.requests;
}

