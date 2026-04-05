"use client";

import { motion } from "framer-motion";
import { HiOutlineAcademicCap, HiOutlineBriefcase, HiOutlineWrenchScrewdriver } from "react-icons/hi2";

type SelectionCardProps = {
  title: string;
  examples: string;
  selected: boolean;
  onClick: () => void;
  variant: "skilled" | "unskilled" | "internship";
};

export default function SelectionCard({
  title,
  examples,
  selected,
  onClick,
  variant,
}: SelectionCardProps) {
  const Icon =
    variant === "skilled"
      ? HiOutlineAcademicCap
      : variant === "internship"
        ? HiOutlineBriefcase
        : HiOutlineWrenchScrewdriver;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative w-full h-full min-h-[220px] sm:min-h-[240px] flex flex-col text-left rounded-2xl border-2 p-5 sm:p-6 lg:p-7 transition-shadow
        backdrop-blur-sm bg-white/80
        ${
          selected
            ? "border-[#2561c2] shadow-[0_0_0_4px_rgba(37,97,194,0.12),0_12px_40px_-12px_rgba(37,97,194,0.35)]"
            : "border-slate-200/90 shadow-sm hover:border-slate-300 hover:shadow-md"
        }
      `}
    >
      {selected && (
        <span className="absolute inset-0 rounded-2xl pointer-events-none ring-2 ring-[#2561c2]/25" />
      )}
      <div
        className={`
          shrink-0 inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl mb-3 sm:mb-4
          ${selected ? "bg-gradient-to-br from-primary to-accent text-white" : "bg-slate-100 text-slate-600"}
        `}
      >
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
      <h3 className="shrink-0 font-display text-base sm:text-lg font-bold text-slate-900 leading-snug">
        {title}
      </h3>
      <p className="mt-2 sm:mt-3 flex-1 min-h-[3.5rem] sm:min-h-[4rem] text-sm text-slate-600 leading-relaxed">
        {examples}
      </p>
    </motion.button>
  );
}
