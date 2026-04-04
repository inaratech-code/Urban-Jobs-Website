"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineArrowUpTray, HiOutlineDocument, HiOutlineCheckCircle } from "react-icons/hi2";

type FileUploaderProps = {
  id: string;
  label: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  value: File | File[] | null;
  onChange: (files: File | File[] | null) => void;
  required?: boolean;
  error?: string;
};

export default function FileUploader({
  id,
  label,
  description,
  accept,
  multiple,
  value,
  onChange,
  required,
  error,
}: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false);

  const filesList = value
    ? Array.isArray(value)
      ? value
      : [value]
    : [];

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list?.length) return;
      if (multiple) {
        const next = [...(Array.isArray(value) ? value : []), ...Array.from(list)];
        onChange(next);
      } else {
        onChange(list[0]);
      }
    },
    [multiple, onChange, value]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const removeAt = (index: number) => {
    if (!multiple || !Array.isArray(value)) {
      onChange(null);
      return;
    }
    const next = value.filter((_, i) => i !== index);
    onChange(next.length ? next : null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {description && <p className="text-xs text-slate-500">{description}</p>}

      <motion.label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        animate={{
          borderColor: dragOver ? "#2561c2" : error ? "#fca5a5" : "rgba(148, 163, 184, 0.6)",
          backgroundColor: dragOver ? "rgba(37, 97, 194, 0.06)" : "rgba(255,255,255,0.75)",
        }}
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 cursor-pointer backdrop-blur-sm shadow-sm transition-colors"
      >
        <input
          id={id}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          onChange={onInputChange}
        />
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary"
        >
          <HiOutlineArrowUpTray className="h-7 w-7" />
        </motion.div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-800">Drag & drop or click to upload</p>
          <p className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX, images up to your Cloudinary limit</p>
        </div>
      </motion.label>

      <AnimatePresence mode="popLayout">
        {filesList.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-2"
          >
            {filesList.map((file, i) => (
              <motion.li
                key={`${file.name}-${i}`}
                layout
                className="flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 backdrop-blur-sm"
              >
                <HiOutlineCheckCircle className="h-5 w-5 text-primary shrink-0" />
                <HiOutlineDocument className="h-5 w-5 text-slate-500 shrink-0" />
                <span className="flex-1 text-sm font-medium text-slate-800 truncate">{file.name}</span>
                <span className="text-xs text-slate-500 shrink-0">
                  {(file.size / 1024).toFixed(0)} KB
                </span>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="text-xs font-semibold text-red-600 hover:underline shrink-0"
                >
                  Remove
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
