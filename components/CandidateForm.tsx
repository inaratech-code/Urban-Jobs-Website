"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ResumeUploader from "./ResumeUploader";

const CATEGORIES = [
  "Teaching Jobs",
  "Hotel Management",
  "Reception / Admin",
  "Accounting",
  "IT / Management",
];

const INDUSTRY_CATEGORIES = ["Hotel", "Labour", "Office", "School", "Other"];

export interface CandidateFormValues {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  currentlyResiding: string;
  permanentAddress: string;
  industryCategory: string;
  desiredRole: string;
  education: string;
  skills: string;
  experience: string;
  preferredJob: string;
}

interface CandidateFormProps {
  onSubmit: (
    data: CandidateFormValues,
    documentIdFile: File,
    passportPhotoFile: File,
    certificates?: File[]
  ) => Promise<void>;
  isLoading?: boolean;
}

const initial: CandidateFormValues = {
  fullName: "",
  phone: "",
  email: "",
  city: "Dhangadhi",
  currentlyResiding: "",
  permanentAddress: "",
  industryCategory: "",
  desiredRole: "",
  education: "",
  skills: "",
  experience: "",
  preferredJob: "",
};

export default function CandidateForm({ onSubmit, isLoading }: CandidateFormProps) {
  const [form, setForm] = useState<CandidateFormValues>(initial);
  const [documentIdFile, setDocumentIdFile] = useState<File | null>(null);
  const [passportPhotoFile, setPassportPhotoFile] = useState<File | null>(null);
  const [certificates, setCertificates] = useState<File[]>([]);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.email) {
      setError("Please fill required fields (Name, Phone, Email).");
      return;
    }
    if (!documentIdFile) {
      setError("Document ID with photo is required.");
      return;
    }
    if (!passportPhotoFile) {
      setError("Passport size photo is required.");
      return;
    }
    try {
      await onSubmit(form, documentIdFile, passportPhotoFile, certificates);
      setForm(initial);
      setDocumentIdFile(null);
      setPassportPhotoFile(null);
      setCertificates([]);
    } catch (err: unknown) {
      const raw =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Something went wrong. Please try again.";

      const lower = raw.toLowerCase();
      if (lower.includes("timeout")) {
        setError("Request timed out. Check internet/Firebase and try again.");
      } else if (
        lower.includes("permission-denied") ||
        lower.includes("missing or insufficient permissions")
      ) {
        setError("Firebase permission denied. Please enable Firestore and update rules.");
      } else if (
        lower.includes("invalid-api-key") ||
        lower.includes("firebase auth not configured")
      ) {
        setError("Firebase is not configured correctly. Check your .env.local values.");
      } else {
        setError(raw);
      }
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            placeholder="Your full name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            placeholder="98XXXXXXXX"
            required
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            placeholder="email@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            placeholder="Dhangadhi"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Currently living in
          </label>
          <input
            type="text"
            name="currentlyResiding"
            value={form.currentlyResiding}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            placeholder="e.g. Dhangadhi-5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Permanent address
          </label>
          <input
            type="text"
            name="permanentAddress"
            value={form.permanentAddress}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            placeholder="e.g. Kailali, Nepal"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Industry category
          </label>
          <select
            name="industryCategory"
            value={form.industryCategory}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
          >
            <option value="">Select industry</option>
            {INDUSTRY_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Job you want (type)
          </label>
          <input
            type="text"
            name="desiredRole"
            value={form.desiredRole}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            placeholder="e.g. Waiter, Receptionist, Electrician"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Education
        </label>
        <input
          type="text"
          name="education"
          value={form.education}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
          placeholder="Degree, school, year"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Skills
        </label>
        <input
          type="text"
          name="skills"
          value={form.skills}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
          placeholder="e.g. MS Office, Communication, Teaching"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Experience
        </label>
        <textarea
          name="experience"
          value={form.experience}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition resize-none"
          placeholder="Previous roles and years of experience"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Preferred Job Category
        </label>
        <select
          name="preferredJob"
          value={form.preferredJob}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
        >
          <option value="">Select category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Document ID with photo <span className="text-red-500">*</span>
        </label>
        <ResumeUploader
          onFileSelect={setDocumentIdFile}
          accept="application/pdf,image/*"
          maxSizeMB={10}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Passport size photo <span className="text-red-500">*</span>
        </label>
        <ResumeUploader
          onFileSelect={setPassportPhotoFile}
          accept="image/*"
          maxSizeMB={5}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Certificates / experience letter (optional)
        </label>
        <input
          type="file"
          multiple
          accept="application/pdf,image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setCertificates(files);
          }}
          className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
        />
        {certificates.length > 0 && (
          <p className="mt-2 text-xs text-slate-500">
            Selected: {certificates.length} file(s)
          </p>
        )}
        <p className="mt-1 text-xs text-slate-500">
          You can upload multiple files.
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 shadow-soft hover:shadow-soft-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "Submitting..." : "Submit form"}
      </button>
    </motion.form>
  );
}
