export type JobCategory =
  | "Teaching Jobs"
  | "Hotel Management"
  | "Reception / Admin"
  | "Accounting"
  | "IT / Management"
  | string;

export interface Job {
  id: string;
  employerId: string;
  title: string;
  category: JobCategory;
  location: string;
  salary: string;
  description: string;
  requirements: string;
  status: "active" | "closed" | "draft";
  /** When false, job is hidden from the public site until an admin approves. Legacy docs omit this field (treated as approved). */
  adminApproved?: boolean;
  /** When true, job may appear in the home “featured” section (must also be active and approved). */
  featured?: boolean;
  /** ISO string when passed from Server Components to clients; Firestore Timestamp or plain seconds object when from DB. */
  createdAt: { seconds: number; nanoseconds: number } | Date | string;
  companyName?: string;
}

export interface JobFormData {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  title: string;
  category: JobCategory;
  description: string;
  requirements: string;
  salary: string;
  location: string;
}
