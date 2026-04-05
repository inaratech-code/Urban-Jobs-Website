export const EXPERIENCE_OPTIONS = [
  { value: "Fresher", label: "Fresher" },
  { value: "1-2 years", label: "1–2 years" },
  { value: "3+ years", label: "3+ years" },
] as const;

export type ExperienceValue = (typeof EXPERIENCE_OPTIONS)[number]["value"];

/** `internship` = user chose Internship on the first screen; next step picks skilled vs entry-level track. */
export type JobTier = "" | "skilled" | "unskilled" | "internship";

export const SKILLED_INDUSTRIES = [
  "Internship",
  "IT",
  "Education",
  "Hotel Management",
  "Accounting",
  "Law",
] as const;

export const UNSKILLED_JOB_TYPES = [
  "Internship",
  "Hotel Staff",
  "Cleaner",
  "Helper",
  "Reception",
  "Office Boy",
] as const;

export const EDUCATION_LEVEL_OPTIONS = [
  { value: "SEE / Grade 10", label: "SEE / Grade 10" },
  { value: "+2 / High school", label: "+2 / High school" },
  { value: "Diploma", label: "Diploma" },
  { value: "Bachelor's degree", label: "Bachelor's degree" },
  { value: "Master's degree", label: "Master's degree" },
  { value: "Other", label: "Other" },
] as const;

export type StepKey =
  | "tier"
  | "internshipBranch"
  | "industry"
  | "education"
  | "skillsExp"
  | "resumeCerts"
  | "resumeOnly"
  | "internshipDocs"
  | "basicSkilled"
  | "unskilledRole"
  | "basicUnskilled"
  | "photoUnskilled"
  | "review";

export function isInternship(form: {
  jobTier: JobTier;
  industry: string;
  unskilledJobType: string;
}): boolean {
  return (
    (form.jobTier === "skilled" && form.industry === "Internship") ||
    (form.jobTier === "unskilled" && form.unskilledJobType === "Internship")
  );
}

/** Step order depends on tier and whether Internship is selected (education → resume → docs/photo for internship). */
export function getStepOrder(form: ApplicationFormState): StepKey[] {
  if (!form.jobTier) return ["tier"];
  if (form.jobTier === "internship") return ["tier", "internshipBranch"];

  const intern = isInternship(form);
  const fromInternshipCard = form.internshipFromHome === true;

  if (form.jobTier === "skilled") {
    if (intern) {
      if (fromInternshipCard) {
        return [
          "tier",
          "internshipBranch",
          "education",
          "skillsExp",
          "resumeOnly",
          "internshipDocs",
          "basicSkilled",
          "review",
        ];
      }
      return [
        "tier",
        "industry",
        "education",
        "skillsExp",
        "resumeOnly",
        "internshipDocs",
        "basicSkilled",
        "review",
      ];
    }
    return ["tier", "industry", "skillsExp", "resumeCerts", "basicSkilled", "review"];
  }

  if (form.jobTier === "unskilled") {
    if (intern) {
      if (fromInternshipCard) {
        return [
          "tier",
          "internshipBranch",
          "education",
          "resumeOnly",
          "internshipDocs",
          "basicUnskilled",
          "review",
        ];
      }
      return ["tier", "unskilledRole", "education", "resumeOnly", "internshipDocs", "basicUnskilled", "review"];
    }
    return ["tier", "unskilledRole", "basicUnskilled", "photoUnskilled", "review"];
  }

  return ["tier"];
}

export interface ApplicationFormState {
  jobTier: JobTier;
  /** True when user picked Internship on the first screen, then chose skilled vs entry-level (skips industry/job-type steps). */
  internshipFromHome: boolean;
  industry: string;
  /** Free-form skills text (typed normally, not tag chips). */
  skills: string;
  experience: ExperienceValue | "";
  resumeFile: File | null;
  certificateFiles: File[];
  unskilledJobType: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  photoFile: File | null;
  /** Highest completed or in-progress level (e.g. Bachelor's). */
  educationLevel: string;
  educationInstitution: string;
  educationField: string;
  /** Graduation year or expected (e.g. 2026). */
  educationYear: string;
}

export const initialApplicationState: ApplicationFormState = {
  jobTier: "",
  internshipFromHome: false,
  industry: "",
  skills: "",
  experience: "",
  resumeFile: null,
  certificateFiles: [],
  unskilledJobType: "",
  fullName: "",
  phone: "",
  email: "",
  city: "Dhangadhi",
  photoFile: null,
  educationLevel: "",
  educationInstitution: "",
  educationField: "",
  educationYear: "",
};
