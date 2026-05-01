import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/admin-api-auth";
import { clampLimit, withTtlCache } from "@/lib/admin-api-cache";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const url = new URL(request.url);
    const jobsLimit = clampLimit(url.searchParams.get("jobsLimit"), 500, 2000);
    const appsLimit = clampLimit(url.searchParams.get("appsLimit"), 500, 2000);
    const webLimit = clampLimit(url.searchParams.get("webLimit"), 2000, 10000);

    const { jobs, applications, webViews } = await withTtlCache(
      `admin:analytics:${jobsLimit}:${appsLimit}:${webLimit}`,
      8000,
      async () => {
        const db = getAdminDb();
        const [jobsSnap, appsSnap, webSnap] = await Promise.all([
          db.collection("jobs").orderBy("createdAt", "desc").limit(jobsLimit).get(),
          db.collection("applications").orderBy("createdAt", "desc").limit(appsLimit).get(),
          db.collection("web_analytics").orderBy("createdAt", "desc").limit(webLimit).get(),
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
        return { jobs, applications, webViews };
      }
    );

    return NextResponse.json({ ok: true, jobs, applications, webViews });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unauthorized.";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

