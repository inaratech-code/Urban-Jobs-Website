import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore/lite";
import { db } from "./firebase";
import { uploadToCloudinary } from "./cloudinary";
import type { Candidate, CandidateFormData, Job, JobFormData, Employer, Application, ApplicationStatus } from "@/types";

/** Public job listing: active and not explicitly pending (legacy docs without adminApproved stay visible). */
export function isJobPublicVisible(job: Job) {
  return job.status === "active" && job.adminApproved !== false;
}

/** Home featured strip: explicit featured, or legacy docs with neither flag set. */
export function isJobFeaturedOnHome(job: Job) {
  if (!isJobPublicVisible(job)) return false;
  if (job.featured === true) return true;
  if (job.featured === undefined && job.adminApproved === undefined) return true;
  return false;
}

const COLLECTIONS = {
  users: "users",
  candidates: "candidates",
  employers: "employers",
  jobs: "jobs",
  applications: "applications",
} as const;

// Candidates
export async function createCandidate(
  data: CandidateFormData,
  documentIdFile: File,
  passportPhotoFile: File,
  certificates?: File[]
): Promise<string> {
  const [documentIdURL, passportPhotoURL] = await Promise.all([
    uploadToCloudinary(documentIdFile, "urban-jobs/candidate-document-id"),
    uploadToCloudinary(passportPhotoFile, "urban-jobs/candidate-passport-photo"),
  ]);

  const certificateURLs = certificates?.length
    ? await Promise.all(
        certificates.map((file) =>
          uploadToCloudinary(file, "urban-jobs/candidate-certificates")
        )
      )
    : [];

  const docRef = await addDoc(collection(db, COLLECTIONS.candidates), {
    ...data,
    documentIdURL,
    passportPhotoURL,
    certificateURLs,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getCandidates() {
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.candidates), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Candidate & { id: string }));
}

export async function getCandidate(id: string) {
  const snap = await getDoc(doc(db, COLLECTIONS.candidates, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Candidate & { id: string };
}

export async function deleteCandidate(id: string) {
  await deleteDoc(doc(db, COLLECTIONS.candidates, id));
}

// Employers
export async function createEmployer(data: {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address?: string;
}) {
  const docRef = await addDoc(collection(db, COLLECTIONS.employers), {
    ...data,
    approved: true,
    disabled: false,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getEmployers() {
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.employers), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Employer & { id: string }));
}

export async function updateEmployer(
  id: string,
  data: Partial<Pick<Employer, "approved" | "disabled">>
) {
  await updateDoc(doc(db, COLLECTIONS.employers, id), data as Record<string, unknown>);
}

// Jobs
export async function createJob(data: JobFormData, employerId: string) {
  const employer = await getDoc(doc(db, COLLECTIONS.employers, employerId));
  const companyName = employer.exists() ? (employer.data() as Employer).companyName : data.companyName;
  const docRef = await addDoc(collection(db, COLLECTIONS.jobs), {
    employerId,
    title: data.title,
    category: data.category,
    location: data.location,
    salary: data.salary,
    description: data.description,
    requirements: data.requirements,
    status: "active",
    adminApproved: false,
    featured: false,
    companyName,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function createJobAsGuest(data: JobFormData) {
  const employerRef = await addDoc(collection(db, COLLECTIONS.employers), {
    companyName: data.companyName,
    contactPerson: data.contactPerson,
    phone: data.phone,
    email: data.email,
    approved: true,
    disabled: false,
    createdAt: Timestamp.now(),
  });
  return createJob(data, employerRef.id);
}

export async function getJobs(filters?: {
  category?: string;
  location?: string;
  search?: string;
}) {
  const q = query(
    collection(db, COLLECTIONS.jobs),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  let jobs = snap.docs
    .map((d) => {
      const data = d.data();
      return { id: d.id, ...data, createdAt: data.createdAt } as Job & { id: string };
    })
    .filter((j) => isJobPublicVisible(j));
  if (filters?.category) {
    jobs = jobs.filter((j) => j.category === filters.category);
  }
  if (filters?.location) {
    jobs = jobs.filter(
      (j) => j.location?.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    jobs = jobs.filter(
      (j) =>
        j.title?.toLowerCase().includes(s) ||
        j.companyName?.toLowerCase().includes(s) ||
        j.description?.toLowerCase().includes(s)
    );
  }
  return jobs;
}

export async function getJob(id: string) {
  const snap = await getDoc(doc(db, COLLECTIONS.jobs, id));
  if (!snap.exists()) return null;
  const data = snap.data();
  return { id: snap.id, ...data, createdAt: data.createdAt } as Job & { id: string };
}

export async function updateJob(
  id: string,
  data: Partial<
    Pick<
      Job,
      | "title"
      | "category"
      | "location"
      | "salary"
      | "description"
      | "requirements"
      | "status"
      | "adminApproved"
      | "featured"
    >
  >
) {
  await updateDoc(doc(db, COLLECTIONS.jobs, id), data as Record<string, unknown>);
}

export async function deleteJob(id: string) {
  await deleteDoc(doc(db, COLLECTIONS.jobs, id));
}

// Applications
export async function createApplication(jobId: string, candidateId: string) {
  const job = await getJob(jobId);
  if (!job || !isJobPublicVisible(job)) {
    throw new Error("This job is not open for applications yet.");
  }
  const docRef = await addDoc(collection(db, COLLECTIONS.applications), {
    jobId,
    candidateId,
    status: "Applied",
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getApplications() {
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.applications), orderBy("createdAt", "desc"))
  );
  const applications = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as (Application & { id: string })[];
  return applications;
}

export async function getApplicationsByJob(jobId: string) {
  const snap = await getDocs(
    query(
      collection(db, COLLECTIONS.applications),
      where("jobId", "==", jobId)
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
) {
  await updateDoc(doc(db, COLLECTIONS.applications, id), { status });
}

export async function getJobsForAdmin() {
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.jobs), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => {
    const data = d.data();
    return { id: d.id, ...data, createdAt: data.createdAt } as Job & { id: string };
  });
}

// Web analytics
export async function trackWebView(path: string) {
  await addDoc(collection(db, "web_analytics"), {
    path,
    createdAt: Timestamp.now(),
  });
}

export async function getWebViews() {
  const snap = await getDocs(
    query(collection(db, "web_analytics"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as { path: string; createdAt: unknown }),
  }));
}

