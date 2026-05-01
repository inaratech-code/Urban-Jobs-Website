import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/admin-api-auth";
import { clampLimit, withTtlCache } from "@/lib/admin-api-cache";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const url = new URL(request.url);
    const limit = clampLimit(url.searchParams.get("limit"), 300, 1000);

    const applications = await withTtlCache(`admin:applications:${limit}`, 5000, async () => {
      const db = getAdminDb();
      const snap = await db.collection("applications").orderBy("createdAt", "desc").limit(limit).get();
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Array<{
        id: string;
        candidateId: string;
        jobId: string;
        status: string;
        createdAt?: unknown;
      }>;

      const candidateIds = Array.from(new Set(rows.map((r) => r.candidateId).filter(Boolean)));
      const jobIds = Array.from(new Set(rows.map((r) => r.jobId).filter(Boolean)));

      const [candidateSnaps, jobSnaps] = await Promise.all([
        Promise.all(candidateIds.map((id) => db.collection("candidates").doc(id).get())),
        Promise.all(jobIds.map((id) => db.collection("jobs").doc(id).get())),
      ]);

      const candidateById = new Map(
        candidateSnaps
          .filter((s) => s.exists)
          .map((s) => [s.id, s.data() as Record<string, unknown>])
      );
      const jobById = new Map(
        jobSnaps.filter((s) => s.exists).map((s) => [s.id, s.data() as Record<string, unknown>])
      );

      return rows.map((a) => {
        const candidate = candidateById.get(a.candidateId);
        const job = jobById.get(a.jobId);
        const createdAtRaw = (a as any).createdAt;
        const createdAt = createdAtRaw instanceof Timestamp ? createdAtRaw : createdAtRaw;
        return {
          ...a,
          createdAt,
          candidateName: (candidate?.fullName as string | undefined) || undefined,
          jobTitle: (job?.title as string | undefined) || undefined,
          companyName: (job?.companyName as string | undefined) || undefined,
        };
      });
    });

    return NextResponse.json({ ok: true, applications });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unauthorized.";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin(request);
    const body = (await request.json()) as { id?: string; data?: Record<string, unknown> };
    if (!body?.id || !body?.data) {
      return NextResponse.json({ error: "Missing id or data." }, { status: 400 });
    }
    const db = getAdminDb();
    await db.collection("applications").doc(body.id).update(body.data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unauthorized.";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

