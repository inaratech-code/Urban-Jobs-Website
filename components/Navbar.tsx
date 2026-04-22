"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";

const moreLinks = [
  { href: "/job-request", label: "Request a job" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm pt-[env(safe-area-inset-top,0px)]"
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-16 md:h-[4.25rem]">
          <Link
            href="/"
            className="flex items-center gap-2.5 min-w-0 group shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <BrandLogo height={44} priority className="group-hover:opacity-90 transition-opacity" />
            <span className="font-display font-bold text-lg sm:text-xl text-slate-900 tracking-tight hidden sm:inline">
              Urban Jobs
            </span>
          </Link>

          <div className="hidden lg:flex" />

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link
              href="/candidate"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-cta-job hover:bg-cta-job-hover transition-colors shadow-sm"
            >
              Fill a form
            </Link>
            <Link
              href="/employer"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-cta-hire hover:bg-cta-hire-hover transition-colors shadow-sm"
            >
              Hire now
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/candidate"
              className="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-cta-job"
              onClick={() => setMobileOpen(false)}
            >
              Fill a form
            </Link>
            <button
              type="button"
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden border-t border-slate-100 py-4 space-y-3"
          >
            <Link
              href="/candidate"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center py-3 rounded-xl font-semibold text-white bg-cta-job"
            >
              Fill a form
            </Link>
            <Link
              href="/employer"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center py-3 rounded-xl font-semibold text-white bg-cta-hire"
            >
              Hire now
            </Link>
            {moreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}
