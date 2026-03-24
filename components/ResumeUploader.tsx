"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineCloudArrowUp, HiOutlineDocument } from "react-icons/hi2";

interface ResumeUploaderProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  error?: string;
  required?: boolean;
}

export default function ResumeUploader({
  onFileSelect,
  accept = "application/pdf",
  maxSizeMB = 5,
  error,
  required = false,
}: ResumeUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      setFile(null);
      onFileSelect(null);
      return;
    }
    if (f.size > maxSizeMB * 1024 * 1024) {
      return;
    }
    setFile(f);
    onFileSelect(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === "application/pdf" && f.size <= maxSizeMB * 1024 * 1024) {
      setFile(f);
      onFileSelect(f);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  return (
    <div className="space-y-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
        } ${error ? "border-red-300 bg-red-50/50" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          required={required}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {file ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <HiOutlineDocument className="h-10 w-10 text-primary" />
            <p className="text-sm font-medium text-slate-700">{file.name}</p>
            <p className="text-xs text-slate-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                onFileSelect(null);
              }}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </motion.div>
        ) : (
          <>
            <HiOutlineCloudArrowUp className="h-10 w-10 text-slate-400 mx-auto" />
            <p className="mt-2 text-sm font-medium text-slate-600">
              Drop your resume here or click to upload
            </p>
            <p className="text-xs text-slate-500 mt-1">
              PDF only, max {maxSizeMB} MB
            </p>
          </>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
