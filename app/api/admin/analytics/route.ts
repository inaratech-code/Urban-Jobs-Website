import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/admin-api-auth";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const [jobsSnap, appsSnap, webSnap] = await Promise.all([
      db.collection("jobs").orderBy("createdAt", "desc").get(),
      db.collection("applications").orderBy("createdAt", "desc").get(),
      db.collection("web_analytics").orderBy("createdAt", "desc").get(),
    ]);

    const jobs = jobsSnap.docs.map((d) => {
      const data = d.data();
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt : data.createdAt;
      return { id: d.id, ...data, createdAt };
    });
    const applications = appsSnap.docs.map((d) => {
      const data = d.data();
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt : data.createdAt;
      return { id: d.id, ...data, createdAt };
    });
    const webViews = webSnap.docs.map((d) => {
      const data = d.data();
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt : data.createdAt;
      return { id: d.id, ...data, createdAt };
    });

    return NextResponse.json({ ok: true, jobs, applications, webViews });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unauthorized.";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

