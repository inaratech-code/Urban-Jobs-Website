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
    const employers = await withTtlCache(`admin:employers:${limit}`, 5000, async () => {
      const db = getAdminDb();
      const snap = await db.collection("employers").orderBy("createdAt", "desc").limit(limit).get();
      return snap.docs.map((d) => {
        const data = d.data();
        const createdAt = data.createdAt instanceof Timestamp ? data.createdAt : data.createdAt;
        return { id: d.id, ...data, createdAt };
      });
    });
    return NextResponse.json({ ok: true, employers });
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
    await db.collection("employers").doc(body.id).update(body.data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unauthorized.";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

