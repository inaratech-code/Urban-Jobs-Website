"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";

const jobSeeker = [
  { href: "/jobs", label: "Browse jobs" },
  { href: "/candidate", label: "Fill a form" },
  { href: "/job-request", label: "Request a job" },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-slate-900 text-slate-300 mt-auto"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <BrandLogo height={48} />
              <div>
                <p className="font-display font-bold text-white text-lg">Urban Jobs</p>
                <p className="text-sm text-slate-400 mt-0.5">Connecting talent in Dhangadhi</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">I want a job</p>
            <ul className="space-y-2.5 text-sm">
              {jobSeeker.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-slate-300 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">I want to hire</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/employer" className="text-slate-300 hover:text-white transition-colors">
                  Post a job / Hire now
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Site</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Urban Jobs. All rights reserved.</p>
          <p className="mt-2">
            Built by{" "}
            <a
              href="https://www.inaratech.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-medium hover:text-sky-300 hover:underline"
            >
              Inara Tech
            </a>
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
