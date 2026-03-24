"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import type { Job } from "@/types";
import {
  HiOutlineBriefcase,
  HiOutlineDocumentText,
  HiOutlineUserPlus,
  HiOutlineDocumentDuplicate,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";

const CATEGORIES = [
  { label: "Teaching Jobs", href: "/jobs?category=Teaching+Jobs" },
  { label: "Hotel Management", href: "/jobs?category=Hotel+Management" },
  { label: "Reception / Admin", href: "/jobs?category=Reception+%2F+Admin" },
  { label: "Accounting", href: "/jobs?category=Accounting" },
  { label: "IT / Management", href: "/jobs?category=IT+%2F+Management" },
];

const STEPS = [
  {
    title: "Make your profile",
    description: "Tell us who you are and what work you can do.",
    icon: HiOutlineUserPlus,
  },
  {
    title: "Upload ID & photo",
    description: "Upload your Document ID and passport photo so employers can trust your profile.",
    icon: HiOutlineDocumentDuplicate,
  },
  {
    title: "Get matched",
    description: "Employers will find your profile and contact you for interviews.",
    icon: HiOutlineBriefcase,
  },
];

interface HomeContentProps {
  featuredJobs: (Job & { id: string })[];
}

export default function HomeContent({ featuredJobs }: HomeContentProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 sm:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800"
            >
              Find Jobs in <span className="text-primary">Dhangadhi</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto"
            >
              Simple local job site for Dhangadhi. Find good work close to home.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium shadow-soft hover:shadow-soft-lg hover:bg-primary/90 transition-all duration-200"
              >
                <HiOutlineBriefcase className="h-5 w-5" />
                Browse Jobs
              </Link>
              <Link
                href="/candidate"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary font-medium border-2 border-primary shadow-soft hover:shadow-soft-lg hover:bg-primary/5 transition-all duration-200"
              >
                <HiOutlineDocumentText className="h-5 w-5" />
                Fill the form
              </Link>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl font-bold text-slate-800 text-center"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-2 text-slate-600 text-center max-w-xl mx-auto"
            >
              Three simple steps to connect with local employers.
            </motion.p>
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <p className="text-lg font-display font-semibold text-slate-800">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1 font-display font-semibold text-slate-800">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-slate-600 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Jobs */}
        <section className="py-16 sm:py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <h2 className="font-display text-3xl font-bold text-slate-800">
                  Featured Jobs
                </h2>
                <p className="mt-1 text-slate-600">
                  Latest opportunities in Dhangadhi
                </p>
              </div>
              <Link
                href="/jobs"
                className="text-primary font-medium hover:underline"
              >
                View all jobs →
              </Link>
            </motion.div>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.length > 0 ? (
                featuredJobs.map((job, i) => (
                  <JobCard key={job.id} job={job} index={i} />
                ))
              ) : (
                <p className="col-span-full text-center text-slate-500 py-8">
                  No jobs posted yet. Check back soon!
                </p>
              )}
            </div>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 bg-primary">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl font-bold text-white"
            >
              Looking for employees?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-2 text-white/90"
            >
              Post your job and reach local talent in Dhangadhi.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link
                href="/employer"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-white text-primary font-medium shadow-soft hover:shadow-soft-lg transition-all duration-200"
              >
                <HiOutlineBuildingOffice2 className="h-5 w-5" />
                Post a Job
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
