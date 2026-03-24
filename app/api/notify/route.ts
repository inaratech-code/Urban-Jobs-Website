import { NextResponse } from "next/server";

/**
 * Optional: Call this from a Firebase Cloud Function or webhook
 * when a candidate submits a resume, to send admin notification.
 * Or implement email (e.g. Resend/SendGrid) here.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.type === "candidate_submitted") {
      // TODO: Send email to admin, e.g. via Resend
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Unknown type" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
