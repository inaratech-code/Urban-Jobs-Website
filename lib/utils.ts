import type { Job } from "@/types";

/** Convert Firestore Timestamp or Date to Date */
export function toDate(
  value: { seconds: number; nanoseconds: number } | Date | string | undefined | null
): Date {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }
  if (typeof value === "object" && "toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate();
  }
  if (typeof value === "object" && value !== null && "seconds" in value) {
    return new Date((value as { seconds: number }).seconds * 1000);
  }
  return new Date();
}

/** Plain ISO string for passing job data from Server → Client (no Firestore Timestamp / toJSON). */
export function serializeFirestoreTimestamp(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object" && "toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof value === "object" && value !== null && "seconds" in value) {
    const s = (value as { seconds: number }).seconds;
    const ns = (value as { nanoseconds?: number }).nanoseconds ?? 0;
    return new Date(s * 1000 + ns / 1e6).toISOString();
  }
  if (typeof value === "string") return value;
  return undefined;
}

/** JSON-safe job for Client Components (Next.js RSC serialization). */
export function serializeJobForClient(job: Job & { id: string }) {
  const { createdAt: _removed, ...rest } = job;
  return {
    ...rest,
    createdAt: serializeFirestoreTimestamp(job.createdAt),
  } as Job & { id: string };
}
