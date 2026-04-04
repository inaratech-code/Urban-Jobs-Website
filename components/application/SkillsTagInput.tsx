"use client";

import { motion } from "framer-motion";

type SkillsFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
};

/** Single textarea for skills — normal typing, commas or lines as the user prefers. */
export default function SkillsTagInput({
  value,
  onChange,
  error,
  placeholder = "e.g. Microsoft Excel, customer service, Nepali / English",
}: SkillsFieldProps) {
  return (
    <motion.div layout className="space-y-2">
      <label htmlFor="skills-field" className="block text-sm font-semibold text-slate-700">
        Skills <span className="text-red-500">*</span>
      </label>
      <textarea
        id="skills-field"
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full rounded-2xl border bg-white/80 backdrop-blur-sm px-4 py-3.5 text-slate-900 placeholder:text-slate-400 text-sm
          shadow-sm transition-[box-shadow,border-color] outline-none resize-y min-h-[100px]
          focus:border-primary focus:ring-4 focus:ring-primary/15 focus:shadow-[0_0_0_1px_rgba(37,97,194,0.08)]
          ${error ? "border-red-300" : "border-slate-200/90"}
        `}
      />
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </motion.div>
  );
}
