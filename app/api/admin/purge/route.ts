import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/admin-api-auth";

const COLLECTIONS_TO_PURGE = [
  "applications",
  "candidates",
  "employers",
  "jobs",
  "job_requests",
  "web_analytics",
] as const;

async function deleteCollectionAll(db: FirebaseFirestore.Firestore, collectionName: string) {
  const col = db.collection(collectionName);
  // Loop until empty; each batch deletes up to 400 docs.
  // (keep < 500 for Firestore batch write limit)
  while (true) {
    const snap = await col.limit(400).get();
    if (snap.empty) break;
    const batch = db.batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    const body = (await request.json()) as { confirm?: string; password?: string };

    if (body?.confirm !== "DELETE ALL DATA") {
      return NextResponse.json(
        { error: 'Type "DELETE ALL DATA" to confirm.' },
        { status: 400 }
      );
    }

    const requiredPassword =
      process.env.ADMIN_DELETE_PASSWORD ||
      process.env.NEXT_PUBLIC_ADMIN_DELETE_PASSWORD ||
      "";
    if (requiredPassword.trim()) {
      if (!body?.password || body.password !== requiredPassword) {
        return NextResponse.json({ error: "Invalid admin delete password." }, { status: 401 });
      }
    }

    const db = getAdminDb();
    for (const c of COLLECTIONS_TO_PURGE) {
      await deleteCollectionAll(db, c);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unauthorized.";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

