import "server-only";

import { getAuth } from "firebase-admin/auth";

function getAdminEmailAllowlist(): string[] {
  const raw = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin(request: Request): Promise<{ uid: string; email: string }> {
  const authHeader = request.headers.get("authorization") || "";
  const m = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!m) throw new Error("Missing Authorization header.");
  const idToken = m[1]!;

  const decoded = await getAuth().verifyIdToken(idToken);
  const email = (decoded.email || "").toLowerCase();
  if (!email) throw new Error("Missing email on auth token.");

  const allow = getAdminEmailAllowlist();
  if (allow.length > 0 && !allow.includes(email)) {
    throw new Error("Access denied. Admin only.");
  }
  return { uid: decoded.uid, email };
}

