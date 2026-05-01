import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";

type GuestJobPayload = {
  companyName?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  title?: string;
  category?: string;
  description?: string;
  requirements?: string;
  salary?: string;
  location?: string;
};

function requiredString(v: unknown) {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : null;
}

export async function POST(req: Request) {
  let body: GuestJobPayload;
  try {
    body = (await req.json()) as GuestJobPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const companyName = requiredString(body.companyName);
  const contactPerson = requiredString(body.contactPerson);
  const phone = requiredString(body.phone);
  const email = requiredString(body.email);
  const title = requiredString(body.title);
  const category = requiredString(body.category);
  const description = requiredString(body.description);
  const requirements = typeof body.requirements === "string" ? body.requirements : "";
  const salary = typeof body.salary === "string" ? body.salary : "";
  const location = requiredString(body.location) || "Dhangadhi";

  if (
    !companyName ||
    !contactPerson ||
    !phone ||
    !email ||
    !title ||
    !category ||
    !description
  ) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  try {
    const db = getAdminDb();

    const employerRef = await db.collection("employers").add({
      companyName,
      contactPerson,
      phone,
      email,
      approved: true,
      disabled: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    const jobRef = await db.collection("jobs").add({
      employerId: employerRef.id,
      title,
      category,
      location,
      salary,
      description,
      requirements,
      status: "active",
      adminApproved: false,
      featured: false,
      companyName,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true, employerId: employerRef.id, jobId: jobRef.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to submit job.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

