"use client";

import { motion } from "framer-motion";

type NavigationButtonsProps = {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
  isLastStep?: boolean;
  loading?: boolean;
};

export default function NavigationButtons({
  onBack,
  onNext,
  nextLabel = "Next",
  backLabel = "Back",
  nextDisabled = false,
  showBack = true,
  isLastStep = false,
  loading = false,
}: NavigationButtonsProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between sm:items-center pt-2">
      <div>
        {showBack && onBack && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl font-semibold text-slate-600 bg-white/80 border border-slate-200/90 backdrop-blur-sm shadow-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            {backLabel}
          </motion.button>
        )}
      </div>
      <motion.button
        type="button"
        whileHover={nextDisabled || loading ? {} : { scale: 1.02 }}
        whileTap={nextDisabled || loading ? {} : { scale: 0.98 }}
        onClick={onNext}
        disabled={nextDisabled || loading}
        className={`
          w-full sm:w-auto min-w-[140px] px-8 py-3.5 rounded-2xl font-semibold text-white shadow-lg
          bg-gradient-to-r from-primary to-accent hover:opacity-95
          disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-none
          transition-opacity
        `}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Submitting…
          </span>
        ) : isLastStep ? (
          "Submit application"
        ) : (
          nextLabel
        )}
      </motion.button>
    </div>
  );
}
