export const EXPERIENCE_OPTIONS = [
  { value: "Fresher", label: "Fresher" },
  { value: "1-2 years", label: "1–2 years" },
  { value: "3+ years", label: "3+ years" },
] as const;

export type ExperienceValue = (typeof EXPERIENCE_OPTIONS)[number]["value"];

export type JobTier = "" | "skilled" | "unskilled";

export const SKILLED_INDUSTRIES = [
  "IT",
  "Education",
  "Hotel Management",
  "Accounting",
  "Law",
] as const;

export const UNSKILLED_JOB_TYPES = [
  "Hotel Staff",
  "Cleaner",
  "Helper",
  "Reception",
  "Office Boy",
] as const;

export type StepKey =
  | "tier"
  | "industry"
  | "skillsExp"
  | "resumeCerts"
  | "basicSkilled"
  | "unskilledRole"
  | "basicUnskilled"
  | "photoUnskilled"
  | "review";

export function getStepOrder(tier: JobTier): StepKey[] {
  if (!tier) return ["tier"];
  if (tier === "skilled") {
    return ["tier", "industry", "skillsExp", "resumeCerts", "basicSkilled", "review"];
  }
  return ["tier", "unskilledRole", "basicUnskilled", "photoUnskilled", "review"];
}

export interface ApplicationFormState {
  jobTier: JobTier;
  industry: string;
  skillTags: string[];
  experience: ExperienceValue | "";
  resumeFile: File | null;
  certificateFiles: File[];
  unskilledJobType: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  photoFile: File | null;
}

export const initialApplicationState: ApplicationFormState = {
  jobTier: "",
  industry: "",
  skillTags: [],
  experience: "",
  resumeFile: null,
  certificateFiles: [],
  unskilledJobType: "",
  fullName: "",
  phone: "",
  email: "",
  city: "Dhangadhi",
  photoFile: null,
};
