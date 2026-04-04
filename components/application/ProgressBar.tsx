"use client";

import { motion } from "framer-motion";

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const total = Math.max(totalSteps, 1);
  const pct = (currentStep / total) * 100;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center text-xs font-medium text-slate-500 mb-2">
        <span>
          Step {currentStep} of {total}
        </span>
        <span className="text-[#2561c2]">{Math.round(pct)}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200/80 overflow-hidden backdrop-blur-sm">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
