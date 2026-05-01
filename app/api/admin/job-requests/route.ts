import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/admin-api-auth";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const snap = await db.collection("job_requests").orderBy("createdAt", "desc").get();
    const requests = snap.docs.map((d) => {
      const data = d.data();
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt : data.createdAt;
      return { id: d.id, ...data, createdAt };
    });
    return NextResponse.json({ ok: true, requests });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unauthorized.";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

