export type { Job, JobCategory, JobFormData } from "./job";
export type { Candidate, CandidateFormData } from "./candidate";
export type { Employer } from "./employer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employer" | "candidate";
  createdAt: { seconds: number; nanoseconds: number } | Date;
}

export type ApplicationStatus = "Applied" | "Shortlisted" | "Rejected" | "Hired";

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  createdAt: { seconds: number; nanoseconds: number } | Date;
  jobTitle?: string;
  candidateName?: string;
  companyName?: string;
}
