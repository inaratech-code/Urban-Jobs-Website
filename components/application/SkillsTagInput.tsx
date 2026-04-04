"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineXMark } from "react-icons/hi2";

type SkillsTagInputProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
  error?: string;
  placeholder?: string;
};

export default function SkillsTagInput({
  tags,
  onChange,
  error,
  placeholder = "Type a skill and press Enter",
}: SkillsTagInputProps) {
  const [input, setInput] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const t = raw.trim();
    if (!t || tags.includes(t)) return;
    onChange([...tags, t]);
    setInput("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        Skills <span className="text-red-500">*</span>
      </label>
      <p className="text-xs text-slate-500">Add one or more skills (press Enter after each)</p>
      <div
        className={`
          flex flex-wrap items-center gap-2 min-h-[52px] rounded-2xl border bg-white/80 backdrop-blur-sm px-3 py-2.5 shadow-sm
          focus-within:ring-4 focus-within:ring-[#2561c2]/15 focus-within:border-[#2561c2]
          ${error ? "border-red-300" : "border-slate-200/90"}
        `}
        onClick={() => ref.current?.focus()}
      >
        <AnimatePresence mode="popLayout">
          {tags.map((tag) => (
            <motion.span
              key={tag}
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="inline-flex items-center gap-1 pl-3 pr-1 py-1 rounded-full text-sm font-medium bg-[#2561c2]/10 text-[#1a4488]"
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(tags.filter((x) => x !== tag));
                }}
                className="p-1 rounded-full hover:bg-[#2561c2]/20 text-[#1a4488]"
                aria-label={`Remove ${tag}`}
              >
                <HiOutlineXMark className="h-4 w-4" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          ref={ref}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={tags.length === 0 ? placeholder : "Add another…"}
          className="flex-1 min-w-[120px] bg-transparent border-0 outline-none text-slate-900 placeholder:text-slate-400 text-sm py-1"
        />
      </div>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
