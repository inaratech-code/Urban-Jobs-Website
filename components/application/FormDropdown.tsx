"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";

type Option = { value: string; label: string };

type FormDropdownProps = {
  id: string;
  label: string;
  options: readonly Option[] | Option[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
};

const FormDropdown = forwardRef<HTMLSelectElement, FormDropdownProps>(
  ({ id, label, options, value, onChange, error, required, placeholder = "Select…" }, ref) => {
    return (
      <motion.div layout className="space-y-1.5">
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <select
          ref={ref}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full rounded-2xl border bg-white/80 backdrop-blur-sm px-4 py-3.5 text-slate-900 shadow-sm outline-none
            focus:border-[#2561c2] focus:ring-4 focus:ring-[#2561c2]/15
            ${error ? "border-red-300" : "border-slate-200/90"}
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      </motion.div>
    );
  }
);

FormDropdown.displayName = "FormDropdown";

export default FormDropdown;
