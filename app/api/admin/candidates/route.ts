import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/admin-api-auth";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const snap = await db.collection("candidates").orderBy("createdAt", "desc").get();
    const candidates = snap.docs.map((d) => {
      const data = d.data();
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt : data.createdAt;
      return { id: d.id, ...data, createdAt };
    });
    return NextResponse.json({ ok: true, candidates });
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
    await db.collection("candidates").doc(body.id).update(body.data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unauthorized.";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin(request);
    const body = (await request.json()) as { id?: string };
    if (!body?.id) {
      return NextResponse.json({ error: "Missing id." }, { status: 400 });
    }
    const db = getAdminDb();
    await db.collection("candidates").doc(body.id).delete();
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unauthorized.";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

