"use client";

import { motion } from "framer-motion";
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineDocumentText } from "react-icons/hi2";
import type { Candidate } from "@/types";
import { toDate } from "@/lib/utils";

interface CandidateCardProps {
  candidate: Candidate & { id: string };
  index?: number;
}

export default function CandidateCard({ candidate, index = 0 }: CandidateCardProps) {
  const createdAt = toDate(candidate.createdAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-2xl p-5 shadow-soft border border-slate-100 hover:shadow-soft-lg transition-shadow"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-display font-semibold text-slate-800">{candidate.fullName}</h3>
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-600">
            <a
              href={`mailto:${candidate.email}`}
              className="flex items-center gap-1 hover:text-primary"
            >
              <HiOutlineEnvelope className="h-4 w-4" />
              {candidate.email}
            </a>
            <a
              href={`tel:${candidate.phone}`}
              className="flex items-center gap-1 hover:text-primary"
            >
              <HiOutlinePhone className="h-4 w-4" />
              {candidate.phone}
            </a>
          </div>
          <p className="text-sm text-slate-500 mt-1">{candidate.city}</p>
          {(candidate.industryCategory || candidate.desiredRole) && (
            <p className="text-sm text-slate-600 mt-2">
              <span className="font-medium">Looking for:</span>{" "}
              {candidate.desiredRole || "—"}{" "}
              {candidate.industryCategory ? (
                <span className="text-slate-500">({candidate.industryCategory})</span>
              ) : null}
            </p>
          )}
          {candidate.skills && (
            <p className="text-sm text-slate-600 mt-2 line-clamp-2">
              <span className="font-medium">Skills:</span> {candidate.skills}
            </p>
          )}
          <p className="text-xs text-slate-400 mt-2">
            Preferred: {candidate.preferredJob || "—"}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          {candidate.documentIdURL ? (
            <a
              href={candidate.documentIdURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <HiOutlineDocumentText className="h-4 w-4" />
              Document ID
            </a>
          ) : (
            <span className="text-sm text-slate-400">No Document ID</span>
          )}
          {candidate.passportPhotoURL ? (
            <a
              href={candidate.passportPhotoURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
              title="Open passport size photo"
            >
              <HiOutlineDocumentText className="h-4 w-4" />
              Passport photo
            </a>
          ) : null}
          {candidate.certificateURLs?.length ? (
            <a
              href={candidate.certificateURLs[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
              title="Open certificates / experience letter"
            >
              <HiOutlineDocumentText className="h-4 w-4" />
              Certificates ({candidate.certificateURLs.length})
            </a>
          ) : null}
          <span className="text-xs text-slate-400">
            {createdAt.toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
