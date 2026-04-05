"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import ProgressBar from "./ProgressBar";
import StepContainer from "./StepContainer";
import FormInput from "./FormInput";
import FormDropdown from "./FormDropdown";
import FileUploader from "./FileUploader";
import NavigationButtons from "./NavigationButtons";
import SkillsTagInput from "./SkillsTagInput";
import SelectionCard from "./SelectionCard";
import {
  ApplicationFormState,
  EDUCATION_LEVEL_OPTIONS,
  EXPERIENCE_OPTIONS,
  getStepOrder,
  initialApplicationState,
  isInternship,
  SKILLED_INDUSTRIES,
  StepKey,
  UNSKILLED_JOB_TYPES,
} from "./types";
import type { CandidateFormData } from "@/types";
import { createCandidate, createApplication } from "@/lib/firestore";

function withTimeout<T>(promise: Promise<T>, ms = 120000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Request timeout. Please check internet and try again."));
    }, ms);
    promise
      .then((v) => {
        clearTimeout(timer);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(timer);
        reject(e);
      });
  });
}

function formatEducation(f: ApplicationFormState): string {
  const parts = [
    f.educationLevel,
    f.educationField.trim(),
    f.educationInstitution.trim(),
    f.educationYear.trim(),
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "—";
}

function toCandidateFormData(f: ApplicationFormState): CandidateFormData {
  if (f.jobTier === "skilled") {
    return {
      fullName: f.fullName.trim(),
      phone: f.phone.trim(),
      email: f.email.trim(),
      city: f.city.trim(),
      currentlyResiding: f.city.trim(),
      permanentAddress: "",
      industryCategory: f.industry,
      desiredRole: "Skilled — " + f.industry,
      education: isInternship(f) ? formatEducation(f) : "See resume",
      skills: f.skills.trim(),
      experience: f.experience,
      preferredJob: f.industry,
    };
  }
  const email =
    f.email.trim() ||
    `candidate+${f.phone.replace(/\D/g, "") || "unknown"}@urban-jobs.local`;
  return {
    fullName: f.fullName.trim(),
    phone: f.phone.trim(),
    email,
    city: f.city.trim(),
    currentlyResiding: f.city.trim(),
    permanentAddress: "",
    industryCategory: "Unskilled",
    desiredRole: f.unskilledJobType,
    education: isInternship(f) ? formatEducation(f) : "—",
    skills: f.unskilledJobType,
    experience: isInternship(f) && f.experience ? f.experience : "General / entry",
    preferredJob: f.unskilledJobType,
  };
}

const stepLabel: Record<StepKey, string> = {
  tier: "Job type",
  industry: "Industry",
  education: "Education",
  skillsExp: "Skills & experience",
  resumeCerts: "Resume & certificates",
  resumeOnly: "Resume",
  internshipDocs: "Documents & photo",
  basicSkilled: "Your details",
  unskilledRole: "Role",
  basicUnskilled: "Your details",
  photoUnskilled: "Photo",
  review: "Review",
};

type MultiStepCandidateFormProps = {
  applyJobId?: string | null;
};

export default function MultiStepCandidateForm({ applyJobId }: MultiStepCandidateFormProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [form, setForm] = useState<ApplicationFormState>(initialApplicationState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const focusRef = useRef<HTMLInputElement | HTMLSelectElement | null>(null);

  const order = useMemo(
    () => getStepOrder(form),
    [form.jobTier, form.industry, form.unskilledJobType]
  );

  useEffect(() => {
    setStepIndex((i) => Math.min(i, Math.max(0, order.length - 1)));
  }, [order.length, form.jobTier, form.industry, form.unskilledJobType]);
  const currentKey = order[stepIndex] ?? "tier";
  const totalSteps = order.length;
  const displayStep = stepIndex + 1;

  const update = useCallback(<K extends keyof ApplicationFormState>(key: K, value: ApplicationFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((e) => ({ ...e, [String(key)]: "" }));
    setSubmitError(null);
  }, []);

  useEffect(() => {
    const t = requestAnimationFrame(() => focusRef.current?.focus());
    return () => cancelAnimationFrame(t);
  }, [currentKey, stepIndex]);

  const validate = useCallback(
    (key: StepKey): boolean => {
      const e: Record<string, string> = {};
      switch (key) {
        case "tier":
          if (!form.jobTier) e.jobTier = "Choose Skilled or Unskilled to continue";
          break;
        case "industry":
          if (!form.industry) e.industry = "Select an industry";
          break;
        case "education":
          if (!form.educationLevel) e.educationLevel = "Select education level";
          if (!form.educationInstitution.trim()) e.educationInstitution = "Enter institution name";
          if (!form.educationField.trim()) e.educationField = "Enter field of study (e.g. BBA, CS)";
          if (!form.educationYear.trim()) e.educationYear = "Enter graduation or expected year";
          break;
        case "skillsExp":
          if (!form.skills.trim()) e.skills = "Enter your skills";
          if (!form.experience) e.experience = "Select experience level";
          break;
        case "resumeCerts":
          if (!form.resumeFile) e.resumeFile = "Upload your resume";
          break;
        case "resumeOnly":
          if (!form.resumeFile) e.resumeFile = "Upload your resume";
          break;
        case "internshipDocs":
          if (!form.photoFile) e.photoFile = "Upload a profile photo";
          break;
        case "basicSkilled":
          if (!form.fullName.trim()) e.fullName = "Enter your full name";
          if (!form.phone.trim()) e.phone = "Enter your phone number";
          if (!form.email.trim()) e.email = "Enter your email";
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
          if (!form.city.trim()) e.city = "Enter your city";
          break;
        case "unskilledRole":
          if (!form.unskilledJobType) e.unskilledJobType = "Select a job type";
          break;
        case "basicUnskilled":
          if (!form.fullName.trim()) e.fullName = "Enter your full name";
          if (!form.phone.trim()) e.phone = "Enter your phone number";
          if (!form.city.trim()) e.city = "Enter your city";
          break;
        case "photoUnskilled":
          break;
        case "review":
          break;
        default:
          break;
      }
      setErrors(e);
      return Object.keys(e).length === 0;
    },
    [form]
  );

  const goNext = () => {
    if (!validate(currentKey)) return;
    if (currentKey === "review") {
      handleSubmit();
      return;
    }
    if (stepIndex >= totalSteps - 1) return;
    setDirection(1);
    setStepIndex((i) => i + 1);
  };

  const goBack = () => {
    if (stepIndex <= 0) return;
    const nextIndex = stepIndex - 1;
    const nextKey = order[nextIndex];
    if (nextKey === "tier") {
      setForm(initialApplicationState);
      setStepIndex(0);
      setErrors({});
      setSubmitError(null);
      setDirection(-1);
      return;
    }
    setDirection(-1);
    setStepIndex(nextIndex);
    setErrors({});
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    const intern = isInternship(form);
    if (form.jobTier === "skilled" || intern) {
      if (!form.resumeFile) {
        setSubmitError("Resume is required.");
        return;
      }
    }
    if (intern && !form.photoFile) {
      setSubmitError("Profile photo is required.");
      return;
    }
    setLoading(true);
    setSubmitError(null);
    try {
      const data = toCandidateFormData(form);
      const intern = isInternship(form);
      const id = await withTimeout(
        createCandidate(
          data,
          form.jobTier === "skilled" || intern ? form.resumeFile : null,
          intern ? form.photoFile : form.jobTier === "unskilled" ? form.photoFile : null,
          (form.jobTier === "skilled" || intern) && form.certificateFiles.length
            ? form.certificateFiles
            : undefined,
          {
            allowEmptyDocuments: form.jobTier === "unskilled" && !intern && !form.photoFile,
          }
        )
      );
      if (applyJobId) {
        await withTimeout(createApplication(applyJobId, id));
      }
      setSuccess(true);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Something went wrong. Please try again.";
      setSubmitError(msg);
    } finally {
      setLoading(false);
    }
  };

  const whatsappDigits = process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.replace(/\D/g, "") ?? "";
  const whatsappHref = whatsappDigits
    ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
        "Hi Urban Jobs — I just submitted my application."
      )}`
    : "https://wa.me/";

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 40 : -40, opacity: 0 }),
  };

  const industryOptions = SKILLED_INDUSTRIES.map((v) => ({ value: v, label: v }));
  const unskilledOptions = UNSKILLED_JOB_TYPES.map((v) => ({ value: v, label: v }));

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="w-full max-w-md rounded-2xl border border-white/60 bg-white/85 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(37,97,194,0.3)] p-8 sm:p-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.08 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg"
        >
          <HiOutlineCheckBadge className="h-10 w-10" />
        </motion.div>
        <h2 className="mt-6 font-display text-2xl font-bold text-slate-900">
          Your application has been submitted
        </h2>
        <p className="mt-3 text-slate-600 text-sm leading-relaxed">
          {applyJobId
            ? "We’ve saved your profile and linked this application to the job you chose."
            : "We’ve saved your profile. Employers may reach out when there’s a match."}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl font-semibold text-white bg-primary hover:opacity-95 shadow-md"
          >
            Back to home
          </Link>
          <motion.a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-md"
          >
            Chat on WhatsApp
          </motion.a>
        </div>
        <p className="mt-6 text-sm text-slate-500">
          Want to see openings?{" "}
          <Link href="/jobs" className="font-semibold text-primary hover:underline">
            Browse open jobs
          </Link>{" "}
          — optional, not part of your registration.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col min-h-[calc(100dvh-10rem)]">
      <div className="shrink-0 mb-6">
        <ProgressBar currentStep={displayStep} totalSteps={totalSteps} />
        <p className="text-center text-xs text-slate-500 mt-3 font-medium">{stepLabel[currentKey]}</p>
      </div>

      <div className="flex-1 flex items-center justify-center py-2">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${currentKey}-${stepIndex}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="w-full"
          >
            {currentKey === "tier" && (
              <StepContainer
                title="What kind of work are you looking for?"
                subtitle="Choose one — we’ll tailor the next questions for you."
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <SelectionCard
                    variant="skilled"
                    title="Skilled jobs"
                    examples="Examples: IT, Accounting, Teaching, Legal"
                    selected={form.jobTier === "skilled"}
                    onClick={() => update("jobTier", "skilled")}
                  />
                  <SelectionCard
                    variant="unskilled"
                    title="Unskilled jobs"
                    examples="Examples: Helper, Reception, Hotel staff"
                    selected={form.jobTier === "unskilled"}
                    onClick={() => update("jobTier", "unskilled")}
                  />
                </div>
                {errors.jobTier && (
                  <p className="text-sm font-medium text-red-600 text-center">{errors.jobTier}</p>
                )}
              </StepContainer>
            )}

            {currentKey === "industry" && (
              <StepContainer title="Industry" subtitle="Where does your experience fit best? Includes Internship.">
                <FormDropdown
                  ref={focusRef as React.Ref<HTMLSelectElement>}
                  id="industry"
                  label="Industry"
                  required
                  placeholder="Select industry"
                  options={industryOptions}
                  value={form.industry}
                  onChange={(v) => update("industry", v)}
                  error={errors.industry}
                />
              </StepContainer>
            )}

            {currentKey === "education" && (
              <StepContainer
                title="Education"
                subtitle="Basic details and level — select Bachelor's degree if your program is at that level."
              >
                <FormDropdown
                  ref={focusRef as React.Ref<HTMLSelectElement>}
                  id="educationLevel"
                  label="Education level"
                  required
                  placeholder="Select level"
                  options={[...EDUCATION_LEVEL_OPTIONS]}
                  value={form.educationLevel}
                  onChange={(v) => update("educationLevel", v)}
                  error={errors.educationLevel}
                />
                <FormInput
                  id="educationInstitution"
                  label="School / College / University"
                  required
                  value={form.educationInstitution}
                  onChange={(e) => update("educationInstitution", e.target.value)}
                  error={errors.educationInstitution}
                />
                <FormInput
                  id="educationField"
                  label="Field of study"
                  required
                  hint="e.g. BBA, Computer Science, Civil Engineering"
                  value={form.educationField}
                  onChange={(e) => update("educationField", e.target.value)}
                  error={errors.educationField}
                />
                <FormInput
                  id="educationYear"
                  label="Graduation year or expected"
                  required
                  value={form.educationYear}
                  onChange={(e) => update("educationYear", e.target.value)}
                  error={errors.educationYear}
                />
              </StepContainer>
            )}

            {currentKey === "skillsExp" && (
              <StepContainer title="Skills & experience" subtitle="Help employers understand your background.">
                <SkillsTagInput
                  value={form.skills}
                  onChange={(v) => update("skills", v)}
                  error={errors.skills}
                />
                <FormDropdown
                  ref={focusRef as React.Ref<HTMLSelectElement>}
                  id="experience"
                  label="Experience"
                  required
                  placeholder="Select experience"
                  options={[...EXPERIENCE_OPTIONS]}
                  value={form.experience}
                  onChange={(v) => update("experience", v as ApplicationFormState["experience"])}
                  error={errors.experience}
                />
              </StepContainer>
            )}

            {currentKey === "resumeCerts" && (
              <StepContainer
                title="Resume & certificates"
                subtitle="Upload your CV. Certificates are optional but help you stand out."
              >
                <FileUploader
                  id="resume"
                  label="Resume"
                  required
                  accept=".pdf,.doc,.docx,image/*"
                  value={form.resumeFile}
                  onChange={(f) => update("resumeFile", f as File | null)}
                  error={errors.resumeFile}
                />
                <FileUploader
                  id="certs"
                  label="Certificates (optional)"
                  description="Multiple files allowed."
                  accept=".pdf,.doc,.docx,image/*"
                  multiple
                  value={form.certificateFiles.length ? form.certificateFiles : null}
                  onChange={(f) => update("certificateFiles", Array.isArray(f) ? f : f ? [f] : [])}
                />
              </StepContainer>
            )}

            {currentKey === "resumeOnly" && (
              <StepContainer
                title="Resume"
                subtitle="Upload your CV (PDF, Word, or image). Next step: supporting documents and photo."
              >
                <FileUploader
                  id="resume-intern"
                  label="Resume"
                  required
                  accept=".pdf,.doc,.docx,image/*"
                  value={form.resumeFile}
                  onChange={(f) => update("resumeFile", f as File | null)}
                  error={errors.resumeFile}
                />
              </StepContainer>
            )}

            {currentKey === "internshipDocs" && (
              <StepContainer
                title="Documents & photo"
                subtitle="Optional certificates, then a clear profile photo for your application."
              >
                <FileUploader
                  id="certs-intern"
                  label="Certificates or other documents (optional)"
                  description="Multiple files allowed."
                  accept=".pdf,.doc,.docx,image/*"
                  multiple
                  value={form.certificateFiles.length ? form.certificateFiles : null}
                  onChange={(f) => update("certificateFiles", Array.isArray(f) ? f : f ? [f] : [])}
                />
                <FileUploader
                  id="photo-intern"
                  label="Profile photo"
                  required
                  accept="image/*"
                  value={form.photoFile}
                  onChange={(f) => update("photoFile", f as File | null)}
                  error={errors.photoFile}
                />
              </StepContainer>
            )}

            {currentKey === "basicSkilled" && (
              <StepContainer title="Your contact details" subtitle="We’ll use this to reach you about opportunities.">
                <FormInput
                  ref={focusRef as React.Ref<HTMLInputElement>}
                  id="fullName"
                  label="Full name"
                  required
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  autoComplete="name"
                  error={errors.fullName}
                />
                <FormInput
                  id="phone"
                  label="Phone number"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  autoComplete="tel"
                  error={errors.phone}
                />
                <FormInput
                  id="email"
                  label="Email"
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  autoComplete="email"
                  error={errors.email}
                />
                <FormInput
                  id="city"
                  label="City"
                  required
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  autoComplete="address-level2"
                  error={errors.city}
                />
              </StepContainer>
            )}

            {currentKey === "unskilledRole" && (
              <StepContainer title="Job type" subtitle="Which role matches what you’re looking for? Includes Internship.">
                <FormDropdown
                  ref={focusRef as React.Ref<HTMLSelectElement>}
                  id="unskilledJobType"
                  label="Job type"
                  required
                  placeholder="Select job type"
                  options={unskilledOptions}
                  value={form.unskilledJobType}
                  onChange={(v) => update("unskilledJobType", v)}
                  error={errors.unskilledJobType}
                />
              </StepContainer>
            )}

            {currentKey === "basicUnskilled" && (
              <StepContainer title="Your details" subtitle="Name, phone, and city — email is optional.">
                <FormInput
                  ref={focusRef as React.Ref<HTMLInputElement>}
                  id="fullName"
                  label="Full name"
                  required
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  autoComplete="name"
                  error={errors.fullName}
                />
                <FormInput
                  id="phone"
                  label="Phone number"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  autoComplete="tel"
                  error={errors.phone}
                />
                <FormInput
                  id="email"
                  label="Email (optional)"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  autoComplete="email"
                  hint="If you skip this, we’ll use a placeholder tied to your phone for our records."
                />
                <FormInput
                  id="city"
                  label="City"
                  required
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  autoComplete="address-level2"
                  error={errors.city}
                />
              </StepContainer>
            )}

            {currentKey === "photoUnskilled" && (
              <StepContainer
                title="Profile photo"
                subtitle="Optional — a clear photo helps employers recognize you faster."
              >
                <FileUploader
                  id="photo"
                  label="Photo upload"
                  accept="image/*"
                  value={form.photoFile}
                  onChange={(f) => update("photoFile", f as File | null)}
                />
              </StepContainer>
            )}

            {currentKey === "review" && (
              <StepContainer title="Review & submit" subtitle="Check everything before you send your application.">
                <dl className="space-y-3 text-sm rounded-2xl bg-slate-50/90 border border-slate-100 p-4 backdrop-blur-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Track</dt>
                    <dd className="font-semibold text-slate-900 capitalize">{form.jobTier}</dd>
                  </div>
                  {form.jobTier === "skilled" && (
                    <>
                      <div className="flex justify-between gap-3">
                        <dt className="text-slate-500">Industry</dt>
                        <dd className="font-medium text-slate-900 text-right">{form.industry}</dd>
                      </div>
                      {isInternship(form) && (
                        <div className="flex flex-col gap-1">
                          <dt className="text-slate-500">Education</dt>
                          <dd className="font-medium text-slate-900 text-right whitespace-pre-wrap">
                            {formatEducation(form)}
                          </dd>
                        </div>
                      )}
                      <div className="flex flex-col gap-1">
                        <dt className="text-slate-500">Skills</dt>
                        <dd className="font-medium text-slate-900 whitespace-pre-wrap">{form.skills.trim() || "—"}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-slate-500">Experience</dt>
                        <dd className="font-medium text-slate-900">{form.experience || "—"}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-slate-500">Resume</dt>
                        <dd className="font-medium text-slate-900 truncate max-w-[55%] text-right">
                          {form.resumeFile?.name ?? "—"}
                        </dd>
                      </div>
                      <div className="flex flex-col gap-1">
                        <dt className="text-slate-500">Certificates</dt>
                        <dd className="font-medium text-slate-900">
                          {form.certificateFiles.length
                            ? form.certificateFiles.map((x) => x.name).join(", ")
                            : "None"}
                        </dd>
                      </div>
                      {isInternship(form) && (
                        <div className="flex justify-between gap-3">
                          <dt className="text-slate-500">Profile photo</dt>
                          <dd className="font-medium text-slate-900 truncate max-w-[55%] text-right">
                            {form.photoFile?.name ?? "—"}
                          </dd>
                        </div>
                      )}
                    </>
                  )}
                  {form.jobTier === "unskilled" && (
                    <>
                      <div className="flex justify-between gap-3">
                        <dt className="text-slate-500">Job type</dt>
                        <dd className="font-medium text-slate-900 text-right">{form.unskilledJobType}</dd>
                      </div>
                      {isInternship(form) && (
                        <>
                          <div className="flex flex-col gap-1">
                            <dt className="text-slate-500">Education</dt>
                            <dd className="font-medium text-slate-900 text-right whitespace-pre-wrap">
                              {formatEducation(form)}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-3">
                            <dt className="text-slate-500">Resume</dt>
                            <dd className="font-medium text-slate-900 truncate max-w-[55%] text-right">
                              {form.resumeFile?.name ?? "—"}
                            </dd>
                          </div>
                          <div className="flex flex-col gap-1">
                            <dt className="text-slate-500">Certificates / documents</dt>
                            <dd className="font-medium text-slate-900">
                              {form.certificateFiles.length
                                ? form.certificateFiles.map((x) => x.name).join(", ")
                                : "None"}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-3">
                            <dt className="text-slate-500">Profile photo</dt>
                            <dd className="font-medium text-slate-900 text-right">
                              {form.photoFile?.name ?? "—"}
                            </dd>
                          </div>
                        </>
                      )}
                      {!isInternship(form) && (
                        <div className="flex justify-between gap-3">
                          <dt className="text-slate-500">Photo</dt>
                          <dd className="font-medium text-slate-900 text-right">
                            {form.photoFile?.name ?? "Skipped"}
                          </dd>
                        </div>
                      )}
                    </>
                  )}
                  <div className="border-t border-slate-200 pt-3 mt-3 space-y-2">
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-500">Name</dt>
                      <dd className="font-medium text-slate-900 text-right">{form.fullName}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-500">Phone</dt>
                      <dd className="font-medium text-slate-900 text-right break-all">{form.phone}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-500">Email</dt>
                      <dd className="font-medium text-slate-900 text-right break-all">
                        {form.email || "(generated if empty)"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-500">City</dt>
                      <dd className="font-medium text-slate-900 text-right">{form.city}</dd>
                    </div>
                  </div>
                </dl>
                {submitError && (
                  <p className="text-sm text-red-600 font-medium rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                    {submitError}
                  </p>
                )}
              </StepContainer>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="shrink-0 pt-4 pb-2">
        <NavigationButtons
          showBack={stepIndex > 0}
          onBack={goBack}
          onNext={goNext}
          isLastStep={currentKey === "review"}
          loading={loading}
        />
      </div>
    </div>
  );
}
