"use client";

import { motion } from "framer-motion";

type StepContainerProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function StepContainer({ title, subtitle, children }: StepContainerProps) {
  return (
    <motion.div
      layout
      className="w-full max-w-lg md:max-w-xl lg:max-w-2xl rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(37,97,194,0.25)] p-5 xs:p-6 sm:p-8"
    >
      <div className="mb-6">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
        {subtitle && <p className="mt-2 text-sm text-slate-600 leading-relaxed">{subtitle}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </motion.div>
  );
}
