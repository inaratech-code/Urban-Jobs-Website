"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-slate-800 text-slate-300 mt-auto"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 overflow-hidden">
              <Image
                src="/logo.png"
                alt="Urban Jobs"
                fill
                sizes="56px"
                className="object-cover"
              />
            </span>
            <div>
              <p className="font-display font-semibold text-white">Urban Jobs</p>
              <p className="text-sm">Connecting Talent with Opportunity</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/jobs" className="hover:text-white transition-colors">
              Jobs
            </Link>
            <Link href="/candidate" className="hover:text-white transition-colors">
              Fill the form
            </Link>
            <Link href="/employer" className="hover:text-white transition-colors">
              Post a Job
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-700 text-center text-sm">
          <p>© {new Date().getFullYear()} Urban Jobs. All rights reserved.</p>
          <p className="mt-1 text-slate-500">
            Built by{" "}
            <a
              href="https://www.inaratech.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-medium hover:text-accent/90 hover:underline"
            >
              Inara Tech
            </a>
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

