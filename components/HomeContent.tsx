"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  HiOutlineBriefcase,
  HiOutlineDocumentText,
  HiOutlineUserPlus,
  HiOutlineDocumentDuplicate,
  HiOutlineBuildingOffice2,
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineCheckCircle,
  HiOutlineClipboardDocumentList,
} from "react-icons/hi2";

const CATEGORIES = [
  { label: "Teaching Jobs", href: "/jobs?category=Teaching+Jobs" },
  { label: "Hotel Management", href: "/jobs?category=Hotel+Management" },
  { label: "Reception / Admin", href: "/jobs?category=Reception+%2F+Admin" },
  { label: "Accounting", href: "/jobs?category=Accounting" },
  { label: "IT / Management", href: "/jobs?category=IT+%2F+Management" },
];

const CANDIDATE_STEPS = [
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
    description: "Employers find your profile and contact you for interviews.",
    icon: HiOutlineBriefcase,
  },
];

const EMPLOYER_STEPS = [
  {
    title: "Post a job",
    description: "Tell us what you need in a candidate in just a few minutes.",
    icon: HiOutlineDocumentText,
  },
  {
    title: "Get verified",
    description: "Our team reviews your listing so candidates see trusted posts.",
    icon: HiOutlineCheckCircle,
  },
  {
    title: "Hire locally",
    description: "Connect with applicants in Dhangadhi and hire faster.",
    icon: HiOutlineBuildingOffice2,
  },
];

interface HomeContentProps {
  categorySummaries: { label: string; count: number }[];
  totalJobs: number;
}

export default function HomeContent({
  categorySummaries,
  totalJobs,
}: HomeContentProps) {
  const categoryCount = categorySummaries.length;
  const FAKE_STATS = {
    totalPosted: 1248,
    hiring: 86,
    hired: 392,
  } as const;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero — WorkIndia-style: headline + dual CTA + search card */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-10 sm:py-14 md:py-16 lg:py-20">
            <div className="max-w-3xl mx-auto text-center">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-semibold text-primary uppercase tracking-wide"
              >
                Dhangadhi job portal
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 text-balance leading-tight"
              >
                Find jobs & hire staff — fast and simple
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto"
              >
                Urban Jobs connects job seekers and employers in Dhangadhi. Complete the candidate form to register your
                profile, browse open roles below when you want listings, or post a vacancy as an employer.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
              >
                <Link
                  href="/candidate"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-cta-job hover:bg-cta-job-hover shadow-md transition-colors"
                >
                  <HiOutlineClipboardDocumentList className="h-5 w-5 shrink-0" />
                  Fill a form
                </Link>
                <Link
                  href="/employer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-cta-hire hover:bg-cta-hire-hover shadow-md transition-colors"
                >
                  <HiOutlineBuildingOffice2 className="h-5 w-5 shrink-0" />
                  Hire now
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-10 max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-6 shadow-sm"
            >
              <p className="text-center text-sm font-semibold text-slate-700 mb-4">Search jobs</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="relative">
                  <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Link
                    href="/jobs"
                    className="flex items-center w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-slate-200 text-left text-slate-800 font-medium hover:border-primary/40 hover:ring-1 hover:ring-primary/20 transition-all"
                  >
                    Browse all categories
                  </Link>
                </div>
                <div className="relative">
                  <HiOutlineMapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <div className="flex items-center w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-600">
                    Dhangadhi
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {CATEGORIES.slice(0, 5).map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:border-primary hover:text-primary transition-colors"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats — WorkIndia-style trust strip */}
        <section className="py-10 sm:py-12 bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-slate-500 font-medium mb-8">
              Local employers & job seekers use Urban Jobs
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                { value: totalJobs > 0 ? String(totalJobs) : "—", title: "Open roles", sub: "Live listings" },
                { value: categoryCount > 0 ? String(categoryCount) : "—", title: "Categories", sub: "Job types" },
                { value: "Dhangadhi", title: "City", sub: "Local focus" },
                { value: "Free", title: "Basic use", sub: "Browse or register" },
              ].map((s) => (
                <div key={s.title} className="text-center">
                  <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-1">{s.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Jobs overview (KPIs) */}
        <section className="py-14 sm:py-16 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Jobs stats
              </h2>
              <p className="mt-2 text-slate-600">
                Demo numbers for the homepage — hiring, hired, and total jobs posted.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-4xl mx-auto">
              {[
                {
                  title: "Total jobs posted",
                  value: String(FAKE_STATS.totalPosted),
                  sub: totalJobs > 0 ? `${totalJobs} currently open` : `${categoryCount || 0} categories tracked`,
                  img: "/stats-total.svg",
                },
                {
                  title: "How many hiring",
                  value: String(FAKE_STATS.hiring),
                  sub: "Companies actively receiving applications",
                  img: "/stats-hiring.svg",
                },
                {
                  title: "How many hired",
                  value: String(FAKE_STATS.hired),
                  sub: "Candidates placed via Urban Jobs",
                  img: "/stats-hired.svg",
                },
              ].map((s) => (
                <div
                  key={s.title}
                  className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-5 sm:p-6 flex items-center gap-4"
                >
                  <div className="shrink-0 h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <Image src={s.img} alt="" width={42} height={42} className="opacity-95" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{s.title}</p>
                    <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mt-0.5">
                      {s.value}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-center text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              If your desired job is not available, please submit a request — we will contact you soon.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/job-request"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Request a job role
              </Link>
            </div>
          </div>
        </section>

        {/* Job seeker + Employer steps — side-by-side on desktop */}
        <section className="py-14 sm:py-16 bg-white border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
              {/* Job seeker — how it works */}
              <div className="h-full">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-center">
                  Get started in 3 easy steps
                </h2>
                <p className="mt-2 text-slate-600 text-center max-w-xl mx-auto">
                  For job seekers — build your profile and get discovered by local employers.
                </p>
                <div className="mt-10 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto lg:max-w-none">
                  {CANDIDATE_STEPS.map((step, i) => (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 text-center"
                    >
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cta-job/15 text-cta-job mb-4">
                        <step.icon className="h-7 w-7" />
                      </div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Step {i + 1}</p>
                      <h3 className="mt-1 font-display font-bold text-lg text-slate-900">{step.title}</h3>
                      <p className="mt-2 text-slate-600 text-sm leading-relaxed">{step.description}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-10 text-center">
                  <Link
                    href="/candidate"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white bg-cta-job hover:bg-cta-job-hover transition-colors"
                  >
                    Fill a form
                  </Link>
                </div>
              </div>

              {/* Employers — brand accent block + steps */}
              <div className="h-full rounded-3xl bg-primary text-white px-6 py-10 sm:px-8 sm:py-12 shadow-lg border border-white/10">
                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold">Hire staff for your business</h2>
                  <p className="mt-3 text-white/90 text-sm sm:text-base">
                    Post your vacancy and reach candidates in Dhangadhi. Simple forms, quick listing.
                  </p>
                  <Link
                    href="/employer"
                    className="inline-flex items-center gap-2 mt-6 px-8 py-3.5 rounded-xl bg-white text-primary font-bold shadow-lg hover:bg-slate-50 transition-colors"
                  >
                    Post a new job
                  </Link>
                </div>
                <div className="mt-10 grid md:grid-cols-2 gap-6">
                  {EMPLOYER_STEPS.map((step, i) => (
                    <div
                      key={step.title}
                      className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 text-center"
                    >
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 mb-3">
                        <step.icon className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-xs font-bold text-white/80 uppercase tracking-wide">Step {i + 1}</p>
                      <h3 className="mt-1 font-display font-bold text-lg">{step.title}</h3>
                      <p className="mt-2 text-white/85 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
