import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/admin-api-auth";
import { clampLimit, withTtlCache } from "@/lib/admin-api-cache";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const url = new URL(request.url);
    const limit = clampLimit(url.searchParams.get("limit"), 500, 2000);
    const requests = await withTtlCache(`admin:job-requests:${limit}`, 5000, async () => {
      const db = getAdminDb();
      const snap = await db.collection("job_requests").orderBy("createdAt", "desc").limit(limit).get();
      return snap.docs.map((d) => {
        const data = d.data();
        const createdAt = data.createdAt instanceof Timestamp ? data.createdAt : data.createdAt;
        return { id: d.id, ...data, createdAt };
      });
    });
    return NextResponse.json({ ok: true, requests });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unauthorized.";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

