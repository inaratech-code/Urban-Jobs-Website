"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";

type FormInputProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, label, error, hint, className = "", ...props }, ref) => {
    return (
      <motion.div layout className="space-y-1.5">
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <input
          ref={ref}
          id={id}
          className={`
            w-full rounded-2xl border bg-white/80 backdrop-blur-sm px-4 py-3.5 text-slate-900 placeholder:text-slate-400
            shadow-sm transition-[box-shadow,transform,border-color] outline-none
            focus:border-[#2561c2] focus:ring-4 focus:ring-[#2561c2]/15 focus:shadow-[0_0_0_1px_rgba(37,97,194,0.08)]
            ${error ? "border-red-300" : "border-slate-200/90"}
            ${className}
          `}
          {...props}
        />
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      </motion.div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
